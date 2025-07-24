const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const Discount = require('../models/Discount');

// Create a new payment (integrated with enrollment)
const createPayment = async (req, res) => {
  try {
    const {
      courseId,
      amount,
      originalAmount,
      discountCode,
      paymentMethod,
      transactionId,
      paymentGatewayResponse,
      currency = 'USD'
    } = req.body;

    // Verify course exists
    const course = await Course.findById(courseId).populate('instructor');
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user already enrolled in this course
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You have already purchased this course'
      });
    }

    let discountApplied = 0;
    let discountDetails = null;
    if (discountCode) {
      const discount = await Discount.findOne({ 
        code: discountCode.toUpperCase(),
        isActive: true 
      });
      
      if (discount && discount.isValid()) {
        discountApplied = discount.calculateDiscount(originalAmount);
        discountDetails = {
          code: discountCode,
          percentage: discount.type === 'percentage' ? discount.value : 0,
          amount: discountApplied
        };
        // Increment usage count
        discount.usedCount += 1;
        await discount.save();
      }
    }

    // Calculate admin commission (10%) and instructor earning (90%)
    const adminCommission = amount * 0.10;
    const instructorEarning = amount * 0.90;

    // Create enrollment with payment details
    const enrollment = new Enrollment({
      student: req.user.id,
      course: courseId,
      paymentDetails: {
        amount,
        currency,
        paymentMethod,
        transactionId,
        paymentStatus: 'completed',
        discountApplied: discountDetails
      }
    });

    await enrollment.save();

    // Update course enrollment count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrollmentCount: 1 }
    });

    // Update user enrolled courses
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        enrolledCourses: {
          course: courseId,
          enrolledAt: new Date()
        }
      }
    });

    // Update instructor revenue and student count
    await User.findByIdAndUpdate(course.instructor._id, {
      $inc: {
        'instructorProfile.totalRevenue': instructorEarning,
        'instructorProfile.totalStudents': 1
      }
    });

    // Populate the enrollment for response
    await enrollment.populate([
      { path: 'student', select: 'name email' },
      { path: 'course', select: 'title price instructor', populate: { path: 'instructor', select: 'name email' } }
    ]);

    // Create payment summary for response
    const paymentSummary = {
      _id: enrollment._id,
      user: enrollment.student,
      instructor: enrollment.course.instructor,
      course: enrollment.course,
      amount,
      originalAmount,
      discountApplied,
      discountCode: discountCode || null,
      paymentMethod,
      transactionId,
      paymentGatewayResponse,
      currency,
      paymentStatus: 'completed'
    };

    res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      payment: paymentSummary,
      enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: error.message
    });
  }
};

