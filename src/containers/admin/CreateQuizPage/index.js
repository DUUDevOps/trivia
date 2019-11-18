import React from 'react';

import styles from '../../client/RegisterPage/styles.module.css';
import TextInput from '../../../components/TextInput';

const NUM_QUESTIONS = 10;

class CreateQuizPage extends React.Component {

  constructor() {

    var defaultQA = [];
    for (let i = 0; i < NUM_QUESTIONS; i += 1) {
      defaultQA.push({
        question: '',
        answer: ''
      });
    }

    this.state = {
      questionsAndAnswers: defaultQA,
    }
  }

  render() {
    return (
      <h1>
        This is the create quiz page
      </h1>
    );
  }
}

export default CreateQuizPage;