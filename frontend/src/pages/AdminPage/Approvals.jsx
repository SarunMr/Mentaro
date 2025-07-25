import React, { useState, useEffect } from "react";
import { Check, X, Eye, BookOpen, FileText, Video, Clock, User, Tag, AlertCircle } from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";
import axios from "axios";

export default function Approvals() {
  const [pendingCourses, setPendingCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPendingCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.ADMIN.PENDING_COURSES, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.courses) {
        setPendingCourses(response.data.courses);
      }
    } catch (err) {
      console.error('Error fetching pending courses:', err);
      setError(err.response?.data?.message || 'Failed to fetch pending courses');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (courseId) => {
    try {
      setActionLoading(courseId);
      const token = localStorage.getItem('token');
      await axios.put(API_ENDPOINTS.ADMIN.APPROVE_COURSE(courseId), {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setPendingCourses(courses => courses.filter(c => c._id !== courseId));
      setSelectedCourse(null);
    } catch (err) {
      console.error('Error approving course:', err);
      setError(err.response?.data?.message || 'Failed to approve course');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (courseId, reason = '') => {
    try {
      setActionLoading(courseId);
      const token = localStorage.getItem('token');
      await axios.put(API_ENDPOINTS.ADMIN.REJECT_COURSE(courseId), {
        reason
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setPendingCourses(courses => courses.filter(c => c._id !== courseId));
      setSelectedCourse(null);
    } catch (err) {
      console.error('Error rejecting course:', err);
      setError(err.response?.data?.message || 'Failed to reject course');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Course Approvals</h2>
            <p className="text-gray-600 mt-1">Review and approve course submissions</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <button
                onClick={fetchPendingCourses}
                className="ml-auto px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Approvals Grid */}
        <div className="grid gap-6">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading courses...</h3>
              <p className="text-gray-500">Please wait while we fetch pending approvals</p>
            </div>
          ) : pendingCourses.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No pending approvals</h3>
              <p className="text-gray-500">All courses have been reviewed</p>
            </div>
          ) : (
            pendingCourses.map(course => (
              <div key={course._id} className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span className="text-sm">{course.instructor?.firstName} {course.instructor?.lastName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-blue-600 font-medium">{course.category}</span>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {course.level}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {course.price === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            `$${course.price}`
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-6">
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleApprove(course._id)}
                        disabled={actionLoading === course._id}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 disabled:bg-green-200 disabled:cursor-not-allowed text-green-700 rounded-xl transition font-medium"
                      >
                        <Check className="w-4 h-4" />
                        {actionLoading === course._id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleDecline(course._id)}
                        disabled={actionLoading === course._id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 disabled:bg-red-200 disabled:cursor-not-allowed text-red-700 rounded-xl transition font-medium"
                      >
                        <X className="w-4 h-4" />
                        {actionLoading === course._id ? 'Processing...' : 'Decline'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedCourse(null)}>
          <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden relative"
            onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b bg-gradient-to-r from-blue-50 to-white">
              <button
                className="absolute top-6 right-6 bg-white rounded-full p-2 hover:bg-gray-100 shadow transition"
                onClick={() => setSelectedCourse(null)}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="text-3xl font-bold text-gray-900 mb-2 pr-12">{selectedCourse.title}</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{selectedCourse.instructor?.firstName} {selectedCourse.instructor?.lastName}</span>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{selectedCourse.category}</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">{selectedCourse.level}</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-bold">
                    {selectedCourse.price === 0 ? "Free" : `$${selectedCourse.price}`}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-8 overflow-y-auto max-h-[60vh]">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 leading-relaxed">{selectedCourse.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    Requirements
                  </h4>
                  <ul className="space-y-2">
                    {selectedCourse.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <Tag className="w-5 h-5 text-green-500" />
                    Learning Objectives
                  </h4>
                  <ul className="space-y-2">
                    {selectedCourse.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {!!selectedCourse.chapters.length && (
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <Video className="w-5 h-5 text-purple-500" />
                    Curriculum
                  </h4>
                  <div className="space-y-4">
                    {selectedCourse.chapters.map((ch, chIdx) => (
                      <div key={chIdx} className="bg-gray-50 rounded-xl p-4">
                        <h5 className="font-medium text-gray-900 mb-3">Chapter {chIdx + 1}: {ch.title}</h5>
                        <div className="space-y-2">
                          {ch.lessons.map((l, lIdx) => (
                            <div key={lIdx} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 font-medium text-sm">{lIdx + 1}</span>
                              </div>
                              <div className="flex-1">
                                <h6 className="font-medium text-gray-900">{l.title}</h6>
                                {l.description && <p className="text-gray-600 text-sm mt-1">{l.description}</p>}
                              </div>
                              {l.duration && (
                                <div className="flex items-center gap-1 text-gray-500">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-sm">{l.duration}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCourse.notes.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-orange-500" />
                    Notes & Resources
                  </h4>
                  <div className="space-y-2">
                    {selectedCourse.notes.map((note, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 border-t bg-gray-50 flex gap-4">
              <button
                onClick={() => handleApprove(selectedCourse._id)}
                disabled={actionLoading === selectedCourse._id}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-400 disabled:cursor-not-allowed text-white py-3 rounded-xl shadow font-semibold text-lg transition flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" /> {actionLoading === selectedCourse._id ? 'Processing...' : 'Approve Course'}
              </button>
              <button
                onClick={() => handleDecline(selectedCourse._id)}
                disabled={actionLoading === selectedCourse._id}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-400 disabled:cursor-not-allowed text-white py-3 rounded-xl shadow font-semibold text-lg transition flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" /> {actionLoading === selectedCourse._id ? 'Processing...' : 'Decline Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
