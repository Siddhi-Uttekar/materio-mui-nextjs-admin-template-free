// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";
import { getFirestore , collection} from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: "tickets-manager-bfd7b.firebaseapp.com",
  projectId: "tickets-manager-bfd7b",
  storageBucket: "tickets-manager-bfd7b.firebasestorage.app",
  messagingSenderId: "952165022886",
  appId: "1:952165022886:web:017e65e2f0c1ac33390867",
  measurementId: "G-QY36ELD7HM"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Export db

export const storage = getStorage(app);
export default app;