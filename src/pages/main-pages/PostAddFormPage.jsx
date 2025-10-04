import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createPost } from "../../firebase/dbService";
import postBackground from "../../assets/images/background/post-back.webp";
import man1Img from "../../assets/images/others/Img-6.webp";

// Step type (0, 1)
const steps = [
  {
    key: 0,
    label: "Details",
    Icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: 1,
    label: "Finish",
    Icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="m5 13 4 4L20 6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const ArrowIcon = ({ dir = "right" }) => (
  <svg
    className={`w-5 h-5 ${dir === "left" ? "rotate-180" : ""}`}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M5 12h14M13 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SheenButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`relative overflow-hidden bg-[#263D5D] hover:bg-[#303435] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl group flex items-center gap-3 justify-center ${
      disabled ? "opacity-50 cursor-not-allowed hover:scale-100" : ""
    } ${className}`}
  >
    <span className="relative z-10 flex items-center gap-3">{children}</span>
    {!disabled && (
      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    )}
  </button>
);

const PillTag = ({ children }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-sm">
    {children}
  </span>
);

const SectionTitle = ({ children, Icon }) => (
  <div className="flex items-center gap-3 mb-4">
    <Icon />
    <h3 className="font-hugiller text-2xl text-[#263D5D]">{children}</h3>
  </div>
);

const TextLabel = ({ children, className = "", required = false }) => (
  <label className={`font-semibold text-[#263D5D] ${className}`}>
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const ErrorMessage = ({ message }) =>
  message ? (
    <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <line
          x1="12"
          y1="8"
          x2="12"
          y2="12"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="12"
          y1="16"
          x2="12.01"
          y2="16"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      {message}
    </div>
  ) : null;

const FormInput = ({ error, ...props }) => (
  <div>
    <input
      {...props}
      className={`w-full bg-white border shadow-md rounded-2xl p-3 outline-none transition ${
        error
          ? "border-red-300 focus:ring-2 focus:ring-red-300 focus:border-red-400"
          : "border-slate-200/50 focus:ring-2 focus:ring-cyan-300 focus:border-cyan-400"
      } ${props.className || ""}`}
    />
    <ErrorMessage message={error} />
  </div>
);

const FormSelect = ({ error, children, ...props }) => (
  <div>
    <div className="relative">
      <select
        {...props}
        className={`w-full bg-white border shadow-md rounded-2xl p-3 outline-none transition appearance-none ${
          error
            ? "border-red-300 focus:ring-2 focus:ring-red-300 focus:border-red-400"
            : "border-slate-200/50 focus:ring-2 focus:ring-cyan-300 focus:border-cyan-400"
        }`}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
    <ErrorMessage message={error} />
  </div>
);

const FormTextarea = ({ error, ...props }) => (
  <div>
    <textarea
      {...props}
      className={`w-full bg-white border shadow-md rounded-2xl p-3 outline-none transition resize-none ${
        error
          ? "border-red-300 focus:ring-2 focus:ring-red-300 focus:border-red-400"
          : "border-slate-200/50 focus:ring-2 focus:ring-cyan-300 focus:border-cyan-400"
      }`}
    />
    <ErrorMessage message={error} />
  </div>
);

const FormIcon = {
  Edit: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20h9"
        stroke="#263D5D"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.5a2.121 2.121 0 1 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
        stroke="#263D5D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  User: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        stroke="#263D5D"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="7"
        r="4"
        stroke="#263D5D"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const PostAddFormPage = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    forWhom: "",
    location: "",
    description: "",
    rent: "",
    email: user?.email || "",
    mobile: "",
  });

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{9}$/;
    return mobileRegex.test(mobile.replace(/\s/g, ""));
  };

  const validateStep1 = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 10) {
      newErrors.title = "Title must be at least 10 characters long";
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    // For Whom validation
    if (!formData.forWhom) {
      newErrors.forWhom = "Please select who this is for";
    }

    // Location validation
    if (!formData.location) {
      newErrors.location = "Please select a location";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters long";
    } else if (formData.description.trim().length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    // Rent validation
    if (!formData.rent.trim()) {
      newErrors.rent = "Rent amount is required";
    } else if (isNaN(Number(formData.rent.replace(/,/g, "")))) {
      newErrors.rent = "Please enter a valid number";
    } else if (Number(formData.rent.replace(/,/g, "")) <= 0) {
      newErrors.rent = "Rent must be greater than 0";
    } else if (Number(formData.rent.replace(/,/g, "")) > 1000000) {
      newErrors.rent = "Rent amount seems too high";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Mobile validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!validateMobile(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 9-digit mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const heroMan = useMemo(() => man1Img, []);

  const progressPercentage = useMemo(() => {
    let totalProgress = 0;

    // Step 1 (Details) progress
    const step1Fields = [
      formData.title.trim(),
      formData.category,
      formData.forWhom,
      formData.location,
      formData.description.trim(),
      formData.rent.trim(),
      formData.email.trim(),
      formData.mobile.trim(),
    ];
    const step1FilledCount = step1Fields.filter((field) => field !== "").length;
    const step1Progress = step1FilledCount / step1Fields.length;

    // Calculate total progress based on current step
    if (activeStep === 0) {
      totalProgress = step1Progress * 0.8;
    } else if (activeStep === 1) {
      totalProgress = 1.0;
    }

    return Math.round(totalProgress * 100);
  }, [formData, activeStep]);

  const goNext = () => {
    if (activeStep === 0 && !validateStep1()) {
      return;
    }
    setActiveStep((s) => Math.min(1, s + 1));
  };

  const handleSubmit = async () => {
    // Final validation before submission
    if (!validateStep1()) {
      alert("Please fix all errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create post data (text-only, no images or videos)
      const postData = {
        title: formData.title.trim(),
        category: formData.category,
        forWhom: formData.forWhom,
        location: formData.location,
        description: formData.description.trim(),
        rent: Number(formData.rent.replace(/,/g, "")),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        ownerId: user.uid,
        ownerName: userProfile?.fullName || user.displayName || "Anonymous",
      };

      // Save to Firestore
      await createPost(postData);

      alert("Post submitted successfully!");
      navigate("/browse");
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Failed to submit post: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToNext = () => {
    if (activeStep === 0) {
      return (
        formData.title &&
        formData.category &&
        formData.forWhom &&
        formData.location &&
        formData.description &&
        formData.rent &&
        formData.email &&
        formData.mobile
      );
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-blue-200 to-purple-200 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/15 rounded-full blur-lg animate-bounce"></div>
      </div>
      <div className="absolute inset-0 z-0">
        <img
          src={postBackground}
          alt="Background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-cyan-100 via-blue-50 to-purple-100"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/100 via-white/0 to-white/0 backdrop-blur-[1px]"></div>
      </div>
      <div className="relative z-10 px-4 pt-10 pb-4 text-center">
        <h1 className="font-hugiller text-[52px] sm:text-[84px] md:text-[96px] lg:text-[106px] text-[#263D5D] leading-[1.1] animate-fadeInUp">
          Post Your <span className="text-[#3ABBD0] relative">Add</span>
        </h1>
        <p className="max-w-4xl mx-auto text-[#303435]/90 mt-4 font-hugiller text-lg sm:text-xl px-2">
          Discover the smarter way to rent – effortlessly list your boarding
          rooms, houses, hostels, or luxury apartments on our all-in-one
          platform.
        </p>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-12 gap-6 lg:gap-10 min-h-[70vh]">
          {/* Stepper Section */}
          <div className="col-span-12 md:col-span-4 order-1 md:order-1">
            <div className="w-full max-w-[360px] mx-auto md:mx-0 rounded-3xl bg-white/85 backdrop-blur border border-white/60 shadow-2xl p-4 sm:p-5 animate-slideInLeft">
              <div className="space-y-3">
                {steps.map(({ key, label, Icon }) => {
                  const active = activeStep === key;
                  const hasErrors =
                    key === 0
                      ? Object.keys(errors).some((field) =>
                          [
                            "title",
                            "category",
                            "forWhom",
                            "location",
                            "description",
                            "rent",
                            "email",
                            "mobile",
                          ].includes(field)
                        )
                      : false;

                  return (
                    <button
                      key={label}
                      onClick={() => setActiveStep(key)}
                      className={`w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-4 transition-all border ${
                        active
                          ? "bg-gradient-to-r from-cyan-400 to-sky-500 text-white border-transparent shadow-lg"
                          : hasErrors
                          ? "bg-red-50 text-red-700 border-red-200 shadow-sm hover:shadow-md"
                          : "bg-white text-[#263D5D] border-white shadow-sm hover:shadow-md"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${
                            active
                              ? "bg-white/20 text-white"
                              : hasErrors
                              ? "bg-red-100 text-red-600"
                              : "bg-cyan-50 text-sky-500"
                          }`}
                        >
                          {hasErrors ? (
                            <svg
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <line
                                x1="12"
                                y1="8"
                                x2="12"
                                y2="12"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <line
                                x1="12"
                                y1="16"
                                x2="12.01"
                                y2="16"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                            </svg>
                          ) : (
                            <Icon />
                          )}
                        </span>
                        <span className="font-semibold">{label}</span>
                      </span>
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-xl ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <ArrowIcon />
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <span>Overall Progress</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#3ABBD0] to-cyan-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Desktop Man Image */}
            <div className="hidden md:block relative mt-8 md:mt-10">
              <div className="relative max-w-[520px]">
                <img
                  src={heroMan}
                  alt="Illustration"
                  className="absolute left-[2px] max-w-[700px] h-auto mb-12 object-contain transform hover:scale-105 transition-transform duration-500 sm:w-auto drop-shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#3ABBD0]/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-400/20 rounded-full blur-lg animate-bounce"></div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="col-span-12 md:col-span-8 order-2 md:order-2">
            <div className="rounded-3xl bg-white/90 backdrop-blur border border-white/70 shadow-2xl p-5 sm:p-7 md:p-8 min-h-[520px] animate-slideInRight">
              {/* STEP 0: DETAILS FORM */}
              {activeStep === 0 && (
                <div className="space-y-8">
                  <SectionTitle Icon={FormIcon.Edit}>
                    Create A Post
                  </SectionTitle>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <TextLabel className="text-left md:col-span-1" required>
                        Title
                      </TextLabel>
                      <div className="md:col-span-3">
                        <FormInput
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          error={errors.title}
                          placeholder="Enter a descriptive title (min 10 characters)"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <TextLabel className="text-left md:col-span-1" required>
                        Category
                      </TextLabel>
                      <div className="md:col-span-3">
                        <FormSelect
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          error={errors.category}
                        >
                          <option value="" disabled>
                            Select a category
                          </option>
                          <option>Boarding Houses</option>
                          <option>Apartment</option>
                          <option>House</option>
                        </FormSelect>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <TextLabel className="text-left md:col-span-1" required>
                        For Whom
                      </TextLabel>
                      <div className="md:col-span-3">
                        <FormSelect
                          name="forWhom"
                          value={formData.forWhom}
                          onChange={handleInputChange}
                          error={errors.forWhom}
                        >
                          <option value="" disabled>
                            Choose
                          </option>
                          <option>Students</option>
                          <option>Families</option>
                          <option>Professionals</option>
                        </FormSelect>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <TextLabel className="text-left md:col-span-1" required>
                        Location
                      </TextLabel>
                      <div className="md:col-span-3">
                        <FormSelect
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          error={errors.location}
                        >
                          <option value="" disabled>
                            Select a city
                          </option>
                          <option>Colombo</option>
                          <option>Kandy</option>
                          <option>Galle</option>
                          <option>Gampaha</option>
                          <option>Kalutara</option>
                          <option>Matale</option>
                          <option>Nuwara Eliya</option>
                          <option>Matara</option>
                          <option>Hambantota</option>
                        </FormSelect>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <TextLabel
                        className="text-left md:col-span-1 pt-3"
                        required
                      >
                        Description
                      </TextLabel>
                      <div className="md:col-span-3">
                        <FormTextarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={5}
                          error={errors.description}
                          placeholder="Describe your property in detail (min 20 characters)"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <TextLabel className="text-left md:col-span-1" required>
                        Rent
                      </TextLabel>
                      <div className="md:col-span-3 relative flex items-center">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-9 w-14 bg-[#263D5D] text-white font-semibold rounded-xl">
                          Rs.
                        </span>
                        <FormInput
                          name="rent"
                          value={formData.rent}
                          onChange={handleInputChange}
                          className="pl-20"
                          error={errors.rent}
                          placeholder="Enter monthly rent"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <SectionTitle Icon={FormIcon.User}>
                      Owner Information
                    </SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <TextLabel className="text-left md:col-span-1" required>
                        Email
                      </TextLabel>
                      <div className="md:col-span-3">
                        <FormInput
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          error={errors.email}
                          placeholder="your.email@example.com"
                          type="email"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <TextLabel className="text-left md:col-span-1" required>
                        Mobile
                      </TextLabel>
                      <div className="md:col-span-3 relative flex items-center">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-9 w-16 bg-[#263D5D] text-white font-semibold rounded-xl">
                          +94
                        </span>
                        <FormInput
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          className="pl-20"
                          error={errors.mobile}
                          placeholder="771234567"
                          maxLength={9}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center pt-4">
                    <SheenButton
                      onClick={goNext}
                      className="min-w-[160px]"
                      disabled={!canProceedToNext()}
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500 text-white">
                        <ArrowIcon />
                      </span>
                      Next
                    </SheenButton>
                  </div>
                </div>
              )}

              {/* STEP 1: FINISH/PREVIEW */}
              {activeStep === 1 && (
                <div className="space-y-8">
                  <div className="rounded-3xl bg-white/90 border border-white/70 shadow-xl p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-hugiller text-2xl text-[#263D5D]">
                            {formData.title || "[No Title]"}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {formData.category && (
                              <PillTag>
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M3 11l9-7 9 7v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8Z"
                                    stroke="#475569"
                                    strokeWidth="2"
                                  />
                                </svg>
                                {formData.category}
                              </PillTag>
                            )}
                            {formData.location && (
                              <PillTag>
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M12 21s7-6.5 7-11a7 7 0 0 0-14 0c0 4.5 7 11 7 11Z"
                                    stroke="#475569"
                                    strokeWidth="2"
                                  />
                                </svg>
                                {formData.location}
                              </PillTag>
                            )}
                          </div>
                        </div>
                        <div className="text-right pl-4">
                          <div className="text-sm text-slate-500">Rent</div>
                          <div className="text-2xl font-bold text-[#263D5D]">
                            {formData.rent
                              ? `RS. ${formData.rent}`
                              : "[No Rent]"}
                          </div>
                        </div>
                      </div>
                      <div className="relative rounded-2xl overflow-hidden">
                        <img
                          src={postBackground}
                          alt="Preview"
                          className="w-full h-64 sm:h-80 object-cover"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <svg
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                            <h3 className="font-hugiller text-2xl text-[#263D5D]">
                              Details
                            </h3>
                          </div>
                          <div className="text-sm text-slate-600 space-y-2 pl-2">
                            {formData.forWhom && (
                              <div>
                                <strong>For Whom:</strong> {formData.forWhom}
                              </div>
                            )}
                            {formData.description && (
                              <div>
                                <strong>Description:</strong>{" "}
                                {formData.description}
                              </div>
                            )}
                            {formData.email && (
                              <div>
                                <strong>Contact:</strong> {formData.email}
                              </div>
                            )}
                            {formData.mobile && (
                              <div>
                                <strong>Mobile:</strong> +94 {formData.mobile}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-end justify-start sm:justify-end">
                          <SheenButton
                            onClick={() => setActiveStep(0)}
                            className="min-w-[160px] bg-[#303435]"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M12 20h9"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                              <path
                                d="M16.5 3.5a2.121 2.121 0 1 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Edit Details
                          </SheenButton>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Final validation summary */}
                  {Object.keys(errors).length > 0 && (
                    <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
                      <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <line
                            x1="12"
                            y1="8"
                            x2="12"
                            y2="12"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <line
                            x1="12"
                            y1="16"
                            x2="12.01"
                            y2="16"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                        Please fix the following issues:
                      </div>
                      <ul className="text-sm text-red-600 space-y-1">
                        {Object.entries(errors).map(
                          ([field, message]) =>
                            message && (
                              <li
                                key={field}
                                className="flex items-center gap-2"
                              >
                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                {message}
                              </li>
                            )
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-center">
                    <SheenButton
                      onClick={handleSubmit}
                      className="min-w-[160px]"
                      disabled={Object.keys(errors).length > 0 || isSubmitting}
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500 text-white">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="m5 13 4 4L20 6"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      {isSubmitting ? "Submitting..." : "Submit Post"}
                    </SheenButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Man Image */}
        <div className="block md:hidden mt-8">
          <div className="relative flex justify-center">
            <div className="relative max-w-[650px] w-full translate-x-6">
              <img
                src={heroMan}
                alt="Illustration"
                className="w-[1900px] h-auto object-contain transform hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
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
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PostAddFormPage;
