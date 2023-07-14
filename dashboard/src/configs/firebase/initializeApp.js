import { initializeApp } from 'firebase/app'

const prodConfig = {
    apiKey: 'AIzaSyBqXQxuWcEjr2DYJrLI09qWC6dF0dC_PTk',
    authDomain: 'ci-cd-github-actions.firebaseapp.com',
    projectId: 'ci-cd-github-actions',
    storageBucket: 'ci-cd-github-actions.appspot.com',
    messagingSenderId: '107543337844',
    appId: '1:107543337844:web:bf1dd2c548191fb275ea21',
    measurementId: 'G-XF9YMSV7PB',
}

const testConfig = {
    apiKey: 'AIzaSyBqObxPFvRKMnQ1CT0s5G6qju1vZLaI5m8',
    authDomain: 'ci-cd-github-actions-test.firebaseapp.com',
    projectId: 'ci-cd-github-actions-test',
    storageBucket: 'ci-cd-github-actions-test.appspot.com',
    messagingSenderId: '451804714965',
    appId: '1:451804714965:web:b00796db4d4abd4c4a0f5c',
    measurementId: 'G-60T4JK326Q',
}

// Initialize Firebase
const firebase = initializeApp(prodConfig)

export default firebase
