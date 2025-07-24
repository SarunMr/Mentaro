const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const Discount = require('./models/Discount');
require('dotenv').config();

const seedSampleData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create sample users if they don't exist
    let admin = await User.findOne({ email: 'admin@mentaro.com' });
    if (!admin) {
      admin = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@mentaro.com',
        password: 'admin123',
        role: 'admin',
        isEmailVerified: true
      });
      console.log('Created admin user');
    }

    let instructor = await User.findOne({ email: 'instructor@mentaro.com' });
    if (!instructor) {
      instructor = await User.create({
        firstName: 'John',
        lastName: 'Instructor',
        email: 'instructor@mentaro.com',
        password: 'instructor123',
        role: 'instructor',
        isEmailVerified: true,
        instructorProfile: {
          isApproved: true,
          approvedAt: new Date(),
          totalStudents: 0,
          totalCourses: 0,
          totalRevenue: 0
        }
      });
      console.log('Created instructor user');
    }

    let student = await User.findOne({ email: 'student@mentaro.com' });
    if (!student) {
      student = await User.create({
        firstName: 'Jane',
        lastName: 'Student',
        email: 'student@mentaro.com',
        password: 'student123',
        role: 'student',
        isEmailVerified: true
      });
      console.log('Created student user');
    }

    // Create sample course if it doesn't exist
    let course = await Course.findOne({ title: 'Sample Web Development Course' });
    if (!course) {
      course = await Course.create({
        title: 'Sample Web Development Course',
        description: 'A comprehensive course on web development',
        shortDescription: 'Learn web development from scratch',
        instructor: instructor._id,
        category: 'web-development',
        level: 'beginner',
        price: 99.99,
        originalPrice: 149.99,
        thumbnail: 'https://example.com/thumbnail.jpg',
        status: 'approved',
        isPublished: true,
        publishedAt: new Date(),
        chapters: [{
          title: 'Introduction',
          description: 'Getting started with web development',
          order: 1,
          lessons: [{
            title: 'Welcome to the Course',
            description: 'Course overview and objectives',
            videoUrl: 'https://example.com/video1.mp4',
            duration: 300,
            order: 1,
            isPreview: true
          }]
        }]
      });
      console.log('Created sample course');
    }

    // Create sample discounts
    const discounts = [
      {
        code: 'WELCOME10',
        description: '10% off for new students',
        type: 'percentage',
        value: 10,
        validFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        usageLimit: 100,
        usedCount: 15,
        applicableCourses: [],
        isActive: true
      },
      {
        code: 'SAVE20',
        description: '$20 off any course',
        type: 'fixed',
        value: 20,
        validFrom: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        usageLimit: 50,
        usedCount: 8,
        applicableCourses: [course._id],
        isActive: true
      }
    ];

    for (const discountData of discounts) {
      const existingDiscount = await Discount.findOne({ code: discountData.code });
      if (!existingDiscount) {
        await Discount.create(discountData);
        console.log(`Created discount: ${discountData.code}`);
      }
    }

    // Create sample enrollments with payment data
    const enrollments = [
      {
        student: student._id,
        course: course._id,
        paymentDetails: {
          amount: 90.00,
          currency: 'USD',
          paymentMethod: 'stripe',
          transactionId: 'txn_sample_001',
          paymentStatus: 'completed',
          discountApplied: {
            code: 'WELCOME10',
            percentage: 10,
            amount: 9.99
          }
        }
      },
      {
        student: student._id,
        course: course._id,
        paymentDetails: {
          amount: 99.99,
          currency: 'USD',
          paymentMethod: 'paypal',
          transactionId: 'txn_sample_002',
          paymentStatus: 'completed'
        }
      },
      {
        student: student._id,
        course: course._id,
        paymentDetails: {
          amount: 129.99,
          currency: 'USD',
          paymentMethod: 'stripe',
          transactionId: 'txn_sample_003',
          paymentStatus: 'completed',
          discountApplied: {
            code: 'SAVE20',
            percentage: 0,
            amount: 20.00
          }
        }
      }
    ];

    for (const enrollmentData of enrollments) {
      const existingEnrollment = await Enrollment.findOne({ 
        'paymentDetails.transactionId': enrollmentData.paymentDetails.transactionId 
      });
      if (!existingEnrollment) {
        await Enrollment.create(enrollmentData);
        console.log(`Created enrollment: ${enrollmentData.paymentDetails.transactionId}`);
      }
    }

    // Update course enrollment count
    await Course.findByIdAndUpdate(course._id, {
      $inc: { enrollmentCount: enrollments.length }
    });

    // Update instructor revenue
    const totalInstructorEarnings = enrollments.reduce((sum, enrollment) => {
      return sum + (enrollment.paymentDetails.amount * 0.90); // 90% goes to instructor
    }, 0);
    
    await User.findByIdAndUpdate(instructor._id, {
      'instructorProfile.totalRevenue': totalInstructorEarnings,
      'instructorProfile.totalStudents': enrollments.length
    });
    console.log(`Updated instructor revenue: $${totalInstructorEarnings.toFixed(2)}`);

    // Update student enrolled courses
    await User.findByIdAndUpdate(student._id, {
      $push: {
        enrolledCourses: {
          course: course._id,
          enrolledAt: new Date()
        }
      }
    });

    console.log('\nSample data seeded successfully!');
    console.log('\nTest accounts created:');
    console.log('Admin: admin@mentaro.com / admin123');
    console.log('Instructor: instructor@mentaro.com / instructor123');
    console.log('Student: student@mentaro.com / student123');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

if (require.main === module) {
  seedSampleData();
}

module.exports = seedSampleData;