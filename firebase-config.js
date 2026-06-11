// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBF3p6zopEyv9bop1HbnNohM7RVKqM3jnU",
  authDomain: "khanelectricsstore.firebaseapp.com",
  projectId: "khanelectricsstore",
  storageBucket: "khanelectricsstore.firebasestorage.app",
  messagingSenderId: "630145342928",
  appId: "1:630145342928:web:037feea0656f3eda7f6dd5",
  measurementId: "G-6K4EZGFLWE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
