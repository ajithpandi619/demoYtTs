// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoMDi04Ag6QJ_tpA4gHMMQjP2ProKHoZE",
  authDomain: "clone-fca1e.firebaseapp.com",
  projectId: "clone-fca1e",
  storageBucket: "clone-fca1e.appspot.com",
  messagingSenderId: "449761743033",
  appId: "1:449761743033:web:da29a2fe7df827bb084b68",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();
const timestamp = serverTimestamp();

export { app, db, auth, timestamp, provider };
