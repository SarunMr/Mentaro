const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  validateObjectId,
  validatePagination,
  handleValidationErrors
} = require('../middleware/validation');
const { body } = require('express-validator');
const User = require('../models/User');
const Course = require('../models/Course');

router.get('/wishlist', auth, authorize('student'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'wishlist',
        select: 'title description price thumbnail instructor category level rating totalStudents',
        populate: {
          path: 'instructor',
          select: 'firstName lastName'
        }
      });

    res.json({
      success: true,
      data: user.wishlist || []
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/cart', auth, authorize('student'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'cart.course',
        select: 'title description price thumbnail instructor category level rating totalStudents',
        populate: {
          path: 'instructor',
          select: 'firstName lastName'
        }
      });

    const cartCourses = user.cart.map(item => item.course).filter(course => course);
    const totalPrice = cartCourses.reduce((sum, course) => sum + course.price, 0);

    res.json({
      success: true,
      data: {
        courses: cartCourses,
        totalPrice,
        totalItems: cartCourses.length
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/enrolled-courses', auth, authorize('student'), validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user.id)
      .populate({
        path: 'enrolledCourses',
        select: 'title description price thumbnail instructor category level rating totalStudents',
        populate: {
          path: 'instructor',
          select: 'firstName lastName'
        },
        options: {
          skip,
          limit
        }
      });

    const totalCourses = await User.findById(req.user.id).select('enrolledCourses');
    const totalPages = Math.ceil(totalCourses.enrolledCourses.length / limit);

    res.json({
      success: true,
      data: {
        courses: user.enrolledCourses,
        pagination: {
          currentPage: page,
          totalPages,
          totalCourses: totalCourses.enrolledCourses.length,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/search', validatePagination, async (req, res) => {
  try {
    const { q, category, level, minPrice, maxPrice, rating } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    let query = { status: 'approved', isPublished: true };

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    const courses = await Course.find(query)
      .populate('instructor', 'firstName lastName')
      .select('title description price thumbnail category level rating totalStudents createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCourses = await Course.countDocuments(query);
    const totalPages = Math.ceil(totalCourses / limit);

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          currentPage: page,
          totalPages,
          totalCourses,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Search courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/search-courses', validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const courses = await Course.find({ status: 'approved', isPublished: true })
      .populate('instructor', 'firstName lastName')
      .select('title description price thumbnail category level rating totalStudents createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCourses = await Course.countDocuments({ status: 'approved', isPublished: true });
    const totalPages = Math.ceil(totalCourses / limit);

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          currentPage: page,
          totalPages,
          totalCourses,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Search courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Course.distinct('category', { status: 'approved', isPublished: true });
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;