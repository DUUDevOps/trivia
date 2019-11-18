import firebase from 'firebase';
import React from 'react';

var config = {
	apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "devops-trivia-18a2c.firebaseapp.com",
  databaseURL: "https://devops-trivia-18a2c.firebaseio.com",
  projectId: "devops-trivia-18a2c",
  storageBucket: "",
  messagingSenderId: "701353522538",
  appId: "1:701353522538:web:e621e9c40ab4fbf2dee113",
  measurementId: "G-SJ6TD2BJRW"
};

const DUU_ADMIN_USERNAME = "duu-admin";

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
}

const FirebaseContext = React.createContext(null);

export default Firebase;

export { FirebaseContext };