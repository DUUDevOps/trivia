import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import classNames from 'classnames';

// import DukeNiteLogo from '../../../assets/DukeNiteLogo.png';
import firebase, { withFirebase } from '../../../components/Firebase/firebase';
import styles from './styles.module.css';

class GradingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numTeams: 7,
      questions: [],
      answers: [],
      corrects: [],
      showQuestion: -1,
    };

    this.team = parseInt(this.props.match.params.team);

    this.firebase = props.firebase;

    this.firebase.getAnswersForTeam(this.team, answers => {
      this.setState({ answers });
    });

    // TODO(dpowers): change this from a constant
    this.firebase.getQuestionsAndCorrectAnswers(questions => {
      this.setState({ questions });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.team === this.props.match.params.team) {
      return;
    }

    this.setState({
      correctAnswers: [false, false, false, false, false, false, false, false, false, false]
    });
  }

  changeGrade(i, val) {
    const corrects = [...this.state.corrects];
    corrects[i] = val;
    this.setState({ corrects });
  }

  render() {
    if (!this.props.match.params.team) {
      return <Redirect to="/admin/login" />;
    }

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          {`team ${this.team}`}
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
                  {q.answer}
                </div>
                <div className={styles.answer} style={{ marginLeft: '5vw' }}>
                  {this.state.answers[i]}
                </div>

                <div
                  className={classNames(styles.gradeButton, { [styles.selectedButton]: this.state.corrects[i] })}
                  role="button"
                  tabIndex={0}
                  onClick={() => this.changeGrade(i, true)}
                >
                  <i className={classNames(styles.gradeIcon, 'fas fa-check', { [styles.selectedIcon]: this.state.corrects[i] })} style={{ fontSize: '2vw' }} />
                </div>
                <div
                  className={classNames(styles.gradeButton, { [styles.selectedButton]: !this.state.corrects[i] })}
                  role="button"
                  tabIndex={0}
                  onClick={() => this.changeGrade(i, false)}
                >
                  <i className={classNames(styles.gradeIcon, 'fas fa-times', { [styles.selectedIcon]: !this.state.corrects[i] })} style={{ fontSize: '2.4vw' }} />
                </div>
              </div>

              <div className={styles.divider} />
            </div>
          ))}
        </div>

        <Link
          className={styles.nextButton}
          to={this.team === this.state.numTeams ? '/admin' : `/admin/grading/${this.team + 1}`}
          style={{ right: '3vw', bottom: '3vh' }}
        >
          {this.team === this.state.numTeams ? 'finish' : 'next'}
          <i className={classNames('fas fa-arrow-right', styles.arrow)} />
        </Link>

        {this.state.showQuestion !== -1 ? (
          <div className={styles.modal}>
            <div className={styles.popUp}>
              {this.state.questions[this.state.showQuestion].img ? (
                <img src={this.state.questions[this.state.showQuestion].img} alt="Question" className={styles.showImage} />
              ) : null}
              <div className={styles.showText}>
                {this.state.questions[this.state.showQuestion].text}
              </div>
              <i className={classNames('fas fa-times', styles.closeIcon)} role="button" tabIndex={0} onClick={() => this.setState({ showQuestion: -1 })} />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

GradingPage.propTypes = {
  match: PropTypes.object,
};

export default withFirebase(GradingPage);