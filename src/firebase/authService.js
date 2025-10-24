import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  EmailAuthProvider,
  linkWithCredential,
  reauthenticateWithCredential,
  updatePassword,
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

// Send password reset email (traditional method)
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

// Email Link Authentication Methods
export const sendPasswordResetLink = (email) => {
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain must be in the authorized domains list
    url: `${window.location.origin}/password-reset-verification`,
    // This must be true.
    handleCodeInApp: true,
  };

  return sendSignInLinkToEmail(auth, email, actionCodeSettings);
};

// Check if the current URL is a sign-in with email link
export const checkEmailLink = () => {
  return isSignInWithEmailLink(auth, window.location.href);
};

// Sign in with email link
export const signInWithEmailLinkAuth = (email) => {
  return signInWithEmailLink(auth, email, window.location.href);
};

// Link email credential to current user
export const linkEmailCredential = (email) => {
  const credential = EmailAuthProvider.credentialWithLink(
    email, 
    window.location.href
  );
  return linkWithCredential(auth.currentUser, credential);
};

// Re-authenticate with email link
export const reauthenticateWithEmailLink = (email) => {
  const credential = EmailAuthProvider.credentialWithLink(
    email, 
    window.location.href
  );
  return reauthenticateWithCredential(auth.currentUser, credential);
};

// Update password for current user
export const updateUserPassword = (newPassword) => {
  return updatePassword(auth.currentUser, newPassword);
};
