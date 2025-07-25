
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MentaroNavbar from '../../components/Mentaronavbar';
import Navbar from '../../components/Student/Navbar';
import { userAPI, enrollmentAPI } from '../../utils/apiClient';
import { getThumbnailUrl } from '../../utils/imageUtils';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  User, 
  BookOpen,
  Code,
  Brain,
  Palette,
  Database,
  Server,
  Monitor,
  Smartphone,
  Camera,
  TrendingUp,
  Heart,
  ShoppingCart
} from 'lucide-react';

const BrowseCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCoursesAndCategories();
  }, []);

  const fetchCoursesAndCategories = async () => {
    try {
      setLoading(true);
      const [coursesResponse, categoriesResponse] = await Promise.all([
        userAPI.searchCourses(),
        userAPI.getCategories()
      ]);
      
      console.log('Courses Response:', coursesResponse);
      console.log('Categories Response:', categoriesResponse);
      
      const coursesData = coursesResponse.data?.data?.courses || [];
      console.log('Processed Courses Data:', coursesData);
      setCourses(coursesData);
      
      const categoriesData = categoriesResponse.data?.data || [];
      console.log('Categories Data:', categoriesData);
      const formattedCategories = Array.isArray(categoriesData) ? categoriesData.map(cat => ({
        value: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1)
      })) : [];
      console.log('Formatted Categories:', formattedCategories);
      setCategories([{ value: 'all', label: 'All Categories' }, ...formattedCategories]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    fetchUserWishlistAndCart();
  }, []);

  const fetchUserWishlistAndCart = async () => {
    try {
      const [wishlistResponse, cartResponse, enrolledResponse] = await Promise.all([
        userAPI.getWishlist(),
        userAPI.getCart(),
        userAPI.getEnrolledCourses()
      ]);
      
      if (wishlistResponse.data?.success) {
        setWishlistItems(wishlistResponse.data.data || []);
      }
      
      if (cartResponse.data?.success) {
        setCartItems(cartResponse.data.data?.courses || []);
      }
      
      if (enrolledResponse.data?.success) {
        setEnrolledCourses(enrolledResponse.data.data?.courses || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };



  const levels = [
    { value: 'all', label: 'All Levels' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' }
  ];

  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' }
  ];

  const filteredCourses = Array.isArray(courses) ? courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    console.log('Course filter check:', {
      course: course.title,
      matchesSearch,
      matchesCategory,
      matchesLevel,
      searchTerm,
      selectedCategory,
      selectedLevel
    });
    
    return matchesSearch && matchesCategory && matchesLevel;
  }) : [];
  
  console.log('All courses:', courses);
  console.log('Filtered courses:', filteredCourses);

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating?.average || 0) - (a.rating?.average || 0);
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return (b.totalStudents || 0) - (a.totalStudents || 0);
    }
  });
  
  console.log('Sorted courses:', sortedCourses);
  console.log('Sort by:', sortBy);

  const addToCart = async (courseId) => {
    if (isInCart(courseId)) {
      console.log('Course already in cart, skipping API call');
      return;
    }
    
    try {
      await userAPI.addToCart(courseId);
      await fetchUserWishlistAndCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      await fetchUserWishlistAndCart();
    }
  };

  const addToWishlist = async (courseId) => {
    try {
      if (isInWishlist(courseId)) {
        await userAPI.removeFromWishlist(courseId);
      } else {
        await userAPI.addToWishlist(courseId);
      }
      // Refresh wishlist to ensure frontend state matches backend
      await fetchUserWishlistAndCart();
    } catch (error) {
      console.error('Error updating wishlist:', error);
      // If there's an error, still refresh to sync state
      await fetchUserWishlistAndCart();
    }
  };

  const isInCart = (courseId) => {
    return cartItems.some(item => item._id === courseId || item.course?._id === courseId);
  };

  const isInWishlist = (courseId) => {
    return wishlistItems.some(item => item._id === courseId);
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(course => course._id === courseId || course.id === courseId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MentaroNavbar />
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Courses</h1>
          <p className="text-gray-600">Discover and learn new skills with our comprehensive course catalog</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search courses, instructors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {levels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {levels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedCourses.length} of {courses.length} courses
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading courses</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchCoursesAndCategories}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : sortedCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedCourses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="relative">
                  <div className="w-full h-48 bg-gray-50 rounded-t-lg flex items-center justify-center border-b border-gray-200">
                    {course.thumbnail ? (
                      <img src={getThumbnailUrl(course.thumbnail)} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="h-16 w-16 text-blue-600" />
                    )}
                  </div>
                  
                  {course.badge && (
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        course.badge === 'Bestseller' ? 'bg-yellow-100 text-yellow-800' :
                        course.badge === 'New' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {course.badge}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => addToWishlist(course._id)}
                    className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist(course._id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <User className="h-4 w-4 mr-2" />
                    <span>{course.instructor?.firstName} {course.instructor?.lastName}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

                  <div className="flex items-center mb-3">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium text-gray-900">{course.rating?.average || 0}</span>
                    <span className="text-sm text-gray-500 ml-1">({course.rating?.count || 0})</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{course.duration}</span>
                    <span className="mx-2">•</span>
                    <span className="font-medium">{course.level}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-gray-900">${course.price}</span>
                    </div>
                  </div>

                  {isEnrolled(course._id) ? (
                    <button
                      onClick={() => navigate('/my-courses')}
                      className="w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center transition-colors bg-green-600 text-white hover:bg-green-700"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Go to Course
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(course._id)}
                      className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center transition-colors ${
                        isInCart(course._id) 
                          ? 'bg-gray-600 text-white cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      disabled={isInCart(course._id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {isInCart(course._id) ? 'Added to Cart' : 'Add to Cart'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseCourses;
