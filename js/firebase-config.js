/**
 * KhanElectricsStore — Firebase Configuration
 * Using Firebase v10 Modular SDK via CDN (no bundler needed).
 * This is the single source of truth for Firebase instances.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBF3p6zopEyv9bop1HbnNohM7RVKqM3jnU",
  authDomain: "khanelectricsstore.firebaseapp.com",
  projectId: "khanelectricsstore",
  storageBucket: "khanelectricsstore.firebasestorage.app",
  messagingSenderId: "630145342928",
  appId: "1:630145342928:web:037feea0656f3eda7f6dd5",
  measurementId: "G-6K4EZGFLWE"
};

// Initialize Firebase App (only once)
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Make db and auth globally accessible for non-module scripts
window._firebaseDb = db;
window._firebaseAuth = auth;

console.log("✅ Firebase initialized successfully.");
