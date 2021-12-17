import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDEvjxEDzTb5G8Ik_siY7jM8aqyJmXzl98',
  authDomain: 'dino-food-f52c4.firebaseapp.com',
  projectId: 'dino-food-f52c4',
  storageBucket: 'dino-food-f52c4.appspot.com',
  messagingSenderId: '570122616174',
  appId: '1:570122616174:web:89b5fccdcd8691740e157f',
  measurementId: 'G-55Q2SVQ694'
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
