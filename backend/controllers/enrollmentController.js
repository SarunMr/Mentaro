const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { paymentDetails } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (course.status !== 'approved' || !course.isPublished) {
      return res.status(400).json({ message: 'Course is not available for enrollment' });
    }
    
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    if (course.instructor.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Instructors cannot enroll in their own courses' });
    }
    
    const enrollment = new Enrollment({
      student: req.user._id,
      course: courseId,
      paymentDetails: {
        amount: paymentDetails.amount || course.price,
        currency: paymentDetails.currency || 'USD',
        paymentMethod: paymentDetails.paymentMethod,
        transactionId: paymentDetails.transactionId,
        paymentStatus: paymentDetails.paymentStatus || 'completed',
        discountApplied: paymentDetails.discountApplied
      }
    });
    
    await enrollment.save();
    
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrollmentCount: 1 }
    });
    
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        enrolledCourses: {
          course: courseId,
          enrolledAt: new Date()
        }
      }
    });
    
    await User.findByIdAndUpdate(course.instructor, {
      $inc: {
        'instructorProfile.totalStudents': 1,
        'instructorProfile.totalRevenue': paymentDetails.amount || course.price
      }
    });
    
    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('course', 'title thumbnail instructor')
      .populate('student', 'firstName lastName email');
    
    res.status(201).json({
      message: 'Enrolled in course successfully',
      enrollment: populatedEnrollment
    });
  } catch (error) {
    console.error('Enroll in course error:', error);
    res.status(500).json({ message: 'Server error while enrolling in course' });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { student: req.user._id };
    if (status === 'completed') {
      query.isCompleted = true;
    } else if (status === 'in-progress') {
      query.isCompleted = false;
      query.progress = { $gt: 0 };
    } else if (status === 'not-started') {
      query.progress = 0;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const enrollments = await Enrollment.find(query)
      .populate({
        path: 'course',
        select: 'title thumbnail description instructor totalDuration totalLessons rating',
        populate: {
          path: 'instructor',
          select: 'firstName lastName avatar'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Enrollment.countDocuments(query);
    
    res.json({
      message: 'Enrollments retrieved successfully',
      enrollments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalEnrollments: total
      }
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ message: 'Server error while retrieving enrollments' });
  }
};

const getEnrollmentDetails = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    
    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      student: req.user._id
    })
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'firstName lastName avatar bio expertise'
        }
      });
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    res.json({
      message: 'Enrollment details retrieved successfully',
      enrollment
    });
  } catch (error) {
    console.error('Get enrollment details error:', error);
    res.status(500).json({ message: 'Server error while retrieving enrollment details' });
  }
};

const markLessonComplete = async (req, res) => {
  try {
    const { enrollmentId, lessonId } = req.params;
    const { watchTime } = req.body;
    
    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      student: req.user._id
    });
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    const existingLesson = enrollment.completedLessons.find(
      lesson => lesson.lesson.toString() === lessonId
    );
    
    if (!existingLesson) {
      enrollment.completedLessons.push({
        lesson: lessonId,
        completedAt: new Date(),
        watchTime: watchTime || 0
      });
    } else {
      existingLesson.watchTime = watchTime || existingLesson.watchTime;
    }
    
    await enrollment.updateProgress();
    
    res.json({
      message: 'Lesson marked as complete',
      enrollment
    });
  } catch (error) {
    console.error('Mark lesson complete error:', error);
    res.status(500).json({ message: 'Server error while marking lesson complete' });
  }
};

const updateLastAccessedLesson = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { chapterId, lessonId } = req.body;
    
    const enrollment = await Enrollment.findOneAndUpdate(
      {
        _id: enrollmentId,
        student: req.user._id
      },
      {
        lastAccessedLesson: {
          chapter: chapterId,
          lesson: lessonId,
          accessedAt: new Date()
        }
      },
      { new: true }
    );
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    res.json({
      message: 'Last accessed lesson updated',
      enrollment
    });
  } catch (error) {
    console.error('Update last accessed lesson error:', error);
    res.status(500).json({ message: 'Server error while updating last accessed lesson' });
  }
};

const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    }).populate('course');
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }
    
    const course = enrollment.course;
    const completedLessonsIds = enrollment.completedLessons.map(cl => cl.lesson.toString());
    
    const progressByChapter = course.chapters.map(chapter => {
      const totalLessons = chapter.lessons.length;
      const completedLessons = chapter.lessons.filter(lesson => 
        completedLessonsIds.includes(lesson._id.toString())
      ).length;
      
      return {
        chapterId: chapter._id,
        chapterTitle: chapter.title,
        totalLessons,
        completedLessons,
        progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
      };
    });
    
    res.json({
      message: 'Course progress retrieved successfully',
      enrollment: {
        _id: enrollment._id,
        progress: enrollment.progress,
        isCompleted: enrollment.isCompleted,
        totalWatchTime: enrollment.totalWatchTime,
        lastAccessedLesson: enrollment.lastAccessedLesson
      },
      progressByChapter
    });
  } catch (error) {
    console.error('Get course progress error:', error);
    res.status(500).json({ message: 'Server error while retrieving course progress' });
  }
};

