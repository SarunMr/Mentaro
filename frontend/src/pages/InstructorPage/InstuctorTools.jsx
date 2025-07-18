import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Tag, Calendar, Percent, BookOpen } from "lucide-react";

export default function Tools() {
  const [discounts, setDiscounts] = useState([]);
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState("");
  const [course, setCourse] = useState("");
  const [message, setMessage] = useState("");

  // Example: Pretend you have these courses — replace with actual API
  const courses = [
    { id: "1", title: "React for Beginners" },
    { id: "2", title: "Design Fundamentals" },
    { id: "3", title: "Advanced JavaScript" },
    { id: "4", title: "UI/UX Design Masterclass" },
  ];

  function handleCreateDiscount(e) {
    e.preventDefault();
    if (!code || !amount || !course) {
      setMessage("Please fill all fields.");
      return;
    }
    setDiscounts([
      ...discounts,
      {
        code: code.trim(),
        amount: Number(amount),
        courseId: course,
        courseTitle: courses.find(c => c.id === course)?.title || "",
        created: new Date().toLocaleString(),
      },
    ]);
    setCode("");
    setAmount("");
    setCourse("");
    setMessage("Discount created successfully!");
    setTimeout(() => setMessage(""), 3000);
  }

  function handleDeleteDiscount(idx) {
    setDiscounts(discounts.filter((_, i) => i !== idx));
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
                      Discount Code
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                        placeholder="e.g. SUMMER25"
                        value={code}
                        onChange={e => setCode(e.target.value.toUpperCase())}
                        maxLength={18}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Discount Amount (%)
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
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Course
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white appearance-none"
                        value={course}
                        onChange={e => setCourse(e.target.value)}
                      >
                        <option value="">Choose a course</option>
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Create Discount Code
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
                    {discounts.map((discount, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-lg tracking-wider">
                                {discount.code}
                              </div>
                              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-lg">
                                {discount.amount}% OFF
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                <span className="font-medium">{discount.courseTitle}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Created: {discount.created}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteDiscount(idx)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-3 rounded-xl transition-colors group"
                            title="Delete discount"
                          >
                            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          </button>
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
