import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Users,
  BookOpen,
  Calendar,
  Filter,
  Eye,
  BarChart3
} from 'lucide-react';
import { instructorAPI } from '../../utils/apiClient';

function InstructorRevenue() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for real data
  const [dashboardStats, setDashboardStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all required data
        const [dashboardResponse, revenueResponse, topCoursesResponse, transactionsResponse] = await Promise.all([
          instructorAPI.getDashboard(),
          instructorAPI.getRevenue(),
          instructorAPI.getTopCourses(),
          instructorAPI.getRecentTransactions(10)
        ]);
        
        setDashboardStats(dashboardResponse.data.data);
        
        // Transform revenue data for chart
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const transformedRevenueData = revenueResponse.data.data.months.map(monthData => ({
          month: monthNames[monthData.month - 1],
          revenue: monthData.revenue,
          courses: monthData.enrollments
        }));
        setRevenueData(transformedRevenueData);
        
        // Transform top courses data
        const transformedTopCourses = topCoursesResponse.data.data.map(course => ({
          name: course.title,
          revenue: course.revenue || 0,
          students: course.enrollmentCount || 0,
          price: course.price || 0
        }));
        setTopCourses(transformedTopCourses);
        
        setRecentTransactions(transactionsResponse.data.data);
        
      } catch (err) {
        console.error('Error fetching instructor revenue data:', err);
        setError('Failed to load revenue data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
              <p className="text-gray-600 mt-1">Track your earnings and financial performance</p>
            </div>
          </div>
          
        </div>

        {/* Revenue Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Total</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(dashboardStats?.totalRevenue || 0)}
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
                <span className="text-sm font-medium">Current</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(dashboardStats?.monthlyRevenue || 0)}
            </div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-sm text-gray-600">
                {dashboardStats?.publishedCourses || 0} published
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {dashboardStats?.totalCourses || 0}
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
                <span className="text-sm font-medium">{dashboardStats?.completionRate || 0}%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {(dashboardStats?.totalStudents || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Revenue Trends</h3>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Monthly</span>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {revenueData && revenueData.length > 0 ? (
                revenueData.map((data, index) => {
                  const maxRevenue = Math.max(...revenueData.map(d => d.revenue || 0));
                  const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg mb-2 hover:from-green-600 hover:to-green-500 transition-colors cursor-pointer"
                        style={{ height: `${height}%`, minHeight: '20px' }}
                        title={`${data.month}: ${formatCurrency(data.revenue || 0)}`}
                      />
                      <span className="text-xs text-gray-600 font-medium">{data.month}</span>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No revenue data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top Performing Courses */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Top Performing Courses</h3>
              <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {topCourses && topCourses.length > 0 ? (
                topCourses.map((course, index) => (
                  <div key={course._id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{course.title || course.name}</h4>
                        <p className="text-sm text-gray-600">{course.enrollmentCount || course.students} students</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{formatCurrency(course.totalRevenue || course.revenue || 0)}</div>
                      <div className="text-sm text-gray-600">{course.enrollmentCount || course.students} enrollments</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No course data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
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
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 font-medium text-gray-700">Course</th>
                  <th className="text-left p-4 font-medium text-gray-700">Student</th>
                  <th className="text-left p-4 font-medium text-gray-700">Amount</th>
                  <th className="text-left p-4 font-medium text-gray-700">Date</th>
                  <th className="text-left p-4 font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions && recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <tr key={transaction._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{transaction.course}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-900">{transaction.student}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{formatCurrency(transaction.amount)}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-600">{formatDate(transaction.date)}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
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
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No recent transactions</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorRevenue;
