
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDs6IcFMZv563RTupMZFFmDy1E3KGN7qbQ",
  authDomain: "churchapp-a00ff.firebaseapp.com",
  projectId: "churchapp-a00ff",
  storageBucket: "churchapp-a00ff.appspot.com",
  messagingSenderId: "540371702651",
  appId: "1:540371702651:web:e49b041b907f515d35e3de",
  measurementId: "G-6MT4PR8LW1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);


export { app, firestore, auth, database, storage };


