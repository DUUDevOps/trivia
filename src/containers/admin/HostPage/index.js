import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import classNames from 'classnames';

import styles from './styles.module.css';
import { withFirebase } from '../../../components/Firebase/firebase';
import DukeNiteLogo from '../../../assets/DukeNiteLogo.png';

class HostPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: [],
    };

    this.firebase = props.firebase;
    this.dbRef = this.firebase.getDatabaseRef();
    this.id = props.match.params.id;

    this.start = this.start.bind(this);
  }

  componentDidMount() {
    // refresh the realtime db with this new host
    this.firebase.hostQuiz(this.id);

    // listen for new teams to join
    this.dbRef.on('value', (snap) => {
      this.setState({ teams: snap.val().teams ? Object.keys(snap.val().teams) : [] });
    });
  }

  componentWillUnmount() {
    // stop listening so we don't try to update this page when we're not here
    this.dbRef.off('value');
  }

  // tell everyone its the first round and show the first question
  start() {
    this.firebase.setStage('round1');
    this.props.history.push('/host/question/1');
  }

  render() {
    if (!this.id) {
      return <Redirect to="/admin/dashboard" />;
    }

    return (
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <img src={DukeNiteLogo} alt="Duke@Nite" className={styles.logo} />
          <div className={styles.headerText}>
            trivia night
          </div>
        </div>

        <div className={styles.startButton} role="button" tabIndex={0} onClick={this.start}>
          start
          <i className={classNames('fas fa-arrow-right', styles.arrow)} />
        </div>

        <div className={styles.instructText}>
          join at&nbsp;<u>localhost:3000/join</u>
        </div>

        <div className={styles.teamsContainer}>
          {this.state.teams.map((t) => (
            <div className={styles.team} key={t}>
              {t}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

HostPage.propTypes = {
  match: PropTypes.object,
  firebase: PropTypes.object,
};

export default withFirebase(HostPage);
