import firebase from 'firebase'
import React from 'react'

/* var config = {
  apiKey: "AIzaSyAwyhl8Pi7drd3ls6bSaxWTYx3LnyyO7_Q",
  authDomain: "devops-trivia-18a2c.firebaseapp.com",
  databaseURL: "https://devops-trivia-18a2c.firebaseio.com",
  projectId: "devops-trivia-18a2c",
  storageBucket: "",
  messagingSenderId: "701353522538",
  appId: "1:701353522538:web:e621e9c40ab4fbf2dee113",
  measurementId: "G-SJ6TD2BJRW"
}; */

var firebaseConfig = {
  apiKey: "AIzaSyDiwnfwQ4hbNxjZC7Ei-pXXB2iDAziFpJU",
  authDomain: "fun-food-friends-baffe.firebaseapp.com",
  databaseURL: "https://fun-food-friends-baffe.firebaseio.com",
  projectId: "fun-food-friends-baffe",
  storageBucket: "fun-food-friends-baffe.appspot.com",
  messagingSenderId: "539730067495",
  appId: "1:539730067495:web:fa50cabb6d626befd08e02",
  measurementId: "G-LGHM1R2NNR"
};
// Initialize Firebase

firebase.initializeApp(firebaseConfig);

const DUU_ADMIN_USERNAME = "duu-admin";

class Firebase {
  constructor() {
    this.auth = firebase.auth();
    this.database = firebase.database();
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