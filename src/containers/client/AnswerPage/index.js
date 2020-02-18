import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isMobile } from 'react-device-detect';

import styles from './styles.module.css';
import { withFirebase } from '../../../components/Firebase/firebase';
import TextInput from '../../../components/TextInput';

class AnswerPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      answers: [],
      stage: '',
    };

    this.firebase = props.firebase;
    this.dbRef = this.firebase.getLiveGameRef();

    this.round = '';

    this.changeAnswer = this.changeAnswer.bind(this);
  }

  componentDidMount() {
    this.firebase.getGame((res) => {
      if (!res.success) return;
      const game = res.data;
      let num = 10;
      this.round = game.stage;
      // see if there is a bonus question for this round
      // if so add an extra answer field
      if (game[game.stage][10].questionText) {
        num += 1;
      }

      // add an empty answer for each question
      let answers = [];
      for (let i = 0; i < num; i++) {
        answers.push('');
      }

      // format the header in a long and boring way
      let stage = '';
      if (game.stage === 'round1') {
        stage = 'round 1';
      } else if (game.stage === 'round2') {
        stage = 'round 2';
      } else {
        stage = 'round 3';
      }

      // get the stored string, and make sure it exists
      const storedString = localStorage.getItem('trivia-answers');
      if (storedString) {
        // make the array from the string
        const savedAnswers = JSON.parse(storedString);
        // make sure it has the right number of answers
        if (savedAnswers && savedAnswers.length === answers.length) {
          answers = savedAnswers;
        }
      }

      this.setState({ answers, stage });
    });

    // listen for the round to end
    this.dbRef.on('value', (snapshot) => {
      const stage = snapshot.val().stage;
      if (['round1-grading', 'round2-grading', 'round3-grading'].includes(stage)) {
        // submit answers to db
        this.firebase.setTeamAnswers(JSON.parse(localStorage.getItem('game')).name, this.round, this.state.answers);
        // remove answers because we just submitted
        localStorage.removeItem('trivia-answers');
        this.props.history.push('/play/waiting');
      }
    });
  }

  componentWillUnmount() {
    this.dbRef.off('value');
  }

  changeAnswer(e, index) {
    const answers = [...this.state.answers];
    answers[index] = e.target.value;
    this.setState({ answers }, () => {
      // store our answers, have to stringify because localstorage can't store an array
      localStorage.setItem('trivia-answers', JSON.stringify(answers));
    });
  }

  render() {
    return this.state.answers.length > 0 ? (
      <div className={styles.container}>
        <div className={styles.header}>
          {this.state.stage}
        </div>

        {this.state.answers.map((a, index) => (
          <div className={styles.answerContainer} key={index}>
            {index === 10 ? (
              <i className={classNames('fas fa-star', styles.answerNum)} />
            ) : (
              <div className={styles.answerNum}>
                {index + 1}
              </div>
            )}

            <TextInput
              placeholder="answer"
              value={a}
              onChange={(e) => this.changeAnswer(e, index)}
              width={isMobile ? '80%' : '50%'}
            />
          </div>
        ))}
      </div>
    ) : null;
  }
}

AnswerPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(withFirebase(AnswerPage));
