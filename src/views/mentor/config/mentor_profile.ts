import { useAuthStore } from '@/stores/auth';
import $keys from '@/utils/keys';

const authStore = useAuthStore();
const user = authStore.getUser();

const mentorProfileConfig: Record<string, any> = {
  [$keys.ACCOUNT_ADMIN]: {
    pageHeaderConfig: {
      pageTitle: 'Mentor Profile',
      pageDescription: 'View and manage mentor profile details',
      showBackButton: true,
      breadcrumbs: [
        {
          title: 'Home',
          disabled: false,
          to: { name: 'Default' }
        },
        {
          title: 'Tutors',
          disabled: false,
          to: { name: 'MentorList' }
        },
        {
          title: 'Profile',
          disabled: true
        }
      ]
    },
    mentorProfileConfig: [
      {
        title: 'Basic Mentor Details',
        sectionKey: 'basic_details',
        fields: [
          {
            data: 'name',
            label: 'Full Name',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'tutor_id',
            label: 'Mentor ID',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'gender',
            label: 'Gender',
            fieldType: 'Display',
            cols: 4
          }
        ]
      },
      {
        title: 'Contact Details',
        sectionKey: 'contact_details',
        fields: [
          {
            data: 'email',
            label: 'Email',
            fieldType: 'Display',
            cols: 6
          },
          {
            data: 'mobile',
            label: 'Mobile',
            fieldType: 'Display',
            cols: 6
          },
          {
            data: 'alternate_mobile',
            label: 'Alternate Mobile',
            fieldType: 'Display',
            cols: 6
          },
          {
            data: 'city',
            label: 'City',
            fieldType: 'Display',
            cols: 6
          },
          {
            data: 'state',
            label: 'State',
            fieldType: 'Display',
            cols: 6
          }
        ]
      },
      {
        title: 'Professional Details',
        sectionKey: 'professional_details',
        fields: [
          {
            data: 'qualification',
            label: 'Highest Qualification',
            fieldType: 'Display',
            cols: 6
          },
          {
            data: 'experience_years',
            label: 'Teaching Experience (years)',
            fieldType: 'Display',
            cols: 6
          },
          {
            data: 'subjects',
            label: 'Subjects',
            fieldType: 'Display',
            cols: 12
          },
          {
            data: 'bio',
            label: 'Short Bio',
            fieldType: 'Display',
            cols: 12
          }
        ]
      }
    ]
  },
  [$keys.ACCOUNT_TEACHER]: {
    pageHeaderConfig: {
      pageTitle: 'My Mentor Profile',
      pageDescription: 'Manage and update your mentor profile',
      showBackButton: true,
      breadcrumbs: [
        {
          title: 'Home',
          disabled: false,
          to: { name: 'Default' }
        },
        {
          title: 'My Profile',
          disabled: true
        }
      ]
    },
    mentorProfileConfig: [
      {
        title: 'Basic Mentor Details',
        sectionKey: 'basic_details',
        fields: [
          {
            data: 'name',
            label: 'Full Name',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'tutor_id',
            label: 'Mentor ID',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'gender',
            label: 'Gender',
            fieldType: 'Display',
            cols: 4
          }
        ]
      },
      {
        title: 'Contact Details',
        sectionKey: 'contact_details',
        fields: [
          {
            data: 'email',
            label: 'Email',
            fieldType: 'Display',
            cols: 6
          },
          {
            data: 'mobile',
            label: 'Mobile',
            fieldType: 'Display',
            cols: 6
          },
          {
            data: 'alternate_mobile',
            label: 'Alternate Mobile',
            fieldType: 'Display',
            cols: 6
          },
          {
            data: 'city',
            label: 'City',
            fieldType: 'Display',
            cols: 6
          },
          {
            data: 'state',
            label: 'State',
            fieldType: 'Display',
            cols: 6
          }
        ]
      },
      {
        title: 'Professional Details',
        sectionKey: 'professional_details',
        fields: [
          {
            data: 'qualification',
            label: 'Highest Qualification',
            fieldType: 'Display',
            cols: 6
          },
          {
            data: 'experience_years',
            label: 'Teaching Experience (years)',
            fieldType: 'Display',
            cols: 6
          },
          {
            data: 'subjects',
            label: 'Subjects',
            fieldType: 'Display',
            cols: 12
          },
          {
            data: 'bio',
            label: 'Short Bio',
            fieldType: 'Display',
            cols: 12
          }
        ]
      }
    ]
  }
};

const pageConfig = mentorProfileConfig[user.account_type] || mentorProfileConfig[$keys.ACCOUNT_TEACHER];

export default pageConfig;

