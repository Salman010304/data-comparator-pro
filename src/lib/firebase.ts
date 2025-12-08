import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDITHD1oFf7OnxBSW9PUJv6lhnITrsOOmI",
  authDomain: "nuranitutionclasses.firebaseapp.com",
  projectId: "nuranitutionclasses",
  storageBucket: "nuranitutionclasses.firebasestorage.app",
  messagingSenderId: "318451325558",
  appId: "1:318451325558:web:0f9dd8024a8458189d9d57",
  measurementId: "G-Q2PKG8XYCC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
