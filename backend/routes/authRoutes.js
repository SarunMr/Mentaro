const express = require('express');
const router = express.Router();
const {
  register,
  login,
  adminLogin,
  instructorRegister,
  instructorLogin,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validateUserUpdate,
  handleValidationErrors
} = require('../middleware/validation');
const { body } = require('express-validator');

router.post('/register', validateRegister, register);

router.post('/login', validateLogin, login);

router.post('/admin/login', validateLogin, adminLogin);

router.post('/instructor/register', [
  ...validateRegister,
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('expertise')
    .optional()
    .isArray()
    .withMessage('Expertise must be an array'),
  body('expertise.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each expertise item must be between 2 and 50 characters'),
  handleValidationErrors
], instructorRegister);

router.post('/instructor/login', validateLogin, instructorLogin);

router.get('/profile', auth, getProfile);

router.put('/profile', auth, validateUserUpdate, updateProfile);

router.put('/change-password', auth, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  handleValidationErrors
], changePassword);

router.get('/verify', auth, verifyToken);

module.exports = router;