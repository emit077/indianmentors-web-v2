import $keys from '@/utils/keys';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const user = authStore.getUser();

const mentorListConfig: Record<string, any> = {
  [$keys.ACCOUNT_ADMIN]: {
    pageHeaderConfig: {
      pageTitle: 'Tutors',
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
    dataTableConfig: {
      headers: [
        { title: 'Tutor ID', key: 'tutor_id', minWidth: '65px', sortable: false },
        { title: 'Tutor Info', key: 'user', minWidth: '100px', align: 'start', formatType: $keys.DT_PROFILE, sortable: false },
        // { title: 'Subject & Board', key: 'class_name', maxWidth: '200px', formatType: $keys.DT_CUSTOM, sortable: false },
        { title: 'Location', key: 'city', sortable: false },
        { title: 'Signup Date', key: 'signup_date', sortable: false },
        { title: 'Actions', key: 'DT_BTNS', align: 'end', formatType: $keys.DT_CUSTOM, sortable: false }
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
    profileListConfig: [
      {
        className: 'mb-v-col-md-4 v-col-4',
        childs: [
          {
            formatType: $keys.DT_PROFILE,
            label: '',
            value: 'profile_card',
            className: ''
          }
        ]
      },
      {
        className: 'mb-v-col-md-3 v-col-3',
        childs: [
          {
            formatType: $keys.DT_TEXT,
            label: 'Phone',
            value: 'mobile',
            className: ''
          },
          {
            formatType: $keys.DT_TEXT,
            label: 'Email',
            value: 'email',
            className: ''
          }
        ]
      },
      {
        className: 'mb-v-col-md-3 v-col-3',
        childs: [
          {
            formatType: $keys.DT_TEXT,
            label: 'City',
            value: 'city',
            className: ''
          },
          {
            formatType: $keys.DT_TEXT,
            label: 'Status',
            value: '',
            className: ''
          }
        ]
      },
      {
        className: 'mb-v-col-md-2 v-col-2',
        childs: [
          {
            formatType: $keys.DT_CUSTOM,
            label: 'actionBtn',
            value: '',
            className: ''
          }
        ]
      }
    ]
  },
  [$keys.ACCOUNT_STUDENT]: {
    pageHeaderConfig: {
      pageTitle: 'Tutors',
      pageDescription: 'Browse and view all tutor profiles',
      showBackButton: true,
      breadcrumbs: [
        {
          title: 'Home',
          disabled: false,
          to: { name: 'Default' }
        }
      ]
    },
    dataTableConfig: {
      headers: [
        { title: 'Tutor ID', key: 'student_id', minWidth: '65px', sortable: false },
        { title: 'Tutor Info', key: 'user', minWidth: '100px', align: 'start', formatType: $keys.DT_PROFILE, sortable: false },
        { title: 'Subject & Board', key: 'class_name', maxWidth: '200px', formatType: $keys.DT_CUSTOM, sortable: false },
        { title: 'Location', key: 'city', sortable: false },
        { title: 'Signup Date', key: 'signup_date', sortable: false },
        { title: 'Actions', key: 'DT_BTNS', align: 'end', formatType: $keys.DT_CUSTOM, sortable: false }
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
    profileListConfig: [
      {
        className: 'mb-v-col-md-4 v-col-4',
        childs: [
          {
            formatType: $keys.DT_PROFILE,
            label: '',
            value: 'profile_card',
            className: ''
          }
        ]
      },
      {
        className: 'mb-v-col-md-3 v-col-3',
        childs: [
          {
            formatType: $keys.DT_TEXT,
            label: 'Phone',
            value: 'mobile',
            className: ''
          },
          {
            formatType: $keys.DT_TEXT,
            label: 'Email',
            value: 'email',
            className: ''
          }
        ]
      },
      {
        className: 'mb-v-col-md-3 v-col-3',
        childs: [
          {
            formatType: $keys.DT_TEXT,
            label: 'City',
            value: 'city',
            className: ''
          },
          {
            formatType: $keys.DT_TEXT,
            label: 'Status',
            value: '',
            className: ''
          }
        ]
      },
      {
        className: 'mb-v-col-md-2 v-col-2',
        childs: [
          {
            formatType: $keys.DT_CUSTOM,
            label: 'actionBtn',
            value: '',
            className: ''
          }
        ]
      }
    ]
  }
};

const pageConfig = mentorListConfig[user.account_type];
export default pageConfig;

