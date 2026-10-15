const URLS = {
  USER_SIGNUP: '/api/users/signup/',
  USER_LOGIN: '/api/users/login/',
  USER_VERIFY_OTP: '/api/users/verify-otp/',
  USER_RESEND_OTP: '/api/users/resend-otp/',
  USER_LOGOUT: '/api/users/logout/',
  USER_PROFILE: '/api/users/profile/',
  USER_PROFILE_UPDATE: '/api/users/profile/update/',
  USER_FCM_TOKEN: '/api/users/fcm-token/',
  // STUDENT ENDPOINTS
  STUDENT_PROFILE: '/api/students/profile/',
  STUDENT_PROFILE_CREATE: '/api/students/profile/create/',
  STUDENT_PROFILE_UPDATE: '/api/students/profile/update/',
  STUDENT_LIST: '/api/students/list/',
  // PAYMENT ENDPOINTS
  PAYMENT_LIST: '/api/payments/list/',
  PAYMENT_SCHEDULED_LIST: '/api/payments/scheduled/',
  // TUTOR ENDPOINTS
  TUTOR_LIST: '/api/tutors/list/',
  TUTOR_PROFILE: '/api/tutors/profile/',
  TUTOR_PROFILE_CREATE: '/api/tutors/profile/create/',
  TUTOR_PROFILE_UPDATE: '/api/tutors/profile/update/',
  COUNTRIES: '/api/master/countries/',
} as const;

export default URLS;
