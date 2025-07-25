# Mentaro Backend API

A comprehensive backend API for an online course selling platform similar to Udemy, built with Node.js, Express.js, and MongoDB.

## Features

- **Multi-role Authentication**: Student, Instructor, and Admin roles
- **Course Management**: Create, update, delete courses with chapters and lessons
- **Enrollment System**: Course enrollment with progress tracking
- **File Upload**: Support for thumbnails, videos, avatars, and documents
- **Admin Panel**: User management, instructor approval, course moderation
- **Payment Integration**: Ready for payment gateway integration
- **Security**: JWT authentication, input validation, rate limiting

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/mentaro
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Student registration
- `POST /login` - Student login
- `POST /admin/login` - Admin login
- `POST /instructor/register` - Instructor registration (requires admin approval)
- `POST /instructor/login` - Instructor login
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `GET /verify` - Verify JWT token

### Course Routes (`/api/courses`)

- `GET /` - Get all published courses (with pagination and filters)
- `GET /instructor` - Get instructor's courses
- `GET /:id` - Get course by ID
- `POST /` - Create new course (instructor only)
- `PUT /:id` - Update course (instructor only)
- `DELETE /:id` - Delete course (instructor only)
- `POST /:id/chapters` - Add chapter to course
- `POST /:id/chapters/:chapterId/lessons` - Add lesson to chapter
- `POST /:id/reviews` - Add review to course
- `PUT /:id/submit` - Submit course for approval

### Enrollment Routes (`/api/enrollments`)

- `POST /enroll/:courseId` - Enroll in course
- `GET /my-enrollments` - Get student's enrollments
- `GET /details/:enrollmentId` - Get enrollment details
- `PUT /:enrollmentId/lessons/:lessonId/complete` - Mark lesson as complete
- `PUT /:enrollmentId/last-accessed` - Update last accessed lesson
- `GET /progress/:courseId` - Get course progress
- `GET /instructor/enrollments` - Get instructor's course enrollments
- `GET /instructor/stats` - Get enrollment statistics
- `POST /wishlist/:courseId` - Add to wishlist
- `DELETE /wishlist/:courseId` - Remove from wishlist
- `POST /cart/:courseId` - Add to cart
- `DELETE /cart/:courseId` - Remove from cart

### User Routes (`/api/users`)

- `GET /wishlist` - Get user's wishlist
- `GET /cart` - Get user's cart
- `GET /enrolled-courses` - Get enrolled courses
- `GET /search` - Search courses
- `GET /categories` - Get course categories

### Admin Routes (`/api/admin`)

- `GET /dashboard/stats` - Get dashboard statistics
- `GET /users` - Get all users
- `PUT /users/:userId/status` - Update user status
- `GET /instructors/pending` - Get pending instructor approvals
- `PUT /instructors/:instructorId/approve` - Approve instructor
- `PUT /instructors/:instructorId/reject` - Reject instructor
- `GET /courses/pending` - Get pending course approvals
- `PUT /courses/:courseId/approve` - Approve course
- `PUT /courses/:courseId/reject` - Reject course
- `GET /courses` - Get all courses
- `GET /revenue/stats` - Get revenue statistics
- `POST /create-admin` - Create new admin

### Instructor Routes (`/api/instructor`)

- `GET /dashboard/stats` - Get instructor dashboard stats
- `GET /students` - Get instructor's students
- `GET /revenue/monthly` - Get monthly revenue
- `PUT /profile` - Update instructor profile

### Upload Routes (`/api/upload`)

- `POST /thumbnail` - Upload course thumbnail
- `POST /video` - Upload lesson video
- `POST /avatar` - Upload user avatar
- `POST /document` - Upload document
- `DELETE /:type/:filename` - Delete uploaded file

## Data Models

### User Model
- Personal information (name, email, phone)
- Authentication (password hash)
- Role-based access (student, instructor, admin)
- Profile data (avatar, bio, expertise)
- Course relationships (enrolled, wishlist, cart)
- Instructor-specific data

### Course Model
- Course details (title, description, price)
- Content structure (chapters and lessons)
- Metadata (category, level, tags)
- Status tracking (draft, pending, published)
- Analytics (ratings, reviews, enrollment count)

### Enrollment Model
- Student-course relationship
- Progress tracking
- Payment information
- Completion status
- Watch time analytics

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for students, instructors, and admins
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet**: Security headers for Express apps
- **Password Hashing**: Bcrypt for secure password storage

## File Upload

- **Supported Types**: Images (thumbnails, avatars), Videos (lessons), Documents (PDF, DOC, TXT)
- **Size Limits**: 100MB maximum file size
- **Storage**: Local file system with organized directory structure
- **Security**: File type validation and secure filename generation

## Error Handling

- Centralized error handling middleware
- Consistent error response format
- Validation error aggregation
- Detailed logging for debugging

## Development

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Project Structure

```
backend/
├── controllers/     # Route handlers
├── middleware/      # Custom middleware
├── models/         # Mongoose schemas
├── routes/         # API routes
├── uploads/        # File uploads
├── .env           # Environment variables
├── .gitignore     # Git ignore rules
├── package.json   # Dependencies
└── server.js      # Entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.