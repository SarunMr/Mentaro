
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: '/dashboard', label: 'Overview' },
    { path: '/my-courses', label: 'My Courses' },
    { path: '/courses', label: 'Browse Courses' },
    { path: '/my-cart', label: 'Cart' },
    { path: '/wishlist', label: 'Wishlist' },
    { path: '/notifications', label: 'Notifications' },
    { path: '/settings', label: 'Settings' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-8">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`py-4 px-2 border-b-2 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
