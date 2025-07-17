import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FilePlus2,
  MessageSquare,
  CheckCheck,
  BarChart2,
  Settings,
  HelpCircle,
} from "lucide-react";
import justLogo from "../../assets/images/justLogo.png";

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  // Define navigation items with their routes
  const navigationItems = [

    {
      icon: <CheckCheck className="h-5 w-5" />,
      text: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: <FilePlus2 className="h-5 w-5" />,
      text: "Add Course",
      path: "/admin/course",
    },
    {
      icon: <CheckCheck className="h-5 w-5" />,
      text: "Approvals",
      path: "/admin/approvals",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      text: "Tools",
      path: "/admin/tools",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      text: "Help",
      path: "/admin/help",
    },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out z-50
        ${isHovered ? "w-48" : "w-20"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full p-4">
        {/* User Profile */}
        <div className="flex items-center mb-8 p-2">
          <img
            src={justLogo}
            alt="Logo"
            className={`h-10 ${isHovered ? "w-auto" : "w-12"} transition-all`}
            style={{ objectFit: "contain" }}
          />
          {isHovered && <span className="ml-3 font-semibold">Menataro</span>}
        </div>

        {/* Navigation Items */}
        <div className="flex-1">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <SidebarItem
                key={item.path}
                icon={item.icon}
                text={item.text}
                path={item.path}
                isHovered={isHovered}
                isActive={location.pathname === item.path}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, path, isHovered, isActive }) => {
  return (
    <li>
      <Link
        to={path}
        className={`flex items-center p-2 rounded-md transition-colors ${
          isActive ? "bg-gray-600 text-white" : "hover:bg-gray-700"
        }`}
      >
        <span>{icon}</span>
        {isHovered && <span className="ml-3">{text}</span>}
      </Link>
    </li>
  );
};

export default Sidebar;
