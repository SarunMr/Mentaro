import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import API_BASE_URL from '../config/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL.replace('/api', ''), // Remove /api suffix since endpoints already include it
  timeout: 30000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      console.error('Access forbidden - insufficient permissions');
    }
    
    if (error.response?.status >= 500) {
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

// Helper functions for common API operations
export const authAPI = {
  login: (userType, credentials) => {
    let endpoint;
    switch (userType) {
      case 'admin':
        endpoint = API_ENDPOINTS.AUTH.LOGIN_ADMIN;
        break;
      case 'instructor':
        endpoint = API_ENDPOINTS.AUTH.LOGIN_INSTRUCTOR;
        break;
      case 'student':
      default:
        endpoint = API_ENDPOINTS.AUTH.LOGIN;
        break;
    }
    return apiClient.post(endpoint, credentials);
  },
  
  register: (userData) => {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  },
  
  registerInstructor: (userData) => {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER_INSTRUCTOR, userData);
  },
  
  verifyToken: () => {
    return apiClient.get(API_ENDPOINTS.AUTH.VERIFY_TOKEN);
  },
  
  getProfile: () => {
    return apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
  },
  
  changePassword: (passwordData) => {
    return apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
  },
};

export const courseAPI = {
  getAllCourses: () => {
    return apiClient.get(API_ENDPOINTS.COURSES.BASE);
  },
  
  getCourseById: (id) => {
    return apiClient.get(API_ENDPOINTS.COURSES.BY_ID(id));
  },
  
  getInstructorCourses: () => {
    return apiClient.get(API_ENDPOINTS.COURSES.BY_INSTRUCTOR);
  },
  
  createCourse: (courseData) => {
    return apiClient.post(API_ENDPOINTS.COURSES.BASE, courseData);
  },
  
  updateCourse: (id, courseData) => {
    return apiClient.put(API_ENDPOINTS.COURSES.BY_ID(id), courseData);
  },
  
  deleteCourse: (id) => {
    return apiClient.delete(API_ENDPOINTS.COURSES.BY_ID(id));
  },
  
  submitForApproval: (id) => {
    return apiClient.put(API_ENDPOINTS.COURSES.SUBMIT_FOR_APPROVAL(id));
  },
  
  publishCourse: (id) => {
    return apiClient.put(API_ENDPOINTS.COURSES.PUBLISH(id));
  },
  
  addReview: (id, reviewData) => {
    return apiClient.post(API_ENDPOINTS.COURSES.ADD_REVIEW(id), reviewData);
  },
  
  // Course progress and lesson completion
  getCourseProgress: (courseId) => {
    return apiClient.get(API_ENDPOINTS.ENROLLMENTS.PROGRESS(courseId));
  },
  
  markLessonComplete: (enrollmentId, lessonId, data) => {
    return apiClient.put(API_ENDPOINTS.ENROLLMENTS.COMPLETE_LESSON(enrollmentId, lessonId), data);
  },
  
  updateLastAccessedLesson: (enrollmentId, data) => {
    return apiClient.post(API_ENDPOINTS.ENROLLMENTS.UPDATE_LAST_ACCESSED(enrollmentId), data);
  },
};

export const enrollmentAPI = {
  enrollInCourse: (courseId, paymentDetails) => {
    return apiClient.post(API_ENDPOINTS.ENROLLMENTS.ENROLL(courseId), { paymentDetails });
  },
  
  getMyEnrollments: (page = 1, limit = 10) => {
    return apiClient.get(`${API_ENDPOINTS.ENROLLMENTS.MY_ENROLLMENTS}?page=${page}&limit=${limit}`);
  },
  
  getCourseProgress: (courseId) => {
    return apiClient.get(API_ENDPOINTS.ENROLLMENTS.PROGRESS(courseId));
  },
  
  completeLesson: (enrollmentId, lessonId, watchTime) => {
    return apiClient.put(API_ENDPOINTS.ENROLLMENTS.COMPLETE_LESSON(enrollmentId, lessonId), { watchTime });
  },
  
  updateLastAccessed: (enrollmentId, chapterId, lessonId) => {
    return apiClient.put(API_ENDPOINTS.ENROLLMENTS.UPDATE_LAST_ACCESSED(enrollmentId), { chapterId, lessonId });
  },
  
  addToWishlist: (courseId) => {
    return apiClient.post(API_ENDPOINTS.ENROLLMENTS.WISHLIST(courseId));
  },
  
  removeFromWishlist: (courseId) => {
    return apiClient.delete(API_ENDPOINTS.ENROLLMENTS.WISHLIST(courseId));
  },
  
  addToCart: (courseId) => {
    return apiClient.post(API_ENDPOINTS.ENROLLMENTS.CART(courseId));
  },
  
  removeFromCart: (courseId) => {
    return apiClient.delete(API_ENDPOINTS.ENROLLMENTS.CART(courseId));
  },
};



