import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import classNames from 'classnames';
import { Textfit } from 'react-textfit';

import styles from './styles.module.css';
import DukeNiteLogo from '../../../assets/DukeNiteLogo.png';
import { withFirebase } from '../../../components/Firebase/firebase';

class HostQuestionPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      question: {},
      qnum: parseInt(props.match.params.qnum),
      numQuestions: 0,
    };

    this.firebase = props.firebase;
  }

  componentDidMount() {
    // get the question from the realtime db
    this.firebase.getGame((game) => {
      const questions = game[game.stage];
      this.setState({
        question: questions[this.state.qnum - 1],
        numQuestions: questions.length,
      });
    });
  }

  render() {
    if (!this.state.qnum) {
      return <Redirect to="/admin/login" />;
    }

    return this.state.numQuestions ? (
      <div className={styles.container}>
        <img src={DukeNiteLogo} alt="Duke@Nite Logo" className={styles.logo} draggable={false} />
        <div className={styles.header}>
          {`question ${this.state.qnum}`}
        </div>

        <div className={styles.questionContainer}>
          {this.state.question.img ? (
            <img src={this.state.question.img} alt="Question" className={styles.questionImage} draggable={false} />
          ) : null}

          {this.state.question.q ? (
            <Textfit
              className={styles.questionText}
              style={{ width: this.state.question.img ? '48vw' : '80vw', height: this.state.question.img ? '70vh' : '60vh' }}
              mode="multi"
              max={70}
            >
              {this.state.question.q}
            </Textfit>
          ) : null}
        </div>

        <Link
          className={styles.nextButton}
          to={this.state.qnum === this.state.numQuestions ? '/host/results' : `/host/question/${this.state.qnum + 1}`}
          style={{ right: '3vw', bottom: '3vh' }}
        >
          {this.state.qnum === this.state.numQuestions ? 'end round' : 'next'}
          <i className={classNames('fas fa-arrow-right', styles.arrow)} />
        </Link>
        {this.state.qnum !== 1 ? (
          <Link
            className={styles.nextButton}
            to={`/host/question/${this.state.qnum - 1}`}
            style={{ left: '3vw', bottom: '3vh' }}
          >
            <i className={classNames('fas fa-arrow-left', styles.arrow)} />
            back
          </Link>
        ) : null}
      </div>
    ) : null;
  }
}

HostQuestionPage.propTypes = {
  match: PropTypes.object,
  firebase: PropTypes.object,
};

export default withFirebase(HostQuestionPage);
