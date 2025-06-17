import React from 'react';
import { MoreHorizontal, User } from 'lucide-react';

const CourseCard = ({ 
  title, 
  subtitle, 
  instructor, 
  progress, 
  bgColor, 
  textColor = "text-white",
  hasPersonImage = false,
  status = "Not Yet Started",
  completed = false,
  tags = [],
  personPosition = "bottom-right"
}) => {
  return (
    <div className={`relative rounded-xl overflow-hidden ${bgColor} p-5 h-56 flex flex-col shadow-lg`}>
      {/* Three dots menu - small circle */}
      <div className="absolute top-4 right-4">
        <div className="w-7 h-7 bg-black/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/30">
          <MoreHorizontal size={16} className="text-white" />
        </div>
      </div>
      
      {/* Course tags/icons at top */}
      {tags.length > 0 && (
        <div className="flex gap-1 mb-3">
          {tags.map((tag, index) => (
            <div key={index} className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-xs">
              {tag}
            </div>
          ))}
        </div>
      )}
      
      {/* Course title */}
      <div className="flex-1">
        <h3 className="text-white font-bold text-base leading-tight mb-1 pr-8">
          {title}
        </h3>
        {subtitle && (
          <p className="text-white/80 text-sm mb-3">{subtitle}</p>
        )}
      </div>
      
      {/* Bottom section */}
      <div className="mt-auto">
        <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
          <User size={14} />
          <span className="text-sm">{instructor}</span>
        </div>
        <div className="text-white text-sm">
          {completed ? (
            <span className="font-semibold">Completed!</span>
          ) : (
            <span>{progress || status}</span>
          )}
        </div>
      </div>
      
      {/* Person image */}
      {hasPersonImage && (
        <div className="absolute bottom-5 right-5">
          <div className="w-16 h-20 bg-white/10 rounded-lg overflow-hidden">
            <div className="w-full h-full bg-gradient-to-b from-gray-300 to-gray-400 flex items-end justify-center">
              <div className="w-10 h-12 bg-gray-600 rounded-t-full mb-0"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CourseDashboard = () => {
  const courses = [
    {
      title: "WEBSITE DEV ZERO TO HERO",
      instructor: "Kitani Studio",
      progress: "4/10 Videos Completed",
      bgColor: "bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700",
      hasPersonImage: true,
      tags: ["🌐", "📱", "⚡"]
    },
    {
      title: "MOBILE DEV REACT NATIVE",
      subtitle: "by Kitani Studio",
      instructor: "Kitani Studio",
      status: "Not Yet Started",
      bgColor: "bg-gradient-to-br from-green-500 via-green-600 to-green-700",
      hasPersonImage: true,
      tags: ["📱"]
    },
    {
      title: "MAKE UBER CLONE APP",
      instructor: "Kitani Studio",
      progress: "3/8 Videos Completed",
      bgColor: "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900",
      hasPersonImage: true
    },
    {
      title: "VUE JAVASCRIPT COURSE",
      instructor: "Kitani Studio",
      status: "Not Yet Started", 
      bgColor: "bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700",
      hasPersonImage: true,
      tags: ["🔥"]
    },
    {
      title: "Java Programming Beginner",
      instructor: "Kitani Studio",
      status: "Not Yet Started",
      bgColor: "bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700"
    },
    {
      title: "UI DESIGN FOR BEGINNERS",
      subtitle: "by Kitani Studio",
      instructor: "Kitani Studio",
      status: "Not Yet Started",
      bgColor: "bg-gradient-to-br from-red-500 via-red-600 to-red-700",
      hasPersonImage: true,
      tags: ["🎨", "📐", "💡"]
    },
    {
      title: "Wordpress Course Intermediate",
      instructor: "Kitani Studio",
      status: "Not Yet Started",
      bgColor: "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800"
    },
    {
      title: "Wordpress Course Intermediate", 
      instructor: "Kitani Studio",
      status: "Not Yet Started",
      bgColor: "bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500"
    },
    {
      title: "IOS 13 SWIFT 5 IOS DEVELOPMENT",
      instructor: "Kitani Studio",
      status: "Not Yet Started",
      bgColor: "bg-gradient-to-br from-yellow-500 via-orange-500 to-orange-600",
      hasPersonImage: true,
      tags: ["🍎"]
    },
    {
      title: "iOS 13 & Swift 5 - Complete iOS...",
      instructor: "Kitani Studio",
      completed: true,
      bgColor: "bg-gradient-to-br from-orange-400 via-orange-500 to-red-500"
    },
    {
      title: "Wordpress Course Intermediate",
      instructor: "Kitani Studio", 
      completed: true,
      bgColor: "bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800"
    },
    {
      title: "WEBSITE DEV ZERO TO HERO",
      subtitle: "by Kitani Studio",
      instructor: "Kitani Studio",
      completed: true,
      bgColor: "bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700",
      hasPersonImage: true,
      tags: ["🌐", "📱", "⚡"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">My Course</h1>
          <nav className="flex justify-center space-x-12 border-b">
            <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-4 font-medium">All Courses</a>
            <a href="#" className="text-gray-500 hover:text-gray-700 pb-4 font-medium">Courses</a>
            <a href="#" className="text-gray-500 hover:text-gray-700 pb-4 font-medium">Wishlist</a>
            <a href="#" className="text-gray-500 hover:text-gray-700 pb-4 font-medium">Completed</a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Course</h2>
          <p className="text-gray-600">List of your courses</p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>

        {/* Activate Coupons Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white relative overflow-hidden">
          {/* Content */}
          <div className="relative z-10 flex items-center">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-4">Activate Coupons</h2>
              <p className="text-blue-100 mb-8 text-lg leading-relaxed max-w-lg">
                Get some mind blowing discounts on all the available courses
              </p>
              <div className="flex gap-4 max-w-lg">
                <input 
                  type="text" 
                  className="flex-1 px-6 py-4 rounded-lg text-gray-900 border-0 focus:ring-2 focus:ring-blue-300 placeholder-gray-400"
                  placeholder=""
                />
                <button className="bg-white text-blue-700 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors whitespace-nowrap">
                  Activate
                </button>
              </div>
            </div>
            
            {/* Decorative Graphics */}
            <div className="hidden lg:block absolute right-8 top-0 bottom-0 w-96">
              <div className="relative w-full h-full">
                {/* Colorful circles */}
                <div className="absolute top-12 right-16 w-8 h-8 bg-yellow-400 rounded-full"></div>
                <div className="absolute top-8 right-32 w-6 h-6 bg-green-400 rounded-full"></div>
                <div className="absolute top-20 right-24 w-10 h-10 bg-red-400 rounded-full"></div>
                <div className="absolute top-32 right-12 w-5 h-5 bg-purple-400 rounded-full"></div>
                <div className="absolute top-28 right-40 w-7 h-7 bg-orange-400 rounded-full"></div>
                <div className="absolute bottom-20 right-20 w-9 h-9 bg-pink-400 rounded-full"></div>
                <div className="absolute bottom-16 right-36 w-4 h-4 bg-cyan-400 rounded-full"></div>
                <div className="absolute bottom-32 right-28 w-6 h-6 bg-lime-400 rounded-full"></div>
                
                {/* Abstract geometric shapes */}
                <div className="absolute top-16 right-8 w-20 h-20 border-4 border-white/30 rotate-45 rounded-lg"></div>
                <div className="absolute bottom-24 right-16 w-16 h-16 border-3 border-yellow-300/50 rounded-full"></div>
                <div className="absolute top-24 right-48 w-12 h-12 bg-white/10 rotate-12 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDashboard;