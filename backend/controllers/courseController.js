const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      category,
      subcategory,
      level,
      language,
      price,
      originalPrice,
      thumbnail,
      previewVideo,
      requirements,
      objectives,
      tags,
      chapters
    } = req.body;
    
    // Process chapters and lessons if provided
    let processedChapters = [];
    if (chapters && Array.isArray(chapters)) {
      processedChapters = chapters.map((chapter, chapterIndex) => ({
        title: chapter.title || `Chapter ${chapterIndex + 1}`,
        description: chapter.description || '',
        order: chapterIndex + 1,
        lessons: chapter.lessons ? chapter.lessons.map((lesson, lessonIndex) => ({
          title: lesson.title || `Lesson ${lessonIndex + 1}`,
          description: lesson.description || '',
          videoUrl: lesson.videoUrl || lesson.videoFile || '', // Handle both URL and file
          duration: parseInt(lesson.duration) || 0,
          order: lessonIndex + 1,
          isPreview: lesson.isPreview || false,
          resources: lesson.resources || []
        })) : []
      }));
    }
    
    const course = new Course({
      title,
      description,
      shortDescription: shortDescription || description?.substring(0, 200) || '',
      instructor: req.user._id,
      category,
      subcategory,
      level,
      language: language || 'English',
      price,
      originalPrice: originalPrice || price,
      thumbnail: thumbnail || '',
      previewVideo: previewVideo || '',
      requirements: requirements || [],
      objectives: objectives || [],
      tags: tags || [],
      chapters: processedChapters,
      status: 'draft'
    });
    
    await course.save();
    
    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error while creating course' });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      level,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status = 'approved'
    } = req.query;
    
    const query = { isPublished: true };
    
    if (status && req.user?.role === 'admin') {
      query.status = status;
      delete query.isPublished;
    } else {
      query.status = 'approved';
    }
    
    if (category) query.category = category;
    if (level) query.level = level;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const courses = await Course.find(query)
      .populate('instructor', 'firstName lastName avatar instructorProfile.rating')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Course.countDocuments(query);
    
    res.json({
      message: 'Courses retrieved successfully',
      courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalCourses: total,
        hasNext: skip + courses.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error while retrieving courses' });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findById(id)
      .populate('instructor', 'firstName lastName avatar bio expertise instructorProfile socialLinks')
      .populate('reviews.user', 'firstName lastName avatar');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (course.status !== 'approved' && course.instructor._id.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Course not available' });
    }
    
    let isEnrolled = false;
    if (req.user) {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: course._id
      });
      isEnrolled = !!enrollment;
    }
    
    res.json({
      message: 'Course retrieved successfully',
      course,
      isEnrolled
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error while retrieving course' });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    if (course.status === 'approved' && req.user.role !== 'admin') {
      updateData.status = 'pending';
    }
    
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('instructor', 'firstName lastName avatar');
    
    res.json({
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error while updating course' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }
    
    const enrollmentCount = await Enrollment.countDocuments({ course: id });
    if (enrollmentCount > 0 && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Cannot delete course with active enrollments' });
    }
    
    await Course.findByIdAndDelete(id);
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error while deleting course' });
  }
};

const addChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, order } = req.body;
    
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to modify this course' });
    }
    
    const chapter = {
      title,
      description,
      order,
      lessons: []
    };
    
    course.chapters.push(chapter);
    await course.save();
    
    res.status(201).json({
      message: 'Chapter added successfully',
      chapter: course.chapters[course.chapters.length - 1]
    });
  } catch (error) {
    console.error('Add chapter error:', error);
    res.status(500).json({ message: 'Server error while adding chapter' });
  }
};

const addLesson = async (req, res) => {
  try {
    const { id, chapterId } = req.params;
    const { title, description, videoUrl, duration, order, isPreview, resources } = req.body;
    
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to modify this course' });
    }
    
    const chapter = course.chapters.id(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    
    const lesson = {
      title,
      description,
      videoUrl,
      duration,
      order,
      isPreview: isPreview || false,
      resources: resources || []
    };
    
    chapter.lessons.push(lesson);
    await course.save();
    
    res.status(201).json({
      message: 'Lesson added successfully',
      lesson: chapter.lessons[chapter.lessons.length - 1]
    });
  } catch (error) {
    console.error('Add lesson error:', error);
    res.status(500).json({ message: 'Server error while adding lesson' });
  }
};

const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: id
    });
    
    if (!enrollment) {
      return res.status(403).json({ message: 'You must be enrolled to review this course' });
    }
    
    const existingReview = course.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );
    
    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      course.reviews.push({
        user: req.user._id,
        rating,
        comment
      });
    }
    
    await course.save();
    
    const updatedCourse = await Course.findById(id)
      .populate('reviews.user', 'firstName lastName avatar');
    
    res.json({
      message: existingReview ? 'Review updated successfully' : 'Review added successfully',
      reviews: updatedCourse.reviews
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error while adding review' });
  }
};

const getInstructorCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { instructor: req.user._id };
    if (status) query.status = status;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const courses = await Course.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Course.countDocuments(query);
    
    res.json({
      message: 'Instructor courses retrieved successfully',
      courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalCourses: total
      }
    });
  } catch (error) {
    console.error('Get instructor courses error:', error);
    res.status(500).json({ message: 'Server error while retrieving instructor courses' });
  }
};

const submitForApproval = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to submit this course' });
    }
    
    if (course.chapters.length === 0) {
      return res.status(400).json({ message: 'Course must have at least one chapter' });
    }
    
    const hasLessons = course.chapters.some(chapter => chapter.lessons.length > 0);
    if (!hasLessons) {
      return res.status(400).json({ message: 'Course must have at least one lesson' });
    }
    
    course.status = 'pending';
    await course.save();
    
    res.json({
      message: 'Course submitted for approval successfully',
      course
    });
  } catch (error) {
    console.error('Submit course error:', error);
    res.status(500).json({ message: 'Server error while submitting course' });
  }
};

const publishCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to publish this course' });
    }
    
    if (course.status !== 'approved') {
      return res.status(400).json({ message: 'Course must be approved before publishing' });
    }
    
    course.isPublished = true;
    course.publishedAt = new Date();
    await course.save();
    
    res.json({
      message: 'Course published successfully',
      course
    });
  } catch (error) {
    console.error('Publish course error:', error);
    res.status(500).json({ message: 'Server error while publishing course' });
  }
};

module.exports = {
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
};