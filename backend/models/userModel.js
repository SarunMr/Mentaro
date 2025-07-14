import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import bcrypt from "bcryptjs";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 100],
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isNumeric: true,
        len: [10, 15],
      },
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other", "prefer_not_to_say"),
      allowNull: true,
    },
    // User roles and status
    role: {
      type: DataTypes.ENUM("admin", "instructor", "student"),
      allowNull: false,
      defaultValue: "student",
    },
    status: {
      type: DataTypes.ENUM(
        "active",
        "inactive",
        "suspended",
        "pending_verification",
      ),
      defaultValue: "pending_verification",
    },
    // Location and profile
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "UTC",
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000],
      },
    },
    headline: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 200],
      },
    },
    // Learning preferences for students
    learningStyle: {
      type: DataTypes.ENUM(
        "visual",
        "auditory",
        "kinesthetic",
        "reading_writing",
      ),
      allowNull: true,
    },
    interests: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    skillLevel: {
      type: DataTypes.ENUM("beginner", "intermediate", "advanced", "expert"),
      allowNull: true,
      defaultValue: "beginner",
    },
    // Learning progress and achievements
    totalCoursesEnrolled: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalCoursesCompleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalLearningHours: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    certificatesEarned: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    currentStreak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    longestStreak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Instructor-specific fields
    isInstructor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    instructorStatus: {
      type: DataTypes.ENUM("pending", "approved", "rejected", "suspended"),
      allowNull: true,
    },
    expertise: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    teachingExperience: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Years of teaching experience",
    },
    education: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    certifications: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    // Instructor metrics
    totalCourses: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalStudents: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    averageRating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    totalReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalEarnings: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    // Financial information
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "USD",
    },
    // Payment information
    paymentMethods: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    // Social links
    socialLinks: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        linkedin: null,
        twitter: null,
        youtube: null,
        website: null,
        github: null,
      },
    },
    // Verification status
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isPhoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isIdentityVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Notification preferences
    emailNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    pushNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    smsNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    marketingNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    courseReminders: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    assignmentReminders: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Learning goals and tracking
    weeklyGoalHours: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    dailyGoalMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Privacy settings
    showProfile: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    showCourses: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    showCertificates: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Account activity
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastActiveAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    loginCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Subscription information
    subscriptionStatus: {
      type: DataTypes.ENUM("free", "premium", "pro", "enterprise"),
      defaultValue: "free",
    },
    subscriptionExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Additional metadata
    referralCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    referredBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Tokens for email verification, password reset, etc.
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true, // Soft deletes
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }

        // Generate referral code
        if (!user.referralCode) {
          user.referralCode = generateReferralCode();
        }

        // Set default avatar based on first name
        if (!user.avatar) {
          user.avatar = `https://ui-avatars.com/api/?name=${user.userName}&background=random`;
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      afterCreate: async (user) => {
        // Send welcome email
        // await sendWelcomeEmail(user);
      },
    },
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
      {
        fields: ["role"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["isInstructor"],
      },
      {
        fields: ["subscriptionStatus"],
      },
    ],
  },
);

// Instance methods
User.prototype.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

User.prototype.userName = function () {
  return `${this.userName}`;
};

User.prototype.getCompletionRate = function () {
  if (this.totalCoursesEnrolled === 0) return 0;
  return (
    (this.totalCoursesCompleted / this.totalCoursesEnrolled) *
    100
  ).toFixed(2);
};

User.prototype.isActive = function () {
  return this.status === "active";
};

User.prototype.isPremium = function () {
  return ["premium", "pro", "enterprise"].includes(this.subscriptionStatus);
};

User.prototype.canCreateCourse = function () {
  return this.isInstructor && this.instructorStatus === "approved";
};

User.prototype.updateLoginActivity = async function () {
  this.lastLoginAt = new Date();
  this.lastActiveAt = new Date();
  this.loginCount += 1;
  await this.save();
};

User.prototype.updateLearningProgress = async function (hoursSpent) {
  this.totalLearningHours = parseFloat(this.totalLearningHours) + hoursSpent;
  this.lastActiveAt = new Date();
  await this.save();
};

// Helper function to generate referral code
function generateReferralCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Class methods
User.getInstructors = function () {
  return User.findAll({
    where: {
      isInstructor: true,
      instructorStatus: "approved",
    },
  });
};

User.getTopInstructors = function (limit = 10) {
  return User.findAll({
    where: {
      isInstructor: true,
      instructorStatus: "approved",
    },
    order: [
      ["averageRating", "DESC"],
      ["totalStudents", "DESC"],
    ],
    limit,
  });
};

User.getStudentsByCountry = function (country) {
  return User.findAll({
    where: {
      country,
      role: "student",
    },
  });
};

export default User;
