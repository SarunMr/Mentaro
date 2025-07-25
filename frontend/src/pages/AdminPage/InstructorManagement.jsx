import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/apiClient';
import { GraduationCap, Search, Check, X, Clock, AlertCircle, User, Mail, BookOpen } from 'lucide-react';

const InstructorManagement = () => {
  const [pendingInstructors, setPendingInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPendingInstructors();
  }, []);

  const fetchPendingInstructors = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPendingInstructors();
      setPendingInstructors(response.data.instructors || []);
    } catch (error) {
      console.error('Error fetching pending instructors:', error);
      setError('Failed to fetch pending instructors');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (instructorId) => {
    try {
      await adminAPI.approveInstructor(instructorId);
      setPendingInstructors(pendingInstructors.filter(instructor => instructor._id !== instructorId));
      setSuccess('Instructor approved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error approving instructor:', error);
      setError('Failed to approve instructor');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleReject = async (instructorId) => {
    try {
      await adminAPI.rejectInstructor(instructorId);
      setPendingInstructors(pendingInstructors.filter(instructor => instructor._id !== instructorId));
      setSuccess('Instructor rejected successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error rejecting instructor:', error);
      setError('Failed to reject instructor');
      setTimeout(() => setError(''), 3000);
    }
  };

  const filteredInstructors = pendingInstructors.filter(instructor => {
    const searchLower = searchTerm.toLowerCase();
    return (
      instructor.firstName?.toLowerCase().includes(searchLower) ||
      instructor.lastName?.toLowerCase().includes(searchLower) ||
      instructor.email?.toLowerCase().includes(searchLower) ||
      instructor.instructorProfile?.expertise?.some(exp => 
        exp.toLowerCase().includes(searchLower)
      )
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-3 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Instructor Management</h2>
            <p className="text-gray-600 mt-1">Review and approve pending instructor applications</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <p className="text-green-600">{success}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="text-lg font-semibold text-gray-900">
                  Pending Applications ({pendingInstructors.length})
                </span>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="p-6">
            {filteredInstructors.length === 0 ? (
              <div className="text-center py-12">
                <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {pendingInstructors.length === 0 ? 'No Pending Applications' : 'No Results Found'}
                </h3>
                <p className="text-gray-500">
                  {pendingInstructors.length === 0 
                    ? 'All instructor applications have been processed.' 
                    : 'Try adjusting your search criteria.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredInstructors.map((instructor) => (
                  <div key={instructor._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {instructor.firstName?.charAt(0)}{instructor.lastName?.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <h3 className="text-xl font-semibold text-gray-900">
                                {instructor.firstName} {instructor.lastName}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <Mail className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">{instructor.email}</span>
                            </div>
                            <div className="text-sm text-gray-500 mb-4">
                              Applied on {new Date(instructor.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>

                        {instructor.instructorProfile && (
                          <div className="mt-4 space-y-4">
                            {instructor.instructorProfile.bio && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                  {instructor.instructorProfile.bio}
                                </p>
                              </div>
                            )}
                            
                            {instructor.instructorProfile.expertise && instructor.instructorProfile.expertise.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <BookOpen className="w-4 h-4 text-gray-500" />
                                  <h4 className="font-medium text-gray-900">Expertise</h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {instructor.instructorProfile.expertise.map((skill, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-48">
                        <button
                          onClick={() => handleApprove(instructor._id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(instructor._id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorManagement;