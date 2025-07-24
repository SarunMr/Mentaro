const express = require('express');
const {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  validateDiscount,
  updateDiscount,
  deleteDiscount,
  toggleDiscountStatus
} = require('../controllers/discountController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/validate', validateDiscount);

// Protected routes
router.use(protect);

// Admin only routes
router.post('/', authorize('admin'), createDiscount);
router.get('/', authorize('admin'), getAllDiscounts);
router.get('/:id', authorize('admin'), getDiscountById);
router.put('/:id', authorize('admin'), updateDiscount);
router.delete('/:id', authorize('admin'), deleteDiscount);
router.patch('/:id/toggle-status', authorize('admin'), toggleDiscountStatus);

module.exports = router;