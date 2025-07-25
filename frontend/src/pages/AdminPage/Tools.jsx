import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Tag, Calendar, Percent, BookOpen, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "@/config/api";

export default function Tools() {
  const [discounts, setDiscounts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState("");
  const [course, setCourse] = useState("");
  const [description, setDescription] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    fetchDiscounts();
    fetchCourses();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.DISCOUNTS.BASE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDiscounts(response.data.discounts || []);
    } catch (error) {
      console.error('Error fetching discounts:', error);
      setError('Failed to load discounts');
    } finally {
      setFetchingData(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.ADMIN.ALL_COURSES, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCreateDiscount = async (e) => {
    e.preventDefault();
    if (!code || !amount || !description || !validFrom || !validUntil) {
      setMessage("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem('token');
      const discountData = {
        code: code.trim().toUpperCase(),
        description,
        type: 'percentage',
        value: Number(amount),
        validFrom,
        validUntil,
        applicableToAll: !course,
        applicableCourses: course ? [course] : []
      };

      await axios.post(API_ENDPOINTS.DISCOUNTS.BASE, discountData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCode("");
      setAmount("");
      setCourse("");
      setDescription("");
      setValidFrom("");
      setValidUntil("");
      setMessage("Discount created successfully!");
      setTimeout(() => setMessage(""), 3000);
      
      fetchDiscounts();
    } catch (error) {
      console.error('Error creating discount:', error);
      setMessage(error.response?.data?.message || "Failed to create discount");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDiscount = async (discountId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(API_ENDPOINTS.DISCOUNTS.BY_ID(discountId), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchDiscounts();
      setMessage("Discount deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error('Error deleting discount:', error);
      setMessage("Failed to delete discount");
    }
  };

  const toggleDiscountStatus = async (discountId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(API_ENDPOINTS.DISCOUNTS.TOGGLE_STATUS(discountId), {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchDiscounts();
    } catch (error) {
      console.error('Error toggling discount status:', error);
      setMessage("Failed to update discount status");
    }
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
                        maxLength={18}
                        required
                      />
                    </div>
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
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <div className="relative">
                      <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                        placeholder="e.g. 20% off for new students"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Valid From *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="datetime-local"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                          value={validFrom}
                          onChange={e => setValidFrom(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Valid Until *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="datetime-local"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                          value={validUntil}
                          onChange={e => setValidUntil(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Course (Optional)
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white appearance-none"
                        value={course}
                        onChange={e => setCourse(e.target.value)}
                      >
                        <option value="">Apply to all courses</option>
                        {courses.map(c => (
                          <option key={c._id} value={c._id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Creating...' : 'Create Discount Code'}
                  </button>
                  
                  {message && (
                    <div className={`p-4 rounded-xl text-center font-medium ${
                      message.includes('successfully') 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {message}
                    </div>
                  )}
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
                    {discounts.map((discount) => (
                      <div
                        key={discount._id}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-lg tracking-wider">
                                {discount.code}
                              </div>
                              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-lg">
                                {discount.value}% OFF
                              </div>
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                discount.isActive 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {discount.isActive ? 'Active' : 'Inactive'}
                              </div>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Description:</span> {discount.description}
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <BookOpen className="w-4 h-4" />
                                  <span className="font-medium">
                                    {discount.applicableToAll 
                                      ? "All Courses" 
                                      : discount.applicableCourses?.length > 0 
                                        ? courses.find(c => c._id === discount.applicableCourses[0])?.title || "Unknown Course"
                                        : "All Courses"
                                    }
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>Valid: {new Date(discount.validFrom).toLocaleDateString()} - {new Date(discount.validUntil).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                Used: {discount.usedCount || 0} times
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleDiscountStatus(discount._id)}
                              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                                discount.isActive
                                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                              title={discount.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {discount.isActive ? 'Deactivate' : 'Activate'}
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
