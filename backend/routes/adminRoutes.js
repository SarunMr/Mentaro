const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { auth, authorizeAdmin } = require('../middleware/auth');
const {
  validateObjectId,
  validatePagination,
  handleValidationErrors
} = require('../middleware/validation');
const { body, query } = require('express-validator');

router.use(auth);
router.use(authorizeAdmin);

router.get('/dashboard/stats', getDashboardStats);

router.get('/users', validatePagination, getAllUsers);

router.put('/users/:userId/status', [
  validateObjectId('userId'),
  body('isActive')
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  handleValidationErrors
], updateUserStatus);

router.put('/users/:userId', [
  validateObjectId('userId'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  handleValidationErrors
], updateUser);

router.delete('/users/:userId', [
  validateObjectId('userId'),
  handleValidationErrors
], deleteUser);

router.get('/instructors/pending', validatePagination, getPendingInstructors);

router.put('/instructors/:instructorId/approve', validateObjectId('instructorId'), approveInstructor);

router.put('/instructors/:instructorId/reject', [
  validateObjectId('instructorId'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters'),
  handleValidationErrors
], rejectInstructor);

router.get('/courses/pending', validatePagination, getPendingCourses);

router.put('/courses/:courseId/approve', validateObjectId('courseId'), approveCourse);

router.put('/courses/:courseId/reject', [
  validateObjectId('courseId'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Reason cannot exceed 1000 characters'),
  handleValidationErrors
], rejectCourse);

router.get('/courses', validatePagination, getAllCourses);

router.get('/revenue/stats', [
  query('period')
    .optional()
    .isIn(['daily', 'monthly', 'yearly'])
    .withMessage('Period must be daily, monthly, or yearly'),
  handleValidationErrors
], getRevenueStats);

router.post('/create-admin', [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  handleValidationErrors
], createAdmin);

module.exports = router;