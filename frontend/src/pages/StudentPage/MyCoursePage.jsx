import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import MentaroNavbar from './../../components/Student/StudentNavbar.jsx';
import Navbar from './../../components/Student/Navbar.jsx';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Zap, 
  User, 
  Star,
  Code,
  Database,
  Server,
  Palette 
} from 'lucide-react';
import { studentAPI } from '../../utils/apiClient';
import { getThumbnailUrl } from '../../utils/imageUtils';

const MyCoursesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  });

  const filterOptions = [
    { value: 'all', label: 'All Courses' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'not-started', label: 'Not Started' }
  ];

  useEffect(() => {
    fetchCourses();
  }, [filter, searchTerm, pagination.currentPage]);

  useEffect(() => {
    // Check if user was redirected from successful purchase
    if (location.state?.purchaseSuccess) {
      const purchasedCourses = location.state?.purchasedCourses || 1;
      toast.success(
        `🎉 Purchase successful! ${purchasedCourses} ${purchasedCourses === 1 ? 'course' : 'courses'} added to your library.`,
        {
          duration: 5000,
          style: {
            background: '#10B981',
            color: '#fff',
          },
        }
      );
      
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchCourses = async () => {
     try {
       setLoading(true);
       const response = await studentAPI.getEnrolledCourses(
         pagination.currentPage,
         12
       );
       
       setCourses(response.data.data.courses);
       setPagination(response.data.data.pagination);
       setError(null);
     } catch (err) {
       setError('Failed to fetch courses');
       console.error('Error fetching courses:', err);
     } finally {
       setLoading(false);
     }
   };

  const fetchStats = async () => {
    try {
      const response = await studentAPI.getDashboardStats();
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const filteredCourses = courses.filter(course => {
     const matchesFilter = filter === 'all' || course.status === filter;
     const matchesSearch = !searchTerm || 
       course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       `${course.instructor?.firstName} ${course.instructor?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
     return matchesFilter && matchesSearch;
   });
 
   const displayStats = {
      total: stats.totalCourses || 0,
      completed: stats.completedCourses || 0,
      inProgress: stats.inProgressCourses || 0,
      streak: stats.streak || 0
    };

    const handleSearch = (e) => {
      setSearchTerm(e.target.value);
    };

    const handlePageChange = (newPage) => {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    if (loading && courses.length === 0) {
      return (
        <div className="min-h-screen bg-gray-50">
          <MentaroNavbar />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your courses...</p>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gray-50">
          <MentaroNavbar />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchCourses}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-gray-50">
      <MentaroNavbar />
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-2">Continue your learning journey</p>
          </div>
          <button 
            onClick={() => navigate('/courses')}
            className="mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Browse Catalog
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{displayStats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{displayStats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{displayStats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Learning Streak</p>
                <p className="text-2xl font-bold text-gray-900">{displayStats.streak} days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                {course.thumbnail && (
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={getThumbnailUrl(course.thumbnail)} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                )}
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4">by {course.instructor?.firstName} {course.instructor?.lastName}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {course.duration || 'N/A'}
                  </span>
                  {course.rating > 0 && (
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm text-gray-600">{(course.rating?.average || 0).toFixed(1)}</span>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        course.status === 'completed' ? 'bg-green-500' :
                        course.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.status === 'completed' ? 'bg-green-100 text-green-800' :
                    course.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status === 'completed' ? 'Completed' :
                     course.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                  </span>
                </div>
                
                <button 
                  onClick={() => navigate(`/student/course/${course.id}`)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {course.status === 'completed' ? 'Review Course' :
                   course.status === 'in-progress' ? 'Continue Learning' : 'Start Course'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center mt-8 space-x-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    page === pagination.currentPage
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
