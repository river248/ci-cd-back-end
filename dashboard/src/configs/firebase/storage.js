import { getStorage } from 'firebase/storage'
import firebase from './initializeApp'

const firebaseStorage = getStorage(firebase)

export default firebaseStorage
