// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getRealtimeDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDj2pIhNeS7RbZ-sH6Y4XP2-dubOhZpHf0",
  authDomain: "the-thing-11a07.firebaseapp.com",
  projectId: "the-thing-11a07",
  storageBucket: "the-thing-11a07.firebasestorage.app",
  messagingSenderId: "108252304316",
  appId: "1:108252304316:web:45c86067589c723f4211b9",
  measurementId: "G-1FNQEMBXK6",
  databaseURL: "https://the-thing-11a07.firebaseio.com"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getRealtimeDatabase(app);

// Auth state observer
export function initAuthStateListener(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}
