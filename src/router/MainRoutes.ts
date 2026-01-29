const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: '/main',
  component: () => import('@/layouts/admin/AdminLayout.vue'),
  children: [
    {
      name: '',
      path: '/',
      component: () => import('@/views/dashboards/default/DefaultDashboard.vue')
    },
    {
      name: 'Default',
      path: '/dashboard',
      component: () => import('@/views/dashboards/default/DefaultDashboard.vue')
    },
    {
      name: 'Starter',
      path: '/starter',
      component: () => import('@/views/StarterPage.vue')
    },
    {
      name: 'Typography',
      path: '/utils/typography',
      component: () => import('@/views/utilities/typography/TypographyPage.vue')
    },
    {
      name: 'Colors',
      path: '/utils/colors',
      component: () => import('@/views/utilities/colors/ColorPage.vue')
    },
    {
      name: 'Shadows',
      path: '/utils/shadows',
      component: () => import('@/views/utilities/shadows/ShadowPage.vue')
    },
    {
      name: 'Icons',
      path: '/utils/icons',
      component: () => import('@/views/utilities/icons/IconsPage.vue')
    },
    {
      name: 'StudentList',
      path: '/students/',
      component: () => import('@/views/student/StudentList.vue')
    },
    {
      name: 'StudentProfile',
      path: '/students/profile/:id',
      component: () => import('@/views/student/StudentProfile.vue')
    },
    {
      name: 'SessionList',
      path: '/sessions/list',
      component: () => import('@/views/session/SessionList.vue')
    },
    {
      name: 'BrowseTutors',
      path: '/browse/tutors',
      component: () => import('@/views/browse/Browse.vue')
    },
    {
      name: 'BrowseProfile',
      path: '/browse/profile/:id',
      component: () => import('@/views/browse/Profile.vue')
    },
    {
      name: 'StudentBrowseSubscription',
      path: '/subscription/browse',
      component: () => import('@/views/subscription/StudentBrowseSubscription.vue')
    },
    {
      name: 'Chat',
      path: '/chat',
      component: () => import('@/views/chat/ChatView.vue')
    }
  ]
};

export default MainRoutes;
