import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import mentaroLogo from "../assets/images/mentarologo.png";
import { Monitor, MessageSquare, TrendingUp, HelpCircle } from "lucide-react";
import { VscTools } from "react-icons/vsc";

const InstructorDashboard = () => {
  const [activeSection, setActiveSection] = useState('courses');
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  const sidebarItems = [
    {
      id: 'courses',
      icon: Monitor,
      label: 'Courses',
      route: '/my-courses', // Add route for navigation
    },
    {
      id: 'communication',
      icon: MessageSquare,
      label: 'Communication',
      // Add route if you want nested navigation for this item
    },
    {
      id: 'performance',
      icon: TrendingUp,
      label: 'Performance',
      // Add route if you want nested navigation for this item
    },
    {
      id: 'tools',
      icon: VscTools,
      label: 'Tools',
      // Add route if you want nested navigation for this item
    },
    {
      id: 'help',
      icon: HelpCircle,
      label: 'Help',
      // Add route if you want nested navigation for this item
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${isHovering ? 'w-64' : 'w-16'} bg-gray-900 flex flex-col py-4 transition-all duration-300 ease-in-out fixed h-full z-50`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Brand/Logo at Top */}
        <div
          className="flex items-center px-4 mb-8"
          onMouseEnter={() => setIsHovering(true)}
        >
          <div className="flex items-center">
            {!isHovering ? (
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">M</span>
              </div>
            ) : (
              <>
                <img
                  src={mentaroLogo}
                  alt="Mentaro Logo"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <span className="ml-3 text-white font-bold text-xl whitespace-nowrap">
                  Mentaro
                </span>
              </>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col space-y-2 px-2">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className={`flex items-center p-3 rounded cursor-pointer transition-all duration-200 ${activeSection === item.id
                  ? 'bg-blue-600 shadow-lg'
                  : 'hover:bg-gray-700'
                  }`}
                onClick={() => {
                  setActiveSection(item.id);
                  if (item.route) {
                    navigate(item.route);
                  }
                }}
                onMouseEnter={() => setIsHovering(true)}
              >
                <IconComponent className="w-5 h-5 text-white flex-shrink-0" />
                {isHovering && (
                  <span className="ml-3 text-white font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto ml-16">
        <div className="h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;