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

export default function InstructorDashboard() {
  // Mock data - replace with real data from your API
  const stats = {
    instructors: 24,
    students: 1247,
    courses: 89,
    revenue: 45600,
  };

  const topCourses = [
    { name: "React for Beginners", students: 156, rating: 4.8 },
    { name: "Advanced JavaScript", students: 134, rating: 4.9 },
    { name: "UI/UX Design", students: 98, rating: 4.7 },
  ];

  const recentActivity = [
    { action: "New course published", time: "2 hours ago", user: "John Doe" },
    { action: "Student enrolled", time: "4 hours ago", user: "Jane Smith" },
    { action: "Course completed", time: "6 hours ago", user: "Mike Johnson" },
  ];

  const recentUsers = [
    { name: "Alice Wilson", role: "Student", joined: "Today" },
    { name: "Bob Brown", role: "Instructor", joined: "Yesterday" },
    { name: "Carol Davis", role: "Student", joined: "2 days ago" },
  ];

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
              ${stats.revenue.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-orange-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+18% from last month</span>
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
              {topCourses.map((course, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {course.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {course.students} students
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                    <span>★</span>
                    <span>{course.rating}</span>
                  </div>
                </div>
              ))}
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
              {recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {activity.action}
                    </div>
                    <div className="text-sm text-gray-600">{activity.user}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-purple-500" />
              Recent Users
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentUsers.map((user, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.role}</div>
                  </div>
                  <div className="text-xs text-gray-500">{user.joined}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
