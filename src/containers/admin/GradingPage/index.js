import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import { withFirebase } from '../../../components/Firebase/firebase';
import styles from './styles.module.css';

class GradingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: [],
      teams: {},
      teamNames: [],
      currentTeamNum: -1,
      teamCorrects: [],
      round: '',
      showQuestion: -1,
    };

    this.firebase = props.firebase;

    this.teamScores = [];

    this.changeGrade = this.changeGrade.bind(this);
    this.nextTeam = this.nextTeam.bind(this);
  }

  componentDidMount() {
    // give time for clients' answers to get submitted
    this.timeout = setTimeout(() => {
      // get the round, questions, and teams to grade
      this.firebase.getGame((game) => {
        // get the round from stage, ex. round1-grading => round1
        const round = game.stage.split('-')[0];
        this.setState({
          // filter out no bonus
          questions: game[round].filter((q) => (q.q !== '')),
          teams: game.teams,
          teamNames: Object.keys(game.teams),
          currentTeamNum: 0,
          // 11 false in case of bonus, only will display ten if no, and last false will not matter
          teamCorrects: [false, false, false, false, false, false, false, false, false, false, false],
          round,
        });
      });
    }, 3000);
  }

  // just saving this because it might be better than that derived state thing on question page
  // componentDidUpdate(prevProps) {
  //   if (prevProps.match.params.team === this.props.match.params.team) {
  //     return;
  //   }

  //   this.setState({
  //     corrects: [false, false, false, false, false, false, false, false, false, false]
  //   });
  // }

  componentWillUnmount() {
    // have to clear every timeout we use just in case it doesn't finish
    clearTimeout(this.timeout);
  }

  // either true or false in val
  changeGrade(i, val) {
    const teamCorrects = [...this.state.teamCorrects];
    teamCorrects[i] = val;
    this.setState({ teamCorrects });
  }

  nextTeam() {
    // add one point for each correct answer
    this.teamScores.push(this.state.teamCorrects.filter(Boolean).length);

    const currentTeamNum = this.state.currentTeamNum + 1;
    // keep repeating if we have teams left
    if (currentTeamNum < this.state.teamNames.length) {
      this.setState({
        teamCorrects: [false, false, false, false, false, false, false, false, false, false, false],
        currentTeamNum,
      }, () => window.scrollTo(0, 0));
    } else {
      // otherwise save the scores and show the leaderboard
      const teams = JSON.parse(JSON.stringify(this.state.teams));
      for (let i = 0; i < this.state.teamNames.length; i++) {
        const name = this.state.teamNames[i];
        // add to the current score if possible
        let score = teams[name].score || 0;
        score += this.teamScores[i];
        teams[name].score = score;
      }

      // set standings and then go to the leaderboard
      // cb makes sure standings are set before we try to show them
      this.firebase.setStandings(teams, this.state.round, () => {
        this.props.history.push('/host/leaderboard');
      });
    }
  }

  render() {
    return this.state.questions.length > 0 ? (
      <div className={styles.container}>
        <div className={styles.header}>
          {`team ${this.state.currentTeamNum}/${this.state.teamNames.length}`}
        </div>

        <div className={styles.headerContainer}>
          <div className={styles.subheader}>
            actual answer
          </div>
          <div className={styles.subheader}>
            team answer
          </div>
        </div>

        <div className={styles.gradingContainer}>
          <div className={styles.divider} />

          {this.state.questions.map((q, i) => (
            <div key={i}>
              <div className={styles.gradeContainer}>
                <div className={styles.showButton} role="button" tabIndex={0} onClick={() => this.setState({ showQuestion: i })}>
                  <i className={classNames(styles.questionIcon, 'fas fa-question')} />
                  <div className={styles.viewText}>
                    View
                  </div>
                </div>

                <div className={styles.answer}>
                  {q.a}
                </div>
                <div className={styles.answer} style={{ marginLeft: '5vw' }}>
                  {this.state.teams[this.state.teamNames[this.state.currentTeamNum]][this.state.round][i]}
                </div>

                <div
                  className={classNames(styles.gradeButton, { [styles.selectedButton]: this.state.teamCorrects[i] })}
                  role="button"
                  tabIndex={0}
                  onClick={() => this.changeGrade(i, true)}
                >
                  <i className={classNames(styles.gradeIcon, 'fas fa-check', { [styles.selectedIcon]: this.state.teamCorrects[i] })} style={{ fontSize: '2vw' }} />
                </div>
                <div
                  className={classNames(styles.gradeButton, { [styles.selectedButton]: !this.state.teamCorrects[i] })}
                  role="button"
                  tabIndex={0}
                  onClick={() => this.changeGrade(i, false)}
                >
                  <i className={classNames(styles.gradeIcon, 'fas fa-times', { [styles.selectedIcon]: !this.state.teamCorrects[i] })} style={{ fontSize: '2.4vw' }} />
                </div>
              </div>

              <div className={styles.divider} />
            </div>
          ))}
        </div>

        <div
          className={styles.nextButton}
          role="button"
          tabIndex={0}
          onClick={this.nextTeam}
          style={{ right: '3vw', bottom: '3vh' }}
        >
          {this.state.currentTeamNum + 1 < this.state.teamNames.length ? 'next' : 'standings'}
          <i className={classNames('fas fa-arrow-right', styles.arrow)} />
        </div>

        {this.state.showQuestion !== -1 ? (
          <div className={styles.modal}>
            <div className={styles.popUp}>
              {this.state.questions[this.state.showQuestion].img ? (
                <img src={this.state.questions[this.state.showQuestion].img} alt="Question" className={styles.showImage} />
              ) : null}
              <div className={styles.showText}>
                {this.state.questions[this.state.showQuestion].q}
              </div>
              <i className={classNames('fas fa-times', styles.closeIcon)} role="button" tabIndex={0} onClick={() => this.setState({ showQuestion: -1 })} />
            </div>
          </div>
        ) : null}
      </div>
    ) : null;
  }
}

GradingPage.propTypes = {
  match: PropTypes.object,
  firebase: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(withFirebase(GradingPage));
