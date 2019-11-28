import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import classNames from 'classnames';

// import DukeNiteLogo from '../../../assets/DukeNiteLogo.png';
import styles from './styles.module.css';

class GradingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numTeams: 7,
      questions: [
        {
          text: 'Who was the 1st pick in the 2019 NBA Draft?',
          img: 'https://www.pinclipart.com/picdir/big/195-1958645_pelicans-playoff-moments-new-orleans-pelicans-clipart.png',
          ans: 'Zion Williamson',
        }, {
          text: '2 + 2 = ?',
          img: '',
          ans: '4',
        }, {
          text: '2 + 2 = ?',
          img: 'https://www.usnews.com/dims4/USNEWS/1a50cbb/2147483647/thumbnail/640x420/quality/85/?url=http%3A%2F%2Fcom-usnews-beam-media.s3.amazonaws.com%2F85%2Ff1%2F19f0ed814815ade2f68071bc3164%2F190610-geometryshapes-stock.jpg',
          ans: 'Four',
        }, {
          text: 'This question will be overwhelmingly long to make sure that we can fit questions even when they are longer than any reasonable person would make them. I guess it will not be too long to keep it realistic, but still...',
          img: '',
          ans: 'An overwhelmingly long answer that may be correct but is way more than we need',
        }, {
          text: 'This question will be overwhelmingly long (with a picture) to make sure that we can fit questions even when they are longer than any reasonable person would make them. I guess it will not be too long to keep it realistic, but still...',
          img: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/American_Beaver.jpg',
          ans: 'Kind of long, but not too long',
        }, {
          text: 'Back to normal sized questions, I guess?',
          img: '',
          ans: 'Normal Answer',
        }, {
          text: 'Who is the oldest quarterback to ever win a Super Bowl?',
          img: '',
          ans: 'Tom Brady',
        }, {
          text: 'This question will be overwhelmingly long (with a picture) to make sure that we can fit questions even when they are longer than any reasonable person would make them. I guess it will not be too long to keep it realistic, but still...',
          img: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/American_Beaver.jpg',
          ans: 'Kind of long, but not too long',
        }, {
          text: 'Back to normal sized questions, I guess?',
          img: '',
          ans: 'Normal Answer',
        }, {
          text: 'Who is the oldest quarterback to ever win a Super Bowl?',
          img: '',
          ans: 'Tom Brady',
        },
      ],
      answers: [
        'zion',
        'four',
        '4',
        'a very long answer for no reason, I doubt these will be limited in length, so it could happen',
        'i am not sure',
        'Normal Answer',
        'Lebron James',
        'i am not sure',
        'Normal Answer',
        'Lebron James',
      ],
      corrects: [],
      showQuestion: -1,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.team === this.props.match.params.team) {
      return;
    }
    this.setState({
      corrects: [false,false,false,false,false,false,false,false,false,false],
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

    const team = parseInt(this.props.match.params.team);

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          {`team ${team}`}
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
                  {q.ans}
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
          to={team === this.state.numTeams ? '/admin' : `/admin/grading/${team + 1}`}
          style={{ right: '3vw', bottom: '3vh' }}
        >
          {team === this.state.numTeams ? 'finish' : 'next'}
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

export default GradingPage;
