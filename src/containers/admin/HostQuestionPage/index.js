import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import classNames from 'classnames';
import { Textfit } from 'react-textfit';

import DukeNiteLogo from '../../../assets/DukeNiteLogo.png';
import styles from './styles.module.css';

class HostQuestionPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: [
        {
          text: 'Who was the 1st pick in the 2019 NBA Draft?',
          img: 'https://www.pinclipart.com/picdir/big/195-1958645_pelicans-playoff-moments-new-orleans-pelicans-clipart.png',
        }, {
          text: '2 + 2 = ?',
          img: '',
        }, {
          text: '2 + 2 = ?',
          img: 'https://www.usnews.com/dims4/USNEWS/1a50cbb/2147483647/thumbnail/640x420/quality/85/?url=http%3A%2F%2Fcom-usnews-beam-media.s3.amazonaws.com%2F85%2Ff1%2F19f0ed814815ade2f68071bc3164%2F190610-geometryshapes-stock.jpg',
        }, {
          text: 'This question will be overwhelmingly long to make sure that we can fit questions even when they are longer than any reasonable person would make them. I guess it will not be too long to keep it realistic, but still...',
          img: '',
        }, {
          text: 'This question will be overwhelmingly long (with a picture) to make sure that we can fit questions even when they are longer than any reasonable person would make them. I guess it will not be too long to keep it realistic, but still...',
          img: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/American_Beaver.jpg',
        }, {
          text: 'Back to normal sized questions, I guess?',
          img: '',
        }, {
          text: 'Who is the oldest quarterback to ever win a Super Bowl?',
          img: '',
        },
      ]
    };
  }

  render() {
    if (!this.props.match.params.qnum) {
      return <Redirect to="/admin/login" />;
    }

    const qnum = parseInt(this.props.match.params.qnum);
    const question = this.state.questions[qnum - 1];

    return (
      <div className={styles.container}>
        <img src={DukeNiteLogo} alt="Duke@Nite Logo" className={styles.logo} draggable={false} />
        <div className={styles.header}>
          {`question ${qnum}`}
        </div>

        <div className={styles.questionContainer}>
          {question.img ? (
            <img src={question.img} alt="Question" className={styles.questionImage} draggable={false} />
          ) : null}

          {question.text ? (
            <Textfit
              className={styles.questionText}
              style={{ width: question.img ? '48vw' : '80vw', height: question.img ? '70vh' : '60vh' }}
              mode="multi"
              max={70}
            >
              {question.text}
            </Textfit>
          ) : null}
        </div>

        <Link
          className={styles.nextButton}
          to={qnum === this.state.questions.length ? '/host/results' : `/host/question/${qnum + 1}`}
          style={{ right: '3vw', bottom: '3vh' }}
        >
          {qnum === this.state.questions.length ? 'end round' : 'next'}
          <i className={classNames('fas fa-arrow-right', styles.arrow)} />
        </Link>
        {qnum !== 1 ? (
          <Link
            className={styles.nextButton}
            to={`/host/question/${qnum - 1}`}
            style={{ left: '3vw', bottom: '3vh' }}
          >
            <i className={classNames('fas fa-arrow-left', styles.arrow)} />
            back
          </Link>
        ) : null}
      </div>
    );
  }
}

HostQuestionPage.propTypes = {
  match: PropTypes.object,
};

export default HostQuestionPage;
