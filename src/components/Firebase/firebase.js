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
  signInWithEmail = (email, password, cb) => {
    this.auth.signInWithEmailAndPassword(email, password)
      .then((res) => {
        cb({ success: true, msg: email });
      })
      .catch((err) => {
        cb({ success: false, msg: err.message })
      });
  };

  /**
   * @param {String} name
   * @param {function} callback
   */
  createQuiz = (name, cb) => {
    // create an empty round array
    // 11 questions in case of bonus
    const round = [];
    for (let i = 0; i < 11; i++) {
      round.push({
        q: '',
        a: '',
        img: '',
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
        cb(ref.id);
      });
  };

  /**
   * Delete a quiz by its id
   * @param {String} quizId
   * @param {function} callback
   */
  deleteQuiz = (id, cb) => {
    this.db.collection(`quizzes`).doc(id).delete().then(() => cb());
  };


  /**
   * save a whole quiz
   * it's essential that the quiz is the whole quiz object
   * @param {String} quizId
   * @param {Object} quiz
   * @param {function} callback
   */
  saveQuiz = (id, quiz, cb) => {
    const docRef = this.db.collection('quizzes').doc(id);
    docRef.set(quiz).then(() => cb());
  };

  /**
   * returns all quizzes in the database
   * @param {function} callback
   */
  getQuizzes = (cb) => {
    const quizzes = [];
    this.db.collection('quizzes').get()
      .then((snap) => {
        snap.forEach((doc) => {
          quizzes.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        cb(quizzes);
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
  getQuiz = (id, cb) => {
    this.db.collection('quizzes').doc(id).get()
      .then((doc) => {
        // if no doc, return no success so we can redirect
        // else return the document data
        if (!doc) {
          cb({ success: false });
        } else {
          cb({ success: true, data: doc.data() });
        }
      })
      .catch((err) => {
        console.error('Error getting document', err);
        cb({ success: false });
      });
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
