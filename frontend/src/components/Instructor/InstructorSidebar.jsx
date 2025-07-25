import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FilePlus2,
  Settings,
  HelpCircle,
  Menu,
  X,
  LayoutDashboard,
  DollarSign,
  LogOut,
  BookOpen,
} from "lucide-react";

import justLogo from "../../assets/images/justLogo.png";
import { useAuth } from "../../contexts/AuthContext";

const InstructorSidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navigationItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      text: "Dashboard",
      path: "/instructor/dashboard",
    },
    {
      icon: <FilePlus2 className="h-5 w-5" />,
      text: "Add Course",
      path: "/instructor/course",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      text: "My Courses",
      path: "/instructor/courses",
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      text: "Revenue",
      path: "/instructor/revenue",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      text: "Tools",
      path: "/instructor/tools",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      text: "Help",
      path: "/instructor/help",
    },
  ];

  const handleNavClick = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Determine if sidebar is expanded
  const isSidebarExpanded = isHovered || sidebarOpen;

  return (
    <>
      {/* Hamburger Button (visible on mobile below md) */}
      <button
        className="fixed z-50 top-4 left-4 md:hidden bg-gray-800 text-white p-2 rounded-full"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar Overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity duration-300 ${
          sidebarOpen ? "block" : "hidden"
        } md:hidden`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 h-screen bg-gray-800 text-white z-50 transition-all duration-300 ease-in-out
          flex flex-col
          ${isSidebarExpanded ? "w-48" : "w-20"}
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:w-auto
        `}
        style={{
          width: isSidebarExpanded ? 192 : 80,
        }}
        onMouseEnter={() => window.innerWidth >= 768 && setIsHovered(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setIsHovered(false)}
      >
        {/* Mobile: Close button */}
        <div className="md:hidden flex justify-end p-2">
          <button
            className="text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        {/* User Profile */}
        <div className="flex items-center mb-8 p-2">
          <img
            src={justLogo}
            alt="Logo"
            className={`h-10 ${
              isSidebarExpanded ? "w-auto" : "w-12"
            } transition-all`}
            style={{ objectFit: "contain" }}
          />
          {isSidebarExpanded && (
            <span className="ml-3 font-semibold">Menataro</span>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <SidebarItem
                key={item.path}
                icon={item.icon}
                text={item.text}
                path={item.path}
                isExpanded={isSidebarExpanded}
                isActive={location.pathname === item.path}
                onClick={handleNavClick}
              />
            ))}
          </ul>
        </div>

        {/* Logout Button */}
        <div className="p-2 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className={`flex ${isSidebarExpanded ? "flex-row" : "flex-col"} items-center ${
              isSidebarExpanded ? "" : "justify-center"
            } w-full p-2 rounded-md transition-colors hover:bg-gray-700 text-red-400 hover:text-red-300`}
          >
            <LogOut className="h-5 w-5" />
            {isSidebarExpanded && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

// Update: Use flex-col and justify-center when collapsed, flex-row when expanded
const SidebarItem = ({ icon, text, path, isExpanded, isActive, onClick }) => {
  return (
    <li>
      <Link
        to={path}
        className={`flex ${isExpanded ? "flex-row" : "flex-col"} items-center ${
          isExpanded ? "" : "justify-center"
        } p-2 rounded-md transition-colors
          ${isActive ? "bg-gray-600 text-white" : "hover:bg-gray-700"}
        `}
        onClick={onClick}
      >
        <span>{icon}</span>
        {isExpanded && <span className="ml-3">{text}</span>}
      </Link>
    </li>
  );
};

export default InstructorSidebar;
