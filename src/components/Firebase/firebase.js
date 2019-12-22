import firebase from 'firebase';
import React from 'react';

const config = {
  apiKey: "AIzaSyAwyhl8Pi7drd3ls6bSaxWTYx3LnyyO7_Q",
  authDomain: "devops-trivia-18a2c.firebaseapp.com",
  databaseURL: "https://devops-trivia-18a2c.firebaseio.com",
  projectId: "devops-trivia-18a2c",
  storageBucket: "devops-trivia-18a2c.appspot.com",
  messagingSenderId: "701353522538",
  appId: "1:701353522538:web:e621e9c40ab4fbf2dee113",
  measurementId: "G-SJ6TD2BJRW"
};

const ADMIN_REF_NAME = "quizzes";
const NUM_QUESTIONS = 10;

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.auth = firebase.auth();
  }
 
  /**
   * @param {string} email
   * @param {string} password
   * @param {function} callback
   */
  signInWithEmail = (email, password, callback) => {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(() => callback(null))
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * @param {Object} quiz
   * @param {function} callback
   */
  saveQuizFromAdmin = (quiz, callback) => {
    let quizRef = firebase.database().ref().child(this.getCurrentFormattedDate()).child('admin');

    // firebase doesn't allow insertion of arrays, so create children by auto id
    var questionNum = 1;
    quiz.forEach(QASet => {
      quizRef.child(questionNum).set(QASet);
      questionNum += 1;
    });

    callback();
  };

  /**
   * @param {number} teamNumber
   * @param {array} answers
   * @param {function} callback
   */
  saveAnswersForTeam = (teamNumber, answers, callback) => {
    let teamRef = firebase.database().ref()
      .child(this.getCurrentFormattedDate())
      .child('teams')
      .child(teamNumber);

    answers.forEach((answer, index) => {
      teamRef.child(index).set(answer);
    });

    callback();
  };

  /**
   * @param {Number} teamNumber
   * @param {function} callback
   */
  getAnswersForTeam = (teamNumber, callback) => {
    let teamRef = firebase.database().ref()
      .child(this.getCurrentFormattedDate())
      .child('teams')
      .child(teamNumber);

    teamRef.once('value')
      .then(snapshot => {
        if (!snapshot.exists()) {
          return;
        }

        var answers = new Array(snapshot.numChildren());

        snapshot.forEach(answer => {
          answers[parseInt(answer.key)] = answer.val();
        });

        callback(answers);
      }).catch(error => console.log(error));
  }

  /**
   * @param {function} callback
   */
  getQuestionsAndCorrectAnswers = (callback) => {
    let roundRef = firebase.database().ref()
      .child(this.getCurrentFormattedDate())
      .child('admin');

    roundRef.once('value')
      .then(snapshot => {
        if (!snapshot.exists()) {
          return;
        }

        var questionsAndAnswers = new Array(snapshot.numChildren())

        snapshot.forEach(question => {
          questionsAndAnswers[parseInt(question.key)] = question.val();
        });

        callback(questionsAndAnswers);
      }).catch(error => console.log(error));
  }

  /**
   * @returns {string}
   */
  getCurrentFormattedDate = () => {
    // this will return the date in yyyy-mm-dd
    return new Date().toISOString().slice(0, 10);
  };
}

const FirebaseContext = React.createContext(null);

export const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);

export default Firebase;

export { FirebaseContext };