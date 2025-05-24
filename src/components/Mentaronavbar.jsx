import React, { useState } from "react";
import { Search } from "lucide-react";
import mentaroLogo from "./../assets/images/mentarologo.png";
import LoginPage from "../pages/LoginPage";    // Adjust path if needed
import SignupPage from "../pages/SignupPage";  // Adjust path if needed

const MentaroNavbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const openLogin = () => {
    setShowSignup(false);
    setShowAuthModal(true);
  };

  const openSignup = () => {
    setShowSignup(true);
    setShowAuthModal(true);
  };

  return (
    <>
      <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src={mentaroLogo} alt="Mentaro Logo" className="h-10" />
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <Search size={20} />
            </button>
          </div>
        </form>

        {/* Navigation Items */}
        <div className="flex items-center space-x-6">
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Become Instructor
          </a>
          <button onClick={openLogin} className="text-gray-700 hover:text-blue-600">
            Login
          </button>
          <button
            onClick={openSignup}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Conditionally render LoginPage or SignupPage */}
      {showAuthModal && (
        showSignup ? (
          <SignupPage
            onClose={() => setShowAuthModal(false)}
            switchToLogin={() => setShowSignup(false)}
          />
        ) : (
          <LoginPage
            onClose={() => setShowAuthModal(false)}
            switchToSignup={() => setShowSignup(true)}
          />
        )
      )}
    </>
  );
};

export default MentaroNavbar;
