import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  BookOpen,
  Calendar,
  Filter,
  Eye,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";
import axios from "axios";

function Revenue() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    adminRevenue: 0,
    totalTransactions: 0,
    totalCourses: 0,
    totalStudents: 0,
  });
  
  const [revenueData, setRevenueData] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const [analyticsResponse, revenueStatsResponse] = await Promise.all([
        axios.get(API_ENDPOINTS.PAYMENTS.ADMIN_ANALYTICS, {
          headers: { Authorization: `Bearer ${token}` },
          params: { period: selectedPeriod }
        }),
        axios.get(API_ENDPOINTS.ADMIN.REVENUE_STATS, {
          headers: { Authorization: `Bearer ${token}` },
          params: { period: selectedPeriod }
        })
      ]);
      
      const analytics = analyticsResponse.data.analytics;
      const revenueStatsData = revenueStatsResponse.data;
      
      setRevenueStats({
        totalRevenue: analytics.revenue.totalRevenue || 0,
        monthlyRevenue: analytics.monthlyRevenue?.reduce((sum, month) => sum + month.revenue, 0) || 0,
        adminRevenue: analytics.revenue.adminRevenue || 0,
        totalTransactions: analytics.revenue.totalTransactions || 0,
        totalCourses: analytics.courseCount || 0,
        totalStudents: analytics.userStats?.find(stat => stat._id === 'student')?.count || 0,
      });
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formattedRevenueData = analytics.monthlyRevenue?.map(item => ({
        month: monthNames[item._id.month - 1],
        revenue: item.revenue,
        courses: item.transactions
      })) || [];
      setRevenueData(formattedRevenueData);
      
      setTopCourses(analytics.topCourses?.map(course => ({
        name: course.title,
        revenue: course.totalRevenue,
        students: course.enrollments,
        price: Math.round(course.totalRevenue / course.enrollments) || 0
      })) || []);
      
      setRecentTransactions(analytics.recentTransactions?.map(transaction => ({
        id: transaction._id,
        course: transaction.course?.title || 'N/A',
        student: `${transaction.user?.firstName || ''} ${transaction.user?.lastName || ''}`.trim() || 'Unknown',
        amount: transaction.amount,
        adminCommission: transaction.adminCommission,
        date: new Date(transaction.createdAt).toLocaleDateString(),
        status: transaction.paymentStatus
      })) || []);
      
    } catch (err) {
      console.error('Error fetching revenue data:', err);
      setError(err.response?.data?.message || 'Failed to fetch revenue data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [selectedPeriod]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-3 shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Revenue Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Track your earnings and financial performance
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button
              onClick={fetchRevenueData}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
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
                onClick={fetchRevenueData}
                className="ml-auto px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Revenue Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gray-200 p-3 rounded-xl w-12 h-12"></div>
                  <div className="bg-gray-200 px-2 py-1 rounded-full w-16 h-6"></div>
                </div>
                <div className="bg-gray-200 h-8 rounded mb-1"></div>
                <div className="bg-gray-200 h-4 rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    +{revenueStats.growth || 0}%
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(revenueStats.totalRevenue)}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+12.3%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(revenueStats.monthlyRevenue)}
              </div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-sm text-gray-600">
                  {revenueStats.activeCourses || 0} active
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {revenueStats.totalCourses || 0}
              </div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex items-center gap-1 text-orange-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+8.1%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {(revenueStats.totalStudents || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
          </div>
        )}

        {/* Admin Commission Analytics */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-500" />
              Admin Commission Analytics
            </h3>
            <p className="text-gray-600 mt-1">Detailed breakdown of platform commission earnings (10% of all sales)</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-green-700 bg-green-200 px-2 py-1 rounded-full">
                    10% Rate
                  </span>
                </div>
                <div className="text-2xl font-bold text-green-900 mb-1">
                  {formatCurrency(revenueStats.totalRevenue * 0.1)}
                </div>
                <div className="text-sm text-green-700">Total Commission Earned</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-blue-700 bg-blue-200 px-2 py-1 rounded-full">
                    This Month
                  </span>
                </div>
                <div className="text-2xl font-bold text-blue-900 mb-1">
                  {formatCurrency(revenueStats.monthlyRevenue * 0.1)}
                </div>
                <div className="text-sm text-blue-700">Monthly Commission</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-purple-500 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-purple-700 bg-purple-200 px-2 py-1 rounded-full">
                    Avg/Transaction
                  </span>
                </div>
                <div className="text-2xl font-bold text-purple-900 mb-1">
                  {formatCurrency(revenueStats.totalTransactions > 0 ? (revenueStats.totalRevenue * 0.1) / revenueStats.totalTransactions : 0)}
                </div>
                <div className="text-sm text-purple-700">Average Commission</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-orange-500 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-orange-700 bg-orange-200 px-2 py-1 rounded-full">
                    Transactions
                  </span>
                </div>
                <div className="text-2xl font-bold text-orange-900 mb-1">
                  {revenueStats.totalTransactions || 0}
                </div>
                <div className="text-sm text-orange-700">Total Transactions</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                  Commission Breakdown
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Platform Commission (10%)</span>
                    </div>
                    <span className="font-semibold text-green-600">{formatCurrency(revenueStats.totalRevenue * 0.1)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Instructor Earnings (90%)</span>
                    </div>
                    <span className="font-semibold text-blue-600">{formatCurrency(revenueStats.totalRevenue * 0.9)}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span className="text-gray-900">Total Revenue</span>
                      <span className="text-gray-900">{formatCurrency(revenueStats.totalRevenue)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gray-600" />
                  Top Commission Sources
                </h4>
                <div className="space-y-3">
                  {topCourses.slice(0, 4).map((course, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm truncate">{course.name}</p>
                          <p className="text-xs text-gray-500">{course.students} students</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600 text-sm">
                          {formatCurrency(course.revenue * 0.1)}
                        </p>
                        <p className="text-xs text-gray-500">
                          from {formatCurrency(course.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {topCourses.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No commission data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart Loading */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gray-200 h-6 w-32 rounded"></div>
                <div className="bg-gray-200 h-4 w-20 rounded"></div>
              </div>
              <div className="bg-gray-200 h-64 rounded"></div>
            </div>

            {/* Top Courses Loading */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
              <div className="bg-gray-200 h-6 w-48 rounded mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="bg-gray-200 w-10 h-10 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="bg-gray-200 h-4 w-32 rounded mb-2"></div>
                      <div className="bg-gray-200 h-3 w-20 rounded"></div>
                    </div>
                    <div className="text-right">
                      <div className="bg-gray-200 h-4 w-16 rounded mb-1"></div>
                      <div className="bg-gray-200 h-3 w-12 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Admin Commission Analytics */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-green-500" />
                  Admin Commission Analytics
                </h3>
                <div className="text-sm text-gray-600">
                  10% Platform Commission
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-green-500 p-2 rounded-lg">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-green-700 bg-green-200 px-2 py-1 rounded-full">
                      Total
                    </span>
                  </div>
                  <div className="text-xl font-bold text-green-900 mb-1">
                    {formatCurrency(revenueStats.totalRevenue * 0.1)}
                  </div>
                  <div className="text-sm text-green-700">Total Commission</div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-blue-700 bg-blue-200 px-2 py-1 rounded-full">
                      Monthly
                    </span>
                  </div>
                  <div className="text-xl font-bold text-blue-900 mb-1">
                    {formatCurrency(revenueStats.monthlyRevenue * 0.1)}
                  </div>
                  <div className="text-sm text-blue-700">This Month</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-purple-500 p-2 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-purple-700 bg-purple-200 px-2 py-1 rounded-full">
                      Avg
                    </span>
                  </div>
                  <div className="text-xl font-bold text-purple-900 mb-1">
                    {formatCurrency(revenueStats.totalTransactions > 0 ? (revenueStats.totalRevenue * 0.1) / revenueStats.totalTransactions : 0)}
                  </div>
                  <div className="text-sm text-purple-700">Per Transaction</div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Commission Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Platform Commission (10%)</span>
                    <span className="font-medium text-green-600">{formatCurrency(revenueStats.totalRevenue * 0.1)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Instructor Earnings (90%)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(revenueStats.totalRevenue * 0.9)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center font-semibold">
                      <span className="text-gray-900">Total Revenue</span>
                      <span className="text-gray-900">{formatCurrency(revenueStats.totalRevenue)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performing Courses */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Top Performing Courses
                </h3>
                <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {topCourses.length > 0 ? (
                  topCourses.map((course, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 font-bold text-sm">
                            #{index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{course.name}</p>
                          <p className="text-sm text-gray-600">
                            {course.students} students
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {formatCurrency(course.revenue)}
                        </p>
                        <p className="text-sm text-green-600">
                          Commission: {formatCurrency(course.revenue * 0.1)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No course data available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Recent Transactions
              </h3>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                  View All
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="animate-pulse">
                <div className="flex border-b border-gray-100 pb-3 mb-4">
                  {['Course', 'Student', 'Amount', 'Admin Commission', 'Date', 'Status', 'Actions'].map((header, index) => (
                    <div key={index} className="flex-1 p-4">
                      <div className="bg-gray-200 h-4 w-20 rounded"></div>
                    </div>
                  ))}
                </div>
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex border-b border-gray-50 py-4">
                    <div className="flex-1 p-4">
                      <div className="bg-gray-200 h-4 w-32 rounded"></div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="bg-gray-200 h-4 w-24 rounded"></div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="bg-gray-200 h-4 w-16 rounded"></div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="bg-gray-200 h-4 w-16 rounded"></div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="bg-gray-200 h-4 w-20 rounded"></div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="bg-gray-200 h-6 w-16 rounded-full"></div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="bg-gray-200 h-8 w-8 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left p-4 font-medium text-gray-700">
                      Course
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700">
                      Student
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700">
                      Amount
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700">
                      Admin Commission
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700">
                      Date
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700">
                      Status
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction, index) => (
                      <tr
                        key={transaction.id || index}
                        className="border-b border-gray-50 hover:bg-gray-50"
                      >
                        <td className="p-4">
                          <div className="font-medium text-gray-900">
                            {transaction.course}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-gray-900">{transaction.student}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-gray-900">
                            {formatCurrency(transaction.amount)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-green-600">
                            {formatCurrency(transaction.adminCommission || transaction.amount * 0.1)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-gray-600">{transaction.date}</div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              transaction.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : transaction.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-gray-500">
                        No transactions available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Revenue;
