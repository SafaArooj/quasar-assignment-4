import firebase from '@firebase/app';
require('firebase/auth');
import "firebase/database";

var firebaseConfig = { 
  apiKey: "AIzaSyCMlHw3JRPM1ktx3vfCI1N7qw0D2ma8wUA",
  authDomain: "quasarassignment4.firebaseapp.com",
  databaseURL: "https://quasarassignment4-default-rtdb.firebaseio.com",
  projectId: "quasarassignment4",
  storageBucket: "quasarassignment4.appspot.com",
  messagingSenderId: "1040145271840",
  appId: "1:1040145271840:web:c9aafe1d79f47455034045",
  measurementId: "G-ZBL167LPP5"
};

let firebaseApp = firebase.initializeApp(firebaseConfig);
let firebaseAuth = firebaseApp.auth();
let firebaseDb = firebaseApp.database();

export { firebaseAuth, firebaseDb }
