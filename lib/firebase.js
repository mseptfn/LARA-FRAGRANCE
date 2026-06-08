// src/lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBik-iOmdHv2nvpPq5dy6zKyr8uVm3GMmk",
  authDomain: "lara-2709.firebaseapp.com",
  projectId: "lara-2709",
  storageBucket: "lara-2709.firebasestorage.app",
  messagingSenderId: "646886533376",
  appId: "1:646886533376:web:787eb8dd79e7568851abe5",
  measurementId: "G-ZH7FJVYQNZ"
};


const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export const storage = getStorage(app);