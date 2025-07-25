const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role = 'student' } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role
    };
    
    if (role === 'instructor') {
      userData.instructorProfile = {
        isApproved: false
      };
    }
    
    const user = new User(userData);
    await user.save();
    
    const token = generateToken(user._id);
    
    const userResponse = user.getPublicProfile();
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    const token = generateToken(user._id);
    
    const userResponse = user.getPublicProfile();
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email, role: 'admin' }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ message: 'Admin account is deactivated' });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    const token = generateToken(user._id);
    
    const userResponse = user.getPublicProfile();
    
    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
};

const instructorRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password, bio, expertise } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: 'instructor',
      bio: bio || '',
      expertise: expertise || [],
      instructorProfile: {
        isApproved: false
      }
    });
    
    await user.save();
    
    res.status(201).json({
      message: 'Instructor registration successful. Awaiting admin approval. You will be able to login once approved.',
      success: true
    });
  } catch (error) {
    console.error('Instructor registration error:', error);
    res.status(500).json({ message: 'Server error during instructor registration' });
  }
};

const instructorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email, role: 'instructor' }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid instructor credentials' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ message: 'Instructor account is deactivated' });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid instructor credentials' });
    }
    
    if (!user.instructorProfile.isApproved) {
      return res.status(403).json({ 
        message: 'Your instructor account is pending admin approval. Please wait for approval before logging in.',
        isApproved: false
      });
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    const token = generateToken(user._id);
    
    const userResponse = user.getPublicProfile();
    
    res.json({
      success: true,
      message: 'Instructor login successful',
      token,
      user: userResponse,
      isApproved: user.instructorProfile.isApproved
    });
  } catch (error) {
    console.error('Instructor login error:', error);
    res.status(500).json({ message: 'Server error during instructor login' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledCourses.course', 'title thumbnail instructor')
      .populate('wishlist', 'title thumbnail price instructor')
      .populate('cart.course', 'title thumbnail price instructor');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userResponse = user.getPublicProfile();
    
    res.json({
      message: 'Profile retrieved successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while retrieving profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, expertise, socialLinks } = req.body;
    
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (bio !== undefined) updateData.bio = bio;
    if (expertise) updateData.expertise = expertise;
    if (socialLinks) updateData.socialLinks = socialLinks;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userResponse = user.getPublicProfile();
    
    res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error while changing password' });
  }
};

const verifyToken = async (req, res) => {
  try {
    const userResponse = req.user.getPublicProfile();
    
    res.json({
      message: 'Token is valid',
      user: userResponse
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ message: 'Server error while verifying token' });
  }
};

module.exports = {
  register,
  login,
  adminLogin,
  instructorRegister,
  instructorLogin,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken
};