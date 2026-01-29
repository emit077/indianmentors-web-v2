import $keys from '@/utils/keys';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const user = authStore.getUser();
import { encrypt } from '@/utils/helpers/crypto';

const leftDrawerConfig: Record<string, any> = {
  [$keys.ACCOUNT_ADMIN]: {
    drawerItems: [
      { header: 'Dashboard' },
      {
        title: 'Dashboard',
        icon: 'custom-home-trend',
        to: '/dashboard/'
      },
      {
        title: 'Subscriptions',
        icon: 'custom-flag',
        to: '/dashboard/',
        children: [
          {
            title: 'Subscriptions Plan',
            icon: 'custom-home-trend',
            to: '/dashboard/subscriptions/plan'
          },
          {
            title: 'Subscriptions History',
            icon: 'custom-home-trend',
            to: '/dashboard/subscriptions/history'
          }
        ]
      },
      {
        title: 'Students',
        icon: 'custom-user-1',
        to: '/students'
      },
      {
        title: 'Mentors',
        icon: 'custom-users',
        to: '/dashboard/mentors'
      },
      {
        title: 'Teams',
        icon: 'custom-user-add',
        to: '/dashboard/teams'
      },
      {
        title: 'Payments',
        icon: 'custom-inr-square',
        to: '/dashboard/payments'
      },
      {
        title: 'Payouts',
        icon: 'custom-wallet',
        to: '/dashboard/payouts'
      },
      {
        title: 'Chat',
        icon: 'custom-chat',
        to: '/chat'
      },
      {
        title: 'Support',
        icon: 'custom-support',
        to: '/dashboard/support'
      },
      { header: 'Utilities' },
      {
        title: 'Typography',
        icon: 'custom-typography',
        to: '/utils/typography'
      },
      {
        title: 'Colors',
        icon: 'custom-colorpick',
        to: '/utils/colors'
      },
      {
        title: 'Shadows',
        icon: 'custom-shadow',
        to: '/utils/shadows'
      },
      {
        title: 'Icons',
        icon: 'custom-shapes',
        to: '/utils/icons'
      },
      { header: 'Pages' },
      {
        title: 'Login',
        icon: 'custom-shield',
        to: '/auth/login/'
      },
      {
        title: 'Register',
        icon: 'custom-register',
        to: '/auth/register1'
      },
      { header: 'Others' },
      {
        title: 'Sample Page',
        icon: 'custom-sample',
        to: '/starter'
      },
      {
        title: 'Documentation',
        icon: 'custom-support',
        to: 'https://phoenixcoded.gitbook.io/able-pro/v/vue/',
        type: 'external'
      }
    ]
  },
  [$keys.ACCOUNT_STUDENT]: {
    drawerItems: [
      { header: 'Dashboard' },
      {
        title: 'Dashboard',
        icon: 'custom-home-trend',
        to: '/dashboard/'
      },
      {
        title: 'profile',
        icon: 'custom-user-1',
        to: '/students/profile/' + encrypt(user.user_id.toString())
      },
      {
        title: 'Subscriptions',
        icon: 'custom-flag',
        to: '/dashboard/',
        children: [
          {
            title: 'Subscriptions Plan',
            icon: 'custom-home-trend',
            to: '/subscription/browse'
          },
          {
            title: 'Subscriptions History',
            icon: 'custom-home-trend',
            to: '/dashboard/subscriptions/history'
          }
        ]
      },
      {
        title: 'Browse Tutors',
        icon: 'custom-search-normal',
        to: '/browse/tutors'
      },

      {
        title: 'Classes',
        icon: 'custom-calendar-check',
        to: '/sessions/list'
      },
      {
        title: 'Transactions',
        icon: 'custom-inr-square',
        to: '/dashboard/payments'
      },
      {
        title: 'Messages',
        icon: 'custom-message-note',
        to: '/dashboard/messages'
      },
      {
        title: 'Chat',
        icon: 'custom-chat',
        to: '/chat'
      },
      {
        title: 'Support',
        icon: 'custom-support',
        to: '/dashboard/support'
      }
    ]
  }
};
const leftDrawerItems = leftDrawerConfig[user.account_type];
export default leftDrawerItems;
