import firebase from 'firebase';
import React from 'react';

var config = {
	apiKey: "AIzaSyAwyhl8Pi7drd3ls6bSaxWTYx3LnyyO7_Q",
  authDomain: "devops-trivia-18a2c.firebaseapp.com",
  databaseURL: "https://devops-trivia-18a2c.firebaseio.com",
  projectId: "devops-trivia-18a2c",
  storageBucket: "",
  messagingSenderId: "701353522538",
  appId: "1:701353522538:web:e621e9c40ab4fbf2dee113",
  measurementId: "G-SJ6TD2BJRW"
};

const DUU_ADMIN_USERNAME = "dukeatnite@gmail.com";
const QUIZ_REF_NAME = "quizzes";
const NUM_QUESTIONS = 10;

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.auth = firebase.auth();
  }
 
  signInWithEmail = (email, password, callback) => {
    if (email !== DUU_ADMIN_USERNAME) {
      callback({
        message: "Incorrect Admin Account",
        status: 500,
      });
    }

    this.auth.signInWithEmailAndPassword(email, password)
      .then(() => callback(null))
      .catch((error) => {
        callback({
          message: error.message,
          status: 500
        });
      });
  };

  saveQuizFromAdmin = (quiz, callback) => {
    let quizzesRef = firebase.database().ref(QUIZ_REF_NAME);
    let newQuizRef = quizzesRef.child('' + this.getCurrentFormattedDate());

    quiz.forEach(QASet => {
      newQuizRef.push().set(QASet);
    });

    callback();
  };

  getCurrentFormattedDate = () => {
    // this will return the date in yyyy-mm-dd
    return new Date().toISOString().slice(0, 10);
  };
}

const FirebaseContext = React.createContext(null);

export default Firebase;

export { FirebaseContext };