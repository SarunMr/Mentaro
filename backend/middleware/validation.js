const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const validateRegister = [
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
  
  body('role')
    .optional()
    .isIn(['student', 'instructor'])
    .withMessage('Role must be either student or instructor'),
  
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

const validateCourse = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Course title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Course description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('shortDescription')
    .optional()
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Short description must be between 10 and 200 characters'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'web-development',
      'mobile-development', 
      'data-science',
      'machine-learning',
      'design',
      'business',
      'marketing',
      'photography',
      'music',
      'language',
      'programming',
      'other'
    ])
    .withMessage('Invalid category'),
  
  body('level')
    .notEmpty()
    .withMessage('Course level is required')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate, or advanced'),
  
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),
  
  body('thumbnail')
    .optional()
    .trim(),
  
  handleValidationErrors
];

const validateChapter = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Chapter title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Chapter title must be between 3 and 100 characters'),
  
  body('order')
    .isInt({ min: 1 })
    .withMessage('Chapter order must be a positive integer'),
  
  handleValidationErrors
];

const validateLesson = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Lesson title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Lesson title must be between 3 and 100 characters'),
  
  body('videoUrl')
    .notEmpty()
    .withMessage('Video URL is required')
    .isURL()
    .withMessage('Please provide a valid video URL'),
  
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer (in seconds)'),
  
  body('order')
    .isInt({ min: 1 })
    .withMessage('Lesson order must be a positive integer'),
  
  handleValidationErrors
];

const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters'),
  
  handleValidationErrors
];

const validateDiscount = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Discount code is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('Discount code must be between 3 and 20 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Discount code must contain only uppercase letters and numbers'),
  
  body('percentage')
    .isInt({ min: 1, max: 100 })
    .withMessage('Discount percentage must be between 1 and 100'),
  
  body('validFrom')
    .isISO8601()
    .withMessage('Valid from date must be a valid date'),
  
  body('validUntil')
    .isISO8601()
    .withMessage('Valid until date must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.validFrom)) {
        throw new Error('Valid until date must be after valid from date');
      }
      return true;
    }),
  
  body('usageLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Usage limit must be a positive integer'),
  
  handleValidationErrors
];

const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} ID`),
  
  handleValidationErrors
];

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

const validateUserUpdate = [
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
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateCourse,
  validateChapter,
  validateLesson,
  validateReview,
  validateDiscount,
  validateObjectId,
  validatePagination,
  validateUserUpdate
};