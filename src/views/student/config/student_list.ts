import $keys from '@/utils/keys';

export interface columns {
  title?: string;
  key?: string;
  align?: string;
  sortable?: boolean | false;
  formatType?: string;
  width?: string;
  maxWidth?: string;
  minWidth?: string;
}

export interface ProfileCardConfigItem {
  formatType: string; // e.g. $keys.DT_PROFILE, $keys.DT_CUSTOM, etc.
  label: string; // slot name / display label
  value: string; // e.g. "profile_card"
  className?: string; // optional CSS classes
}

export interface ProfileListChild {
  formatType: string; // $keys.DT_TEXT | $keys.DT_PROFILE | etc.
  label: string; // label or slot name
  value: string; // key to extract from data
  className?: string; // optional
}

export interface ProfileListGroup {
  className: string; // col classes like "v-col-4"
  childs: ProfileListChild[];
}

export type ProfileListItem = ProfileListGroup | ProfileListChild;

export const headers: columns[] = [
  { title: 'Student ID', key: 'student_id', minWidth: '65px', sortable: false },
  { title: 'Student Info', key: 'user', minWidth: '100px', align: 'start', formatType: $keys.DT_PROFILE, sortable: false },
  { title: 'Class & Board', key: 'class_name', maxWidth: '200px', formatType: $keys.DT_CUSTOM, sortable: false },
  { title: 'Location', key: 'city', sortable: false },
  // { title: 'Status', key: 'profile_status', formatType: $keys.DT_CHIP },
  { title: 'Signup Date', key: 'signup_date', sortable: false },
  { title: 'Actions', key: 'DT_BTNS', align: 'end', formatType: $keys.DT_CUSTOM, sortable: false }
];

export const profileCardConfig: ProfileCardConfigItem[] = [
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
];
export const profileListConfig: ProfileListGroup[] = [
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
];
