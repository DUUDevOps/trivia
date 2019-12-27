import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Textfit } from 'react-textfit';

import styles from './styles.module.css';
import DukeNiteLogo from '../../../assets/DukeNiteLogo.png';
import { withFirebase } from '../../../components/Firebase/firebase';

class HostQuestionPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      qnum: parseInt(props.match.params.qnum),
      question: {},
      questions: [],
    };

    this.firebase = props.firebase;

    this.stage = '';

    this.endRound = this.endRound.bind(this);
  }

  componentDidMount() {
    // get the questions from the realtime db
    // we'll use these questions for the whole round because this page
    // will never fully reload
    this.firebase.getGame((game) => {
      // filter out the bonus if it doesn't exist
      const questions = game[game.stage].filter((q) => (q.q !== ''));
      // for ending the round later
      this.stage = game.stage;
      this.setState({
        question: questions[this.state.qnum - 1],
        questions,
      });
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // if the qnum changes, change the question
    // we do this because the page will not automatically rerender when qnum changes
    const newQnum = parseInt(nextProps.match.params.qnum);
    if (newQnum !== prevState.qnum) {
      return {
        qnum: newQnum,
        question: prevState.questions[newQnum - 1],
      };
    } else {
      return prevState;
    }
  }

  endRound() {
    this.firebase.setStage(`${this.stage}-grading`, () => {
      this.props.history.push('/host/grading');
    });
  }

  render() {
    if (!this.state.qnum) {
      return <Redirect to="/admin/login" />;
    }

    return this.state.questions.length > 0 ? (
      <div className={styles.container}>
        <img src={DukeNiteLogo} alt="Duke@Nite Logo" className={styles.logo} draggable={false} />
        <div className={styles.header}>
          {this.state.qnum === 11 ? 'bonus question' : `question ${this.state.qnum}`}
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

        {this.state.qnum === this.state.questions.length ? (
          <div className={styles.nextButton} role="button" tabIndex={0} onClick={this.endRound} style={{ right: '3vw', bottom: '3vh' }}>
            end round
            <i className={classNames('fas fa-arrow-right', styles.arrow)} />
          </div>
        ) : (
          <Link className={styles.nextButton} to={`/host/question/${this.state.qnum + 1}`} style={{ right: '3vw', bottom: '3vh' }}>
            next
            <i className={classNames('fas fa-arrow-right', styles.arrow)} />
          </Link>
        )}

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
  history: PropTypes.object,
};

export default withRouter(withFirebase(HostQuestionPage));
