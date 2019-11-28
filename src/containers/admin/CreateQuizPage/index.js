import React from 'react';

import styles from '../../client/RegisterPage/styles.module.css';
import TextInput from '../../../components/TextInput';
import { FirebaseContext } from '../../../components/Firebase/firebase';

const NUM_QUESTIONS = 10;

const CreateQuizPage = () => (
  <FirebaseContext.Consumer>
    {firebase => <CreateQuizContainer firebase={firebase} />}
  </FirebaseContext.Consumer>
);

class CreateQuizContainer extends React.Component {

  constructor(props) {
    super(props);
    var defaultQA = [];
    for (let i = 0; i < NUM_QUESTIONS; i += 1) {
      defaultQA.push({
        question: 'This is a question',
        answer: 'This is an answer'
      });
    }

    this.state = {
      questionsAndAnswers: defaultQA,
    }

    this.firebase = props.firebase;

    this.firebase.saveQuizFromAdmin(defaultQA, () => console.log('success'));
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