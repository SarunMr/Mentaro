const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const mongoose = require('mongoose');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const approvedInstructors = await User.countDocuments({ 
      role: 'instructor', 
      'instructorProfile.isApproved': true 
    });
    const pendingInstructors = await User.countDocuments({ 
      role: 'instructor', 
      'instructorProfile.isApproved': false 
    });
    
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true, status: 'approved' });
    const pendingCourses = await Course.countDocuments({ status: 'pending' });
    const draftCourses = await Course.countDocuments({ status: 'draft' });
    
    const totalEnrollments = await Enrollment.countDocuments();
    const completedEnrollments = await Enrollment.countDocuments({ isCompleted: true });
    
    const totalRevenue = await Enrollment.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$paymentDetails.amount' }
        }
      }
    ]);
    
    const monthlyRevenue = await Enrollment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$paymentDetails.amount' }
        }
      }
    ]);
    
    const recentEnrollments = await Enrollment.find()
      .populate('student', 'firstName lastName email')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .limit(10);
    
    const topCourses = await Course.aggregate([
      { $match: { isPublished: true, status: 'approved' } },
      { $sort: { enrollmentCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: 'instructor',
          foreignField: '_id',
          as: 'instructor'
        }
      },
      { $unwind: '$instructor' },
      {
        $project: {
          title: 1,
          enrollmentCount: 1,
          'rating.average': 1,
          'instructor.firstName': 1,
          'instructor.lastName': 1
        }
      }
    ]);
    
    res.json({
      message: 'Dashboard stats retrieved successfully',
      stats: {
        users: {
          total: totalUsers,
          students: totalStudents,
          instructors: totalInstructors,
          approvedInstructors,
          pendingInstructors
        },
        courses: {
          total: totalCourses,
          published: publishedCourses,
          pending: pendingCourses,
          draft: draftCourses
        },
        enrollments: {
          total: totalEnrollments,
          completed: completedEnrollments,
          completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments * 100).toFixed(2) : 0
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          monthly: monthlyRevenue[0]?.total || 0
        }
      },
      recentEnrollments,
      topCourses
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error while retrieving dashboard stats' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search, isActive } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.json({
      message: 'Users retrieved successfully',
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalUsers: total
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error while retrieving users' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error while updating user status' });
  }
};

const getPendingInstructors = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const pendingInstructors = await User.find({
      role: 'instructor',
      'instructorProfile.isApproved': false
    })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments({
      role: 'instructor',
      'instructorProfile.isApproved': false
    });
    
    res.json({
      message: 'Pending instructors retrieved successfully',
      instructors: pendingInstructors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalInstructors: total
      }
    });
  } catch (error) {
    console.error('Get pending instructors error:', error);
    res.status(500).json({ message: 'Server error while retrieving pending instructors' });
  }
};

const approveInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    
    const instructor = await User.findOneAndUpdate(
      { _id: instructorId, role: 'instructor' },
      {
        'instructorProfile.isApproved': true,
        'instructorProfile.approvedAt': new Date()
      },
      { new: true }
    ).select('-password');
    
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    
    res.json({
      message: 'Instructor approved successfully',
      instructor
    });
  } catch (error) {
    console.error('Approve instructor error:', error);
    res.status(500).json({ message: 'Server error while approving instructor' });
  }
};

const rejectInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const { reason } = req.body;
    
    const instructor = await User.findById(instructorId);
    if (!instructor || instructor.role !== 'instructor') {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    
    instructor.role = 'student';
    instructor.instructorProfile = undefined;
    if (reason) {
      instructor.adminNotes = reason;
    }
    
    await instructor.save();
    
    res.json({
      message: 'Instructor application rejected',
      instructor: instructor.getPublicProfile()
    });
  } catch (error) {
    console.error('Reject instructor error:', error);
    res.status(500).json({ message: 'Server error while rejecting instructor' });
  }
};

const getPendingCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const pendingCourses = await Course.find({ status: 'pending' })
      .populate('instructor', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Course.countDocuments({ status: 'pending' });
    
    res.json({
      message: 'Pending courses retrieved successfully',
      courses: pendingCourses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalCourses: total
      }
    });
  } catch (error) {
    console.error('Get pending courses error:', error);
    res.status(500).json({ message: 'Server error while retrieving pending courses' });
  }
};

const approveCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        status: 'approved',
        isPublished: true,
        publishedAt: new Date()
      },
      { new: true }
    ).populate('instructor', 'firstName lastName');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    await User.findByIdAndUpdate(course.instructor._id, {
      $inc: { 'instructorProfile.totalCourses': 1 }
    });
    
    res.json({
      message: 'Course approved successfully',
      course
    });
  } catch (error) {
    console.error('Approve course error:', error);
    res.status(500).json({ message: 'Server error while approving course' });
  }
};

const rejectCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { reason } = req.body;
    
    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        status: 'rejected',
        adminNotes: reason || 'Course rejected by admin'
      },
      { new: true }
    ).populate('instructor', 'firstName lastName');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json({
      message: 'Course rejected successfully',
      course
    });
  } catch (error) {
    console.error('Reject course error:', error);
    res.status(500).json({ message: 'Server error while rejecting course' });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, instructor, category } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (instructor) query.instructor = instructor;
    if (category) query.category = category;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const courses = await Course.find(query)
      .populate('instructor', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Course.countDocuments(query);
    
    res.json({
      message: 'Courses retrieved successfully',
      courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalCourses: total
      }
    });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({ message: 'Server error while retrieving courses' });
  }
};

const getRevenueStats = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    
    let groupBy;
    let dateRange;
    
    const now = new Date();
    
    switch (period) {
      case 'daily':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        dateRange = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'yearly':
        groupBy = { year: { $year: '$createdAt' } };
        dateRange = new Date(now.getFullYear() - 5, 0, 1);
        break;
      default:
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        dateRange = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    }
    
    const revenueData = await Enrollment.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange },
          'paymentDetails.paymentStatus': 'completed'
        }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$paymentDetails.amount' },
          enrollments: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);
    
    const topInstructors = await Enrollment.aggregate([
      {
        $match: {
          'paymentDetails.paymentStatus': 'completed'
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'course'
        }
      },
      { $unwind: '$course' },
      {
        $group: {
          _id: '$course.instructor',
          revenue: { $sum: '$paymentDetails.amount' },
          enrollments: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'instructor'
        }
      },
      { $unwind: '$instructor' },
      {
        $project: {
          'instructor.firstName': 1,
          'instructor.lastName': 1,
          'instructor.email': 1,
          revenue: 1,
          enrollments: 1
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      message: 'Revenue stats retrieved successfully',
      revenueData,
      topInstructors
    });
  } catch (error) {
    console.error('Get revenue stats error:', error);
    res.status(500).json({ message: 'Server error while retrieving revenue stats' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email } = req.body;
    
    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }
    
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error while updating user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deletion of admin users
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }
    
    await User.findByIdAndDelete(userId);
    
    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    const admin = new User({
      firstName,
      lastName,
      email,
      password,
      role: 'admin',
      isEmailVerified: true
    });
    
    await admin.save();
    
    const adminResponse = admin.getPublicProfile();
    
    res.status(201).json({
      message: 'Admin created successfully',
      admin: adminResponse
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error while creating admin' });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  updateUser,
  deleteUser,
  getPendingInstructors,
  approveInstructor,
  rejectInstructor,
  getPendingCourses,
  approveCourse,
  rejectCourse,
  getAllCourses,
  getRevenueStats,
  createAdmin
};