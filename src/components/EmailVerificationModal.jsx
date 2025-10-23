import { useState, useEffect } from "react";
import { sendVerificationEmail, verifyEmailCode, resendVerificationEmail } from "../firebase/emailVerificationService";

const EmailVerificationModal = ({ 
  isOpen, 
  onClose, 
  email, 
  userName, 
  onVerificationSuccess 
}) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle verification code submission
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await verifyEmailCode(email, verificationCode);
      
      if (result.success) {
        setSuccess("Email verified successfully!");
        setTimeout(() => {
          onVerificationSuccess();
        }, 1000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An error occurred during verification");
      console.error("Verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend verification email
  const handleResend = async () => {
    setIsResending(true);
    setError("");
    setSuccess("");

    try {
      const result = await resendVerificationEmail(email, userName);
      
      if (result.success) {
        setSuccess("Verification email sent successfully!");
        setTimeLeft(600); // Reset timer
        setCanResend(false);
        setVerificationCode(""); // Clear the input
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Failed to resend verification email");
      console.error("Resend error:", error);
    } finally {
      setIsResending(false);
    }
  };

  // Handle input change
  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value);
      setError(""); // Clear error when user starts typing
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#3ABBD0]/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#263D5D]/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#3ABBD0] to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#263D5D] mb-2">Verify Your Email</h2>
            <p className="text-gray-600">
              We've sent a 6-digit verification code to
            </p>
            <p className="font-semibold text-[#3ABBD0]">{email}</p>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            {/* Code Input */}
            <div>
              <label className="block text-sm font-semibold text-[#263D5D] mb-2">
                Enter Verification Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={handleCodeChange}
                  placeholder="000000"
                  className="w-full px-6 py-4 text-center text-2xl font-mono tracking-widest border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#3ABBD0] focus:ring-4 focus:ring-[#3ABBD0]/20 transition-all duration-300"
                  maxLength={6}
                  autoComplete="off"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#3ABBD0]/5 to-transparent rounded-2xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Code expires in{" "}
                <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-[#3ABBD0]'}`}>
                  {formatTime(timeLeft)}
                </span>
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-green-600 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {success}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full bg-[#3ABBD0] hover:bg-cyan-500 disabled:bg-gray-300 text-white font-semibold py-4 rounded-2xl transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify Email"
                )}
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend || isResending}
                className="w-full text-[#3ABBD0] hover:text-cyan-500 font-semibold py-2 transition-colors duration-300 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {isResending ? "Sending..." : "Resend Code"}
              </button>
            </div>
          </form>

          {/* Development Helper */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-xs text-yellow-700">
                <strong>Dev Mode:</strong> Check console or localStorage for the verification code
              </p>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