export const userAPI = {
  searchCourses: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`${API_ENDPOINTS.USERS.SEARCH_COURSES}?${queryString}`);
  },
  
  getCategories: () => {
    return apiClient.get(API_ENDPOINTS.USERS.CATEGORIES);
  },
  
  getEnrolledCourses: (page = 1, limit = 10) => {
    return apiClient.get(`${API_ENDPOINTS.USERS.ENROLLED_COURSES}?page=${page}&limit=${limit}`);
  },
  
  getWishlist: () => {
    return apiClient.get(API_ENDPOINTS.USERS.WISHLIST);
  },
  
  getCart: () => {
    return apiClient.get(API_ENDPOINTS.USERS.CART);
  },
  
  addToCart: (courseId) => {
    return apiClient.post(API_ENDPOINTS.ENROLLMENTS.CART(courseId));
  },
  
  addToWishlist: (courseId) => {
    return apiClient.post(API_ENDPOINTS.ENROLLMENTS.WISHLIST(courseId));
  },
  
  removeFromCart: (courseId) => {
    return apiClient.delete(API_ENDPOINTS.ENROLLMENTS.CART(courseId));
  },
  
  removeFromWishlist: (courseId) => {
    return apiClient.delete(API_ENDPOINTS.ENROLLMENTS.WISHLIST(courseId));
  },
};

export const adminAPI = {
  getDashboard: () => {
    return apiClient.get(API_ENDPOINTS.ADMIN.DASHBOARD);
  },
  
  getAllUsers: () => {
    return apiClient.get(API_ENDPOINTS.ADMIN.USERS);
  },
  
  updateUserStatus: (id, status) => {
    return apiClient.put(API_ENDPOINTS.ADMIN.UPDATE_USER_STATUS(id), { status });
  },
  
  updateUser: (id, userData) => {
    return apiClient.put(API_ENDPOINTS.ADMIN.UPDATE_USER(id), userData);
  },
  
  deleteUser: (id) => {
    return apiClient.delete(API_ENDPOINTS.ADMIN.DELETE_USER(id));
  },
  
  getPendingInstructors: () => {
    return apiClient.get(API_ENDPOINTS.ADMIN.PENDING_INSTRUCTORS);
  },
  
  approveInstructor: (id) => {
    return apiClient.put(API_ENDPOINTS.ADMIN.APPROVE_INSTRUCTOR(id));
  },

  rejectInstructor: (id, reason) => {
    return apiClient.put(API_ENDPOINTS.ADMIN.REJECT_INSTRUCTOR(id), { reason });
  },
  
  getPendingCourses: () => {
    return apiClient.get(API_ENDPOINTS.ADMIN.PENDING_COURSES);
  },
  
  approveCourse: (id) => {
    return apiClient.put(API_ENDPOINTS.ADMIN.APPROVE_COURSE(id));
  },

  rejectCourse: (id, reason) => {
    return apiClient.put(API_ENDPOINTS.ADMIN.REJECT_COURSE(id), { reason });
  },
  
  getAllCourses: () => {
    return apiClient.get(API_ENDPOINTS.ADMIN.ALL_COURSES);
  },
  
  getRevenueStats: () => {
    return apiClient.get(API_ENDPOINTS.ADMIN.REVENUE_STATS);
  },
  
  createAdmin: (adminData) => {
    return apiClient.post(API_ENDPOINTS.ADMIN.CREATE_ADMIN, adminData);
  },
};

export const instructorAPI = {
  getDashboard: () => {
    return apiClient.get(API_ENDPOINTS.INSTRUCTOR.DASHBOARD);
  },
  
  getStudents: (page = 1, limit = 10) => {
    return apiClient.get(`${API_ENDPOINTS.INSTRUCTOR.STUDENTS}?page=${page}&limit=${limit}`);
  },
  
  getRevenue: (year) => {
    const params = year ? `?year=${year}` : '';
    return apiClient.get(`${API_ENDPOINTS.INSTRUCTOR.REVENUE}${params}`);
  },
  
  getTopCourses: () => {
    return apiClient.get(API_ENDPOINTS.INSTRUCTOR.TOP_COURSES);
  },
  
  getRecentActivity: (limit = 10) => {
    return apiClient.get(`${API_ENDPOINTS.INSTRUCTOR.RECENT_ACTIVITY}?limit=${limit}`);
  },
  
  getRecentTransactions: (limit = 10) => {
    return apiClient.get(`${API_ENDPOINTS.INSTRUCTOR.RECENT_TRANSACTIONS}?limit=${limit}`);
  },
  
  getTopCourses: () => {
    return apiClient.get(API_ENDPOINTS.INSTRUCTOR.TOP_COURSES);
  },
  
  getRecentActivity: (limit = 10) => {
    return apiClient.get(`${API_ENDPOINTS.INSTRUCTOR.RECENT_ACTIVITY}?limit=${limit}`);
  },
  
  getRecentTransactions: (limit = 10) => {
    return apiClient.get(`${API_ENDPOINTS.INSTRUCTOR.RECENT_TRANSACTIONS}?limit=${limit}`);
  },
  
  updateProfile: (profileData) => {
    return apiClient.put(API_ENDPOINTS.INSTRUCTOR.PROFILE, profileData);
  },
  
  // Discount management functions
  getDiscounts: () => {
    return apiClient.get(API_ENDPOINTS.INSTRUCTOR.DISCOUNTS);
  },
  
  getDiscountById: (id) => {
    return apiClient.get(API_ENDPOINTS.INSTRUCTOR.DISCOUNT_BY_ID(id));
  },
  
  createDiscount: (discountData) => {
    return apiClient.post(API_ENDPOINTS.INSTRUCTOR.DISCOUNTS, discountData);
  },
  
  updateDiscount: (id, discountData) => {
    return apiClient.put(API_ENDPOINTS.INSTRUCTOR.DISCOUNT_BY_ID(id), discountData);
  },
  
  deleteDiscount: (id) => {
    return apiClient.delete(API_ENDPOINTS.INSTRUCTOR.DISCOUNT_BY_ID(id));
  },
  
  toggleDiscountStatus: (id) => {
    return apiClient.patch(API_ENDPOINTS.INSTRUCTOR.TOGGLE_DISCOUNT_STATUS(id));
  },
};

export const studentAPI = {
  getDashboardStats: () => {
    return apiClient.get(API_ENDPOINTS.STUDENT.DASHBOARD);
  },
  
  getEnrolledCourses: (page = 1, limit = 10) => {
    return apiClient.get(`${API_ENDPOINTS.STUDENT.ENROLLED_COURSES}?page=${page}&limit=${limit}`);
  },
  
  getRecentActivity: (limit = 10) => {
    return apiClient.get(`${API_ENDPOINTS.STUDENT.RECENT_ACTIVITY}?limit=${limit}`);
  },
  
  getProgressSummary: () => {
    return apiClient.get(API_ENDPOINTS.STUDENT.PROGRESS_SUMMARY);
  },
};

export const discountAPI = {
  validateDiscount: (code, amount, courseId = null) => {
    return apiClient.post(API_ENDPOINTS.DISCOUNTS.VALIDATE, {
      code,
      amount,
      courseId
    });
  },
};

export const paymentAPI = {
  createPayment: (paymentData) => {
    return apiClient.post(API_ENDPOINTS.PAYMENTS.CREATE, paymentData);
  },
  
  getUserPayments: (page = 1, limit = 10) => {
    return apiClient.get(`${API_ENDPOINTS.PAYMENTS.USER_PAYMENTS}?page=${page}&limit=${limit}`);
  },
  
  getInstructorEarnings: (year) => {
    const params = year ? `?year=${year}` : '';
    return apiClient.get(`${API_ENDPOINTS.PAYMENTS.INSTRUCTOR_EARNINGS}${params}`);
  },
  
  getAllPayments: (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page, limit, ...filters }).toString();
    return apiClient.get(`${API_ENDPOINTS.PAYMENTS.ADMIN_ALL}?${params}`);
  },
  
  getAdminAnalytics: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return apiClient.get(`${API_ENDPOINTS.PAYMENTS.ADMIN_ANALYTICS}?${params.toString()}`);
  },
  
  processRefund: (enrollmentId, refundData) => {
    return apiClient.post(API_ENDPOINTS.PAYMENTS.REFUND(enrollmentId), refundData);
  },
};

export const uploadAPI = {
  uploadThumbnail: (file) => {
    const formData = new FormData();
    formData.append('thumbnail', file);
    return apiClient.post(API_ENDPOINTS.UPLOAD.COURSE_THUMBNAIL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  uploadVideo: (file) => {
    const formData = new FormData();
    formData.append('video', file);
    return apiClient.post(API_ENDPOINTS.UPLOAD.VIDEO, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post(API_ENDPOINTS.UPLOAD.AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  uploadDocument: (file) => {
    const formData = new FormData();
    formData.append('document', file);
    return apiClient.post(API_ENDPOINTS.UPLOAD.DOCUMENT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteFile: (filePath) => {
    return apiClient.delete(API_ENDPOINTS.UPLOAD.DELETE, {
      data: { filePath },
    });
  },
};

export default apiClient;