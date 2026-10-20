// Firebase SDK Configuration for ServiHub
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD-ApdwYyQhhOUyi1lRXOUryRroSuoKeLQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "servizio-9a63c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "servizio-9a63c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "servizio-9a63c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "585345138101",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:585345138101:web:41eb2a748494905afe2dfc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
