import firebase from 'firebase';
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

firebase.initializeApp(config);
export default firebase;