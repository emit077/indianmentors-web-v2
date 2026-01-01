const URLS = {
    USER_SIGNUP: "/api/users/signup/",
    USER_LOGIN: "/api/users/login/",
    USER_VERIFY_OTP: "/api/users/verify-otp/",
    USER_RESEND_OTP: "/api/users/resend-otp/",
    USER_LOGOUT: "/api/users/logout/",
    USER_PROFILE: "/api/users/profile/",
    USER_PROFILE_UPDATE: "/api/users/profile/update/",
    USER_FCM_TOKEN: "/api/users/fcm-token/",
    // STUDENT ENDPOINTS
    STUDENT_PROFILE: "/api/students/profile/",
    STUDENT_PROFILE_CREATE: "/api/students/profile/create/",
    STUDENT_PROFILE_UPDATE: "/api/students/profile/update/",
    STUDENT_LIST: "/api/students/list/",
    STUDENT_GET_BY_ID: (studentId: string | number) => `/api/students/${studentId}/`,
    STUDENT_DELETE: (studentId: string | number) => `/api/students/${studentId}/delete/`,
    STUDENT_ADDRESSES: "/api/students/addresses/",
    STUDENT_ADDRESS_GET: (addressId: string | number) => `/api/students/addresses/${addressId}/`,
    STUDENT_ADDRESS_DELETE: (addressId: string | number) => `/api/students/addresses/${addressId}/delete/`,
    STUDENT_GUARDIANS: "/api/students/guardians/",
    STUDENT_GUARDIAN_GET: (guardianId: string | number) => `/api/students/guardians/${guardianId}/`,
    STUDENT_GUARDIAN_DELETE: (guardianId: string | number) => `/api/students/guardians/${guardianId}/delete/`,
} as const;

export default URLS;
