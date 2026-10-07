import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCET9ravZ_WgyK4Kz-WeyonsAdH7u6AnlM",
  authDomain: "khanelectrics-a3786.firebaseapp.com",
  projectId: "khanelectrics-a3786",
  storageBucket: "khanelectrics-a3786.firebasestorage.app",
  messagingSenderId: "765115094530",
  appId: "1:765115094530:web:634c01f00f9120e320391b",
  measurementId: "G-V84GP9J4Y1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics fallback
let analytics = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// Initialize Firestore
const db = getFirestore(app);

export { app, db, analytics, collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot };
