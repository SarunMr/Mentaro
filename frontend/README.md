# Mentaro Frontend

A React-based frontend for the Mentaro online course platform with role-based authentication and routing.

## Features

### Authentication & Authorization
- **Multi-role Authentication**: Support for Students, Instructors, and Admins
- **Protected Routes**: Role-based access control for different user types
- **Persistent Sessions**: Authentication state stored in localStorage
- **Auto-redirect**: Automatic redirection based on user roles

### Routing Structure
- **Public Routes**: Home, Login, Signup (redirects authenticated users)
- **Student Routes**: `/student/*` - Dashboard, courses, cart, wishlist
- **Instructor Routes**: `/instructor/*` - Dashboard, course management, analytics
- **Admin Routes**: `/admin/*` - User management, course approval, system stats

### Key Components
- **AuthContext**: Centralized authentication state management
- **ProtectedRoute**: Route wrapper for role-based access control
- **PublicRoute**: Route wrapper that redirects authenticated users
- **API Client**: Centralized API communication with automatic token handling

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your backend API URL.

3. **Start Development Server**
   ```bash
   npm start
   ```

## Authentication Flow

### Login Process
1. User selects role (Student/Instructor/Admin)
2. Submits credentials to appropriate endpoint
3. On success, token and user data stored in localStorage
4. User redirected to role-specific dashboard
5. AuthContext updates application state

### Registration Process
1. User registers as Student (default role)
2. Auto-login after successful registration
3. Redirect to student dashboard

### Logout Process
1. Clear localStorage (token and user data)
2. Update AuthContext state
3. Redirect to home page

## Route Protection

### Protected Routes
```jsx
<ProtectedRoute allowedRoles={['student']}>
  <StudentDashboard />
</ProtectedRoute>
```

### Public Routes
```jsx
<PublicRoute>
  <LoginPage />
</PublicRoute>
```

## API Integration

### Centralized API Client
- Automatic token injection for authenticated requests
- Response interceptors for error handling
- Organized API functions by feature (auth, courses, etc.)

### Usage Example
```javascript
import { authAPI, courseAPI } from '../utils/apiClient';

// Login
const response = await authAPI.login('student', { email, password });

// Get courses
const courses = await courseAPI.getAllCourses();
```

## File Structure

```
src/
├── components/
│   ├── ProtectedRoute.jsx
│   ├── PublicRoute.jsx
│   ├── Student/
│   ├── Instructor/
│   └── Admin/
├── contexts/
│   └── AuthContext.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   └── StudentPage/
├── utils/
│   └── apiClient.js
├── config/
│   └── api.js
└── App.jsx
```

## User Roles & Permissions

### Student
- Access to course browsing and enrollment
- Personal dashboard with progress tracking
- Cart and wishlist management

### Instructor
- Course creation and management
- Student analytics and progress tracking
- Revenue and performance metrics

### Admin
- User management and role assignment
- Course approval and content moderation
- System-wide analytics and reporting

## Development Guidelines

### Adding New Protected Routes
1. Define route in App.jsx
2. Wrap with ProtectedRoute component
3. Specify allowed roles
4. Update navigation components

### API Integration
1. Add endpoint to config/api.js
2. Create API function in utils/apiClient.js
3. Use in components with proper error handling

### State Management
- Use AuthContext for authentication state
- Local state for component-specific data
- Consider adding global state management for complex features

## Security Considerations

- Tokens stored in localStorage (consider httpOnly cookies for production)
- Role-based access control on both frontend and backend
- API client handles token expiration and unauthorized access
- Input validation and sanitization

## Next Steps

1. **Enhanced Security**: Implement refresh tokens and httpOnly cookies
2. **Error Handling**: Global error boundary and user-friendly error messages
3. **Loading States**: Implement loading indicators for better UX
4. **Offline Support**: Add service worker for offline functionality
5. **Testing**: Add unit and integration tests
6. **Performance**: Implement code splitting and lazy loading