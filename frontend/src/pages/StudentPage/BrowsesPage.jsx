
import React, { useState } from 'react';
import MentaroNavbar from './../../components/Student/StudentNavbar.jsx';
import Navbar from './../../components/Student/Navbar.jsx';
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
  const [courses] = useState([
    {
      id: 1,
      title: "Complete React Developer Course 2025",
      instructor: "John Smith",
      icon: <Code className="w-16 h-16 text-blue-600" />,
      price: 99.99,
      originalPrice: 129.99,
      rating: 4.8,
      reviews: 15420,
      duration: "40 hours",
      level: "Beginner",
      category: "web-development",
      badge: "Bestseller",
      description: "Master React from basics to advanced concepts with real-world projects",
      onSale: true,
      isEnrolled: false
    },
    {
      id: 2,
      title: "Advanced JavaScript Fundamentals",
      instructor: "Sarah Johnson",
      icon: <BookOpen className="w-16 h-16 text-green-600" />,
      price: 79.99,
      originalPrice: 79.99,
      rating: 4.6,
      reviews: 12350,
      duration: "30 hours",
      level: "Intermediate",
      category: "programming",
      badge: "New",
      description: "Deep dive into JavaScript concepts and modern ES6+ features",
      onSale: false,
      isEnrolled: true
    },
    {
      id: 3,
      title: "Python Machine Learning Bootcamp",
      instructor: "Dr. Amanda Wilson",
      icon: <Brain className="w-16 h-16 text-yellow-600" />,
      price: 129.99,
      originalPrice: 159.99,
      rating: 4.9,
      reviews: 8920,
      duration: "60 hours",
      level: "Advanced",
      category: "data-science",
      badge: "Popular",
      description: "Learn machine learning with Python, pandas, and scikit-learn",
      onSale: true,
      isEnrolled: false
    },
    {
      id: 4,
      title: "UI/UX Design Masterclass",
      instructor: "Emily Davis",
      icon: <Palette className="w-16 h-16 text-purple-600" />,
      price: 89.99,
      originalPrice: 89.99,
      rating: 4.7,
      reviews: 6789,
      duration: "35 hours",
      level: "Beginner",
      category: "design",
      badge: "Bestseller",
      description: "Create beautiful and user-friendly interfaces with modern design principles",
      onSale: false,
      isEnrolled: false
    },
    {
      id: 5,
      title: "Full Stack Web Development",
      instructor: "Carlos Rodriguez",
      icon: <Server className="w-16 h-16 text-red-600" />,
      price: 149.99,
      originalPrice: 199.99,
      rating: 4.5,
      reviews: 5432,
      duration: "80 hours",
      level: "Intermediate",
      category: "web-development",
      badge: "Popular",
      description: "Build complete web applications from frontend to backend",
      onSale: true,
      isEnrolled: false
    },
    {
      id: 6,
      title: "Data Science with Python",
      instructor: "Dr. Lisa Zhang",
      icon: <Database className="w-16 h-16 text-indigo-600" />,
      price: 119.99,
      originalPrice: 119.99,
      rating: 4.8,
      reviews: 7654,
      duration: "50 hours",
      level: "Intermediate",
      category: "data-science",
      badge: "New",
      description: "Analyze and visualize data using Python, NumPy, and Matplotlib",
      onSale: false,
      isEnrolled: false
    },
    {
      id: 7,
      title: "Mobile App Development with React Native",
      instructor: "Michael Chen",
      icon: <Smartphone className="w-16 h-16 text-cyan-600" />,
      price: 109.99,
      originalPrice: 139.99,
      rating: 4.6,
      reviews: 4321,
      duration: "45 hours",
      level: "Intermediate",
      category: "mobile-development",
      badge: "Popular",
      description: "Create cross-platform mobile apps with React Native",
      onSale: true,
      isEnrolled: false
    },
    {
      id: 8,
      title: "Digital Marketing Fundamentals",
      instructor: "Rachel Green",
      icon: <TrendingUp className="w-16 h-16 text-pink-600" />,
      price: 69.99,
      originalPrice: 89.99,
      rating: 4.4,
      reviews: 3210,
      duration: "25 hours",
      level: "Beginner",
      category: "marketing",
      badge: "New",
      description: "Master digital marketing strategies and social media marketing",
      onSale: true,
      isEnrolled: false
    },
    {
      id: 9,
      title: "Photography for Beginners",
      instructor: "David Wilson",
      icon: <Camera className="w-16 h-16 text-orange-600" />,
      price: 59.99,
      originalPrice: 59.99,
      rating: 4.3,
      reviews: 2876,
      duration: "20 hours",
      level: "Beginner",
      category: "photography",
      badge: "Bestseller",
      description: "Learn photography basics and composition techniques",
      onSale: false,
      isEnrolled: false
    },
    {
      id: 10,
      title: "Frontend Development with Vue.js",
      instructor: "Maria Santos",
      icon: <Monitor className="w-16 h-16 text-green-700" />,
      price: 94.99,
      originalPrice: 124.99,
      rating: 4.7,
      reviews: 1987,
      duration: "38 hours",
      level: "Intermediate",
      category: "web-development",
      badge: "New",
      description: "Build modern web applications with Vue.js and Vuex",
      onSale: true,
      isEnrolled: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'programming', label: 'Programming' },
    { value: 'design', label: 'Design' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'photography', label: 'Photography' }
  ];

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

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return b.id - a.id;
      default:
        return b.reviews - a.reviews;
    }
  });

  const addToCart = (course) => {
    if (course.isEnrolled) {
      alert(`You are already enrolled in "${course.title}"`);
      return;
    }
    
    if (cartItems.find(item => item.id === course.id)) {
      alert(`"${course.title}" is already in your cart`);
      return;
    }
    
    setCartItems([...cartItems, course]);
    alert(`Added "${course.title}" to cart!`);
  };

  const addToWishlist = (course) => {
    if (wishlistItems.find(item => item.id === course.id)) {
      alert(`"${course.title}" is already in your wishlist`);
      return;
    }
    
    setWishlistItems([...wishlistItems, course]);
    alert(`Added "${course.title}" to wishlist!`);
  };

  const isInCart = (courseId) => {
    return cartItems.some(item => item.id === courseId);
  };

  const isInWishlist = (courseId) => {
    return wishlistItems.some(item => item.id === courseId);
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
        {sortedCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="relative">
                  <div className="w-full h-48 bg-gray-50 rounded-t-lg flex items-center justify-center border-b border-gray-200">
                    {course.icon}
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

                  {course.onSale && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                        Sale
                      </span>
                    </div>
                  )}

                  {course.isEnrolled && (
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                        Enrolled
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => addToWishlist(course)}
                    className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist(course.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <User className="h-4 w-4 mr-2" />
                    <span>{course.instructor}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

                  <div className="flex items-center mb-3">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium text-gray-900">{course.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({course.reviews.toLocaleString()})</span>
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
                      {course.originalPrice > course.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">${course.originalPrice}</span>
                      )}
                    </div>
                    {course.onSale && (
                      <span className="text-sm text-green-600 font-medium">
                        {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  {course.isEnrolled ? (
                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium cursor-not-allowed">
                      Already Enrolled
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(course)}
                      className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center transition-colors ${
                        isInCart(course.id) 
                          ? 'bg-gray-600 text-white cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      disabled={isInCart(course.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {isInCart(course.id) ? 'Added to Cart' : 'Add to Cart'}
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
