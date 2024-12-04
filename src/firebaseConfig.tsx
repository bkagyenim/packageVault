// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLmmn_vdUNvCYlhQUCAmpGk0iagD-Is-M",
  authDomain: "packagevault-67f49.firebaseapp.com",
  projectId: "packagevault-67f49",
  storageBucket: "packagevault-67f49.firebasestorage.app",
  messagingSenderId: "905264502790",
  appId: "1:905264502790:web:ebf38aa7c313768c21cb87",
  measurementId: "G-PT52BT3N1D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
export const db = getFirestore(app);
export const firestore = getFirestore(app);



export default firebaseConfig;

