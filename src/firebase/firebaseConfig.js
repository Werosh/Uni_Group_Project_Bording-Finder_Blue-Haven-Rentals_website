// Import the functions you need from Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDJaOcvHbTRINGT4cSgziywPkubfhKHYyY",
  authDomain: "blue-haven-rentals-64f42.firebaseapp.com",
  projectId: "blue-haven-rentals-64f42",
  storageBucket: "blue-haven-rentals-64f42.firebasestorage.app",
  messagingSenderId: "359460352567",
  appId: "1:359460352567:web:cacc909a29e66178d705b2",
  measurementId: "G-CC994FCRR5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { analytics };
