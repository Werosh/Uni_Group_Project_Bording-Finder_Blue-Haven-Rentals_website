import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { BsStars } from "react-icons/bs";
import { useSignup } from "../../context/SignupContext";
import heroBackground from "../../assets/images/background/hero-background.webp";

const GetStartedPage = () => {
  const { formData, updateFormData, nextStep } = useSignup();

  const [localData, setLocalData] = useState({
    firstName: formData.firstName || "",
    lastName: formData.lastName || "",
    email: formData.email || "",
    password: formData.password || "",
    confirmPassword: formData.confirmPassword || "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!localData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!localData.lastName.trim())
      newErrors.lastName = "Last name is required";
    if (!localData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!localData.password) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        localData.password
      )
    ) {
      newErrors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character";
    }
    if (localData.confirmPassword !== localData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      updateFormData(localData);
      nextStep();
    }
  };

  // Calculate progress
  const progress =
    ((localData.firstName ? 1 : 0) +
      (localData.lastName ? 1 : 0) +
      (localData.email ? 1 : 0) +
      (localData.password ? 1 : 0) +
      (localData.confirmPassword ? 1 : 0)) /
    5;

  return (
    <div>
      <div className="p-6 md:p-30 min-h-screen bg-gradient-to-br from-cyan-300 via-blue-200 to-purple-200 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/15 rounded-full blur-lg animate-bounce"></div>
        </div>

        {/* Main Content Wrapper */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 px-4 md:px-10 relative z-10">
          {/* Left Side - Heading */}
          <div className="flex-1 max-w-lg text-center lg:text-left">
            <div className="animate-fadeInUp">
              <h1 className="font-hugiller text-[50px] sm:text-[70px] md:text-[100px] lg:text-[130px] text-[#263D5D] leading-[1.1] mb-4">
                Get <br />
                <span className="text-[#3ABBD0] relative">Started</span>
              </h1>
              <p className="font-hugiller text-lg md:text-xl text-[#303435] mb-4 opacity-80">
                Let's create your account here
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-3 bg-[#303435]/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-lg text-sm sm:text-base border border-white/20">
                <BsStars className="w-[25px] sm:w-[30px] text-[#3ABBD0] animate-spin-slow" />
                <span className="font-hugiller font-thin whitespace-nowrap truncate">
                  Discover quality, comfort, and convenience with us.
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 w-full lg:w-[600px] relative z-20 border border-white/30 animate-slideInRight">
            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="flex items-center gap-2 text-[#263D5D] text-sm font-bold mb-1">
                    <div className="w-2 h-2 bg-[#3ABBD0] rounded-full"></div>
                    First Name
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="firstName"
                      value={localData.firstName}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 rounded-2xl bg-gray-50/80 backdrop-blur-sm border-2 focus:outline-none focus:ring-4 focus:ring-[#3ABBD0]/20 transition-all duration-300 group-hover:border-[#3ABBD0]/50 ${
                        errors.firstName
                          ? "border-red-500"
                          : "border-[#3ABBD0]/30 focus:border-[#3ABBD0]"
                      }`}
                      placeholder="Enter first name"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#3ABBD0]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="flex items-center gap-2 text-[#263D5D] text-sm font-bold mb-1">
                    <div className="w-2 h-2 bg-[#3ABBD0] rounded-full"></div>
                    Last Name
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="lastName"
                      value={localData.lastName}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 rounded-2xl bg-gray-50/80 backdrop-blur-sm border-2 focus:outline-none focus:ring-4 focus:ring-[#3ABBD0]/20 transition-all duration-300 group-hover:border-[#3ABBD0]/50 ${
                        errors.lastName
                          ? "border-red-500"
                          : "border-[#3ABBD0]/30 focus:border-[#3ABBD0]"
                      }`}
                      placeholder="Enter last name"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#3ABBD0]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 text-[#263D5D] text-sm font-bold mb-1">
                  <div className="w-2 h-2 bg-[#3ABBD0] rounded-full"></div>
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <input
                    type="email"
                    name="email"
                    value={localData.email}
                    onChange={handleChange}
                    className={`w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50/80 backdrop-blur-sm border-2 focus:outline-none focus:ring-4 focus:ring-[#3ABBD0]/20 transition-all duration-300 group-hover:border-[#3ABBD0]/50 ${
                      errors.email
                        ? "border-red-500"
                        : "border-[#3ABBD0]/30 focus:border-[#3ABBD0]"
                    }`}
                    placeholder="Enter your email"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3ABBD0]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 text-[#263D5D] text-sm font-bold mb-1">
                  <div className="w-2 h-2 bg-[#3ABBD0] rounded-full"></div>
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <input
                    type="password"
                    name="password"
                    value={localData.password}
                    onChange={handleChange}
                    className={`w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50/80 backdrop-blur-sm border-2 focus:outline-none focus:ring-4 focus:ring-[#3ABBD0]/20 transition-all duration-300 group-hover:border-[#3ABBD0]/50 ${
                      errors.password
                        ? "border-red-500"
                        : "border-[#3ABBD0]/30 focus:border-[#3ABBD0]"
                    }`}
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3ABBD0]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="mb-8">
                <label className="flex items-center gap-2 text-[#263D5D] text-sm font-bold mb-1">
                  <div className="w-2 h-2 bg-[#3ABBD0] rounded-full"></div>
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={localData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50/80 backdrop-blur-sm border-2 focus:outline-none focus:ring-4 focus:ring-[#3ABBD0]/20 transition-all duration-300 group-hover:border-[#3ABBD0]/50 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-[#3ABBD0]/30 focus:border-[#3ABBD0]"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3ABBD0]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#3ABBD0] to-cyan-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress * 100}%` }}
                  ></div>
                </div>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className="relative overflow-hidden w-full bg-[#263D5D] hover:bg-[#303435] text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group mb-4"
              >
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>

              <p className="text-center text-[#263D5D] text-sm sm:text-base">
                Have an account?{" "}
                <a
                  href="/login"
                  className="text-[#3ABBD0] hover:text-cyan-700 font-semibold transition-colors duration-300"
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBackground}
            alt="Modern house"
            className="object-cover w-full h-full opacity-100"
          />
          <div className="object-cover w-full h-full opacity-30 bg-gradient-to-br from-cyan-100 via-blue-50 to-purple-100"></div>

          {/* Gradient overlay for small screens only */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#DFECF8]/80 to-transparent opacity-100 block md:hidden"></div>
        </div>
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default GetStartedPage;
