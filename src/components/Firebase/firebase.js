import firebase from 'firebase';
import React from 'react';

const config = {
  apiKey: "AIzaSyARGwqdebOb043X-pjG6b18iGkJ7LDRk68",
  authDomain: "duu-trivia-c9587.firebaseapp.com",
  databaseURL: "https://duu-trivia-c9587.firebaseio.com",
  projectId: "duu-trivia-c9587",
  storageBucket: "duu-trivia-c9587.appspot.com",
  messagingSenderId: "653573216029",
  appId: "1:653573216029:web:c9f655c0b7b000eddef3f4"
};

// const ADMIN_REF_NAME = "quizzes";
// const NUM_QUESTIONS = 10;

const LIVE_GAME_REF = "currentGame";

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.liveGameRef = firebase.database().ref(LIVE_GAME_REF);
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
        q: '',
        a: '',
        img: '',
      });
    }

    // create a new quiz with a random id
    // this.db.collection('quizzes').add({
    //   name,
    //   date: this.getCurrentFormattedDate(),
    //   round1: round,
    //   round2: round,
    //   round3: round,
    // })
    // .then((ref) => callback(ref.id));

    const newQuiz = {
      name,
      round1: round,
      round2: round,
      round3: round
    };

    let newQuizRef = firebase.database().ref().push();
    newQuizRef.set(newQuiz)
      .then(() => callback(newQuizRef.key));
  };

  /**
   * Delete a quiz by its id
   * @param {String} quizId
   * @param {function} callback
   */
  deleteQuiz = (id, callback) => {
    firebase.database().ref(id)
      .remove()
      .then(callback);
  };


  /**
   * save a whole quiz
   * it's essential that the quiz is the whole quiz object
   * @param {String} quizId
   * @param {Object} quiz
   * @param {function} callback
   */
  saveQuiz = (id, quiz, callback) => {
    // const docRef = this.db.collection('quizzes').doc(id);
    // docRef.set(quiz).then(callback);
    firebase.database().ref(id)
      .set(quiz)
      .then(callback);
  };

  /**
   * returns all quizzes in the database
   * @param {function} callback
   */
  getQuizzes = (callback) => {
    const quizzes = [];
    // this.db.collection('quizzes').get()
    //   .then((snapshot) => {
    //     snapshot.forEach((doc) => {
    //       quizzes.push({
    //         id: doc.id,
    //         data: doc.data(),
    //       });
    //     });
    //     callback(quizzes);
    //   })
    //   .catch((err) => {
    //     console.error('Error getting documents', err);
    //   });
    firebase.database().ref().once('value')
      .then(snapshot => {
        snapshot.forEach(child => {
          quizzes.push({
            id: child.key,
            data: child.val()
          });
        });
        callback(quizzes);
      })
      .catch(err => console.error('Error getting documents', err));
  };

  /**
   * Get a quiz by its ID
   * @param {String} quizID
   * @param {function} callback
   */
  getQuiz = (id, callback) => {
    // this.db.collection('quizzes').doc(id).get()
    //   .then((doc) => {
    //     // if no doc, return no success so we can redirect
    //     // else return the document data
    //     if (!doc) {
    //       callback({ success: false });
    //     } else {
    //       callback({ success: true, data: doc.data() });
    //     }
    //   })
    //   .catch((err) => {
    //     console.error('Error getting document', err);
    //     callback({ success: false });
    //   });
    firebase.database().ref(id)
      .once('value')
      .then(snapshot => {
        if (!snapshot.exists()) {
          callback({ success: false });
        } else {
          callback({ success: true, data: snapshot.val() });
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

      firebase.database().ref(LIVE_GAME_REF).set({
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
   * calls the callback with all the data for the current game
   * @param {function} callback
   */
  getGame = (callback) => {
    this.liveGameRef.once('value')
      .then((snapshot) => {
        callback({ success: true, data: snapshot.val() });
      })
      .catch(err => callback({ success: false }));
  };

  /**
   * joins the live game by adding the team
   * to the teams object
   * @param {String} teamName
   * @param {array} teamIds
   * @param {function} callback
   */
  joinGame = (teamName, teamIds, callback) => {
    this.liveGameRef.once('value')
      .then((snapshot) => {
        // if first team, we create the new object
        const teams = snapshot.val().teams || {};
        teams[teamName] = {
          ids: teamIds,
        };

        firebase.database().ref(LIVE_GAME_REF).child('teams').set(teams);

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
    this.liveGameRef.once('value')
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
    this.liveGameRef
      .child('stage')
      .set(newStage)
      .then(callback);
  }

  /**
   * returns a references to the live game part of the database
   */
  getLiveGameRef = () => {
    return firebase.database().ref(LIVE_GAME_REF);
  };

  /**
   * save a team answers for a round
   * @param {string} teamName
   * @param {string} round
   * @param {array} answers
   */
  setTeamAnswers = (teamName, round, answers) => {
    this.liveGameRef.child(`teams/${teamName}/${round}`).set(answers);
  };

  /**
   * set the new team standings and set stage to standings
   * @param {object} teams
   * @param {string} round
   * @param {function} callback
   */
  setStandings = (teams, round, callback) => {
    // inefficient christmas tree, but not sure if await works with firebase
    this.liveGameRef.child('teams').set(teams)
      .then(() => {
        this.setStage(`${round}-${round === 'round3' ? 'final standings' : 'standings'}`, callback);
      });
  };

  /**
   * @returns {string}
   */
  getCurrentFormattedDate = () => {
    // this will return the date in the format MM-DD-YYYY 
    // - used for uniqueness in games
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
  