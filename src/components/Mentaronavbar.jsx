import React, { useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import mentaroLogo from "./../assets/images/mentarologo.png"

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement your search functionality here
  };

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src={mentaroLogo}
          alt="Menataro Logo"
          className="h-10 w-auto"
        />
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for course"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full py-1 px-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 bottom-0 px-3 flex items-center"
            aria-label="Search"
          >
            <Search size={18} className="text-gray-500" />
          </button>
        </div>
      </form>

      {/* Navigation Items */}
      <div className="flex items-center space-x-4">
        <a href="#" className="text-gray-700 hover:text-blue-600">
          Become Instructor
        </a>
        <a href="#" className="text-gray-700">
          <ShoppingCart size={20} />
        </a>
        <a
          href="#"
          className="px-4 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Login
        </a>
        <a
          href="#"
          className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Sign Up
        </a>
      </div>
    </nav>
  );
};


export default Navbar;
