import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';

import styles from './styles.module.css';
import { withFirebase } from '../../../components/Firebase/firebase';
import TextInput from '../../../components/TextInput';

class PlayPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      team: '',
      ids: [''],
      joinable: true,
      error: '',
    };

    this.firebase = props.firebase;
    this.dbRef = this.firebase.getDatabaseRef();

    this.changeId = this.changeId.bind(this);
    this.onJoin = this.onJoin.bind(this);
  }

  componentDidMount() {
    // probably temporary, might not want to immediately remove it when we load this page
    localStorage.removeItem('game');

    // see if we can join the game right now
    this.firebase.getGame((game) => {
      this.setState({
        joinable: game.stage === 'join',
      })
    });

    this.dbRef.on('value', (snap) => {
      this.setState({
        joinable: snap.val().stage === 'join',
      });
    });
  }

  componentWillUnmount() {
    // stop listening so we don't try to update this page when we're not here
    this.dbRef.off('value');
  }

  changeId(e, index) {
    const ids = [...this.state.ids];
    ids[index] = e.target.value;
    this.setState({ ids, error: '' });
  }

  onJoin(e) {
    e.preventDefault();

    let error = '';

    const ids = this.state.ids.filter((id) => (id !== ''));
    if (!ids[0]) {
      error = 'we need at least one net id';
    }

    if (!this.state.team) {
      error = "what's your team's name";
    }

    this.firebase.getGame((game) => {
      const teams = game.teams ? Object.keys(game.teams) : [];
      if (teams.includes(this.state.team)) {
        error = "team name already taken";
      }

      if (error) {
        this.setState({ error });
      } else {
        this.firebase.joinGame(this.state.team, ids, (data) => {
          localStorage.setItem('game', JSON.stringify(data));
          this.props.history.push('/play/waiting');
        });
      }
    });
  }

  render() {
    return (
      <form onSubmit={this.onJoin} className={styles.container}>
        <div className={styles.header}>
          register your team
        </div>

        <div className={styles.section}>
          <div className={styles.subheader}>
            team name
          </div>
          <div className={styles.inputContainer}>
            <TextInput
              value={this.state.team}
              autoFocus={!isMobile}
              onChange={(e) => this.setState({ team: e.target.value.slice(0, 35), error: '' })}
              width="80%"
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.subheader}>
            player netIDs
          </div>
          <div className={styles.inputContainer}>
            {this.state.ids.map((id, index) => (
              <div className={styles.idRow} key={index}>
                <TextInput
                  value={id}
                  onChange={(e) => this.changeId(e, index)}
                  width={isMobile ? '20vw' : '9vw'}
                />

                {index + 1 === this.state.ids.length ? (
                  <div
                    className={classNames(styles.plus, 'fas fa-plus')}
                    role="button"
                    tabIndex={0}
                    onClick={() => this.setState({ ids: [...this.state.ids, ''] })}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {this.state.error ? (
          <div className={styles.errorText}>
            {this.state.error}
          </div>
        ) : this.state.joinable ? (
          <div className={styles.next} role="button" tabIndex={0} onClick={this.onJoin}>
            join
            <i className={classNames('fas fa-arrow-right', styles.arrow)} />
          </div>
        ) : (
          <div className={styles.noJoin}>
            no live game
          </div>
        )}

        <input type="submit" style={{ opacity: 0, display: 'none' }} />
      </form>
    );
  }
}

PlayPage.propTypes = {
  firebase: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(withFirebase(PlayPage));
