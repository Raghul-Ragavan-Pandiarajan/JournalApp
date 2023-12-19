import * as firebase from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB0ZMXQitrAdVX-lCd7QA5RInRTNEv--_Q",
  authDomain: "muse-2e3a2.firebaseapp.com",
  projectId: "muse-2e3a2",
  storageBucket: "muse-2e3a2.appspot.com",
  messagingSenderId: "841840620936",
  appId: "1:841840620936:web:d29d576575f5830a2f763d",
  measurementId: "G-MY6Z0THR0H"
};

const app = firebase.initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const provider = new GoogleAuthProvider(app);
export const auth = getAuth(app);
export const storage = getStorage(app)
