import { useState } from "react";
import {
  FilePlus2,
  MessageSquare,
  BarChart2,
  Settings,
  HelpCircle,
} from "lucide-react";
import justLogo from "../../assets/images/justLogo.png";

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out z-50
        ${isHovered ? "w-48" : "w-20"}`} // Adjusted width for non-hover state
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full p-4">
        {/* User Profile */}
        <div className="flex items-center mb-8 p-2">
          <img
            src={justLogo}
            alt="Logo"
            className={`h-10 ${isHovered ? "w-auto" : "w-12"} transition-all`} // Adjusted width based on hover state
            style={{ objectFit: "contain" }} // Maintain aspect ratio
          />
          {isHovered && <span className="ml-3 font-semibold">Menataro</span>}
        </div>

        {/* Navigation Items */}
        <div className="flex-1">
          <ul className="space-y-2">
            <SidebarItem
              icon={<FilePlus2 className="h-5 w-5" />}
              text="Add Course"
              isHovered={isHovered}
            />
            <SidebarItem
              icon={<MessageSquare className="h-5 w-5" />}
              text="Communication"
              isHovered={isHovered}
            />
            <SidebarItem
              icon={<BarChart2 className="h-5 w-5" />}
              text="Performance"
              isHovered={isHovered}
            />
            <SidebarItem
              icon={<Settings className="h-5 w-5" />}
              text="Tools"
              isHovered={isHovered}
            />
            <SidebarItem
              icon={<HelpCircle className="h-5 w-5" />}
              text="Help"
              isHovered={isHovered}
            />
          </ul>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, isHovered }) => {
  return (
    <li>
      <a
        href="#"
        className="flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors"
      >
        <span>{icon}</span>
        {isHovered && <span className="ml-3">{text}</span>}
      </a>
    </li>
  );
};

export default Sidebar;
