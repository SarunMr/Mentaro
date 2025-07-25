import React, { useState, useEffect } from 'react';
import { courseAPI } from '../../utils/apiClient';
import { getThumbnailUrl } from '../../utils/imageUtils';
import { Book, Eye, Clock, Users, CheckCircle, XCircle, AlertCircle, Play, Edit } from 'lucide-react';

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCourses: 0
  });

  const fetchCourses = async (page = 1, status = '') => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (status && status !== 'all') {
        params.status = status;
      }
      
      const response = await courseAPI.getInstructorCourses(params);
      setCourses(response.data.courses);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error('Fetch courses error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(1, filter);
  }, [filter]);

  const handleStatusFilter = (status) => {
    setFilter(status);
  };

  const handleSubmitForApproval = async (courseId) => {
    try {
      await courseAPI.submitForApproval(courseId);
      fetchCourses(pagination.currentPage, filter);
    } catch (err) {
      setError('Failed to submit course for approval');
      console.error('Submit for approval error:', err);
    }
  };

  const handlePublishCourse = async (courseId) => {
    try {
      await courseAPI.publishCourse(courseId);
      fetchCourses(pagination.currentPage, filter);
    } catch (err) {
      setError('Failed to publish course');
      console.error('Publish course error:', err);
    }
  };

  const getStatusBadge = (status, isPublished) => {
    if (isPublished) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Published
        </span>
      );
    }

    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Edit className="w-3 h-3 mr-1" />
            Draft
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Unknown
          </span>
        );
    }
  };

  const getActionButton = (course) => {
    if (course.isPublished) {
      return (
        <span className="text-green-600 text-sm font-medium">
          Live for Students
        </span>
      );
    }

    switch (course.status) {
      case 'draft':
        return (
          <button
            onClick={() => handleSubmitForApproval(course._id)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Submit for Approval
          </button>
        );
      case 'pending':
        return (
          <span className="text-yellow-600 text-sm font-medium">
            Awaiting Admin Review
          </span>
        );
      case 'approved':
        return (
          <button
            onClick={() => handlePublishCourse(course._id)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Publish Course
          </button>
        );
      case 'rejected':
        return (
          <span className="text-red-600 text-sm font-medium">
            Needs Revision
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
        <p className="text-gray-600">Manage your courses and track their approval status</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Courses' },
            { key: 'draft', label: 'Draft' },
            { key: 'pending', label: 'Pending' },
            { key: 'approved', label: 'Approved' },
            { key: 'rejected', label: 'Rejected' }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => handleStatusFilter(filterOption.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <Book className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? "You haven't created any courses yet."
              : `No courses with status: ${filter}`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
                      {getStatusBadge(course.status, course.isPublished)}
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Book className="w-4 h-4" />
                        <span>{course.chapters?.length || 0} chapters</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.enrollmentCount || 0} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">${course.price}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      Created: {new Date(course.createdAt).toLocaleDateString()}
                      {course.publishedAt && (
                        <span className="ml-4">
                          Published: {new Date(course.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 ml-6">
                    {course.thumbnail ? (
                      <img
                        src={(() => {
                          const url = getThumbnailUrl(course.thumbnail);
                          console.log('Thumbnail URL:', url, 'Original path:', course.thumbnail);
                          return url;
                        })()}
                        alt={course.title}
                        className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA5NiA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00OCAzMkM0OCAzNS4zMTM3IDQ1LjMxMzcgMzggNDIgMzhDMzguNjg2MyAzOCAzNiAzNS4zMTM3IDM2IDMyQzM2IDI4LjY4NjMgMzguNjg2MyAyNiA0MiAyNkM0NS4zMTM3IDI2IDQ4IDI4LjY4NjMgNDggMzJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yNCA0NEw0MCAzMkw1NiA0NEgyNFoiIGZpbGw9IiM5QjlCQTAiLz4KPC9zdmc+';
                          e.target.onerror = null;
                        }}
                      />
                    ) : (
                      <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center gap-1">
                      <Edit className="w-4 h-4" />
                      Edit Course
                    </button>
                  </div>
                  
                  <div>
                    {getActionButton(course)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchCourses(pagination.currentPage - 1, filter)}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="px-4 py-2 text-sm text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => fetchCourses(pagination.currentPage + 1, filter)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorCourses;