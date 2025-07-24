const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  maxDiscountAmount: {
    type: Number,
    default: null
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
  },
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  applicableCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  applicableToAll: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdByRole: {
    type: String,
    enum: ['admin', 'instructor'],
    required: true,
    default: 'admin'
  }
}, {
  timestamps: true
});

discountSchema.methods.isValid = function() {
  const now = new Date();
  return this.isActive && 
         now >= this.validFrom && 
         now <= this.validUntil &&
         (this.usageLimit === null || this.usedCount < this.usageLimit);
};

discountSchema.methods.calculateDiscount = function(amount) {
  if (!this.isValid() || amount < this.minOrderAmount) {
    return 0;
  }
  
  let discount = 0;
  if (this.type === 'percentage') {
    discount = (amount * this.value) / 100;
  } else {
    discount = this.value;
  }
  
  if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
    discount = this.maxDiscountAmount;
  }
  
  return Math.min(discount, amount);
};

module.exports = mongoose.model('Discount', discountSchema);