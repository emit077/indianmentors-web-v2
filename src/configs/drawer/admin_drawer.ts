export interface menu {
  header?: string;
  title?: string;
  icon?: string;
  to?: string;
  divider?: boolean;
  getURL?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [
  { header: 'Dashboard' },
  {
    title: 'Dashboard',
    icon: 'custom-home-trend',
    to: '/dashboard/default'
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
    to: '/dashboard/students'
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
    title: 'Support',
    icon: 'custom-chat',
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
    to: '/auth/login1'
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
];

export default sidebarItem;
