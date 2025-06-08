import React, { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import mentaroLogo from "./../assets/images/mentarologo.png";
import InstructorSidebar from './../components/InstructorSidebar';

const MentaroNavbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  // Navigate to /login with backgroundLocation state to show modal
  const openLogin = () => {
    navigate("/login", { state: { backgroundLocation: location } });
  };

  // Navigate to /register with backgroundLocation state to show modal
  const openSignup = () => {
    navigate("/signup", { state: { backgroundLocation: location } });
  };

<InstructorSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
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
        <div onClick={() => setIsSidebarOpen(true)}>
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
    </>
  );
};

export default MentaroNavbar;