const getInstructorEnrollments = async (req, res) => {
  try {
    const { page = 1, limit = 20, courseId } = req.query;
    
    let courseQuery = { instructor: req.user._id };
    if (courseId) {
      courseQuery._id = courseId;
    }
    
    const courses = await Course.find(courseQuery).select('_id');
    const courseIds = courses.map(course => course._id);
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate('student', 'firstName lastName email avatar')
      .populate('course', 'title thumbnail')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Enrollment.countDocuments({ course: { $in: courseIds } });
    
    res.json({
      message: 'Instructor enrollments retrieved successfully',
      enrollments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalEnrollments: total
      }
    });
  } catch (error) {
    console.error('Get instructor enrollments error:', error);
    res.status(500).json({ message: 'Server error while retrieving instructor enrollments' });
  }
};

const getEnrollmentStats = async (req, res) => {
  try {
    const { courseId } = req.query;
    
    let courseQuery = { instructor: req.user._id };
    if (courseId) {
      courseQuery._id = courseId;
    }
    
    const courses = await Course.find(courseQuery).select('_id');
    const courseIds = courses.map(course => course._id);
    
    const totalEnrollments = await Enrollment.countDocuments({ course: { $in: courseIds } });
    const completedEnrollments = await Enrollment.countDocuments({ 
      course: { $in: courseIds },
      isCompleted: true 
    });
    
    const totalRevenue = await Enrollment.aggregate([
      { $match: { course: { $in: courseIds } } },
      {
        $group: {
          _id: null,
          total: { $sum: '$paymentDetails.amount' }
        }
      }
    ]);
    
    const monthlyEnrollments = await Enrollment.aggregate([
      {
        $match: {
          course: { $in: courseIds },
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          revenue: { $sum: '$paymentDetails.amount' }
        }
      }
    ]);
    
    const courseStats = await Enrollment.aggregate([
      { $match: { course: { $in: courseIds } } },
      {
        $group: {
          _id: '$course',
          enrollments: { $sum: 1 },
          completions: {
            $sum: { $cond: [{ $eq: ['$isCompleted', true] }, 1, 0] }
          },
          revenue: { $sum: '$paymentDetails.amount' }
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      { $unwind: '$course' },
      {
        $project: {
          'course.title': 1,
          enrollments: 1,
          completions: 1,
          revenue: 1,
          completionRate: {
            $cond: [
              { $gt: ['$enrollments', 0] },
              { $multiply: [{ $divide: ['$completions', '$enrollments'] }, 100] },
              0
            ]
          }
        }
      }
    ]);
    
    res.json({
      message: 'Enrollment stats retrieved successfully',
      stats: {
        totalEnrollments,
        completedEnrollments,
        completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments * 100).toFixed(2) : 0,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyEnrollments: monthlyEnrollments[0]?.count || 0,
        monthlyRevenue: monthlyEnrollments[0]?.revenue || 0
      },
      courseStats
    });
  } catch (error) {
    console.error('Get enrollment stats error:', error);
    res.status(500).json({ message: 'Server error while retrieving enrollment stats' });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const user = await User.findById(req.user._id);
    
    if (user.wishlist.includes(courseId)) {
      return res.status(400).json({ message: 'Course already in wishlist' });
    }
    
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });
    
    if (enrollment) {
      return res.status(400).json({ message: 'Cannot add enrolled course to wishlist' });
    }
    
    user.wishlist.push(courseId);
    await user.save();
    
    res.json({
      message: 'Course added to wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error while adding to wishlist' });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: courseId } },
      { new: true }
    );
    
    res.json({
      message: 'Course removed from wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error while removing from wishlist' });
  }
};

const addToCart = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const existingCartItem = user.cart.find(
      item => item.course.toString() === courseId
    );
    
    if (existingCartItem) {
      return res.status(400).json({ message: 'Course already in cart' });
    }
    
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });
    
    if (enrollment) {
      return res.status(400).json({ message: 'Cannot add enrolled course to cart' });
    }
    
    user.cart.push({ course: courseId });
    await user.save();
    
    const updatedUser = await User.findById(req.user._id)
      .populate('cart.course', 'title thumbnail price instructor');
    
    res.json({
      message: 'Course added to cart',
      cart: updatedUser.cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error while adding to cart' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { cart: { course: courseId } } },
      { new: true }
    ).populate('cart.course', 'title thumbnail price instructor');
    
    res.json({
      message: 'Course removed from cart',
      cart: user.cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error while removing from cart' });
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentDetails,
  markLessonComplete,
  updateLastAccessedLesson,
  getCourseProgress,
  getInstructorEnrollments,
  getEnrollmentStats,
  addToWishlist,
  removeFromWishlist,
  addToCart,
  removeFromCart
};