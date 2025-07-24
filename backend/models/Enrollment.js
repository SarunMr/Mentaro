const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedLessons: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    watchTime: {
      type: Number,
      default: 0
    }
  }],
  lastAccessedLesson: {
    chapter: {
      type: mongoose.Schema.Types.ObjectId
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId
    },
    accessedAt: {
      type: Date
    }
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateIssuedAt: {
    type: Date
  },
  totalWatchTime: {
    type: Number,
    default: 0
  },
  paymentDetails: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'free'],
      required: true
    },
    transactionId: {
      type: String,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'completed'
    },
    discountApplied: {
      code: String,
      percentage: Number,
      amount: Number
    }
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

enrollmentSchema.pre('save', function(next) {
  if (this.isModified('completedLessons')) {
    this.totalWatchTime = this.completedLessons.reduce((total, lesson) => {
      return total + (lesson.watchTime || 0);
    }, 0);
  }
  
  if (this.isModified('isCompleted') && this.isCompleted && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  next();
});

enrollmentSchema.methods.updateProgress = async function() {
  try {
    const course = await mongoose.model('Course').findById(this.course);
    if (!course) return;
    
    const totalLessons = course.totalLessons;
    const completedLessonsCount = this.completedLessons.length;
    
    this.progress = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
    
    if (this.progress >= 100 && !this.isCompleted) {
      this.isCompleted = true;
      this.completedAt = new Date();
    }
    
    await this.save();
  } catch (error) {
    console.error('Error updating progress:', error);
  }
};

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ student: 1 });
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ enrollmentDate: -1 });
enrollmentSchema.index({ isCompleted: 1 });
enrollmentSchema.index({ 'paymentDetails.paymentStatus': 1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);