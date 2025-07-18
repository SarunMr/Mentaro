import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  BookOpen,
  Calendar,
  Filter,
  Eye,
  BarChart3,
} from "lucide-react";

function Revenue() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("all");

  // Mock data - replace with real data from your API
  const revenueStats = {
    totalRevenue: 45678,
    monthlyRevenue: 12450,
    weeklyRevenue: 3250,
    dailyRevenue: 520,
    growth: 18.5,
    totalCourses: 89,
    activeCourses: 76,
    totalStudents: 1247,
  };

  const revenueData = [
    { month: "Jan", revenue: 8500, courses: 12 },
    { month: "Feb", revenue: 9200, courses: 15 },
    { month: "Mar", revenue: 11800, courses: 18 },
    { month: "Apr", revenue: 10500, courses: 16 },
    { month: "May", revenue: 13200, courses: 22 },
    { month: "Jun", revenue: 12450, courses: 20 },
  ];

  const topCourses = [
    { name: "React for Beginners", revenue: 3450, students: 156, price: 49 },
    { name: "Advanced JavaScript", revenue: 2890, students: 134, price: 79 },
    {
      name: "UI/UX Design Masterclass",
      revenue: 2340,
      students: 98,
      price: 99,
    },
    { name: "Python Programming", revenue: 1980, students: 87, price: 69 },
    {
      name: "Web Development Bootcamp",
      revenue: 1650,
      students: 73,
      price: 89,
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      course: "React for Beginners",
      student: "John Doe",
      amount: 49,
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: 2,
      course: "Advanced JavaScript",
      student: "Jane Smith",
      amount: 79,
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: 3,
      course: "UI/UX Design",
      student: "Mike Johnson",
      amount: 99,
      date: "2024-01-14",
      status: "pending",
    },
    {
      id: 4,
      course: "Python Programming",
      student: "Sarah Wilson",
      amount: 69,
      date: "2024-01-14",
      status: "completed",
    },
    {
      id: 5,
      course: "Web Development",
      student: "Tom Brown",
      amount: 89,
      date: "2024-01-13",
      status: "completed",
    },
  ];

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
                <span className="text-sm font-medium">
                  +{revenueStats.growth}%
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
                {revenueStats.activeCourses} active
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {revenueStats.totalCourses}
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
              {revenueStats.totalStudents.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Revenue Trends
              </h3>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Monthly</span>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {revenueData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg mb-2 hover:from-green-600 hover:to-green-500 transition-colors cursor-pointer"
                    style={{
                      height: `${(data.revenue / 15000) * 100}%`,
                      minHeight: "20px",
                    }}
                    title={`${data.month}: ${formatCurrency(data.revenue)}`}
                  />
                  <span className="text-xs text-gray-600 font-medium">
                    {data.month}
                  </span>
                </div>
              ))}
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
              {topCourses.map((course, index) => (
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
                    <p className="text-sm text-gray-600">
                      {formatCurrency(course.price)}/course
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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
                {recentTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
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
                      <div className="text-gray-600">{transaction.date}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Revenue;
