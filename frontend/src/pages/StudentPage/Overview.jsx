import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MentaroNavbar from "./../../components/Student/StudentNavbar.jsx";
import { useAuth } from "../../contexts/AuthContext";
import { authAPI, userAPI, enrollmentAPI } from '../../utils/apiClient';
import { getThumbnailUrl } from '../../utils/imageUtils';
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
  const { user } = useAuth();
  
  const [userProfile, setUserProfile] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [stats, setStats] = useState({
    enrolledCount: 0,
    completedCount: 0,
    totalHours: 0,
    certificates: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user profile
      const profileResponse = await authAPI.getProfile();
      setUserProfile(profileResponse.data.user);

      // Fetch enrolled courses
      const enrollmentsResponse = await enrollmentAPI.getMyEnrollments(1, 20);
      const enrollments = enrollmentsResponse.data.enrollments || [];
      setEnrolledCourses(enrollments);

      // Calculate stats from enrollments
      const completedCourses = enrollments.filter(enrollment => enrollment.isCompleted);
      const totalHours = enrollments.reduce((sum, enrollment) => {
        return sum + (enrollment.course?.duration || 0);
      }, 0);

      setStats({
        enrolledCount: enrollments.length,
        completedCount: completedCourses.length,
        totalHours: Math.round(totalHours),
        certificates: completedCourses.length
      });

      // Fetch featured courses (using search with no filters to get popular courses)
      const coursesResponse = await userAPI.searchCourses({ limit: 4 });
      setFeaturedCourses(coursesResponse.data.courses || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddToCart = async (course) => {
    try {
      await userAPI.addToCart(course._id);
      alert(`Added "${course.title}" to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add course to cart. Please try again.');
    }
  };

  const handleAddToWishlist = async (course) => {
    try {
      await userAPI.addToWishlist(course._id);
      alert(`Added "${course.title}" to wishlist!`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add course to wishlist. Please try again.');
    }
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(enrollment => 
      enrollment.course?._id === courseId || 
      enrollment.course?.id === courseId ||
      enrollment._id === courseId ||
      enrollment.id === courseId
    );
  };

  const handleRetry = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <MentaroNavbar />
        <div className="max-w-7xl mx-auto py-8 px-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <MentaroNavbar />
        <div className="max-w-7xl mx-auto py-8 px-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userName = userProfile?.firstName || user?.firstName || 'User';
  const inProgressCount = stats.enrolledCount - stats.completedCount;

  return (
    <div className="min-h-screen bg-gray-100">
      <MentaroNavbar />

      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Welcome Message - Classic Style with Blue Buttons */}
        <div className="bg-white border-2 border-gray-300 rounded-none shadow-lg p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              {getGreeting()}! Ready to continue your learning journey?
            </p>
            <p className="text-gray-500 mb-6">
              You have {inProgressCount} courses in progress and {featuredCourses.length} new recommendations waiting
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
                  {stats.enrolledCount}
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
                <p className="text-3xl font-serif font-bold text-gray-800">{stats.completedCount}</p>
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
                  {stats.totalHours}
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
                <p className="text-3xl font-serif font-bold text-gray-800">{stats.certificates}</p>
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
            {featuredCourses.length > 0 ? (
              featuredCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white border-2 border-gray-300 rounded-none shadow-md hover:shadow-lg transition-shadow group"
                >
                  <div className="relative bg-gray-50 border-b-2 border-gray-300 p-8">
                    <div className="flex justify-center mb-4">
                      {course.thumbnail ? (
                        <img
                          src={getThumbnailUrl(course.thumbnail)}
                          alt={course.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <BookOpen className="w-16 h-16 text-blue-600" />
                      )}
                    </div>

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
                      <span className="font-medium">
                        {course.instructor?.firstName} {course.instructor?.lastName}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{course.duration || 'N/A'} hours</span>
                      <span className="mx-2">•</span>
                      <span className="font-medium">{course.level}</span>
                    </div>

                    <div className="flex space-x-2">
                      {isEnrolled(course._id) ? (
                        <button
                          onClick={() => navigate('/my-courses')}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-none hover:bg-green-700 transition-colors font-semibold border-2 border-green-600 flex items-center justify-center"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Go to Course
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(course)}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-none hover:bg-blue-700 transition-colors font-semibold border-2 border-blue-600 flex items-center justify-center"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </button>
                      )}
                      <button
                        onClick={() => handleAddToWishlist(course)}
                        className="p-2 border-2 border-gray-300 rounded-none hover:bg-gray-50 transition-colors"
                      >
                        <Heart className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">No featured courses available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