// Get all payments (admin only) - using enrollment data
const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate, search } = req.query;
    const query = {};

    if (status) {
      query['paymentDetails.paymentStatus'] = status;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const enrollments = await Enrollment.find(query)
      .populate('student', 'name email')
      .populate({
        path: 'course',
        select: 'title price instructor',
        populate: {
          path: 'instructor',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Transform enrollments to payment format
    const payments = enrollments.map(enrollment => {
      const adminCommission = enrollment.paymentDetails.amount * 0.10;
      const instructorEarning = enrollment.paymentDetails.amount * 0.90;
      
      return {
        _id: enrollment._id,
        user: enrollment.student,
        instructor: enrollment.course.instructor,
        course: {
          _id: enrollment.course._id,
          title: enrollment.course.title,
          price: enrollment.course.price
        },
        amount: enrollment.paymentDetails.amount,
        originalAmount: enrollment.paymentDetails.amount + (enrollment.paymentDetails.discountApplied?.amount || 0),
        discountApplied: enrollment.paymentDetails.discountApplied?.amount || 0,
        discountCode: enrollment.paymentDetails.discountApplied?.code || null,
        paymentMethod: enrollment.paymentDetails.paymentMethod,
        transactionId: enrollment.paymentDetails.transactionId,
        currency: enrollment.paymentDetails.currency,
        paymentStatus: enrollment.paymentDetails.paymentStatus,
        createdAt: enrollment.createdAt,
        updatedAt: enrollment.updatedAt
      };
    });

    const total = await Enrollment.countDocuments(query);

    res.json({
      success: true,
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message
    });
  }
};

// Get user's payment history - using enrollment data
const getUserPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: 'course',
        select: 'title price thumbnail instructor',
        populate: {
          path: 'instructor',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Transform enrollments to payment format
    const payments = enrollments.map(enrollment => ({
      _id: enrollment._id,
      course: {
        _id: enrollment.course._id,
        title: enrollment.course.title,
        price: enrollment.course.price,
        thumbnail: enrollment.course.thumbnail
      },
      instructor: enrollment.course.instructor,
      amount: enrollment.paymentDetails.amount,
      originalAmount: enrollment.paymentDetails.amount + (enrollment.paymentDetails.discountApplied?.amount || 0),
      discountApplied: enrollment.paymentDetails.discountApplied?.amount || 0,
      discountCode: enrollment.paymentDetails.discountApplied?.code || null,
      paymentMethod: enrollment.paymentDetails.paymentMethod,
      transactionId: enrollment.paymentDetails.transactionId,
      currency: enrollment.paymentDetails.currency,
      paymentStatus: enrollment.paymentDetails.paymentStatus,
      createdAt: enrollment.createdAt
    }));

    const total = await Enrollment.countDocuments({ student: req.user.id });

    res.json({
      success: true,
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history',
      error: error.message
    });
  }
};

// Get instructor's earnings - using enrollment data
const getInstructorEarnings = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    
    // Get instructor's courses
    const instructorCourses = await Course.find({ instructor: req.user.id }).select('_id');
    const courseIds = instructorCourses.map(course => course._id);
    
    const query = { 
      course: { $in: courseIds },
      'paymentDetails.paymentStatus': 'completed'
    };

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const enrollments = await Enrollment.find(query)
      .populate('student', 'name email')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Transform to payment format
    const payments = enrollments.map(enrollment => {
      const instructorEarning = enrollment.paymentDetails.amount * 0.90;
      return {
        _id: enrollment._id,
        user: enrollment.student,
        course: enrollment.course,
        amount: enrollment.paymentDetails.amount,
        originalAmount: enrollment.paymentDetails.amount + (enrollment.paymentDetails.discountApplied?.amount || 0),
        discountApplied: enrollment.paymentDetails.discountApplied?.amount || 0,
        instructorEarning,
        paymentMethod: enrollment.paymentDetails.paymentMethod,
        transactionId: enrollment.paymentDetails.transactionId,
        paymentStatus: enrollment.paymentDetails.paymentStatus,
        createdAt: enrollment.createdAt
      };
    });

    const total = await Enrollment.countDocuments(query);

    // Calculate total earnings
    const earningsStats = await Enrollment.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: { $multiply: ['$paymentDetails.amount', 0.90] } },
          totalSales: { $sum: '$paymentDetails.amount' },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    const stats = earningsStats[0] || {
      totalEarnings: 0,
      totalSales: 0,
      totalTransactions: 0
    };

    res.json({
      success: true,
      payments,
      stats,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching instructor earnings',
      error: error.message
    });
  }
};

