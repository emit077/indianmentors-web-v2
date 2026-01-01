const AuthRoutes = {
  path: '/auth',
  component: () => import('@/layouts/blank/BlankLayout.vue'),
  meta: {
    requiresAuth: false
  },
  children: [
    {
      name: 'Login',
      path: '/auth/login1',
      component: () => import('@/views/authentication/auth1/LoginPage1.vue')
    },
    {
      name: 'Register',
      path: '/auth/register1',
      component: () => import('@/views/authentication/auth1/RegisterPage1.vue')
    },
    {
      name: 'Forgot Password',
      path: '/auth/forgot-pwd1',
      component: () => import('@/views/authentication/auth1/ForgotPwd1.vue')
    },
    {
      name: 'Reset Password',
      path: '/auth/reset-pwd1',
      component: () => import('@/views/authentication/auth1/ResetPwd1.vue')
    },
    {
      name: 'Verify OTP',
      path: '/auth/verify-otp',
      component: () => import('@/views/authentication/auth1/CodeVerification1.vue')
    },
    {
      name: 'Mobile Login',
      path: '/auth/mobile-login',
      component: () => import('@/views/authentication/auth1/LoginPage1.vue')
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
