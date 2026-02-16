// lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDkfTwHN4HZovG3CxyF87tYaWKnrql81Mg",
  authDomain: "bombay-bureau.firebaseapp.com",
  projectId: "bombay-bureau",
  storageBucket: "bombay-bureau.firebasestorage.app",
  messagingSenderId: "809339827214",
  appId: "1:809339827214:web:8c621d448da6d90446785f",
  measurementId: "G-Q0Z5PDFM4Z",
};

// Prevent multiple initialization in Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);