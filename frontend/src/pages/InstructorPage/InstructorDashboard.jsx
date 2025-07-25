import React, { useState, useEffect } from 'react';
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
} from "lucide-react";
import { instructorAPI } from '../../utils/apiClient';
import { toast } from 'react-hot-toast';

export default function InstructorDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    pendingCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    completionRate: 0
  });
  const [topCourses, setTopCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all dashboard data in parallel
      const [statsResponse, topCoursesResponse, activityResponse] = await Promise.all([
        instructorAPI.getDashboard(),
        instructorAPI.getTopCourses(),
        instructorAPI.getRecentActivity(5)
      ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      if (topCoursesResponse.data.success) {
        setTopCourses(topCoursesResponse.data.data);
      }

      if (activityResponse.data.success) {
        setRecentActivity(activityResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
     return (
       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
         <div className="max-w-7xl mx-auto">
           <div className="animate-pulse">
             <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="bg-white rounded-lg p-6">
                   <div className="h-4 bg-gray-300 rounded w-20 mb-4"></div>
                   <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
                   <div className="h-3 bg-gray-300 rounded w-24"></div>
                 </div>
               ))}
             </div>
           </div>
         </div>
       </div>
     );
   }



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
               {stats.totalStudents.toLocaleString()}
             </div>
            <div className="flex items-center text-sm text-green-600">
              <span>Enrolled students</span>
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
               {stats.totalCourses}
             </div>
            <div className="flex items-center text-sm text-purple-600">
              <span className="text-xs bg-purple-200 px-2 py-1 rounded">
                {stats.publishedCourses} published • {stats.pendingCourses} pending
              </span>
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
               ${stats.totalRevenue.toLocaleString()}
             </div>
            <div className="flex items-center text-sm text-orange-600">
              <span className="text-xs">
                ${stats.monthlyRevenue.toLocaleString()} this month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-900 font-semibold">
                Completion Rate
              </CardTitle>
              <div className="bg-blue-500 p-2 rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 mb-1">
               {stats.completionRate}%
             </div>
            <div className="flex items-center text-sm text-blue-600">
              <span>Course completion rate</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Cards */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
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
                    key={course._id || idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {course.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {course.enrollmentCount} students • ${course.revenue.toLocaleString()} revenue
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                      <span>★</span>
                      <span>{course.rating || 'N/A'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No courses published yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-2xl">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-green-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {activity.message}
                    </div>
                    <div className="text-sm text-gray-600">{activity.user.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}
