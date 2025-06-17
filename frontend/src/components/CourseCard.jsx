import React, { useState } from 'react';
import { MoreHorizontal, User, BookOpen, Heart, CheckCircle2 } from 'lucide-react';

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
    <div className={`relative rounded-xl overflow-hidden ${bgColor} p-4 sm:p-5 h-48 sm:h-56 flex flex-col shadow-lg transition-all duration-300 cursor-pointer group hover:scale-[1.05] hover:shadow-2xl hover:shadow-black/25 hover:-translate-y-2 hover:rotate-1`}>
      {/* Three dots menu - small circle */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-black/20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-black/50 hover:scale-125 hover:rotate-90">
          <MoreHorizontal size={14} className="text-white transition-transform duration-200" />
        </div>
      </div>
      
      {/* Course tags/icons at top */}
      {tags.length > 0 && (
        <div className="flex gap-1 mb-2 sm:mb-3">
          {tags.map((tag, index) => (
            <div key={index} className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded flex items-center justify-center text-xs transition-all duration-200 group-hover:bg-white/40 group-hover:scale-110 group-hover:rotate-12">
              {tag}
            </div>
          ))}
        </div>
      )}
      
      {/* Course title */}
      <div className="flex-1">
        <h3 className="text-white font-bold text-sm sm:text-base leading-tight mb-1 pr-6 sm:pr-8 transition-all duration-300 group-hover:text-yellow-200 group-hover:scale-105 transform-gpu">
          {title}
        </h3>
        {subtitle && (
          <p className="text-white/80 text-xs sm:text-sm mb-2 sm:mb-3 transition-all duration-300 group-hover:text-white/95 group-hover:translate-x-1">{subtitle}</p>
        )}
      </div>
      
      {/* Bottom section */}
      <div className="mt-auto">
        <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm mb-1 sm:mb-2 transition-all duration-300 group-hover:text-white/95 group-hover:translate-x-1">
          <User size={12} className="transition-all duration-300 group-hover:scale-125 group-hover:text-yellow-200" />
          <span className="text-xs sm:text-sm truncate">{instructor}</span>
        </div>
        <div className="text-white text-xs sm:text-sm transition-all duration-300 group-hover:text-yellow-100 group-hover:scale-105 transform-gpu">
          {completed ? (
            <span className="font-semibold">✅ Completed!</span>
          ) : (
            <span>{progress || status}</span>
          )}
        </div>
      </div>
      
      {/* Person image */}
      {hasPersonImage && (
        <div className="absolute bottom-3 sm:bottom-5 right-3 sm:right-5">
          <div className="w-12 h-16 sm:w-16 sm:h-20 bg-white/10 rounded-lg overflow-hidden transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg">
            <div className="w-full h-full bg-gradient-to-b from-gray-300 to-gray-400 flex items-end justify-center transition-all duration-300 group-hover:from-gray-200 group-hover:to-gray-300">
              <div className="w-8 h-10 sm:w-10 sm:h-12 bg-gray-600 rounded-t-full mb-0 transition-all duration-300 group-hover:bg-gray-500"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 pointer-events-none"></div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 sm:mb-6">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-md px-4">{description}</p>
    </div>
  );
};

const CourseDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');

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

  const tabs = [
    { id: 'all', label: 'All Courses', icon: BookOpen },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'all':
        return (
          <>
            {/* Section Header */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">My Courses</h2>
              <p className="text-gray-600 text-sm sm:text-base">List of your courses</p>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
              {courses.map((course, index) => (
                <CourseCard key={index} {...course} />
              ))}
            </div>

            {/* Activate Coupons Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
              {/* Content */}
              <div className="relative z-10">
                <div className="lg:flex lg:items-center">
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Activate Coupons</h2>
                    <p className="text-blue-100 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed lg:max-w-lg">
                      Get some mind blowing discounts on all the available courses
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:max-w-lg">
                      <input 
                        type="text" 
                        className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-gray-900 border-0 focus:ring-2 focus:ring-blue-300 placeholder-gray-400 text-sm sm:text-base"
                        placeholder="Enter coupon code"
                      />
                      <button className="bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold whitespace-nowrap text-sm sm:text-base transition-all duration-200 hover:bg-blue-50 hover:scale-105 hover:shadow-lg active:scale-95">
                        Activate
                      </button>
                    </div>
                  </div>
                  
                  {/* Decorative Graphics - Hidden on mobile and tablet */}
                  <div className="hidden xl:block absolute right-8 top-0 bottom-0 w-96">
                    <div className="relative w-full h-full">
                      {/* Colorful circles */}
                      <div className="absolute top-12 right-16 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
                      <div className="absolute top-8 right-32 w-6 h-6 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute top-20 right-24 w-10 h-10 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                      <div className="absolute top-32 right-12 w-5 h-5 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                      <div className="absolute top-28 right-40 w-7 h-7 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                      <div className="absolute bottom-20 right-20 w-9 h-9 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '2.5s'}}></div>
                      <div className="absolute bottom-16 right-36 w-4 h-4 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
                      <div className="absolute bottom-32 right-28 w-6 h-6 bg-lime-400 rounded-full animate-pulse" style={{animationDelay: '3.5s'}}></div>
                      
                      {/* Abstract geometric shapes */}
                      <div className="absolute top-16 right-8 w-20 h-20 border-4 border-white/30 rotate-45 rounded-lg"></div>
                      <div className="absolute bottom-24 right-16 w-16 h-16 border-3 border-yellow-300/50 rounded-full"></div>
                      <div className="absolute top-24 right-48 w-12 h-12 bg-white/10 rotate-12 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'courses':
        return (
          <EmptyState 
            icon={BookOpen}
            title="No Courses Yet"
            description="You haven't enrolled in any courses yet. Browse our catalog to find courses that interest you."
          />
        );
      case 'wishlist':
        return (
          <EmptyState 
            icon={Heart}
            title="Your Wishlist is Empty"
            description="Save courses you're interested in to your wishlist. You can add courses by clicking the heart icon."
          />
        );
      case 'completed':
        return (
          <EmptyState 
            icon={CheckCircle2}
            title="No Completed Courses"
            description="Complete your first course to see it here. Keep learning and track your progress!"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 sm:bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-900">My Course</h1>
          
          {/* Navigation Tabs */}
          <nav className="flex justify-center">
            <div className="flex space-x-1 sm:space-x-2 bg-gray-100 rounded-lg p-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap text-sm sm:text-base hover:scale-105 active:scale-95 ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm hover:shadow-md'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <Icon size={16} className="sm:size-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default CourseDashboard;