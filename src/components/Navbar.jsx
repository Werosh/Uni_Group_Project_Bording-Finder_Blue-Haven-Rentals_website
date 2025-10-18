import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  MapPin,
  Plus,
  User,
  Home,
  Info,
  Mail,
  LogOut,
  Clock,
  Edit,
  LayoutDashboard,
} from "lucide-react";

import DropDownBackImg from "../assets/images/others/handBack.webp";
import LogoImg from "../assets/images/logo/logo.png";
import { useAuth } from "../context/AuthContext";
import { logout } from "../firebase/authService";
import Modal from "./Modal";
import {
  getInitials,
  getDisplayName,
  getProfileImageUrl,
  hasProfileImage,
} from "../utils/profileUtils";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    // If user is not logged in, navigate to login page
    if (!user) {
      navigate("/login");
      return;
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSectionNavigation = (sectionId) => {
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleAddPostClick = () => {
    // Check if user is logged in
    if (!user) {
      navigate("/login");
      return;
    }

    // Check user role
    if (userProfile?.role === "boarding_finder") {
      // Show modal for boarding_finder users
      setIsRoleModalOpen(true);
    } else if (
      userProfile?.role === "boarding_owner" ||
      userProfile?.role === "admin"
    ) {
      // Navigate to post-add for boarding_owner and admin
      navigate("/post-add");
    } else {
      // Default behavior for users without a role
      navigate("/post-add");
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9999] ${
        isScrolled
          ? "bg-blue-200 shadow-sm"
          : "bg-[#05153b]/80 backdrop-blur-md border-b border-white/20"
      } transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src={LogoImg}
              alt="Blue Haven Rentals"
              className="h-10 w-auto"
            />
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search
                  className={`h-5 w-5 ${
                    isScrolled ? "text-gray-400" : "text-gray-300"
                  }`}
                />
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className={`w-full pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none ${
                  isScrolled
                    ? "border-gray-300 bg-white"
                    : "border-gray-400 bg-white/90 placeholder-gray-400"
                }`}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-[20px] tracking-[.09em] Hugiller-font-style">
            <button
              onClick={() => handleSectionNavigation("home")}
              className={`${
                isScrolled
                  ? "text-gray-700 hover:text-teal-600"
                  : "text-white hover:text-gray-300"
              } transition-colors duration-200`}
            >
              Home
            </button>
            <button
              onClick={() => handleSectionNavigation("about")}
              className={`${
                isScrolled
                  ? "text-gray-700 hover:text-teal-600"
                  : "text-white hover:text-gray-300"
              } transition-colors duration-200`}
            >
              About
            </button>
            <Link
              to="/contact"
              className={`${
                isScrolled
                  ? "text-gray-700 hover:text-teal-600"
                  : "text-white hover:text-gray-300"
              } transition-colors duration-200`}
            >
              Contact
            </Link>

            {/* Dashboard Link - Only for Admins */}
            {user && isAdmin() && (
              <Link
                to="/admin/dashboard"
                className={`${
                  isScrolled
                    ? "text-gray-700 hover:text-teal-600"
                    : "text-white hover:text-gray-300"
                } transition-colors duration-200 flex items-center space-x-1`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}

            {/* Find Place Button */}
            <button
              onClick={() => navigate("/browse")}
              className="bg-white font-[Hugiller-Demo] text-[20px] hover:bg-teal-600 text-[#324262] hover:text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <MapPin className="h-4 w-4" />
              <span>Find place</span>
            </button>

            {/* Add Post Button */}
            <button
              onClick={handleAddPostClick}
              className="bg-white font-[Hugiller-Demo] text-[20px] hover:bg-teal-600 text-[#324262] hover:text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Add Post</span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white hover:bg-teal-600 transition-colors duration-200 font-semibold text-lg"
              >
                {user && userProfile ? (
                  <span>
                    {getInitials(userProfile.firstName, userProfile.lastName) ||
                      userProfile.username?.[0]?.toUpperCase() ||
                      user.email?.[0]?.toUpperCase() ||
                      "U"}
                  </span>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </button>

              {/* Dropdown Menu - Only show if user is logged in */}
              {isDropdownOpen && user && (
                <div
                  className="absolute bg-white right-0 mt-2 w-86 rounded-lg shadow-lg border z-50 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${DropDownBackImg})`,
                  }}
                >
                  {/* Overlay for readability */}
                  <div className="bg-white/70 rounded-lg">
                    {/* Profile section - hide for boarding_finder users */}
                    {userProfile?.role !== "boarding_finder" && (
                      <div className="p-4 ">
                        <div className="flex items-center space-x-3">
                          <div className="w-32 h-32 border-[#2BA9C1B2] border-3 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            {hasProfileImage(userProfile) ? (
                              <img
                                src={getProfileImageUrl(userProfile)}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-4xl font-bold text-teal-600">
                                {getInitials(
                                  userProfile.firstName,
                                  userProfile.lastName
                                )}
                              </span>
                            )}
                          </div>
                          <div>
                            <p
                              id="username-drop"
                              className="font-medium text-[24px] text-gray-900"
                            >
                              {getDisplayName(
                                userProfile,
                                user.email?.split("@")[0] || "User"
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              @
                              {userProfile?.username ||
                                user.email?.split("@")[0]}
                            </p>
                            <button
                              onClick={() => {
                                navigate("/user/edit");
                                setIsDropdownOpen(false);
                              }}
                              className="mt-3 w-full  bg-teal-500 hover:bg-teal-600 text-white py-2 px-5 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
                            >
                              <Edit className="h-4 w-4 " />
                              <span>Edit Profile</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="py-1 text-[24px] text-[#235A78]">
                      {/* boarding_finder: only logout */}
                      {userProfile?.role === "boarding_finder" && (
                        <div className=" py-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2  hover:bg-red-50 transition-colors duration-200"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Logout
                          </button>
                        </div>
                      )}

                      {/* boarding_owner: profile, find place, add post, pending posts, logout */}
                      {userProfile?.role === "boarding_owner" && (
                        <>
                          <button
                            onClick={() => {
                              navigate("/user");
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center px-4 py-2  hover:bg-gray-50 transition-colors duration-200"
                          >
                            <User className="h-4 w-4 mr-3" />
                            Profile
                          </button>
                          <button
                            onClick={() => {
                              navigate("/browse");
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center px-4 py-2  hover:bg-gray-50 transition-colors duration-200"
                          >
                            <MapPin className="h-4 w-4 mr-3" />
                            Find Place
                          </button>
                          <button
                            onClick={() => {
                              navigate("/post-add");
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center px-4 py-2  hover:bg-gray-50 transition-colors duration-200"
                          >
                            <Plus className="h-4 w-4 mr-3" />
                            Add Post
                          </button>
                          <button
                            onClick={() => {
                              navigate("/user?tab=posts");
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center px-4 py-2  hover:bg-gray-50 transition-colors duration-200"
                          >
                            <Clock className="h-4 w-4 mr-3" />
                            My Posts
                          </button>
                          <div className=" py-1">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center px-4 py-2  hover:bg-red-50 transition-colors duration-200"
                            >
                              <LogOut className="h-4 w-4 mr-3" />
                              Logout
                            </button>
                          </div>
                        </>
                      )}

                      {/* admin: all options including dashboard */}
                      {isAdmin() && (
                        <>
                          <button
                            onClick={() => {
                              navigate("/user");
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center px-4 py-2  hover:bg-gray-50 transition-colors duration-200"
                          >
                            <User className="h-4 w-4 mr-3" />
                            Profile
                          </button>
                          <button
                            onClick={() => {
                              navigate("/browse");
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center px-4 py-2  hover:bg-gray-50 transition-colors duration-200"
                          >
                            <MapPin className="h-4 w-4 mr-3" />
                            Find Place
                          </button>
                          <button
                            onClick={() => {
                              navigate("/post-add");
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center px-4 py-2  hover:bg-gray-50 transition-colors duration-200"
                          >
                            <Plus className="h-4 w-4 mr-3" />
                            Add Post
                          </button>
                          <button
                            onClick={() => {
                              navigate("/user?tab=posts");
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center px-4 py-2  hover:bg-gray-50 transition-colors duration-200"
                          >
                            <Clock className="h-4 w-4 mr-3" />
                            My Posts
                          </button>
                          <button
                            onClick={() => {
                              navigate("/admin/dashboard");
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center px-4 py-2  hover:bg-gray-50 transition-colors duration-200"
                          >
                            <LayoutDashboard className="h-4 w-4 mr-3" />
                            Dashboard
                          </button>
                          <div className=" py-1">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center px-4 py-2  hover:bg-red-50 transition-colors duration-200"
                            >
                              <LogOut className="h-4 w-4 mr-3" />
                              Logout
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-md ${
                isScrolled
                  ? "text-gray-700 hover:text-teal-600"
                  : "text-white hover:text-gray-300"
              } transition-colors duration-200`}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Search Bar - Now inside the menu */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Mobile Navigation Links */}
            <button
              onClick={() => handleSectionNavigation("home")}
              className="block  hover:text-teal-600 py-2 text-[20px] text-[#235A78]"
            >
              Home
            </button>
            <button
              onClick={() => handleSectionNavigation("about")}
              className="block text-[#235A78] hover:text-teal-600 py-2 text-[20px]"
            >
              About
            </button>
            <Link
              to="/contact"
              className="block text-[#235A78] hover:text-teal-600 py-2 text-[20px]"
            >
              Contact
            </Link>

            {/* Mobile Action Buttons */}
            <div id="same-font" className="pt-4 space-y-3">
              <button
                onClick={() => {
                  navigate("/browse");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
              >
                <MapPin className="h-4 w-4" />
                <span>Find place</span>
              </button>

              <button
                onClick={() => {
                  handleAddPostClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-gray-700 hover:bg-gray-800 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Add Post</span>
              </button>
            </div>

            {/* Mobile User Section */}
            <div className="pt-4 border-t">
              {user ? (
                <>
                  {/* Profile section - hide for boarding_finder users */}
                  {userProfile?.role !== "boarding_finder" && (
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white overflow-hidden font-semibold text-lg">
                        {hasProfileImage(userProfile) ? (
                          <img
                            src={getProfileImageUrl(userProfile)}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>
                            {getInitials(
                              userProfile.firstName,
                              userProfile.lastName
                            ) ||
                              userProfile?.username?.[0]?.toUpperCase() ||
                              user.email?.[0]?.toUpperCase() ||
                              "U"}
                          </span>
                        )}
                      </div>
                      <div>
                        <p
                          id="same-font"
                          className="font-medium text-gray-900 text-[20px]"
                        >
                          {getDisplayName(
                            userProfile,
                            user.email?.split("@")[0] || "User"
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{userProfile?.username || user.email?.split("@")[0]}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {/* boarding_finder: only logout */}
                    {userProfile?.role === "boarding_finder" && (
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 text-[20px]"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    )}

                    {/* boarding_owner: profile, find place, add post, pending posts, logout */}
                    {userProfile?.role === "boarding_owner" && (
                      <>
                        <button
                          onClick={() => {
                            navigate("/user");
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-[20px]"
                        >
                          <User className="h-4 w-4 mr-3" />
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            navigate("/browse");
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-[20px]"
                        >
                          <MapPin className="h-4 w-4 mr-3" />
                          Find Place
                        </button>
                        <button
                          onClick={() => {
                            navigate("/post-add");
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-[20px]"
                        >
                          <Plus className="h-4 w-4 mr-3" />
                          Add Post
                        </button>
                        <button
                          onClick={() => {
                            navigate("/user?tab=posts");
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-[20px]"
                        >
                          <Clock className="h-4 w-4 mr-3" />
                          My Posts
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 text-[20px]"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Logout
                        </button>
                      </>
                    )}

                    {/* admin: all options including dashboard */}
                    {isAdmin() && (
                      <>
                        <button
                          onClick={() => {
                            navigate("/user");
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-[20px]"
                        >
                          <User className="h-4 w-4 mr-3" />
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            navigate("/browse");
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-[20px]"
                        >
                          <MapPin className="h-4 w-4 mr-3" />
                          Find Place
                        </button>
                        <button
                          onClick={() => {
                            navigate("/post-add");
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-[20px]"
                        >
                          <Plus className="h-4 w-4 mr-3" />
                          Add Post
                        </button>
                        <button
                          onClick={() => {
                            navigate("/user?tab=posts");
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-[20px]"
                        >
                          <Clock className="h-4 w-4 mr-3" />
                          My Posts
                        </button>
                        <button
                          onClick={() => {
                            navigate("/admin/dashboard");
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-[20px]"
                        >
                          <LayoutDashboard className="h-4 w-4 mr-3" />
                          Dashboard
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 text-[20px]"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Logout
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#263D5D] hover:bg-[#303435] text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Role Restriction Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Post Ads Restricted"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700 text-lg">
            Only boarding owners can post ads on Blue Haven Rentals. You are
            currently registered as a boarding finder.
          </p>
          <p className="text-gray-600">
            To post your boarding property, you need to register as a boarding
            owner.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => {
                setIsRoleModalOpen(false);
                navigate("/signup");
              }}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Register as Boarding Owner
            </button>
            <button
              onClick={() => setIsRoleModalOpen(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </nav>
  );
};

export default Navbar;
