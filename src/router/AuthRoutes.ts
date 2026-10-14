const AuthRoutes = {
  path: '/auth',
  component: () => import('@/layouts/auth/AuthLayout.vue'),
  meta: {
    requiresAuth: false
  },
  children: [
    {
      name: 'Login',
      path: '/auth/login',
      component: () => import('@/views/authentication/auth/LoginPage.vue')
    },
    {
      name: 'Register',
      path: '/auth/register1',
      component: () => import('@/views/authentication/auth/RegisterPage1.vue')
    },
    {
      name: 'StudentSignup',
      path: '/student/signup',
      component: () => import('@/views/authentication/auth/StudentSignupPage.vue')
    },
    {
      name: 'Forgot Password',
      path: '/auth/forgot-pwd1',
      component: () => import('@/views/authentication/auth/ForgotPwd1.vue')
    },
    {
      name: 'Reset Password',
      path: '/auth/reset-pwd1',
      component: () => import('@/views/authentication/auth/ResetPwd1.vue')
    },
    {
      name: 'Verify OTP',
      path: '/auth/verify-otp',
      component: () => import('@/views/authentication/auth/CodeVerification1.vue')
    },
    {
      name: 'Mobile Login',
      path: '/auth/mobile-login',
      component: () => import('@/views/authentication/auth/LoginPage.vue')
    },
    {
      name: 'Google Callback',
      path: '/auth/google/callback',
      component: () => import('@/views/authentication/authForms/GoogleCallback.vue')
    },
    {
      name: 'Error 404',
      path: '/pages/error',
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    }
  ]
};

export default AuthRoutes;
