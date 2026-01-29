import $keys from '@/utils/keys';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const user = authStore.getUser();
import URLS from '@/utils/urls';
const studentListConfig: Record<string, any> = {
  [$keys.ACCOUNT_ADMIN]: {
    API_URL: URLS.STUDENT_LIST,
    SEARCH_LABEL: 'Search Tutors',
    pageHeaderConfig: {
      pageTitle: 'Browse Tutors',
      pageDescription: 'Manage and view all tutor profiles',
      showBackButton: true,
      breadcrumbs: [
        {
          title: 'Home',
          disabled: false,
          to: { name: 'Default' }
        }
      ]
    },
    profileCardConfig: [
      {
        formatType: $keys.DT_PROFILE,
        label: '',
        value: 'profile_card',
        className: 'mb-v-col-md-12 v-col-12'
      },
      {
        formatType: $keys.DT_CUSTOM,
        label: 'classAndBoard',
        value: '',
        className: 'mb-v-col-md-6 v-col-6'
      },
      {
        formatType: $keys.DT_TEXT,
        label: 'Phone',
        value: 'mobile',
        className: 'mb-v-col-md-6 v-col-6'
      },
      {
        formatType: $keys.DT_TEXT,
        label: 'Signup Date',
        value: 'signup_date',
        className: 'mb-v-col-md-6 v-col-6'
      },
      {
        formatType: $keys.DT_TEXT,
        label: 'City',
        value: 'city',
        className: 'mb-v-col-md-6 v-col-6'
      },
      {
        formatType: $keys.DT_CUSTOM,
        label: 'actionBtn',
        value: '',
        className: 'mb-v-col-md-12 v-col-12'
      }
    ],
  },
  [$keys.ACCOUNT_STUDENT]: {
    API_URL: URLS.STUDENT_LIST,
    SEARCH_LABEL: 'Search Tutors',
    pageHeaderConfig: {
      pageTitle: 'Browse Tutors',
      pageDescription: 'Manage and view all student profiles',
      showBackButton: true,
      breadcrumbs: [
        {
          title: 'Home',
          disabled: false,
          to: { name: 'Default' }
        },
        {
          title: 'Browse Tutors',
          disabled: true,
        }
      ]
    },
    profileCardConfig: [
      {
        formatType: $keys.DT_PROFILE,
        label: '',
        value: 'profile_card',
        className: 'mb-v-col-md-12 v-col-12'
      },
      {
        formatType: $keys.DT_CUSTOM,
        label: 'classAndBoard',
        value: '',
        className: 'mb-v-col-md-6 v-col-6'
      },
      {
        formatType: $keys.DT_TEXT,
        label: 'Phone',
        value: 'mobile',
        className: 'mb-v-col-md-6 v-col-6'
      },
      {
        formatType: $keys.DT_TEXT,
        label: 'Signup Date',
        value: 'signup_date',
        className: 'mb-v-col-md-6 v-col-6'
      },
      {
        formatType: $keys.DT_TEXT,
        label: 'City',
        value: 'city',
        className: 'mb-v-col-md-6 v-col-6'
      },
      {
        formatType: $keys.DT_CUSTOM,
        label: 'actionBtn',
        value: '',
        className: 'mb-v-col-md-12 v-col-12'
      }
    ],
  }
};
const pageConfig = studentListConfig[user.account_type];
export default pageConfig;
