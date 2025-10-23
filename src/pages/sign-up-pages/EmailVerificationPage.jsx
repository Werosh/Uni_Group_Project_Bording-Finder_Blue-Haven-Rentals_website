import { useState, useEffect } from "react";
import { useSignup } from "../../context/SignupContext";
import { sendVerificationEmail } from "../../firebase/emailVerificationService";
import EmailVerificationModal from "../../components/EmailVerificationModal";
import categoriesBackground from "../../assets/images/background/categories-background.webp";

const EmailVerificationPage = () => {
  const { formData, updateFormData, nextStep, prevStep } = useSignup();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-send verification email when component mounts
  useEffect(() => {
    if (formData.email && !formData.emailVerified) {
      handleSendVerification();
    }
  }, []);

  const handleSendVerification = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await sendVerificationEmail(formData.email, formData.fullName);
      
      if (result.success) {
        setIsModalOpen(true);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Failed to send verification email");
      console.error("Error sending verification email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    updateFormData({ emailVerified: true });
    setIsModalOpen(false);
    nextStep();
  };

  const handleSkipForNow = () => {
    // Allow users to skip verification (not recommended for production)
    if (window.confirm("Are you sure you want to skip email verification? You may not receive important updates.")) {
      nextStep();
    }
  };

  return (
    <div className="p-6 md:p-30 min-h-screen bg-gradient-to-br from-cyan-300 via-blue-200 to-purple-200 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/15 rounded-full blur-lg animate-bounce"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 px-4 md:px-10 relative z-10">
        {/* Left Side */}
        <div className="flex-1 max-w-lg text-center lg:text-left animate-fadeInUp">
          <h1 className="font-hugiller text-[60px] sm:text-[90px] md:text-[110px] lg:text-[120px] text-[#263D5D] leading-[1.1] mb-4">
            Verify Your <br />
            <span className="text-[#3ABBD0] relative">Email</span>
          </h1>
          <p className="font-hugiller text-lg md:text-xl text-[#303435] mb-4 opacity-80">
            We need to verify your email address to ensure you receive important updates
          </p>
          
          {/* Email Display */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/30">
            <p className="text-sm text-gray-600 mb-2">Verification email sent to:</p>
            <p className="font-semibold text-[#3ABBD0] text-lg">{formData.email}</p>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-600 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
            <h3 className="font-semibold text-[#263D5D] mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#3ABBD0]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              What to do next:
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-[#3ABBD0] rounded-full mt-2 flex-shrink-0"></span>
                Check your email inbox (and spam folder)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-[#3ABBD0] rounded-full mt-2 flex-shrink-0"></span>
                Look for an email from Blue Haven Rentals
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-[#3ABBD0] rounded-full mt-2 flex-shrink-0"></span>
                Enter the 6-digit verification code
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full lg:w-[500px] relative z-20 border border-white/30 animate-slideInRight">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#3ABBD0] to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#263D5D] mb-2">Email Verification Required</h2>
              <p className="text-gray-600">
                Please verify your email address to continue with your account setup
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleSendVerification}
                disabled={isLoading}
                className="w-full bg-[#3ABBD0] hover:bg-cyan-500 disabled:bg-gray-300 text-white font-semibold py-4 rounded-2xl transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  "Send Verification Email"
                )}
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-[#263D5D] hover:bg-[#303435] text-white font-semibold py-4 rounded-2xl transition-all duration-300 hover:scale-105"
              >
                Enter Verification Code
              </button>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={prevStep}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-2xl transition-all duration-300"
                >
                  Back
                </button>
                
                <button
                  onClick={handleSkipForNow}
                  className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-semibold py-3 rounded-2xl transition-all duration-300"
                >
                  Skip for Now
                </button>
              </div>
            </div>

            {/* Development Helper */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-xs text-yellow-700">
                  <strong>Dev Mode:</strong> Check browser console or localStorage for the verification code
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={categoriesBackground}
          alt="Modern house"
          className="object-cover w-full h-full opacity-100"
        />
        <div className="object-cover w-full h-full opacity-30 bg-gradient-to-br from-cyan-100 via-blue-50 to-purple-100"></div>
      </div>

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        email={formData.email}
        userName={formData.fullName}
        onVerificationSuccess={handleVerificationSuccess}
      />

      <style>{`
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
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EmailVerificationPage;
