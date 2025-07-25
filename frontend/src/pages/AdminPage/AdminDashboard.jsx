import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Activity,
  UserPlus,
  Award,
  BarChart3,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "@/config/api";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        API_ENDPOINTS.PAYMENTS.ADMIN_ANALYTICS,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.success) {
        setAnalytics(response.data.analytics);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStats = () => {
    if (!analytics) return { instructors: 0, students: 0, courses: 0, revenue: 0 };
    
    const instructorCount = analytics.userStats?.find(stat => stat._id === 'instructor')?.count || 0;
    const studentCount = analytics.userStats?.find(stat => stat._id === 'student')?.count || 0;
    
    return {
      instructors: instructorCount,
      students: studentCount,
      courses: analytics.courseCount || 0,
      revenue: analytics.revenue?.adminRevenue || 0,
    };
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = getStats();
  const topCourses = analytics?.topCourses || [];
  const recentTransactions = analytics?.recentTransactions || [];

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-900 font-semibold">
                Total Instructors
              </CardTitle>
              <div className="bg-blue-500 p-2 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 mb-1">
              {stats.instructors}
            </div>
            <div className="flex items-center text-sm text-blue-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-900 font-semibold">
                Total Students
              </CardTitle>
              <div className="bg-green-500 p-2 rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 mb-1">
              {stats.students.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+24% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-purple-900 font-semibold">
                Total Courses
              </CardTitle>
              <div className="bg-purple-500 p-2 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 mb-1">
              {stats.courses}
            </div>
            <div className="flex items-center text-sm text-purple-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+8% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-orange-900 font-semibold">
                Total Revenue
              </CardTitle>
              <div className="bg-orange-500 p-2 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 mb-1">
              {formatCurrency(stats.revenue)}
            </div>
            <div className="flex items-center text-sm text-orange-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Admin Commission (10%)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Cards */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Top Performing Courses */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-blue-500" />
              Top Performing Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {topCourses.length > 0 ? (
                topCourses.map((course, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {course.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {course.enrollments} enrollments • {formatCurrency(course.adminRevenue)} earned
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      <span>{formatCurrency(course.totalRevenue)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No course data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-2xl">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-green-500" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {transaction.course?.title || 'Course Purchase'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {transaction.user?.name} • {formatCurrency(transaction.amount)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(transaction.createdAt)}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      +{formatCurrency(transaction.adminCommission)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No recent transactions
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Summary */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-500" />
              Revenue Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Total Revenue</div>
                  <div className="text-sm text-gray-600">All transactions</div>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(analytics?.revenue?.totalRevenue || 0)}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-green-900">Admin Commission</div>
                  <div className="text-sm text-green-600">10% of all sales</div>
                </div>
                <div className="text-lg font-bold text-green-900">
                  {formatCurrency(analytics?.revenue?.adminRevenue || 0)}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-blue-900">Instructor Earnings</div>
                  <div className="text-sm text-blue-600">90% of all sales</div>
                </div>
                <div className="text-lg font-bold text-blue-900">
                  {formatCurrency(analytics?.revenue?.instructorRevenue || 0)}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-orange-900">Total Transactions</div>
                  <div className="text-sm text-orange-600">Completed payments</div>
                </div>
                <div className="text-lg font-bold text-orange-900">
                  {analytics?.revenue?.totalTransactions || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
