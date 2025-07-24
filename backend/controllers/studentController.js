const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get student dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get total enrolled courses
    let totalCourses = await Enrollment.countDocuments({ 
      student: userId
    });

    // Get completed courses
    let completedCourses = await Enrollment.countDocuments({ 
      student: userId,
      isCompleted: true
    });

    // Get in-progress courses
    let inProgressCourses = await Enrollment.countDocuments({ 
      student: userId,
      progress: { $gt: 0 },
      isCompleted: false
    });

    // If no enrollments found, check User's enrolledCourses array as fallback
    if (totalCourses === 0) {
      const User = require('../models/User');
      const user = await User.findById(userId);
      
      if (user && user.enrolledCourses.length > 0) {
        totalCourses = user.enrolledCourses.length;
        completedCourses = user.enrolledCourses.filter(e => e.isCompleted === true).length;
        inProgressCourses = user.enrolledCourses.filter(e => 
          (e.progress || 0) > 0 && e.isCompleted !== true
        ).length;
      }
    }

    // Calculate learning streak (simplified - consecutive days with activity)
    const recentEnrollments = await Enrollment.find({ 
      student: userId,
      'lastAccessedLesson.accessedAt': { $exists: true }
    }).sort({ 'lastAccessedLesson.accessedAt': -1 }).limit(7);

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < recentEnrollments.length; i++) {
      const accessDate = new Date(recentEnrollments[i].lastAccessedLesson.accessedAt);
      accessDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today - accessDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }

    // Get average progress
    const enrollments = await Enrollment.find({ 
      student: userId
    });
    
    const totalProgress = enrollments.reduce((sum, enrollment) => 
      sum + (enrollment.progress || 0), 0
    );
    const averageProgress = totalCourses > 0 ? Math.round(totalProgress / totalCourses) : 0;

    res.json({
      success: true,
      data: {
        totalCourses,
        completedCourses,
        inProgressCourses,
        streak,
        averageProgress
      }
    });
  } catch (error) {
    console.error('Error fetching student dashboard stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch dashboard statistics' 
    });
  }
};

// Get student's enrolled courses with pagination
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status; // 'all', 'completed', 'in-progress', 'not-started'

    let query = { student: userId };

    // Filter by completion status
    if (status === 'completed') {
      query.isCompleted = true;
    } else if (status === 'in-progress') {
      query.progress = { $gt: 0 };
      query.isCompleted = false;
    } else if (status === 'not-started') {
      query.progress = 0;
    }

    const enrollments = await Enrollment.find(query)
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'firstName lastName'
        }
      })
      .sort({ enrollmentDate: -1 })
      .skip(skip)
      .limit(limit);

    let total = await Enrollment.countDocuments(query);
    let courses = [];

    // If no enrollments found, check User's enrolledCourses array as fallback
    if (enrollments.length === 0) {
      const User = require('../models/User');
      const Course = require('../models/Course');
      
      const user = await User.findById(userId).populate({
        path: 'enrolledCourses.course',
        populate: {
          path: 'instructor',
          select: 'firstName lastName'
        }
      });
      
      if (user && user.enrolledCourses.length > 0) {
        const userEnrolledCourses = user.enrolledCourses.slice(skip, skip + limit);
        total = user.enrolledCourses.length;
        
        courses = userEnrolledCourses.map(enrollment => ({
          id: enrollment.course._id,
          title: enrollment.course.title,
          instructor: `${enrollment.course.instructor.firstName} ${enrollment.course.instructor.lastName}`,
          thumbnail: enrollment.course.thumbnail,
          duration: enrollment.course.totalDuration,
          progress: enrollment.progress || 0,
          status: enrollment.isCompleted ? 'completed' : 
                   enrollment.progress > 0 ? 'in-progress' : 'not-started',
          rating: enrollment.course.averageRating || 0,
          enrolledAt: enrollment.enrolledAt,
          lastAccessedAt: null,
          enrollmentId: enrollment._id
        }));
      }
    } else {
      courses = enrollments.map(enrollment => ({
        id: enrollment.course._id,
        title: enrollment.course.title,
        instructor: `${enrollment.course.instructor.firstName} ${enrollment.course.instructor.lastName}`,
        thumbnail: enrollment.course.thumbnail,
        duration: enrollment.course.totalDuration,
        progress: enrollment.progress || 0,
        status: enrollment.isCompleted ? 'completed' : 
                 enrollment.progress > 0 ? 'in-progress' : 'not-started',
        rating: enrollment.course.averageRating || 0,
        enrolledAt: enrollment.enrollmentDate,
        lastAccessedAt: enrollment.lastAccessedLesson?.accessedAt,
        enrollmentId: enrollment._id
      }));
    }



    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch enrolled courses' 
    });
  }
};

