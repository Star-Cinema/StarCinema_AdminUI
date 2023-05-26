import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyD1cW8ycANTzornqOBZrpZHFmT-Rq2z-fs",
  authDomain: "starcinema-3e386.firebaseapp.com",
  projectId: "starcinema-3e386",
  storageBucket: "starcinema-3e386.appspot.com",
  messagingSenderId: "105681044324",
  appId: "1:105681044324:web:bc203162383ef67f3a3071",
  measurementId: "G-2W5KKXYSXD"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();


export { firestore, auth };
export default firebase;
