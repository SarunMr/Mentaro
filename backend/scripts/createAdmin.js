const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mentaro");
    console.log('Connected to MongoDB');

    const adminData = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      isEmailVerified: true
    };

    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin user already exists with email:', adminData.email);
      process.exit(0);
    }

    const admin = new User(adminData);
    await admin.save();

    console.log('Admin user created successfully!');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    console.log('Role:', adminData.role);
    
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

createAdmin();
