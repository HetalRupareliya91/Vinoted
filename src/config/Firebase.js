import "firebase/analytics";
import firebase from "firebase/app";
import "firebase/firebase-messaging";

var config = {
  apiKey: "AIzaSyDGkwSV8HnmRZ8OWAz8YOBYNAwuCzhpNbI",
  authDomain: "vinoted-a4f9a.firebaseapp.com",
  projectId: "vinoted-a4f9a",
  storageBucket: "vinoted-a4f9a.appspot.com",
  messagingSenderId: "410801351983",
  appId: "1:410801351983:web:1c5872bf46ee7f9a8ec5da",
  measurementId: "G-F9CDKQCLR3",
};
firebase.initializeApp(config);

export default firebase;
