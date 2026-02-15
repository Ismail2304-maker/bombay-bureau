// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7xIR3bHEhlm7TwsqRmpaFgCzTNiaP3-Y",
  authDomain: "global-chronicle-662c9.firebaseapp.com",
  projectId: "global-chronicle-662c9",
  storageBucket: "global-chronicle-662c9.firebasestorage.app",
  messagingSenderId: "231668259310",
  appId: "1:231668259310:web:59b9bf633bc846ca3356ff",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
