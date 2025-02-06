import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-1gPO-wN_PNPNjhxFIW2MN0QqVg8NmlA",
  authDomain: "hackathon-charity-2025.firebaseapp.com",
  projectId: "hackathon-charity-2025",
  storageBucket: "hackathon-charity-2025.firebasestorage.app",
  messagingSenderId: "805047019507",
  appId: "1:805047019507:web:1f2efc855e9bb55ca69486",
  measurementId: "G-EHCB9LKEE6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
