const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    required: [true, 'Lesson duration is required']
  },
  order: {
    type: Number,
    required: true
  },
  isPreview: {
    type: Boolean,
    default: false
  },
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'doc', 'link', 'other']
    }
  }]
}, {
  timestamps: true
});

const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Chapter title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    required: true
  },
  lessons: [lessonSchema]
}, {
  timestamps: true
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
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
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  level: {
    type: String,
    required: [true, 'Course level is required'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  language: {
    type: String,
    default: 'English'
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  thumbnail: {
    type: String,
    default: ''
  },
  previewVideo: {
    type: String
  },
  chapters: [chapterSchema],
  requirements: [{
    type: String,
    trim: true
  }],
  objectives: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'archived'],
    default: 'draft'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  totalDuration: {
    type: Number,
    default: 0
  },
  totalLessons: {
    type: Number,
    default: 0
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  discounts: [{
    code: {
      type: String,
      required: true,
      uppercase: true
    },
    percentage: {
      type: Number,
      required: true,
      min: 1,
      max: 100
    },
    validFrom: {
      type: Date,
      required: true
    },
    validUntil: {
      type: Date,
      required: true
    },
    usageLimit: {
      type: Number,
      default: null
    },
    usedCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  adminNotes: {
    type: String,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

courseSchema.pre('save', function(next) {
  if (this.isModified('chapters')) {
    let totalDuration = 0;
    let totalLessons = 0;
    
    this.chapters.forEach(chapter => {
      chapter.lessons.forEach(lesson => {
        totalDuration += lesson.duration || 0;
        totalLessons += 1;
      });
    });
    
    this.totalDuration = totalDuration;
    this.totalLessons = totalLessons;
  }
  
  if (this.isModified('reviews')) {
    if (this.reviews.length > 0) {
      const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
      this.rating.average = totalRating / this.reviews.length;
      this.rating.count = this.reviews.length;
    } else {
      this.rating.average = 0;
      this.rating.count = 0;
    }
  }
  
  next();
});

courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ 'rating.average': -1 });
courseSchema.index({ enrollmentCount: -1 });
courseSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Course', courseSchema);