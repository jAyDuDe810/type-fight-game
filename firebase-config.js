import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDj2pIhNeS7RbZ-sH6Y4XP2-dubOhZpHf0",
  authDomain: "the-thing-11a07.firebaseapp.com",
  projectId: "the-thing-11a07",
  storageBucket: "the-thing-11a07.firebasestorage.app",
  messagingSenderId: "108252304316",
  appId: "1:108252304316:web:45c86067589c723f4211b9",
  measurementId: "G-1FNQEMBXK6",
  databaseURL: "https://the-thing-11a07-default-rtdb.firebaseio.com"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export { onAuthStateChanged };
