import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { getVerificationStatus } from "./emailVerificationService";

// Signup with email verification check
export const signup = async (email, password, fullName) => {
  try {
    // Check if email is verified in our system
    const verificationStatus = await getVerificationStatus(email);
    
    if (!verificationStatus.success || !verificationStatus.isVerified) {
      throw new Error("Email must be verified before creating account");
    }

    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with full name
    if (fullName) {
      await updateProfile(userCredential.user, {
        displayName: fullName
      });
    }

    return userCredential;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

// Signup without email verification (for testing purposes)
export const signupWithoutVerification = (email, password) => {
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
