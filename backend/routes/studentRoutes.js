const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const studentController = require('../controllers/studentController');

// Apply authentication and student authorization to all routes
router.use(auth);
router.use(authorize('student'));

// Get student dashboard statistics
router.get('/dashboard/stats', studentController.getDashboardStats);

// Get student's enrolled courses
router.get('/enrolled-courses', studentController.getEnrolledCourses);

// Get student's recent activity
router.get('/recent-activity', studentController.getRecentActivity);

// Get student's progress summary
router.get('/progress-summary', studentController.getProgressSummary);

module.exports = router;