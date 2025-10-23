import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { sendEmail, generateVerificationEmailHTML, generateVerificationEmailText } from "./emailService";

// Generate a random 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email (using a simple email service or Firebase Functions)
export const sendVerificationEmail = async (email, userName) => {
  try {
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store verification code in Firestore
    const verificationDoc = await addDoc(collection(db, "emailVerifications"), {
      email: email.toLowerCase(),
      code: verificationCode,
      createdAt: serverTimestamp(),
      expiresAt: expiresAt,
      isUsed: false,
      userName: userName
    });

    // Send verification email
    const emailHTML = generateVerificationEmailHTML(userName, verificationCode);
    const emailText = generateVerificationEmailText(userName, verificationCode);
    
    try {
      await sendEmail(
        email,
        "Verify Your Email - Blue Haven Rentals",
        emailHTML,
        emailText
      );
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Continue anyway as the code is stored in Firestore
    }
    
    // In development, you can also store the code in localStorage for testing
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem('dev_verification_code', verificationCode);
      localStorage.setItem('dev_verification_email', email);
    }

    return {
      success: true,
      message: "Verification email sent successfully",
      verificationId: verificationDoc.id
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      message: "Failed to send verification email",
      error: error.message
    };
  }
};

// Verify the code entered by user
export const verifyEmailCode = async (email, code) => {
  try {
    const emailLower = email.toLowerCase();
    
    // Query for verification records for this email
    const q = query(
      collection(db, "emailVerifications"),
      where("email", "==", emailLower),
      where("isUsed", "==", false)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return {
        success: false,
        message: "No verification code found for this email"
      };
    }

    // Check all non-expired codes
    const now = new Date();
    let validCode = null;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const expiresAt = data.expiresAt.toDate();
      
      if (data.code === code && expiresAt > now) {
        validCode = doc;
      }
    });

    if (!validCode) {
      return {
        success: false,
        message: "Invalid or expired verification code"
      };
    }

    // Mark the code as used
    await updateDoc(doc(db, "emailVerifications", validCode.id), {
      isUsed: true,
      usedAt: serverTimestamp()
    });

    return {
      success: true,
      message: "Email verified successfully"
    };
  } catch (error) {
    console.error("Error verifying email code:", error);
    return {
      success: false,
      message: "Failed to verify email code",
      error: error.message
    };
  }
};

// Resend verification email
export const resendVerificationEmail = async (email, userName) => {
  try {
    // First, mark any existing unused codes as expired
    const q = query(
      collection(db, "emailVerifications"),
      where("email", "==", email.toLowerCase()),
      where("isUsed", "==", false)
    );
    
    const querySnapshot = await getDocs(q);
    const batch = [];
    
    querySnapshot.forEach((doc) => {
      batch.push(updateDoc(doc.ref, { isUsed: true }));
    });
    
    if (batch.length > 0) {
      await Promise.all(batch);
    }

    // Send new verification email
    return await sendVerificationEmail(email, userName);
  } catch (error) {
    console.error("Error resending verification email:", error);
    return {
      success: false,
      message: "Failed to resend verification email",
      error: error.message
    };
  }
};

// Clean up expired verification codes (can be called periodically)
export const cleanupExpiredVerificationCodes = async () => {
  try {
    const now = new Date();
    const q = query(
      collection(db, "emailVerifications"),
      where("expiresAt", "<=", now)
    );
    
    const querySnapshot = await getDocs(q);
    const batch = [];
    
    querySnapshot.forEach((doc) => {
      batch.push(deleteDoc(doc.ref));
    });
    
    if (batch.length > 0) {
      await Promise.all(batch);
      console.log(`Cleaned up ${batch.length} expired verification codes`);
    }
    
    return {
      success: true,
      message: `Cleaned up ${batch.length} expired codes`
    };
  } catch (error) {
    console.error("Error cleaning up expired codes:", error);
    return {
      success: false,
      message: "Failed to clean up expired codes",
      error: error.message
    };
  }
};

// Get verification status for an email
export const getVerificationStatus = async (email) => {
  try {
    const q = query(
      collection(db, "emailVerifications"),
      where("email", "==", email.toLowerCase()),
      where("isUsed", "==", true)
    );
    
    const querySnapshot = await getDocs(q);
    
    return {
      success: true,
      isVerified: !querySnapshot.empty,
      message: querySnapshot.empty ? "Email not verified" : "Email verified"
    };
  } catch (error) {
    console.error("Error checking verification status:", error);
    return {
      success: false,
      message: "Failed to check verification status",
      error: error.message
    };
  }
};
