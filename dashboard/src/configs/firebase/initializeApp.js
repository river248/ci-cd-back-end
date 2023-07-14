import { initializeApp } from 'firebase/app'

// This config must be secret
const firebaseConfig = {}

// Initialize Firebase
const firebase = initializeApp(firebaseConfig)

export default firebase
