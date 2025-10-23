import { BsStars } from "react-icons/bs";
import { FcCheckmark } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useSignup } from "../../context/SignupContext";
import { signup } from "../../firebase/authService";
import { createUserProfile } from "../../firebase/dbService";

const SignupCompletePage = () => {
  const navigate = useNavigate();
  const { formData, resetSignup } = useSignup();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [error, setError] = useState("");

  const createUserAccount = useCallback(async () => {
    if (!formData.email || !formData.password || !formData.emailVerified) {
      setError("Missing required information for account creation");
      return;
    }

    setIsCreatingAccount(true);
    setError("");

    try {
      // Create Firebase Auth account
      const userCredential = await signup(
        formData.email, 
        formData.password, 
        formData.fullName
      );

      // Create user profile in Firestore
      const profileData = {
        fullName: formData.fullName,
        email: formData.email,
        userType: formData.userType,
        emailVerified: true,
        createdAt: new Date(),
      };

      // Add additional fields for boarding_owner
      if (formData.userType === "boarding_owner") {
        profileData.username = formData.username;
        profileData.description = formData.description;
        profileData.phone = formData.phone;
        profileData.country = formData.country;
        profileData.district = formData.district;
        profileData.division = formData.division;
        profileData.postalCode = formData.postalCode;
        profileData.idNumber = formData.idNumber;
        profileData.idVerified = false; // Will be verified by admin
        profileData.status = "pending"; // Pending admin approval
      }

      await createUserProfile(userCredential.user.uid, profileData);

      // Clear signup data
      resetSignup();

      // Auto-redirect to browse page after 3 seconds
      const timer = setTimeout(() => {
        navigate("/browse");
      }, 3000);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error creating account:", error);
      setError(error.message || "Failed to create account");
      setIsCreatingAccount(false);
    }
  }, [formData.email, formData.password, formData.emailVerified, formData.fullName, formData.userType, formData.username, formData.description, formData.phone, formData.country, formData.district, formData.division, formData.postalCode, formData.idNumber, resetSignup, navigate]);

  useEffect(() => {
    // Create user account when component mounts
    createUserAccount();
  }, [createUserAccount]);

  const handleGoToDashboard = () => {
    navigate("/browse");
  };

  const handleRetry = () => {
    setError("");
    createUserAccount();
  };

  return (
    <div className="p-6 md:p-30 min-h-screen bg-gradient-to-br from-cyan-300 via-blue-200 to-purple-200 relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/15 rounded-full blur-lg animate-bounce"></div>
      </div>

      {/* Main Card */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 sm:p-14 w-full max-w-lg relative z-20 border border-white/30 animate-fadeInUp text-center">
        {isCreatingAccount ? (
          // Loading State
          <>
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-[#3ABBD0] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="font-hugiller text-[40px] sm:text-[60px] md:text-[80px] text-[#263D5D] leading-[1.1] mb-4">
              Creating
              <br />
              <span className="text-[#3ABBD0]">Account</span>
            </h1>
            <p className="font-hugiller text-lg md:text-xl text-[#303435] mb-6 opacity-80">
              Please wait while we set up your account...
            </p>
          </>
        ) : error ? (
          // Error State
          <>
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="font-hugiller text-[40px] sm:text-[60px] md:text-[80px] text-[#263D5D] leading-[1.1] mb-4">
              Account
              <br />
              <span className="text-red-500">Creation Failed</span>
            </h1>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-[#3ABBD0] hover:bg-cyan-500 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold transition-all duration-300"
              >
                Back to Signup
              </button>
            </div>
          </>
        ) : (
          // Success State
          <>
            {/* Check Icon */}
            <div className="border-5 rounded-full border-green-500 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <FcCheckmark className="p-2 bg-white w-16 h-16 rounded-full" />
            </div>

            {/* Title */}
            <h1 className="font-hugiller text-[50px] sm:text-[80px] md:text-[100px] lg:text-[110px] text-[#263D5D] leading-[1.1] mb-4">
              Setup
              <br />
              <span className="flex items-center justify-center text-[#3ABBD0] relative">
                Completed
              </span>
            </h1>

            <p className="font-hugiller text-lg md:text-xl text-[#303435] mb-6 opacity-80">
              Setup Completed. Let's go to the dashboard
            </p>

            <div className="flex items-center justify-center gap-3 bg-[#303435]/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-lg text-sm sm:text-base border border-white/20 mb-6">
              <BsStars className="w-[25px] sm:w-[30px] text-[#3ABBD0] animate-spin-slow" />
              <span className="font-montserrat font-thin whitespace-nowrap truncate">
                Discover quality, comfort, and convenience with us.
              </span>
            </div>

            <button
              onClick={handleGoToDashboard}
              className="relative overflow-hidden w-full bg-[#263D5D] hover:bg-[#303435] text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group"
            >
              <span className="relative z-10">Go to Dashboard</span>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </>
        )}
      </div>

      {/* Gradient overlay for small screens */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#DFECF8]/80 to-transparent opacity-100 block md:hidden"></div>

      {/* Animations */}
      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SignupCompletePage;
