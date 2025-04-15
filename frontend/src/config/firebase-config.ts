// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDqLkLptqgWpx95wAFcjoNgkABmskF3hQ",
  authDomain: "podcast-summarizer-6cb11.firebaseapp.com",
  projectId: "podcast-summarizer-6cb11",
  storageBucket: "podcast-summarizer-6cb11.firebasestorage.app",
  messagingSenderId: "151740153906",
  appId: "1:151740153906:web:30ff08336ce6b81304fc2b",
  measurementId: "G-DVBHYB8PWV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth };
