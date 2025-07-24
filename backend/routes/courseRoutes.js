const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addChapter,
  addLesson,
  addReview,
  getInstructorCourses,
  submitForApproval,
  publishCourse
} = require('../controllers/courseController');
const { auth, authorizeInstructor, optionalAuth } = require('../middleware/auth');
const {
  validateCourse,
  validateChapter,
  validateLesson,
  validateReview,
  validateObjectId,
  validatePagination
} = require('../middleware/validation');

router.get('/', optionalAuth, validatePagination, getAllCourses);

router.get('/instructor', auth, authorizeInstructor, validatePagination, getInstructorCourses);

router.get('/:id', validateObjectId('id'), optionalAuth, getCourseById);

router.post('/', auth, authorizeInstructor, validateCourse, createCourse);

router.put('/:id', validateObjectId('id'), auth, authorizeInstructor, updateCourse);

router.delete('/:id', validateObjectId('id'), auth, authorizeInstructor, deleteCourse);

router.post('/:id/chapters', validateObjectId('id'), auth, authorizeInstructor, validateChapter, addChapter);

router.post('/:id/chapters/:chapterId/lessons', [
  validateObjectId('id'),
  validateObjectId('chapterId')
], auth, authorizeInstructor, validateLesson, addLesson);

router.post('/:id/reviews', validateObjectId('id'), auth, validateReview, addReview);

router.put('/:id/submit', validateObjectId('id'), auth, authorizeInstructor, submitForApproval);

router.put('/:id/publish', validateObjectId('id'), auth, authorizeInstructor, publishCourse);

module.exports = router;