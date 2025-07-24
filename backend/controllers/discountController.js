const Discount = require('../models/Discount');
const Course = require('../models/Course');

// Create a new discount/coupon
const createDiscount = async (req, res) => {
  try {
    const {
      code,
      description,
      type,
      value,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      validFrom,
      validUntil,
      applicableCourses,
      applicableToAll
    } = req.body;

    // Check if discount code already exists
    const existingDiscount = await Discount.findOne({ code: code.toUpperCase() });
    if (existingDiscount) {
      return res.status(400).json({
        success: false,
        message: 'Discount code already exists'
      });
    }

    const discount = new Discount({
      code: code.toUpperCase(),
      description,
      type,
      value,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      applicableCourses: applicableToAll ? [] : applicableCourses,
      applicableToAll,
      createdBy: req.user.id
    });

    await discount.save();

    res.status(201).json({
      success: true,
      message: 'Discount created successfully',
      discount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating discount',
      error: error.message
    });
  }
};

// Get all discounts
const getAllDiscounts = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive, search } = req.query;
    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const discounts = await Discount.find(query)
      .populate('createdBy', 'name email')
      .populate('applicableCourses', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Discount.countDocuments(query);

    res.json({
      success: true,
      discounts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching discounts',
      error: error.message
    });
  }
};

// Get discount by ID
const getDiscountById = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('applicableCourses', 'title price');

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    res.json({
      success: true,
      discount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching discount',
      error: error.message
    });
  }
};

// Validate discount code
const validateDiscount = async (req, res) => {
  try {
    const { code, courseId, amount } = req.body;

    const discount = await Discount.findOne({ 
      code: code.toUpperCase(),
      isActive: true
    }).populate('applicableCourses');

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Invalid discount code'
      });
    }

    if (!discount.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Discount code has expired or reached usage limit'
      });
    }

    // Check if discount applies to the course
    if (!discount.applicableToAll && courseId) {
      const applicableCourseIds = discount.applicableCourses.map(course => course._id.toString());
      if (!applicableCourseIds.includes(courseId)) {
        return res.status(400).json({
          success: false,
          message: 'Discount code is not applicable to this course'
        });
      }
    }

    const discountAmount = discount.calculateDiscount(amount);
    const finalAmount = amount - discountAmount;

    res.json({
      success: true,
      message: 'Discount code is valid',
      discount: {
        code: discount.code,
        type: discount.type,
        value: discount.value,
        discountAmount,
        finalAmount,
        originalAmount: amount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error validating discount',
      error: error.message
    });
  }
};

// Update discount
const updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('applicableCourses', 'title');

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    res.json({
      success: true,
      message: 'Discount updated successfully',
      discount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating discount',
      error: error.message
    });
  }
};

// Delete discount
const deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    res.json({
      success: true,
      message: 'Discount deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting discount',
      error: error.message
    });
  }
};

// Toggle discount status
const toggleDiscountStatus = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    discount.isActive = !discount.isActive;
    await discount.save();

    res.json({
      success: true,
      message: `Discount ${discount.isActive ? 'activated' : 'deactivated'} successfully`,
      discount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling discount status',
      error: error.message
    });
  }
};

module.exports = {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  validateDiscount,
  updateDiscount,
  deleteDiscount,
  toggleDiscountStatus
};