import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import styles from './styles.module.css';
import { withFirebase } from '../../../components/Firebase/firebase';

class WaitingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.firebase = props.firebase;
    this.dbRef = this.firebase.getLiveGameRef();
  }

  componentDidMount() {
    // wait for graders to finish grading
    this.dbRef.on('value', (snapshot) => {
      const game = snapshot.val();
      const round = game.stage.split('-')[0];
      const teams = {};
      const graded = {};
      Object.entries(game.teams).forEach(([teamName, teamData]) => {
        // filter answers to only include non-empty answers, and make sure there is at least 1
        if (teamData[round] && teamData[round].filter((answer) => (answer !== '')).length > 0) {
          teams[teamName] = teamData;
        }
      });

      // we're done grading if every team that answered was graded
      if (Object.keys(teams).length === Object.keys(graded)) {
        // restore teamsthat didn't answer anything this round
        const updatedTeams = game.teams;
        // check for a tiebreaker after round 3
        if (round === 'round3') {
          // see if teams are tied
          let isTie = false;
          let maxScore = 0;
          // go through each team, if new max score there is no tie
          // if someone ties the max score, there is a tie (until max score is beaten again)
          Object.values(updatedTeams).forEach((teamData) => {
            if (teamData.score > maxScore) {
              isTie = false;
              maxScore = teamData.score;
            } else if (teamData.score === maxScore) {
              isTie = true;
            }
          });
          // if there is a tie, keep the same round, update the teams, and go to tiebreaker page
          if (isTie) {
            this.firebase.setStandings(updatedTeams, 'round3-grading', () => {
              this.props.history.push('/host/tiebreaker');
            });
            // return stops us from going to standings below
            return;
          }
        }

        // after setting standings, then go to the leaderboard/standings page
        // callback makes sure standings are set before we try to show them
        this.firebase.setStandings(updatedTeams, this.state.round, () => {
          this.props.history.push('/host/standings');
        });
      }
    });
  }

  componentWillUnmount() {
    this.dbRef.off('value');
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.text}>
          waiting for graders
        </div>
      </div>
    );
  }
}

WaitingPage.propTypes = {
  firebase: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(withFirebase(WaitingPage));
