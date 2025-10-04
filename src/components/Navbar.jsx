import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";

import DropDownBackImg from "../assets/images/others/handBack.webp";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

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
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        isScrolled ? "bg-blue-200 shadow-sm" : "bg-transparent"
      }   transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 tracking-[.1em]">
            <h1 className="text-xl font-semibold text-[#3ABBD0]">
              Blue <span className="text-black">Haven</span> Rentals
            </h1>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-[20px] tracking-[.09em] Hugiller-font-style">
            <a
              href="#home"
              className="text-gray-700 hover:text-teal-600 transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-teal-600 transition-colors duration-200"
            >
              About
            </a>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-teal-600 transition-colors duration-200"
            >
              Contact
            </Link>

            {/* Find Place Button */}
            <button className="bg-teal-500 font-[Hugiller-Demo] text-[20px] hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
              <MapPin className="h-4 w-4" />
              <span>Find place</span>
            </button>

            {/* Add Post Button */}
            <button className="bg-teal-500 font-[Hugiller-Demo] text-[20px] hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
              <Plus className="h-4 w-4" />
              <span>Add Post</span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white hover:bg-teal-600 transition-colors duration-200"
              >
                <User className="h-5 w-5" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="absolute bg-white right-0 mt-2 w-86 rounded-lg shadow-lg border z-50 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${DropDownBackImg})`,
                  }}
                >
                  {/* Overlay for readability */}
                  <div className="bg-white/70 rounded-lg">
                    <div className="p-4 ">
                      <div className="flex items-center space-x-3">
                        <div className="w-32 h-32 border-[#2BA9C1B2] border-3 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <p
                            id="username-drop"
                            className="font-medium text-[24px] text-gray-900"
                          >
                            User Name
                          </p>
                          <p className="text-sm text-gray-500">@username</p>
                          <button className="mt-3 w-full  bg-teal-500 hover:bg-teal-600 text-white py-2 px-5 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200">
                            <Edit className="h-4 w-4 " />
                            <span>Edit Profile</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="py-1 text-[24px] text-[#235A78]">
                      <a
                        href="#profile"
                        className="flex items-center px-4 py-2  hover:bg-gray-50 transition-colors duration-200"
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </a>
                      <a
                        href="#find-place"
                        className="flex items-center px-4 py-2  hover:bg-gray-50 transition-colors duration-200"
                      >
                        <MapPin className="h-4 w-4 mr-3" />
                        Find Place
                      </a>
                      <a
                        href="#add-post"
                        className="flex items-center px-4 py-2  hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4 mr-3" />
                        Add Post
                      </a>
                      <a
                        href="#pending-posts"
                        className="flex items-center px-4 py-2  hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Clock className="h-4 w-4 mr-3" />
                        Pending Posts
                      </a>
                      <div className=" py-1">
                        <a
                          href="#logout"
                          className="flex items-center px-4 py-2  hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Logout
                        </a>
                      </div>
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
              className="p-2 rounded-md text-gray-700 hover:text-teal-600"
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
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Search Bar - Now inside the menu */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Mobile Navigation Links */}
            <a
              href="#home"
              className="block  hover:text-teal-600 py-2 text-[20px] text-[#235A78]"
            >
              Home
            </a>
            <a
              href="#about"
              className="block text-[#235A78] hover:text-teal-600 py-2 text-[20px]"
            >
              About
            </a>
            <Link
              to="/contact"
              className="block text-[#235A78] hover:text-teal-600 py-2 text-[20px]"
            >
              Contact
            </Link>

            {/* Mobile Action Buttons */}
            <div id="same-font" className="pt-4 space-y-3">
              <button className="w-full bg-teal-500 hover:bg-teal-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200">
                <MapPin className="h-4 w-4" />
                <span>Find place</span>
              </button>

              <button className="w-full bg-gray-700 hover:bg-gray-800 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200">
                <Plus className="h-4 w-4" />
                <span>Add Post</span>
              </button>
            </div>

            {/* Mobile User Section */}
            <div className="pt-4 border-t">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p
                    id="same-font"
                    className="font-medium text-gray-900 text-[20px]"
                  >
                    User Name
                  </p>
                  <p className="text-sm text-gray-500">@username</p>
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href="#profile"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-[20px]"
                >
                  <User className="h-4 w-4 mr-3" />
                  Profile
                </a>
                <a
                  href="#pending-posts"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-[20px]"
                >
                  <Clock className="h-4 w-4 mr-3" />
                  Pending Posts
                </a>
                <a
                  href="#logout"
                  className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 text-[20px]"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
