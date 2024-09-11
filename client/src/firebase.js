// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "hashir-mern--estate.firebaseapp.com",
  projectId: "hashir-mern--estate",
  storageBucket: "hashir-mern--estate.appspot.com",
  messagingSenderId: "875275980769",
  appId: "1:875275980769:web:9c71950101ff3827bb4ca0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);