// Get student's recent activity
exports.getRecentActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    // Get recent enrollments
    const recentEnrollments = await Enrollment.find({ 
      student: userId
    })
    .populate('course', 'title thumbnail')
    .sort({ enrollmentDate: -1 })
    .limit(limit);

    // Get recently accessed courses
    const recentlyAccessed = await Enrollment.find({ 
      student: userId,
      'lastAccessedLesson.accessedAt': { $exists: true }
    })
    .populate('course', 'title thumbnail')
    .sort({ 'lastAccessedLesson.accessedAt': -1 })
    .limit(limit);

    // Combine and format activities
    const activities = [];

    // Add enrollment activities
    recentEnrollments.forEach(enrollment => {
      activities.push({
        id: `enrollment-${enrollment._id}`,
        type: 'enrollment',
        title: `Enrolled in ${enrollment.course.title}`,
        description: 'Started a new course',
        timestamp: enrollment.enrollmentDate,
        course: {
          id: enrollment.course._id,
          title: enrollment.course.title,
          thumbnail: enrollment.course.thumbnail
        }
      });
    });

    // Add access activities
    recentlyAccessed.forEach(enrollment => {
      if (enrollment.lastAccessedLesson && enrollment.lastAccessedLesson.accessedAt) {
        activities.push({
          id: `access-${enrollment._id}`,
          type: 'access',
          title: `Continued ${enrollment.course.title}`,
          description: `Progress: ${enrollment.progress || 0}%`,
          timestamp: enrollment.lastAccessedLesson.accessedAt,
          course: {
            id: enrollment.course._id,
            title: enrollment.course.title,
            thumbnail: enrollment.course.thumbnail
          }
        });
      }
    });

    // Sort by timestamp and limit
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const limitedActivities = activities.slice(0, limit);

    res.json({
      success: true,
      data: limitedActivities
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch recent activity' 
    });
  }
};

// Get student's progress summary
exports.getProgressSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all active enrollments with course details
    const enrollments = await Enrollment.find({ 
      student: userId
    })
    .populate('course', 'title category difficulty totalDuration')
    .sort({ 'lastAccessedLesson.accessedAt': -1 });

    // Calculate progress by category
    const categoryProgress = {};
    const difficultyProgress = { beginner: 0, intermediate: 0, advanced: 0 };
    let totalTimeSpent = 0;
    let totalCoursesCompleted = 0;

    enrollments.forEach(enrollment => {
      const category = enrollment.course.category || 'Other';
      const difficulty = enrollment.course.difficulty || 'beginner';
      const progress = enrollment.progress || 0;
      
      // Category progress
      if (!categoryProgress[category]) {
        categoryProgress[category] = { total: 0, completed: 0, inProgress: 0 };
      }
      categoryProgress[category].total++;
      if (progress === 100) {
        categoryProgress[category].completed++;
        totalCoursesCompleted++;
      } else if (progress > 0) {
        categoryProgress[category].inProgress++;
      }

      // Difficulty progress
      if (progress === 100) {
        difficultyProgress[difficulty]++;
      }

      // Time spent (estimated based on progress and course duration)
      if (enrollment.course.totalDuration && progress > 0) {
        totalTimeSpent += (enrollment.course.totalDuration * progress) / 100;
      }
    });

    // Get learning goals progress (simplified)
    const learningGoals = {
      coursesCompleted: totalCoursesCompleted,
      targetCourses: Math.max(10, totalCoursesCompleted + 5), // Dynamic target
      skillsLearned: Object.keys(categoryProgress).length,
      timeSpent: Math.round(totalTimeSpent)
    };

    // Recent achievements
    const recentAchievements = [];
    if (totalCoursesCompleted >= 1) {
      recentAchievements.push({
        id: 'first-course',
        title: 'First Course Completed',
        description: 'Completed your first course',
        icon: '🎓',
        earnedAt: new Date()
      });
    }
    if (totalCoursesCompleted >= 5) {
      recentAchievements.push({
        id: 'five-courses',
        title: 'Learning Enthusiast',
        description: 'Completed 5 courses',
        icon: '🌟',
        earnedAt: new Date()
      });
    }

    res.json({
      success: true,
      data: {
        overview: {
          totalCourses: enrollments.length,
          completedCourses: totalCoursesCompleted,
          inProgressCourses: enrollments.filter(e => 
            (e.progress || 0) > 0 && (e.progress || 0) < 100
          ).length,
          totalTimeSpent: Math.round(totalTimeSpent)
        },
        categoryProgress,
        difficultyProgress,
        learningGoals,
        recentAchievements
      }
    });
  } catch (error) {
    console.error('Error fetching progress summary:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch progress summary' 
    });
  }
};