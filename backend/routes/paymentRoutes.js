const express = require('express');
const {
  createPayment,
  getAllPayments,
  getUserPayments,
  getInstructorEarnings,
  getAdminAnalytics,
  processRefund
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.post('/', createPayment);
router.get('/my-payments', getUserPayments);

// Instructor routes
router.get('/instructor/earnings', authorize('instructor'), getInstructorEarnings);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllPayments);
router.get('/admin/analytics', authorize('admin'), getAdminAnalytics);
router.post('/admin/refund/:enrollmentId', authorize('admin'), processRefund);

module.exports = router;