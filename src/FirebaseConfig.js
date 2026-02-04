// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhbFm7pdfekQ1GDQQKZKbba8Q8lNbJ9Pk",
  authDomain: "aas-site-523aa.firebaseapp.com",
  projectId: "aas-site-523aa",
  storageBucket: "aas-site-523aa.firebasestorage.app",
  messagingSenderId: "841391004425",
  appId: "1:841391004425:web:68704aed3cebf5062e51d8",
  measurementId: "G-T67NSVTXME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);