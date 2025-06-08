import React, { useState } from 'react';
import { 
  X, 
  PlayCircle, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  HelpCircle,
  ChevronRight,
  Users,
  DollarSign,
  Award,
  BookOpen,
  TrendingUp,
  Globe
} from 'lucide-react';

const InstructorSidebar = ({ isOpen, setIsOpen }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const navigationItems = [
    {
      icon: <PlayCircle className="w-5 h-5" />,
      title: "Courses",
      description: "Create and manage your courses",
      details: "Build comprehensive courses with video lectures, assignments, and interactive content. Track student progress and engagement."
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Communication",
      description: "Connect with your students",
      details: "Message students directly, respond to Q&A, and build a community around your courses."
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Performance",
      description: "Track your success metrics",
      details: "Monitor course performance, student engagement, revenue analytics, and growth trends."
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Tools",
      description: "Instructor resources and utilities",
      details: "Access course creation tools, promotional materials, and instructor resources to enhance your teaching."
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: "Resources",
      description: "Help and support center",
      details: "Find teaching guides, best practices, community support, and technical assistance."
    }
  ];

  const benefits = [
    {
      icon: <Users className="w-6 h-6 text-blue-400" />,
      title: "Teach your way",
      description: "Create courses that reflect your unique teaching style and expertise."
    },
    {
      icon: <DollarSign className="w-6 h-6 text-green-400" />,
      title: "Earn revenue",
      description: "Generate income from your knowledge and grow your professional brand."
    },
    {
      icon: <Award className="w-6 h-6 text-yellow-400" />,
      title: "Impact learners",
      description: "Help students worldwide develop new skills and advance their careers."
    }
  ];

  const stats = [
    { number: "25K+", label: "Active Students" },
    { number: "1.2K+", label: "Expert Instructors" },
    { number: "150+", label: "Course Categories" },
    { number: "95%", label: "Success Rate" }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`} style={{ visibility: isOpen ? 'visible' : 'hidden' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">Become Instructor</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Instructor Dashboard
          </h3>
          <div className="space-y-2">
            {navigationItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="text-gray-400 mr-3">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
                
                {/* Hover Details */}
                {hoveredItem === index && (
                  <div className="absolute left-full top-0 ml-2 w-64 bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-xl z-10">
                    <div className="flex items-center mb-2">
                      <div className="text-blue-400 mr-2">
                        {item.icon}
                      </div>
                      <h4 className="font-semibold text-white">{item.title}</h4>
                    </div>
                    <p className="text-sm text-gray-300">{item.details}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Why teach with us?</h3>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">{benefit.title}</h4>
                  <p className="text-sm text-gray-400">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Our reach</h3>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-3 bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{stat.number}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold mb-4">What you need</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-300">Expertise in your field or subject matter</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-300">Passion for teaching and helping others learn</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-300">Commitment to creating quality educational content</span>
            </li>
          </ul>
        </div>

        {/* CTA Section */}
        <div className="p-6">
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mb-3 flex items-center justify-center">
            Start Teaching Today
            <TrendingUp className="w-4 h-4 ml-2" />
          </button>
          
          <button className="w-full border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-sm mb-4">
            Learn More About Teaching
          </button>
          
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">
              Have questions?{" "}
              <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline">
                Visit our FAQ
              </a>
            </p>
          </div>
        </div>

        {/* Success Story */}
        <div className="p-6 bg-gray-800 m-4 rounded-lg">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">JD</span>
            </div>
            <div>
              <div className="text-sm font-medium text-white">John Developer</div>
              <div className="text-xs text-gray-400">Programming Instructor</div>
            </div>
          </div>
          <p className="text-sm text-gray-300 italic">
            "Teaching on Menatoro has transformed my career. I've helped thousands of students learn coding while building a sustainable income."
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <Globe className="w-4 h-4 mr-2" />
            <span>Join instructors from 50+ countries</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorSidebar;