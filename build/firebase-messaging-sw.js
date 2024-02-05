// import "firebase/analytics";
// import firebase from "firebase/app";
// import "firebase/firebase-messaging";

importScripts("https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js");
// For an optimal experience using Cloud Messaging, also add the Firebase SDK for Analytics.
importScripts("https://www.gstatic.com/firebasejs/8.3.1/firebase-analytics.js");

firebase.initializeApp({
  apiKey: "AIzaSyDGkwSV8HnmRZ8OWAz8YOBYNAwuCzhpNbI",
  authDomain: "vinoted-a4f9a.firebaseapp.com",
  projectId: "vinoted-a4f9a",
  storageBucket: "vinoted-a4f9a.appspot.com",
  messagingSenderId: "410801351983",
  appId: "1:410801351983:web:1c5872bf46ee7f9a8ec5da",
  measurementId: "G-F9CDKQCLR3",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/itwonders-web-logo.png",
  };

  return window.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
