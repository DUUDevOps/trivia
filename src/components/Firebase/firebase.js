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
 
  signInWithEmail = (email, password, callback) => {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(() => callback(null))
      .catch((error) => {
        console.log(error);
      });
  };

  saveQuizFromAdmin = (quiz, callback) => {
    let quizRef = firebase.database().ref().child(this.getCurrentFormattedDate());

    // firebase doesn't allow insertion of arrays, so create children by auto id
    quiz.forEach(QASet => {
      quizRef.push().set(QASet);
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
