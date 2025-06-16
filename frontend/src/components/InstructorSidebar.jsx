import React, { useState } from 'react';
import { 
  Monitor, 
  MessageSquare, 
  TrendingUp, 
  HelpCircle
} from 'lucide-react';
import { VscTools } from "react-icons/vsc";
<VscTools />

const InstructorDashboard = () => {
  const [activeSection, setActiveSection] = useState('courses');
  const [isHovering, setIsHovering] = useState(false);

  const sidebarItems = [
    {
      id: 'courses',
      icon: Monitor,
      label: 'Courses',
      content: (
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Courses</h1>
          {/* Add your courses content here */}
        </div>
      )
    },
    {
      id: 'communication',
      icon: MessageSquare,
      label: 'Communication',
      content: (
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Communication Center</h1>
          {/* Add your communication content here */}
        </div>
      )
    },
    {
      id: 'performance',
      icon: TrendingUp,
      label: 'Performance',
      content: (
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Performance Analytics</h1>
          {/* Add your performance content here */}
        </div>
      )
    },
    {
      
      id: 'tools',
      icon: VscTools,
      label: 'Tools',
      content: (
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Tools & Resources</h1>
          {/* Add your tools content here */}
        </div>
      )
    },
    {
      id: 'help',
      icon: HelpCircle,
      label: 'Help',
      content: (
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Help & Support</h1>
          {/* Add your help content here */}
        </div>
      )
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
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          {isHovering && (
            <span className="ml-3 text-white font-bold text-xl whitespace-nowrap">
              Menataro
            </span>
          )}
        </div>
        
        {/* Menu Items */}
        <div className="flex flex-col space-y-2 px-2">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className={`flex items-center p-3 rounded cursor-pointer transition-all duration-200 ${
                  activeSection === item.id 
                    ? 'bg-blue-600 shadow-lg' 
                    : 'hover:bg-gray-700'
                }`}
                onMouseEnter={() => {
                  setIsHovering(true);
                  setActiveSection(item.id);
                }}
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
          {sidebarItems.find(item => item.id === activeSection)?.content}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;