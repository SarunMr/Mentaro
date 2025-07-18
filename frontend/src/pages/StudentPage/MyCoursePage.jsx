import React, { useState } from 'react';
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

const MyCoursesPage = () => {
  const [courses] = useState([
    {
      id: 1,
      title: "Complete React Developer Course",
      instructor: "John Smith",
      icon: <Code className="w-16 h-16 text-blue-600" />,
      duration: "40 hours",
      progress: 75,
      status: "in-progress",
      rating: 4.8,
      students: 15420
    },
    {
      id: 2,
      title: "Advanced JavaScript Fundamentals",
      instructor: "Sarah Johnson",
      icon: <Database className="w-16 h-16 text-green-600" />,
      duration: "30 hours",
      progress: 100,
      status: "completed",
      rating: 4.6,
      students: 12350
    },
    {
      id: 3,
      title: "Node.js Backend Development",
      instructor: "Mike Chen",
      icon: <Server className="w-16 h-16 text-red-600" />,
      duration: "35 hours",
      progress: 45,
      status: "in-progress",
      rating: 4.7,
      students: 8920
    },
    {
      id: 4,
      title: "UI/UX Design Principles",
      instructor: "Emily Davis",
      icon: <Palette className="w-16 h-16 text-purple-600" />,
      duration: "25 hours",
      progress: 0,
      status: "not-started",
      rating: 4.9,
      students: 6789
    }
  ]);

  const [filter, setFilter] = useState('all');

  const filterOptions = [
    { value: 'all', label: 'All Courses' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'not-started', label: 'Not Started' }
  ];

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    return course.status === filter;
  });

  const stats = {
    total: courses.length,
    completed: courses.filter(c => c.status === 'completed').length,
    inProgress: courses.filter(c => c.status === 'in-progress').length,
    streak: 15
  };

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
          <button className="mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
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
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.streak} days</p>
              </div>
            </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="relative">
                <div className="w-full h-48 bg-gray-50 rounded-t-xl flex items-center justify-center border-b border-gray-200">
                  {course.icon}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.status === 'completed' ? 'bg-green-100 text-green-800' :
                    course.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status === 'completed' ? 'Completed' :
                     course.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{course.title}</h3>
                
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <User className="h-4 w-4 mr-2" />
                  <span>{course.instructor}</span>
                </div>

                {course.status === 'in-progress' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{course.duration}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{course.rating}</span>
                  <span className="ml-1">({course.students.toLocaleString()} students)</span>
                </div>

                <button className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  course.status === 'completed' 
                    ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                  {course.status === 'completed' ? 'Review Course' : 'Continue Learning'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCoursesPage;
