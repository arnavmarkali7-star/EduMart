// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRADpns0YkmSIwKzNzeoqlxzf7Z8e6RpE",
  authDomain: "edumart-e7cb9.firebaseapp.com",
  projectId: "edumart-e7cb9",
  storageBucket: "edumart-e7cb9.firebasestorage.app",
  messagingSenderId: "43338594528",
  appId: "1:43338594528:web:f9ad18b098f5166ee43885"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Firebase Auth (if you want to use Firebase Auth)
export const auth = getAuth(app);

export default app;

