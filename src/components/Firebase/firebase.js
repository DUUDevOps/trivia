import firebase from 'firebase';
import React from 'react';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "duu-trivia.firebaseapp.com",
  databaseURL: "https://duu-trivia.firebaseio.com",
  projectId: "duu-trivia",
  storageBucket: "duu-trivia.appspot.com",
  messagingSenderId: "503528390951",
  appId: "1:503528390951:web:691b0e36f43d7209706902",
  measurementId: "G-L05CNT2ZWP"
};

// const ADMIN_REF_NAME = "quizzes";
// const NUM_QUESTIONS = 10;

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.auth = firebase.auth();
    this.db = firebase.firestore();
  }

  /**
   * @param {string} email
   * @param {string} password
   * @param {function} callback
   */
  signInWithEmail = (email, password, callback) => {
    this.auth.signInWithEmailAndPassword(email, password)
      .then((res) => {
        callback({ success: true, msg: email });
      })
      .catch((err) => {
        callback({ success: false, msg: err.message })
      });
  };

  /**
   * @param {String} name
   * @param {function} callback
   */
  createQuiz = (name, callback) => {
    // create an empty round array
    // 11 questions in case of bonus
    const round = [];
    for (let i = 0; i < 11; i++) {
      round.push({
        question: '',
        answer: '',
        image: '',
      });
    }

    // create a new quiz with a random id
    this.db.collection('quizzes').add({
      name,
      date: this.getCurrentFormattedDate(),
      round1: round,
      round2: round,
      round3: round,
    })
      .then((ref) => {
        callback(ref.id);
      });
  };

  /**
   * Delete a quiz by its id
   * @param {String} quizId
   * @param {function} callback
   */
  deleteQuiz = (id, callback) => {
    this.db.collection(`quizzes`).doc(id).delete().then(callback);
  };


  /**
   * save a whole quiz
   * it's essential that the quiz is the whole quiz object
   * @param {String} quizId
   * @param {Object} quiz
   * @param {function} callback
   */
  saveQuiz = (id, quiz, callback) => {
    const docRef = this.db.collection('quizzes').doc(id);
    docRef.set(quiz).then(callback);
  };

  /**
   * returns all quizzes in the database
   * @param {function} callback
   */
  getQuizzes = (callback) => {
    const quizzes = [];
    this.db.collection('quizzes').get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          quizzes.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        callback(quizzes);
      })
      .catch((err) => {
        console.error('Error getting documents', err);
      });
  };

  /**
   * Get a quiz by its ID
   * @param {String} quizID
   * @param {function} callback
   */
  getQuiz = (id, callback) => {
    this.db.collection('quizzes').doc(id).get()
      .then((doc) => {
        // if no doc, return no success so we can redirect
        // else return the document data
        if (!doc) {
          callback({ success: false });
        } else {
          callback({ success: true, data: doc.data() });
        }
      })
      .catch((err) => {
        console.error('Error getting document', err);
        callback({ success: false });
      });
  };

  /**
   * create a new game by hosting a quiz
   * @param {String} quizId
   */
  hostQuiz = (id) => {
    // store the questions here so we can easily get them
    // and they don't change
    this.getQuiz(id, (res) => {
      if (!res.data) return;

      firebase.database().ref().set({
        quizId: id,
        date: this.getCurrentFormattedDate(),
        stage: 'join',
        round1: res.data.round1,
        round2: res.data.round2,
        round3: res.data.round3,
        teams: [],
      });
    });
  };

  /**
   * calls the callback with all the data in the realtime db
   * this gives us anything we need for a live game
   * @param {function} callback
   */
  getGame = (callback) => {
    firebase.database().ref().once('value')
      .then((snapshot) => {
        callback(snapshot.val());
      });
  };

  /**
   * joins the live game by adding the team
   * to the teams object
   * @param {String} teamName
   * @param {array} teamIds
   * @param {function} callback
   */
  joinGame = (teamName, teamIds, callback) => {
    firebase.database().ref().once('value')
      .then((snapshot) => {
        // if first team, we create the new object
        const teams = snapshot.val().teams || {};
        teams[teamName] = {
          ids: teamIds,
        };

        firebase.database().ref('teams').set(teams);

        // calls callback with the date and team name to
        // store in local storage for the client
        // date for verification of being in live game
        // name for accessing team in live game later
        callback({
          date: snapshot.val().date,
          name: teamName,
        });
      });
  };

  /**
   * used to verify that the user is in the live game
   * by seeing if their date is equal to the live game's start date
   * @param {String} date
   * @param {function} callback
   */
  inGame = (date, callback) => {
    firebase.database().ref().once('value')
      .then((snapshot) => {
        callback(snapshot.val().date === date);
      });
  };

  /**
   * changes the live game's stage
   * @param {String} newStage
   * @param {function} callback
   */
  setStage = (newStage, callback) => {
    firebase.database().ref('stage').set(newStage).then(callback);
  }

  /**
   * returns a references to the live database
   * so we can listen for changes on each page
   */
  getDatabaseRef = () => {
    return firebase.database().ref();
  };

  /**
   * save a team answers for a round
   * @param {string} teamName
   * @param {string} round
   * @param {array} answers
   */
  setTeamAnswers = (teamName, round, answers) => {
    firebase.database().ref(`teams/${teamName}/${round}`).set(answers);
  };

  /**
   * set the new team standings and set stage to standings
   * @param {object} teams
   * @param {string} round
   * @param {function} callback
   */
  setStandings = (teams, round, callback) => {
    // inefficient christmas tree, but not sure if await works with firebase
    firebase.database().ref('teams').set(teams)
      .then(() => {
        this.setStage(`${round}-${round === 'round3' ? 'final standings' : 'standings'}`, callback);
      });
  };

  /**
   * @returns {string}
   */
  getCurrentFormattedDate = () => {
    // this will return the date in string format
    // this prevents it from changing in firebase
    // and provides uniqueness to games
    return new Date().toISOString();
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
