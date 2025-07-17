import { useState } from 'react';
import { 
  Bell, 
  User, 
  ChevronDown,
  GraduationCap,
  Shield
} from 'lucide-react';

const Navbar = () => {
  const [isAdminView, setIsAdminView] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const toggleView = () => {
    setIsAdminView(!isAdminView);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="bg-white shadow-sm py-3 px-6 flex justify-between items-center">
      {/* Empty left side */}
      <div></div>

      {/* Right side controls */}
      <div className="flex items-center space-x-4">
        {/* View Toggle */}
        <button
          onClick={toggleView}
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          {isAdminView ? (
            <>
              <GraduationCap className="h-4 w-4 mr-2" />
              Switch to Student
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Switch to Admin
            </>
          )}
        </button>

        {/* Notification Button */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-600" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <User className="h-4 w-4" />
            </div>
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Your Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
