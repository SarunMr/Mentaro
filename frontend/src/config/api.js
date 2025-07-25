// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    REGISTER_INSTRUCTOR: `${API_BASE_URL}/auth/instructor/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGIN_ADMIN: `${API_BASE_URL}/auth/admin/login`,
    LOGIN_INSTRUCTOR: `${API_BASE_URL}/auth/instructor/login`,
    VERIFY_TOKEN: `${API_BASE_URL}/auth/verify`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
  },
  
  // Course endpoints
  COURSES: {
    BASE: `${API_BASE_URL}/courses`,
    BY_ID: (id) => `${API_BASE_URL}/courses/${id}`,
    BY_INSTRUCTOR: `${API_BASE_URL}/courses/instructor`,
    SUBMIT_FOR_APPROVAL: (id) => `${API_BASE_URL}/courses/${id}/submit`,
    PUBLISH: (id) => `${API_BASE_URL}/courses/${id}/publish`,
    ADD_CHAPTER: (id) => `${API_BASE_URL}/courses/${id}/chapters`,
    ADD_LESSON: (courseId, chapterId) => `${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}/lessons`,
    ADD_REVIEW: (id) => `${API_BASE_URL}/courses/${id}/reviews`,
  },
  
  // Enrollment endpoints
  ENROLLMENTS: {
    ENROLL: (courseId) => `${API_BASE_URL}/enrollments/enroll/${courseId}`,
    MY_ENROLLMENTS: `${API_BASE_URL}/enrollments/my-enrollments`,
    PROGRESS: (courseId) => `${API_BASE_URL}/enrollments/progress/${courseId}`,
    COMPLETE_LESSON: (enrollmentId, lessonId) => `${API_BASE_URL}/enrollments/${enrollmentId}/lessons/${lessonId}/complete`,
    UPDATE_LAST_ACCESSED: (enrollmentId) => `${API_BASE_URL}/enrollments/${enrollmentId}/last-accessed`,
    WISHLIST: (courseId) => `${API_BASE_URL}/enrollments/wishlist/${courseId}`,
    CART: (courseId) => `${API_BASE_URL}/enrollments/cart/${courseId}`,
    INSTRUCTOR_ENROLLMENTS: `${API_BASE_URL}/enrollments/instructor/enrollments`,
    INSTRUCTOR_STATS: `${API_BASE_URL}/enrollments/instructor/stats`,
  },
  
  // User endpoints
  USERS: {
    WISHLIST: `${API_BASE_URL}/users/wishlist`,
    CART: `${API_BASE_URL}/users/cart`,
    ENROLLED_COURSES: `${API_BASE_URL}/users/enrolled-courses`,
    SEARCH_COURSES: `${API_BASE_URL}/users/search-courses`,
    CATEGORIES: `${API_BASE_URL}/users/categories`,
  },
  
  // Admin endpoints
  ADMIN: {
    DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
    USERS: `${API_BASE_URL}/admin/users`,
    UPDATE_USER_STATUS: (id) => `${API_BASE_URL}/admin/users/${id}/status`,
    UPDATE_USER: (id) => `${API_BASE_URL}/admin/users/${id}`,
    DELETE_USER: (id) => `${API_BASE_URL}/admin/users/${id}`,
    PENDING_INSTRUCTORS: `${API_BASE_URL}/admin/instructors/pending`,
    APPROVE_INSTRUCTOR: (id) => `${API_BASE_URL}/admin/instructors/${id}/approve`,
    REJECT_INSTRUCTOR: (id) => `${API_BASE_URL}/admin/instructors/${id}/reject`,
    PENDING_COURSES: `${API_BASE_URL}/admin/courses/pending`,
    APPROVE_COURSE: (id) => `${API_BASE_URL}/admin/courses/${id}/approve`,
    REJECT_COURSE: (id) => `${API_BASE_URL}/admin/courses/${id}/reject`,
    ALL_COURSES: `${API_BASE_URL}/admin/courses`,
    REVENUE_STATS: `${API_BASE_URL}/admin/revenue/stats`,
    CREATE_ADMIN: `${API_BASE_URL}/admin/create-admin`,
  },
  
  // Instructor endpoints
  INSTRUCTOR: {
    DASHBOARD: `${API_BASE_URL}/instructor/dashboard/stats`,
    STUDENTS: `${API_BASE_URL}/instructor/students`,
    REVENUE: `${API_BASE_URL}/instructor/revenue/monthly`,
    PROFILE: `${API_BASE_URL}/instructor/profile`,
    TOP_COURSES: `${API_BASE_URL}/instructor/top-courses`,
    RECENT_ACTIVITY: `${API_BASE_URL}/instructor/recent-activity`,
    RECENT_TRANSACTIONS: `${API_BASE_URL}/instructor/recent-transactions`,
    DISCOUNTS: `${API_BASE_URL}/instructor/discounts`,
    DISCOUNT_BY_ID: (id) => `${API_BASE_URL}/instructor/discounts/${id}`,
    TOGGLE_DISCOUNT_STATUS: (id) => `${API_BASE_URL}/instructor/discounts/${id}/toggle-status`,
  },
  
  // Student endpoints
  STUDENT: {
    DASHBOARD: `${API_BASE_URL}/student/dashboard/stats`,
    ENROLLED_COURSES: `${API_BASE_URL}/student/enrolled-courses`,
    RECENT_ACTIVITY: `${API_BASE_URL}/student/recent-activity`,
    PROGRESS_SUMMARY: `${API_BASE_URL}/student/progress-summary`,
  },
  
  // Upload endpoints
  UPLOAD: {
    COURSE_THUMBNAIL: `${API_BASE_URL}/upload/thumbnail`,
    VIDEO: `${API_BASE_URL}/upload/video`,
    AVATAR: `${API_BASE_URL}/upload/avatar`,
    DOCUMENT: `${API_BASE_URL}/upload/document`,
    DELETE: `${API_BASE_URL}/upload/delete`,
  },

  // Payment endpoints
  PAYMENTS: {
    CREATE: `${API_BASE_URL}/payments`,
    USER_PAYMENTS: `${API_BASE_URL}/payments/my-payments`,
    INSTRUCTOR_EARNINGS: `${API_BASE_URL}/payments/instructor/earnings`,
    ADMIN_ALL: `${API_BASE_URL}/payments/admin/all`,
    ADMIN_ANALYTICS: `${API_BASE_URL}/payments/admin/analytics`,
    REFUND: (enrollmentId) => `${API_BASE_URL}/payments/admin/refund/${enrollmentId}`,
  },

  // Discount endpoints
  DISCOUNTS: {
    BASE: `${API_BASE_URL}/discounts`,
    BY_ID: (id) => `${API_BASE_URL}/discounts/${id}`,
    TOGGLE_STATUS: (id) => `${API_BASE_URL}/discounts/${id}/toggle-status`,
    VALIDATE: `${API_BASE_URL}/discounts/validate`,
  },
};

export default API_BASE_URL;