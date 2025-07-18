import React from "react";
import { useNavigate } from "react-router-dom";
import MentaroNavbar from "./../../components/Student/StudentNavbar.jsx";
import {
  BookOpen,
  Code,
  Brain,
  Palette,
  User,
  Clock,
  Award,
  Heart,
  ShoppingCart,
} from "lucide-react";

const OverviewPage = () => {
  const navigate = useNavigate();

  const featuredCourses = [
    {
      id: 1,
      title: "Complete React Developer Course 2025",
      instructor: "John Smith",
      icon: <Code className="w-16 h-16 text-blue-600" />,
      price: 99.99,
      duration: "40 hours",
      level: "Beginner",
      badge: "Bestseller",
    },
    {
      id: 2,
      title: "Advanced JavaScript Fundamentals",
      instructor: "Sarah Johnson",
      icon: <BookOpen className="w-16 h-16 text-green-600" />,
      price: 79.99,
      duration: "30 hours",
      level: "Intermediate",
      badge: "New",
    },
    {
      id: 3,
      title: "Python Machine Learning Bootcamp",
      instructor: "Dr. Amanda Wilson",
      icon: <Brain className="w-16 h-16 text-yellow-600" />,
      price: 129.99,
      duration: "60 hours",
      level: "Advanced",
      badge: "Popular",
    },
    {
      id: 4,
      title: "UI/UX Design Masterclass",
      instructor: "Emily Davis",
      icon: <Palette className="w-16 h-16 text-purple-600" />,
      price: 89.99,
      duration: "35 hours",
      level: "Beginner",
      badge: "Bestseller",
    },
  ];

  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleContinueLearning = () => {
    navigate("/my-courses");
  };

  const handleBrowseCourses = () => {
    navigate("/courses");
  };

  const handleAddToCart = (course) => {
    alert(`Added "${course.title}" to cart!`);
  };

  const handleAddToWishlist = (course) => {
    alert(`Added "${course.title}" to wishlist!`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <MentaroNavbar />

      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Welcome Message - Classic Style with Blue Buttons */}
        <div className="bg-white border-2 border-gray-300 rounded-none shadow-lg p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">
              Welcome back, User! 👋
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              {getGreeting()}! Ready to continue your learning journey?
            </p>
            <p className="text-gray-500 mb-6">
              You have 3 courses in progress and 2 new recommendations waiting
              for you.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleContinueLearning}
                className="bg-blue-600 text-white px-8 py-3 rounded-none font-semibold hover:bg-blue-700 transition-colors border-2 border-blue-600"
              >
                Continue Learning
              </button>
              <button
                onClick={handleBrowseCourses}
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-none font-semibold hover:bg-blue-600 hover:text-white transition-colors"
              >
                Browse Courses
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats - Classic Style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-300 rounded-none shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-none">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Enrolled Courses
                </p>
                <p className="text-3xl font-serif font-bold text-gray-800">
                  12
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-none shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 border border-green-200 rounded-none">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Completed
                </p>
                <p className="text-3xl font-serif font-bold text-gray-800">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-none shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-none">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Learning Hours
                </p>
                <p className="text-3xl font-serif font-bold text-gray-800">
                  156
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-none shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-none">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Certificates
                </p>
                <p className="text-3xl font-serif font-bold text-gray-800">5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Courses - Classic Style */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">
              Featured Courses
            </h2>
            <div className="w-24 h-1 bg-gray-800 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Discover our most popular and highly-rated courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white border-2 border-gray-300 rounded-none shadow-md hover:shadow-lg transition-shadow group"
              >
                <div className="relative bg-gray-50 border-b-2 border-gray-300 p-8">
                  <div className="flex justify-center mb-4">{course.icon}</div>

                  {course.badge && (
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 text-xs font-bold uppercase tracking-wide border-2 ${
                          course.badge === "Bestseller"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : course.badge === "New"
                              ? "bg-green-100 text-green-800 border-green-300"
                              : "bg-blue-100 text-blue-800 border-blue-300"
                        }`}
                      >
                        {course.badge}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 bg-white border-2 border-gray-300 px-3 py-1">
                    <span className="text-sm font-bold text-gray-900">
                      ${course.price}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-serif font-bold text-lg text-gray-800 mb-3 line-clamp-2">
                    {course.title}
                  </h3>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <User className="h-4 w-4 mr-2" />
                    <span className="font-medium">{course.instructor}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{course.duration}</span>
                    <span className="mx-2">•</span>
                    <span className="font-medium">{course.level}</span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(course)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-none hover:bg-blue-700 transition-colors font-semibold border-2 border-blue-600 flex items-center justify-center"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleAddToWishlist(course)}
                      className="p-2 border-2 border-gray-300 rounded-none hover:bg-gray-50 transition-colors"
                    >
                      <Heart className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
