import * as firebase from 'firebase'
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyDQ5xICbBahso5720aVPMQoXpatXMNz7Bk",
  authDomain: "bedtime-stories-30fe9.firebaseapp.com",
  databaseURL: "https://bedtime-stories-30fe9.firebaseio.com",
  projectId: "bedtime-stories-30fe9",
  storageBucket: "bedtime-stories-30fe9.appspot.com",
  messagingSenderId: "309181626558",
  appId: "1:309181626558:web:4b9f66316db6dfdd4846ef"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();
