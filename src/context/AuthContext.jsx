import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { getUserProfile } from "../firebase/dbService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch user profile from Firestore to get role information
        try {
          const profile = await getUserProfile(currentUser.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Helper function to check if user has a specific role
  const hasRole = (role) => {
    return userProfile?.role === role;
  };

  // Helper function to check if user is admin
  const isAdmin = () => {
    return userProfile?.role === "admin";
  };

  return (
    <AuthContext.Provider
      value={{ user, userProfile, loading, hasRole, isAdmin }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
