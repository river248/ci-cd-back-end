import { initializeApp } from 'firebase/app'

const firebaseConfig = {
    apiKey: 'AIzaSyBqXQxuWcEjr2DYJrLI09qWC6dF0dC_PTk',
    authDomain: 'ci-cd-github-actions.firebaseapp.com',
    projectId: 'ci-cd-github-actions',
    storageBucket: 'ci-cd-github-actions.appspot.com',
    messagingSenderId: '107543337844',
    appId: '1:107543337844:web:bf1dd2c548191fb275ea21',
    measurementId: 'G-XF9YMSV7PB',
}

// Initialize Firebase
const firebase = initializeApp(firebaseConfig)

export default firebase
