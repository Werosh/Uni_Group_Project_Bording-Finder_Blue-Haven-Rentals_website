import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";
import { auth } from "./firebaseConfig";

// Signup
export const signup = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Login
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logout
export const logout = () => {
  return signOut(auth);
};

// Send password reset email
export const sendPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// Verify password reset code
export const verifyResetCode = (code) => {
  return verifyPasswordResetCode(auth, code);
};

// Confirm password reset with code and new password
export const confirmPasswordResetWithCode = (code, newPassword) => {
  return confirmPasswordReset(auth, code, newPassword);
};
