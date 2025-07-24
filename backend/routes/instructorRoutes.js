const express = require('express');
const router = express.Router();
const { auth, authorizeInstructor } = require('../middleware/auth');
const {
  validateObjectId,
  validatePagination,
  handleValidationErrors
} = require('../middleware/validation');
const { body } = require('express-validator');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Discount = require('../models/Discount');

router.use(auth);
router.use(authorizeInstructor);

router.get('/dashboard/stats', async (req, res) => {
  try {
    const instructorId = req.user.id;

    const totalCourses = await Course.countDocuments({ instructor: instructorId });
    const publishedCourses = await Course.countDocuments({ 
      instructor: instructorId, 
      status: 'published' 
    });
    const pendingCourses = await Course.countDocuments({ 
      instructor: instructorId, 
      status: 'pending' 
    });

    const enrollments = await Enrollment.find({
      course: { $in: await Course.find({ instructor: instructorId }).select('_id') }
    });

    const totalStudents = enrollments.length;
    const totalRevenue = enrollments.reduce((sum, enrollment) => 
      sum + enrollment.paymentDetails.amount, 0
    );

    const completedCourses = enrollments.filter(e => e.isCompleted).length;
    const completionRate = totalStudents > 0 ? (completedCourses / totalStudents * 100).toFixed(2) : 0;

    const monthlyRevenue = await Enrollment.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      {
        $match: {
          'courseInfo.instructor': req.user._id,
          enrolledAt: {
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

    res.json({
      success: true,
      data: {
        totalCourses,
        publishedCourses,
        pendingCourses,
        totalStudents,
        totalRevenue,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        completionRate: parseFloat(completionRate)
      }
    });
  } catch (error) {
    console.error('Get instructor dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/students', validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const instructorCourses = await Course.find({ instructor: req.user.id }).select('_id');
    const courseIds = instructorCourses.map(course => course._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate('student', 'firstName lastName email avatar')
      .populate('course', 'title')
      .sort({ enrolledAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalStudents = await Enrollment.countDocuments({ course: { $in: courseIds } });
    const totalPages = Math.ceil(totalStudents / limit);

    res.json({
      success: true,
      data: {
        enrollments,
        pagination: {
          currentPage: page,
          totalPages,
          totalStudents,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get instructor students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/revenue/monthly', async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    const monthlyRevenue = await Enrollment.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      {
        $match: {
          'courseInfo.instructor': req.user._id,
          enrolledAt: {
            $gte: new Date(targetYear, 0, 1),
            $lt: new Date(targetYear + 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$enrolledAt' },
          revenue: { $sum: '$paymentDetails.amount' },
          enrollments: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    const months = Array.from({ length: 12 }, (_, i) => {
      const monthData = monthlyRevenue.find(item => item._id === i + 1);
      return {
        month: i + 1,
        revenue: monthData?.revenue || 0,
        enrollments: monthData?.enrollments || 0
      };
    });

    res.json({
      success: true,
      data: {
        year: targetYear,
        months
      }
    });
  } catch (error) {
    console.error('Get monthly revenue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/top-courses', async (req, res) => {
  try {
    const instructorId = req.user.id;
    
    const topCourses = await Course.aggregate([
      { $match: { instructor: req.user._id, status: 'published' } },
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'course',
          as: 'enrollments'
        }
      },
      {
        $addFields: {
          enrollmentCount: { $size: '$enrollments' },
          revenue: {
            $sum: '$enrollments.paymentDetails.amount'
          }
        }
      },
      {
        $sort: { enrollmentCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          title: 1,
          thumbnail: 1,
          enrollmentCount: 1,
          revenue: 1,
          rating: 1,
          price: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: topCourses
    });
  } catch (error) {
    console.error('Get top courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/recent-activity', async (req, res) => {
  try {
    const instructorId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    
    const instructorCourses = await Course.find({ instructor: instructorId }).select('_id title');
    const courseIds = instructorCourses.map(course => course._id);
    
    const recentEnrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate('student', 'firstName lastName avatar')
      .populate('course', 'title')
      .sort({ enrolledAt: -1 })
      .limit(limit);
    
    const activities = recentEnrollments.map(enrollment => ({
      type: 'enrollment',
      message: `${enrollment.student.firstName} ${enrollment.student.lastName} enrolled in ${enrollment.course.title}`,
      timestamp: enrollment.enrolledAt,
      user: {
        name: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
        avatar: enrollment.student.avatar
      },
      course: enrollment.course.title
    }));

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/recent-transactions', async (req, res) => {
  try {
    const instructorId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    
    const instructorCourses = await Course.find({ instructor: instructorId }).select('_id title');
    const courseIds = instructorCourses.map(course => course._id);
    
    const recentTransactions = await Enrollment.find({ course: { $in: courseIds } })
      .populate('student', 'firstName lastName email avatar')
      .populate('course', 'title price')
      .sort({ enrolledAt: -1 })
      .limit(limit)
      .select('enrolledAt paymentDetails student course');
    
    const transactions = recentTransactions.map(enrollment => ({
      id: enrollment._id,
      course: enrollment.course.title,
      student: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
      amount: enrollment.paymentDetails.amount,
      date: enrollment.enrolledAt,
      status: enrollment.paymentDetails.paymentStatus || 'completed',
      paymentMethod: enrollment.paymentDetails.paymentMethod
    }));

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Get recent transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.put('/profile', [
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Bio cannot exceed 1000 characters'),
  body('expertise')
    .optional()
    .isArray()
    .withMessage('Expertise must be an array'),
  body('expertise.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each expertise item must be between 2 and 50 characters'),
  body('socialLinks.website')
    .optional()
    .isURL()
    .withMessage('Website must be a valid URL'),
  body('socialLinks.linkedin')
    .optional()
    .isURL()
    .withMessage('LinkedIn must be a valid URL'),
  body('socialLinks.twitter')
    .optional()
    .isURL()
    .withMessage('Twitter must be a valid URL'),
  body('socialLinks.youtube')
    .optional()
    .isURL()
    .withMessage('YouTube must be a valid URL'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { bio, expertise, socialLinks } = req.body;
    
    const updateData = {};
    if (bio !== undefined) updateData['instructorProfile.bio'] = bio;
    if (expertise !== undefined) updateData['instructorProfile.expertise'] = expertise;
    if (socialLinks !== undefined) updateData['instructorProfile.socialLinks'] = socialLinks;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update instructor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Discount management routes for instructors
router.post('/discounts', [
  body('code')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Discount code must be between 3 and 20 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Discount code must contain only uppercase letters and numbers'),
  body('description')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Description must be between 5 and 200 characters'),
  body('type')
    .isIn(['percentage', 'fixed'])
    .withMessage('Type must be either percentage or fixed'),
  body('value')
    .isFloat({ min: 1, max: 100 })
    .withMessage('Value must be between 1 and 100'),
  body('validFrom')
    .isISO8601()
    .withMessage('Valid from date must be a valid date'),
  body('validUntil')
    .isISO8601()
    .withMessage('Valid until date must be a valid date'),
  body('applicableCourses')
    .optional()
    .isArray()
    .withMessage('Applicable courses must be an array'),
  handleValidationErrors
], async (req, res) => {
  try {
    const {
      code,
      description,
      type,
      value,
      validFrom,
      validUntil,
      applicableCourses,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      applicableToAll
    } = req.body;

    // Check if discount code already exists
    const existingDiscount = await Discount.findOne({ code: code.toUpperCase() });
    if (existingDiscount) {
      return res.status(400).json({
        success: false,
        message: 'Discount code already exists'
      });
    }

    // If specific courses are selected, verify they belong to the instructor
    if (applicableCourses && applicableCourses.length > 0) {
      const instructorCourses = await Course.find({
        _id: { $in: applicableCourses },
        instructor: req.user.id
      });
      
      if (instructorCourses.length !== applicableCourses.length) {
        return res.status(403).json({
          success: false,
          message: 'You can only create discounts for your own courses'
        });
      }
    }

    const discount = new Discount({
      code: code.toUpperCase(),
      description,
      type,
      value,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      applicableCourses: applicableCourses || [],
      applicableToAll: applicableToAll || false,
      minOrderAmount: minOrderAmount || 0,
      maxDiscountAmount: maxDiscountAmount || null,
      usageLimit: usageLimit || null,
      createdBy: req.user.id,
      createdByRole: 'instructor'
    });

    await discount.save();

    res.status(201).json({
      success: true,
      message: 'Discount created successfully',
      data: discount
    });
  } catch (error) {
    console.error('Create instructor discount error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating discount'
    });
  }
});

router.get('/discounts', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const skip = (page - 1) * limit;

    // Get instructor's courses to filter discounts
    const instructorCourses = await Course.find({ instructor: req.user.id }).select('_id');
    const courseIds = instructorCourses.map(course => course._id);

    let query = {
      $or: [
        { createdBy: req.user.id, createdByRole: 'instructor' },
        { applicableToAll: true },
        { applicableCourses: { $in: courseIds } }
      ]
    };

    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { code: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }

    if (status) {
      query.isActive = status === 'active';
    }

    const discounts = await Discount.find(query)
      .populate('applicableCourses', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Discount.countDocuments(query);

    res.json({
      success: true,
      data: {
        discounts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get instructor discounts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching discounts'
    });
  }
});

router.get('/discounts/:id', validateObjectId('id'), async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id)
      .populate('applicableCourses', 'title');

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    // Check if instructor has access to this discount
    const instructorCourses = await Course.find({ instructor: req.user.id }).select('_id');
    const courseIds = instructorCourses.map(course => course._id.toString());
    
    const hasAccess = 
      discount.createdBy?.toString() === req.user.id ||
      discount.applicableToAll ||
      discount.applicableCourses.some(course => courseIds.includes(course._id.toString()));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: discount
    });
  } catch (error) {
    console.error('Get instructor discount error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching discount'
    });
  }
});

router.put('/discounts/:id', [
  validateObjectId('id'),
  body('code')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Discount code must be between 3 and 20 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Discount code must contain only uppercase letters and numbers'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Description must be between 5 and 200 characters'),
  body('type')
    .optional()
    .isIn(['percentage', 'fixed'])
    .withMessage('Type must be either percentage or fixed'),
  body('value')
    .optional()
    .isFloat({ min: 1, max: 100 })
    .withMessage('Value must be between 1 and 100'),
  handleValidationErrors
], async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    // Only allow instructors to update their own discounts
    if (discount.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own discounts'
      });
    }

    // If updating applicable courses, verify they belong to the instructor
    if (req.body.applicableCourses && req.body.applicableCourses.length > 0) {
      const instructorCourses = await Course.find({
        _id: { $in: req.body.applicableCourses },
        instructor: req.user.id
      });
      
      if (instructorCourses.length !== req.body.applicableCourses.length) {
        return res.status(403).json({
          success: false,
          message: 'You can only assign discounts to your own courses'
        });
      }
    }

    const updatedDiscount = await Discount.findByIdAndUpdate(
      req.params.id,
      { ...req.body, code: req.body.code?.toUpperCase() },
      { new: true, runValidators: true }
    ).populate('applicableCourses', 'title');

    res.json({
      success: true,
      message: 'Discount updated successfully',
      data: updatedDiscount
    });
  } catch (error) {
    console.error('Update instructor discount error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating discount'
    });
  }
});

router.delete('/discounts/:id', validateObjectId('id'), async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    // Only allow instructors to delete their own discounts
    if (discount.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own discounts'
      });
    }

    await Discount.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Discount deleted successfully'
    });
  } catch (error) {
    console.error('Delete instructor discount error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting discount'
    });
  }
});

router.patch('/discounts/:id/toggle-status', validateObjectId('id'), async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    // Only allow instructors to toggle their own discounts
    if (discount.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only toggle your own discounts'
      });
    }

    discount.isActive = !discount.isActive;
    await discount.save();

    res.json({
      success: true,
      message: `Discount ${discount.isActive ? 'activated' : 'deactivated'} successfully`,
      data: discount
    });
  } catch (error) {
    console.error('Toggle instructor discount status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling discount status'
    });
  }
});

module.exports = router;