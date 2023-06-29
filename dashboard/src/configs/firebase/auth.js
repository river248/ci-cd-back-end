import { getAuth } from 'firebase/auth'
import firebase from './initializeApp'

const firebaseAuth = getAuth(firebase)

export default firebaseAuth
