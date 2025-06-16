import React, { useState } from "react";
import { FaShoppingCart, FaBell } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi";
import mentaroLogo from "./../assets/images/mentarologo.png";
import { useNavigate, useLocation } from 'react-router-dom';

// Utility to generate a random username
function generateUsername() {
  const adjectives = ["Cool", "Fast", "Smart", "Happy", "Brave", "Bright"];
  const nouns = ["Lion", "Tiger", "Eagle", "Shark", "Wolf", "Falcon"];
  return (
    adjectives[Math.floor(Math.random() * adjectives.length)] +
    nouns[Math.floor(Math.random() * nouns.length)] +
    Math.floor(Math.random() * 1000)
  );
}

const NavbarLoggedIn = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const randomUsername = generateUsername();
  const loggedEmail = location.state?.email || "user@example.com";

  const handleBecomeInstructor = () => {
    // Add any logic here (form validation, API calls, etc.)
    navigate("/instructor-dashboard");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      {/* Logo and Brand */}
      <div className="flex items-center">
        <img src={mentaroLogo} alt="Mentaro Logo" className="h-10" />
      </div>

      {/* Search Bar */}
      <div className="flex-1 mx-8">
        <input
          type="text"
          placeholder="Search for course"
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Navigation & User */}
      <div className="flex items-center space-x-4">
        <button
          className="text-gray-700 hover:text-blue-600 font-medium"
          onClick={handleBecomeInstructor}
        >
          Become Instructor
        </button>
        <FaShoppingCart className="text-xl text-gray-600 hover:text-blue-600 cursor-pointer" />
        <FaBell className="text-xl text-gray-600 hover:text-blue-600 cursor-pointer" />

        {/* User Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center focus:outline-none"
            aria-label="Open user menu"
          >
            <HiOutlineUserCircle className="text-3xl text-gray-700" />
          </button>
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="px-4 py-3 border-b">
                <div className="font-medium">{randomUsername}</div>
                <div className="text-sm text-gray-500 truncate">{loggedEmail}</div>
              </div>
              <ul className="py-1">
                <li>
                  <a
                    href="/my-courses"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    My Courses
                  </a>
                </li>
                <li>
                  <a
                    href="/cart"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    My Cart
                  </a>
                </li>
                <li>
                  <a
                    href="/wishlist"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Wishlist
                  </a>
                </li>
                <li>
                  <a
                    href="/notifications"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Notifications
                  </a>
                </li>
                <li>
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Account Settings
                  </a>
                </li>
              </ul>
              <div className="border-t">
                <button
                  className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-gray-100"
                  onClick={() => {
                    // Add your logout logic here
                  }}
                >
                  <MdLogout className="mr-2" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarLoggedIn;