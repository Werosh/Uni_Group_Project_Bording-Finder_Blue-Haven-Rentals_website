import { createContext, useContext, useState, useEffect } from "react";

const SignupContext = createContext();

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignup must be used within SignupProvider");
  }
  return context;
};

export const SignupProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Basic Info
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",

    // Step 2 - Account Details
    username: "",
    description: "",
    phone: "",

    // Step 3 - Location
    country: "",
    district: "",
    division: "",
    postalCode: "",

    // Step 4 - ID Verification
    idNumber: "",
    frontImage: null,
    backImage: null,

    // Step 5 - Profile Image
    profileImage: null,
  });

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("signupFormData");
    const savedStep = localStorage.getItem("signupCurrentStep");

    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error loading saved signup data:", error);
      }
    }

    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("signupFormData", JSON.stringify(formData));
    localStorage.setItem("signupCurrentStep", currentStep.toString());
  }, [formData, currentStep]);

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= 6) {
      setCurrentStep(step);
    }
  };

  const resetSignup = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      description: "",
      phone: "",
      country: "",
      district: "",
      division: "",
      postalCode: "",
      idNumber: "",
      frontImage: null,
      backImage: null,
      profileImage: null,
    });
    setCurrentStep(1);
    localStorage.removeItem("signupFormData");
    localStorage.removeItem("signupCurrentStep");
  };

  const value = {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    resetSignup,
  };

  return (
    <SignupContext.Provider value={value}>{children}</SignupContext.Provider>
  );
};
