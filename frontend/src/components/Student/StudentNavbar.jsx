import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import mentaroLogo from "./../../assets/images/mentarologo.png";

// Simple Avatar components
const Avatar = ({ children, className = "" }) => (
  <div
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
  >
    {children}
  </div>
);

const AvatarImage = ({ src, alt, className = "" }) => (
  <img
    src={src}
    alt={alt}
    className={`aspect-square h-full w-full object-cover ${className}`}
  />
);

const AvatarFallback = ({ children, className = "" }) => (
  <div
    className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-sm font-medium ${className}`}
  >
    {children}
  </div>
);

// Simple Dropdown components
const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { isOpen, setIsOpen }),
      )}
    </div>
  );
};

const DropdownMenuTrigger = ({ children, isOpen, setIsOpen }) => (
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="inline-flex justify-center w-full"
  >
    {children}
  </button>
);

const DropdownMenuContent = ({ children, isOpen, setIsOpen }) => (
  <>
    {isOpen && (
      <>
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
        <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg z-50">
          <div className="py-1">{children}</div>
        </div>
      </>
    )}
  </>
);

const DropdownMenuItem = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left"
  >
    {children}
  </button>
);

const DropdownMenuLabel = ({ children }) => (
  <div className="px-4 py-2 text-sm font-medium text-gray-900">{children}</div>
);

const DropdownMenuSeparator = () => (
  <div className="border-t border-gray-100 my-1"></div>
);

const MentaroNavbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const openLogin = () => {
    navigate("/login", { state: { backgroundLocation: location } });
  };

  const openSignup = () => {
    navigate("/signup", { state: { backgroundLocation: location } });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getUserInitials = (username) => {
    if (!username) return "U";
    return username.charAt(0).toUpperCase();
  };

  return (
    <>
      <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/dashboard" className="hover:opacity-80 transition-opacity">
            <img src={mentaroLogo} alt="Mentaro Logo" className="h-10" />
          </Link>
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
        {isAuthenticated() ? (
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Become Instructor
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarFallback>{getUserInitials(user?.username)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user?.username || "User"}</DropdownMenuLabel>
                <DropdownMenuLabel>{user?.email || "user@example.com"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/my-courses">My Courses</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/courses">Browse Courses</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/my-cart">My Cart</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/wishlist">WishList</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/notifications">Notification</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings">Account Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Become Instructor
            </a>
            <button
              onClick={openLogin}
              className="text-gray-700 hover:text-blue-600"
            >
              Login
            </button>
            <button
              onClick={openSignup}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default MentaroNavbar;
