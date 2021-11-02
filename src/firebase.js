import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.G_API_KEY,
  authDomain: 'dinofood.firebaseapp.com',
  databaseURL: 'https://dinofood.firebaseio.com',
  projectId: 'dinofood',
  storageBucket: 'dinofood.appspot.com',
  messagingSenderId: '1064557322091',
  appId: '1:1064557322091:web:c792c3684d2ce823bbf62e'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const database = firebase.database()

const firestore = firebase.firestore()

export {
  firebase,
  database,
  firestore
}

export default firebase
