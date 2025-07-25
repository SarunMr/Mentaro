import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Tag, Calendar, Percent, BookOpen, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { instructorAPI, courseAPI } from "../../utils/apiClient";
import { toast } from "react-hot-toast";

export default function Tools() {
  const [discounts, setDiscounts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState("");
  const [course, setCourse] = useState("");
  const [description, setDescription] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [applicableToAll, setApplicableToAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState("");

  // Fetch data on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setFetchingData(true);
      const [discountsResponse, coursesResponse] = await Promise.all([
        instructorAPI.getDiscounts(),
        courseAPI.getInstructorCourses()
      ]);
      
      setDiscounts(discountsResponse.data.data.discounts || []);
      setCourses(coursesResponse.data.courses || []);
    } catch (error) {
      console.error('Error fetching data:', error);

      setError('Failed to load data. Please try again.');
      toast.error('Failed to load discount data');
    } finally {
      setFetchingData(false);
    }
  };

  const handleCreateDiscount = async (e) => {
    e.preventDefault();
    
    if (!code || !amount) {
      toast.error('Please fill in required fields');
      return;
    }
    
    if (!applicableToAll && !course) {
      toast.error('Please select a course or make it applicable to all courses');
      return;
    }

    try {
      setLoading(true);
      const discountData = {
        code: code.trim().toUpperCase(),
        description: description.trim(),
        type: 'percentage',
        value: Number(amount),
        validFrom: validFrom ? new Date(validFrom) : new Date(),
        validUntil: validUntil ? new Date(validUntil) : null,
        applicableToAll,
        applicableCourses: applicableToAll ? [] : [course]
      };

      const response = await instructorAPI.createDiscount(discountData);
      
      setDiscounts([...discounts, response.data.discount]);
      
      // Reset form
      setCode("");
      setAmount("");
      setCourse("");
      setDescription("");
      setValidFrom("");
      setValidUntil("");
      setApplicableToAll(false);
      
      toast.success('Discount code created successfully!');
    } catch (error) {
      console.error('Error creating discount:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create discount code';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDiscount = async (discountId) => {
    if (!discountId) {
      toast.error('Invalid discount ID');
      return;
    }
    
    const confirmDelete = window.confirm('Are you sure you want to delete this discount code? This action cannot be undone.');
    if (!confirmDelete) {
      return;
    }
    
    try {
      await instructorAPI.deleteDiscount(discountId);
      setDiscounts(discounts.filter(discount => discount._id !== discountId));
      toast.success('Discount code deleted successfully!');
    } catch (error) {
      console.error('Error deleting discount:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete discount code';
      toast.error(errorMessage);
    }
  };

  const handleToggleStatus = async (discountId) => {
    if (!discountId) {
      toast.error('Invalid discount ID');
      return;
    }
    
    try {
      const response = await instructorAPI.toggleDiscountStatus(discountId);
      setDiscounts(discounts.map(discount => 
        discount._id === discountId 
          ? { ...discount, isActive: response.data.data.isActive }
          : discount
      ));
      toast.success('Discount status updated successfully!');
    } catch (error) {
      console.error('Error toggling discount status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update discount status';
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString();
  };

  const getCourseTitle = (discount) => {
    if (discount.applicableToAll) return 'All Courses';
    if (discount.applicableCourses && discount.applicableCourses.length > 0) {
      const courseId = discount.applicableCourses[0];
      const course = courses.find(c => c._id === courseId);
      return course ? course.title : 'Unknown Course';
    }
    return 'No Course Selected';
  };

  if (fetchingData) {
    return (
      <div className="w-full min-h-screen py-8 px-4 sm:px-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading discount management...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen py-8 px-4 sm:px-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchInitialData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-3 shadow-lg">
            <Tag className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discount Management</h1>
            <p className="text-gray-600 mt-1">Create and manage discount codes for your courses</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Discount Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                  <Plus className="w-6 h-6" />
                  Create Discount
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleCreateDiscount} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Discount Code *
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                        placeholder="e.g. SUMMER25"
                        value={code}
                        onChange={e => setCode(e.target.value.toUpperCase())}
                        maxLength={20}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                      placeholder="e.g. Summer sale discount"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      maxLength={100}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Discount Amount (%) *
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                        placeholder="e.g. 20"
                        type="number"
                        value={amount}
                        min={1}
                        max={100}
                        onChange={e => setAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Valid From
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                        value={validFrom}
                        onChange={e => setValidFrom(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Valid Until
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                        value={validUntil}
                        onChange={e => setValidUntil(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={applicableToAll}
                        onChange={e => setApplicableToAll(e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-semibold text-gray-700">
                        Apply to all courses
                      </span>
                    </label>
                  </div>
                  
                  {!applicableToAll && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Course *
                      </label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white appearance-none"
                          value={course}
                          onChange={e => setCourse(e.target.value)}
                          required={!applicableToAll}
                        >
                          <option value="">Choose a course</option>
                          {courses.map(c => (
                            <option key={c._id} value={c._id}>{c.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Discount Code'
                    )}
                  </button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Discounts List */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-2xl pb-4">
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Tag className="w-6 h-6 text-purple-500" />
                  Active Discount Codes
                  <span className="ml-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {discounts.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {discounts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Tag className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No discount codes yet</h3>
                    <p className="text-gray-500">Create your first discount code to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {discounts.filter(discount => discount && discount._id).map((discount) => (
                      <div
                        key={discount._id}
                        className={`bg-gradient-to-r border rounded-2xl p-6 hover:shadow-md transition-shadow ${
                          discount.isActive 
                            ? 'from-blue-50 to-purple-50 border-blue-100' 
                            : 'from-gray-50 to-gray-100 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`px-4 py-2 rounded-xl font-bold text-lg tracking-wider ${
                                discount.isActive 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-400 text-white'
                              }`}>
                                {discount.code}
                              </div>
                              <div className={`px-3 py-1 rounded-full font-bold text-lg ${
                                discount.isActive 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {discount.value}% OFF
                              </div>
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                discount.isActive 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-600'
                              }`}>
                                {discount.isActive ? 'Active' : 'Inactive'}
                              </div>
                            </div>
                            
                            {discount.description && (
                              <p className="text-gray-700 mb-2 font-medium">{discount.description}</p>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                <span className="font-medium">{getCourseTitle(discount)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Valid: {formatDate(discount.validFrom)} - {formatDate(discount.validUntil)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Tag className="w-4 h-4" />
                                <span>Used: {discount.usageCount || 0} times</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleToggleStatus(discount._id)}
                              className={`p-3 rounded-xl transition-colors ${
                                discount.isActive 
                                  ? 'bg-green-50 hover:bg-green-100 text-green-600' 
                                  : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                              }`}
                              title={discount.isActive ? 'Deactivate discount' : 'Activate discount'}
                            >
                              {discount.isActive ? (
                                <ToggleRight className="w-5 h-5" />
                              ) : (
                                <ToggleLeft className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteDiscount(discount._id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 p-3 rounded-xl transition-colors group"
                              title="Delete discount"
                            >
                              <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
