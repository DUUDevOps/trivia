import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import { withFirebase } from '../../../components/Firebase/firebase';
import TextInput from '../../../components/TextInput';
import styles from './styles.module.css';

const FIRST_ELEMENT_ID = 'id0';

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

    this.currentRoundTeamScores = [];

    this.changeGrade = this.changeGrade.bind(this);
    this.nextTeam = this.nextTeam.bind(this);
    this.updateTeamScore = this.updateTeamScore.bind(this);
  }

  componentDidMount() {
    // give time for clients' answers to get submitted
    this.timeout = setTimeout(() => {
      // get the round, questions, and teams to grade
      this.firebase.getGame((res) => {
        if (!res.success) return;
        const game = res.data;
        // get the round from stage, ex. round1-grading => round1
        const round = game.stage.split('-')[0];
        this.setState({
          // filter out no bonus
          questions: game[round].filter((question) => (question.questionText !== '')),
          teams: game.teams,
          teamNames: Object.keys(game.teams),
          currentTeamNum: 0,
          // 11 false in case of bonus, only will display ten if no, and last false will not matter
          teamCorrects: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          round,
        }, () => {
          // select the first input after each question
          const input = document.getElementById('id0');
          setTimeout(() => {
            input.select();
          }, 0);
        });
      });
    }, 2000);
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

  // points values in val
  changeGrade(i, val) {
    const teamCorrects = [...this.state.teamCorrects];
    teamCorrects[i] = val;
    this.setState({ teamCorrects });
  }

  updateTeamScore(teamName) {
    const teams = JSON.parse(JSON.stringify(this.state.teams));
    teams[teamName].questionScores = this.state.teamCorrects;
    return teams;
  }

  prevTeam(e) {
    e.preventDefault();

    // select the first text box
    setTimeout(() => {
      document.getElementById(FIRST_ELEMENT_ID).select();
    }, 0);

    // save the current team score
    const updatedTeams = this.updateTeamScore(this.state.teamNames[this.state.currentTeamNum]);
    const prevTeamNum = this.state.currentTeamNum - 1;
    const prevTeamName = this.state.teamNames[prevTeamNum];

    const prevTeamScores = updatedTeams[prevTeamNum].questionScores;

    this.setState({
      teamCorrects: prevTeamScores,
      currentTeamNum: prevTeamNum,
      teams: updatedTeams
    });
  }

  nextTeam(e) {
    e.preventDefault();

    const updatedTeams = this.updateTeamScore(this.state.teamNames[this.state.currentTeamNum]);

    const nextTeamNum = this.state.currentTeamNum + 1;
    // keep repeating if we have teams left
    if (nextTeamNum < this.state.teamNames.length) {
      // select the first input after each question
      const input = document.getElementById(FIRST_ELEMENT_ID);
      setTimeout(() => {
        input.select();
      }, 0);
       
      // it is possible that we went back and now we are going forward again, so check if we have
      // already graded some questions
      const nextTeamName = this.state.teamNames[nextTeamNum];
      const nextTeamCorrects = updatedTeams[nextTeamName].questionScores || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      this.setState({
        teamCorrects: nextTeamCorrects,
        currentTeamNum: nextTeamNum,
        teams: updatedTeams
      }, () => window.scrollTo(0, 0));
    } else {
      // otherwise save the scores
      for (let i = 0; i < this.state.teamNames.length; i++) {
        const name = this.state.teamNames[i];
        // add to the current score if possible
        let score = updatedTeams[name].score || 0;
        score += updatedTeams[name].questionScores.reduce((accumulator, currentValue) => (accumulator + currentValue));
        updatedTeams[name].score = score;
      }

      // after setting standings, then go to the leaderboard/standings page
      // callback makes sure standings are set before we try to show them
      this.firebase.setStandings(updatedTeams, this.state.round, () => {
        this.props.history.push('/host/standings');
      });
    }
  }

  render() {
    // TODO: mobile styling support

    return this.state.questions.length > 0 ? (
      <div className={styles.container}>
        <div className={styles.header}>
          {`team ${this.state.teamNames[this.state.currentTeamNum]}`}
        </div>

        <div className={styles.headerContainer}>
          <div className={styles.subheader}>
            actual answer
          </div>
          <div className={styles.subheader}>
            team answer
          </div>
        </div>

        <form onSubmit={this.nextTeam}>
          <div className={styles.gradingContainer}>
            <div className={styles.divider} />

            {this.state.questions.map((q, i) => (
              <div key={i}>
                <div className={styles.gradeContainer}>
                  <div className={styles.showButton} role="button" tabIndex={1} onClick={() => this.setState({ showQuestion: i })}>
                    <i className={classNames(styles.questionIcon, 'fas fa-question')} />
                    <div className={styles.viewText}>
                      View
                    </div>
                  </div>

                  <div className={styles.answer}>
                    {q.answer}
                  </div>
                  <div className={styles.answer} style={{ marginLeft: '5vw' }}>
                    {this.state.teams[this.state.teamNames[this.state.currentTeamNum]][this.state.round]
                      && this.state.teams[this.state.teamNames[this.state.currentTeamNum]][this.state.round][i]
                        ? this.state.teams[this.state.teamNames[this.state.currentTeamNum]][this.state.round][i] : 'no answer'}
                  </div>

                  <div className={styles.pointsContainer}>
                    <TextInput
                      value={this.state.teamCorrects[i]}
                      onChange={(e) => this.changeGrade(i, Math.min(e.target.value, q.points))}
                      type="number"
                      width="6vw"
                      id={`id${i}`}
                      customStyle={{
                        fontSize: '3vw',
                        lineHeight: '3vw',
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}
                    />
                    <div className={styles.pointsText}>
                      {`/ ${q.points}`}
                    </div>
                  </div>
                </div>

                <div className={styles.divider} />
              </div>
            ))}
          </div>

          {this.state.currentTeamNum > 0 ? (
            <div 
              className={styles.nextButton}
              role="button"
              tabIndex={1}
              onClick={this.prevTeam}
              style={{ left: '3vw', bottom: '3vh' }}
            >
              <i className={classNames('fas fa-arrow-left', styles.arrow)} />
              back
            </div>
          ) : null}

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
          <input type="submit" style={{ opacity: 0, display: 'none' }} />
        </form>

        {this.state.showQuestion !== -1 ? (
          <div className={styles.modal}>
            <div className={styles.popUp}>
              {this.state.questions[this.state.showQuestion].image ? (
                <img src={this.state.questions[this.state.showQuestion].image} alt="Question" className={styles.showImage} />
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
