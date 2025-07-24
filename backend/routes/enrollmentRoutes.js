const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/enrollmentController');
const { auth, authorize, authorizeInstructor } = require('../middleware/auth');
const {
  validateObjectId,
  validatePagination,
  handleValidationErrors
} = require('../middleware/validation');
const { body } = require('express-validator');

router.post('/enroll/:courseId', [
  validateObjectId('courseId'),
  body('paymentDetails.amount')
    .isNumeric()
    .withMessage('Payment amount must be a number'),
  body('paymentDetails.paymentMethod')
    .isIn(['credit_card', 'debit_card', 'paypal', 'stripe', 'free'])
    .withMessage('Invalid payment method'),
  body('paymentDetails.transactionId')
    .notEmpty()
    .withMessage('Transaction ID is required'),
  handleValidationErrors
], auth, authorize('student'), enrollInCourse);

router.get('/my-enrollments', auth, authorize('student'), validatePagination, getMyEnrollments);

router.get('/details/:enrollmentId', validateObjectId('enrollmentId'), auth, authorize('student'), getEnrollmentDetails);

router.put('/:enrollmentId/lessons/:lessonId/complete', [
  validateObjectId('enrollmentId'),
  validateObjectId('lessonId'),
  body('watchTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Watch time must be a positive integer'),
  handleValidationErrors
], auth, authorize('student'), markLessonComplete);

router.put('/:enrollmentId/last-accessed', [
  validateObjectId('enrollmentId'),
  body('chapterId')
    .isMongoId()
    .withMessage('Invalid chapter ID'),
  body('lessonId')
    .isMongoId()
    .withMessage('Invalid lesson ID'),
  handleValidationErrors
], auth, authorize('student'), updateLastAccessedLesson);

router.get('/progress/:courseId', validateObjectId('courseId'), auth, authorize('student'), getCourseProgress);

router.get('/instructor/enrollments', auth, authorizeInstructor, validatePagination, getInstructorEnrollments);

router.get('/instructor/stats', auth, authorizeInstructor, getEnrollmentStats);

router.post('/wishlist/:courseId', validateObjectId('courseId'), auth, authorize('student'), addToWishlist);

router.delete('/wishlist/:courseId', validateObjectId('courseId'), auth, authorize('student'), removeFromWishlist);

router.post('/cart/:courseId', validateObjectId('courseId'), auth, authorize('student'), addToCart);

router.delete('/cart/:courseId', validateObjectId('courseId'), auth, authorize('student'), removeFromCart);

module.exports = router;