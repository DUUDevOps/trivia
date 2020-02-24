import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Textfit } from 'react-textfit';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';

import styles from './styles.module.css';
import DukeNiteLogo from '../../../assets/DukeNiteLogo.png';
import { withFirebase } from '../../../components/Firebase/firebase';
import { getIdsText } from '../../../tools/helpers';

class StandingsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      standings: [],
      stage: '',
      numberToReveal: 0,
    };

    this.firebase = props.firebase;
    this.round = '';

    this.nextRound = this.nextRound.bind(this);
    this.reveal = this.reveal.bind(this);
  }

  componentDidMount() {
    this.firebase.getGame((res) => {
      if (!res.success || !res.data) return;
      const game = res.data;
      // create a standings array
      const standings = Object.entries(game.teams).map(([name, data]) => ({
        name,
        score: data.score,
        ids: data.ids,
        place: 1,
      }));

      // sort the array by score
      standings.sort((a, b) => (b.score - a.score));

      // set the places, including ties
      let place = 1;
      for (let i = 1; i < standings.length; i++) {
        if (standings[i].score < standings[i - 1].score) {
          place += 1;
        }
        standings[i].place = place;
      }

      // display the standings
      // this.state.stage will either be standings or final standings
      // this.round is used to start next round
      // if game is over, we can pretend to reveal standings again
      const stage = game.stage === 'finished' ? 'round3-final standings'.split('-') : game.stage.split('-');
      this.round = stage[0];
      this.setState({
        standings,
        stage: stage[1],
        // revealing top 5 at max
        numberToReveal: Math.min(5, standings.length),
      });
    });
  }

  nextRound() {
    this.firebase.setStage(`round${parseInt(this.round.slice(-1)) + 1}`, () => {
      this.props.history.push('/host/question/1');
    });
  }

  reveal() {
    this.setState({ numberToReveal: this.state.numberToReveal - 1 }, () => {
      if (this.state.numberToReveal <= 0) {
        this.firebase.setStage('finished');
      }
    });
  }

  render() {
    // not really supported on mobile

    return this.state.stage ? (
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <div className={styles.headerText}>
            {this.state.stage}
          </div>
          <img src={DukeNiteLogo} alt="Duke@Nite" className={styles.headerLogo} />
        </div>

        <div className={styles.divider} style={{ width: '60vw' }} />

        {this.state.stage !== 'final standings' ? (
          <div className={styles.nextButton} role="button" tabIndex={0} onClick={this.nextRound}>
            next round
            <i className={classNames('fas fa-arrow-right', styles.arrow)} />
          </div>
        ) : this.state.numberToReveal > 0 ? (
          <div
            className={styles.nextButton}
            role="button"
            tabIndex={0}
            onClick={this.reveal}
          >
            reveal next
            <i className={classNames('fas fa-arrow-right', styles.arrow)} />
          </div>
        ) : null}

        {this.state.standings.filter((s, i) => (i < 5)).map((s, i) => (
          <div
            className={styles.standingsHolder}
            key={s.name}
            style={{
              marginBottom: i !== this.state.standings.length - 1 ? 0 : 'auto',
              opacity: this.state.stage !== 'final standings' || this.state.numberToReveal <= i ? 1 : 0,
            }}
          >
            <ReactTooltip place="top" effect="solid" className={styles.tooltip} />
            <div className={styles.standingContainer} data-tip={getIdsText(s.ids)}>
              <div className={styles.placeText}>
                {s.place}
              </div>

              <Textfit className={styles.nameText} mode="single" forceSingleModeWidth={false} max={32}>
                {s.name}
              </Textfit>

              <div className={styles.scoreText}>
                {s.score}
              </div>
            </div>

            {i !== this.state.standings.length - 1 ? (
              <div className={styles.divider} />
            ) : null}
          </div>
        ))}
      </div>
    ) : null;
  }
}

StandingsPage.propTypes = {
  firebase: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(withFirebase(StandingsPage));
