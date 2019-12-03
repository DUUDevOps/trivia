import React, { Component } from 'react';
import './create-quiz.css';
//import firebase from '../../firebase';
import firebase from '../../../components/Firebase/firebase'
import styles from '../../client/RegisterPage/styles.module.css';
import TextInput from '../../../components/TextInput';
//Need to write out the handleChange and handleSubmit methods
//idea have two arrays, one for Qs and one for A's?

const NUM_QUES = 10
//need to change for bonus?

class CreateQuizPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ques: [''],
      ans: [''],
      media: [''],
    }


    this.ChangeId = this.ChangeId.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //handleChange = index => event => {
  //incomplete
  handleChange(e, index) {
    const ques = [...this.state.ques];
    ques[index] = e.target.value;
    const ans = [...this.state.ans];
    ans[index] = e.target.value;
    const media = [...this.state.media];
    media[index] = e.target.value;

    this.setState({ques, ans, media})
  }
  //work in progress
  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const item = {
      question: this.state.ques,
      answer: this.state.ans,
    }
    itemsRef.push(item);
  }

  render() {
    return (
      <div className={styles.container}>
        <h1>Welcome to Trivia</h1>
        <div className="container">
          <p>Please enter your questions and answers here</p>
        </div>
        <div className={styles.inputContainer}>
          <form onSubmit = {this.handleSubmit}>
          <table>
            <tr>
              <td>Question</td>
              <td>Answer</td>
            </tr>
            <tr>
              <td><input type="text" name="question1" placeholder = "Question 1" /></td>
              <td><input type="text" name="answer1" placeholder = "Answer 1" /></td>
            </tr>
            <tr>
              <td><input type="text" name="question2" placeholder = "Question 2" /></td>
              <td><input type="text" name="answer2" placeholder = "Answer 2" /></td>
            </tr>
            <tr>
              <td><input type="text" name="question3" placeholder = "Question 3" /></td>
              <td><input type="text" name="answer3" placeholder = "Answer 3" /></td>
            </tr>
            <tr>
              <td><input type="text" name="question4" placeholder = "Question 4" /></td>
              <td><input type="text" name="answer4" placeholder = "Answer 4" /></td>
            </tr>
            <tr>
              <td><input type="text" name="question5" placeholder = "Question 5" /></td>
              <td><input type="text" name="answer5" placeholder = "Answer 5" /></td>
            </tr>
            <tr>
              <td><input type="text" name="question6" placeholder = "Question 6" /></td>
              <td><input type="text" name="answer6" placeholder = "Answer 6" /></td>
            </tr>
            <tr>
              <td><input type="text" name="question7" placeholder = "Question 7" /></td>
              <td><input type="text" name="answer7" placeholder = "Answer 7" /></td>
            </tr>
            <tr>
              <td><input type="text" name="question8" placeholder = "Question 8" /></td>
              <td><input type="text" name="answer8" placeholder = "Answer 8" /></td>
            </tr>
            <tr>
              <td><input type="text" name="question9" placeholder = "Question 9" /></td>
              <td><input type="text" name="answer9" placeholder = "Answer 9" /></td>
            </tr>
            <tr>
              <td><input type="text" name="question10" placeholder = "Question 10" /></td>
              <td><input type="text" name="answer10" placeholder = "Answer 10" /></td>
            </tr>
          </table>
          <button>Submit Quiz</button>
          </form>
        </div>
      </div>
    );
  }
};

export default CreateQuizPage;