// Get admin analytics - using enrollment data
const getAdminAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, period = 'month' } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    // Get revenue stats from enrollments
    const revenueStats = await Enrollment.aggregate([
      {
        $match: {
          'paymentDetails.paymentStatus': 'completed',
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$paymentDetails.amount' },
          adminRevenue: { $sum: { $multiply: ['$paymentDetails.amount', 0.10] } },
          instructorRevenue: { $sum: { $multiply: ['$paymentDetails.amount', 0.90] } },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    // Get monthly revenue for current year
    const monthlyRevenue = await Enrollment.aggregate([
      {
        $match: {
          'paymentDetails.paymentStatus': 'completed',
          createdAt: {
            $gte: new Date(new Date().getFullYear(), 0, 1),
            $lte: new Date(new Date().getFullYear(), 11, 31)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$paymentDetails.amount' },
          adminCommission: { $sum: { $multiply: ['$paymentDetails.amount', 0.10] } },
          transactions: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get top performing courses
    const topCourses = await Enrollment.aggregate([
      {
        $match: {
          'paymentDetails.paymentStatus': 'completed',
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$course',
          totalRevenue: { $sum: '$paymentDetails.amount' },
          adminRevenue: { $sum: { $multiply: ['$paymentDetails.amount', 0.10] } },
          enrollments: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      {
        $unwind: '$courseInfo'
      },
      {
        $project: {
          title: '$courseInfo.title',
          totalRevenue: 1,
          adminRevenue: 1,
          enrollments: 1
        }
      },
      {
        $sort: { totalRevenue: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Get recent transactions
    const recentTransactions = await Enrollment.find({
      'paymentDetails.paymentStatus': 'completed',
      createdAt: { $gte: start, $lte: end }
    })
    .populate('student', 'name email')
    .populate({
      path: 'course',
      select: 'title instructor',
      populate: {
        path: 'instructor',
        select: 'name'
      }
    })
    .sort({ createdAt: -1 })
    .limit(10);

    // Transform recent transactions to payment format
    const formattedTransactions = recentTransactions.map(enrollment => ({
      _id: enrollment._id,
      user: enrollment.student,
      course: {
        _id: enrollment.course._id,
        title: enrollment.course.title
      },
      instructor: enrollment.course.instructor,
      amount: enrollment.paymentDetails.amount,
      adminCommission: enrollment.paymentDetails.amount * 0.10,
      paymentMethod: enrollment.paymentDetails.paymentMethod,
      paymentStatus: enrollment.paymentDetails.paymentStatus,
      createdAt: enrollment.createdAt
    }));

    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const courseCount = await Course.countDocuments();

    res.json({
      success: true,
      analytics: {
        revenue: revenueStats[0] || {
          totalRevenue: 0,
          adminRevenue: 0,
          instructorRevenue: 0,
          totalTransactions: 0
        },
        monthlyRevenue,
        topCourses,
        recentTransactions: formattedTransactions,
        userStats,
        courseCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin analytics',
      error: error.message
    });
  }
};

// Process refund - using enrollment data
const processRefund = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { refundAmount, reason } = req.body;

    const enrollment = await Enrollment.findById(paymentId)
      .populate('student', 'name email')
      .populate({
        path: 'course',
        select: 'title instructor',
        populate: {
          path: 'instructor',
          select: 'name email'
        }
      });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (enrollment.paymentDetails.paymentStatus === 'refunded') {
      return res.status(400).json({
        success: false,
        message: 'Payment already refunded'
      });
    }

    const instructorEarning = enrollment.paymentDetails.amount * 0.90;

    // Update enrollment payment status
    enrollment.paymentDetails.paymentStatus = 'refunded';
    enrollment.notes = `Refunded: ${reason || 'Admin refund'} - Processed at ${new Date().toISOString()}`;
    
    await enrollment.save();

    // Reverse instructor revenue and student count
    await User.findByIdAndUpdate(enrollment.course.instructor._id, {
      $inc: {
        'instructorProfile.totalRevenue': -instructorEarning,
        'instructorProfile.totalStudents': -1
      }
    });

    // Update course enrollment count
    await Course.findByIdAndUpdate(enrollment.course._id, {
      $inc: { enrollmentCount: -1 }
    });

    // Remove from user's enrolled courses
    await User.findByIdAndUpdate(enrollment.student._id, {
      $pull: {
        enrolledCourses: { course: enrollment.course._id }
      }
    });

    res.json({
      success: true,
      message: 'Refund processed successfully',
      payment: {
        _id: enrollment._id,
        user: enrollment.student,
        course: enrollment.course,
        amount: enrollment.paymentDetails.amount,
        refundAmount: refundAmount || enrollment.paymentDetails.amount,
        reason,
        paymentStatus: 'refunded',
        processedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: error.message
    });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getUserPayments,
  getInstructorEarnings,
  getAdminAnalytics,
  processRefund
};