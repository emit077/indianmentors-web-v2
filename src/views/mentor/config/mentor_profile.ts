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
            data: 'id',
            label: 'Id',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'tutor_id',
            label: 'Tutor Id',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'name',
            label: 'Name',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'account_type',
            label: 'Account Type',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'user_id',
            label: 'User Id',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'signup_date',
            label: 'Signup Date',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'date_of_birth',
            label: 'Date Of Birth',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'gender',
            label: 'Gender',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'religion',
            label: 'Religion',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'marital_status',
            label: 'Marital Status',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'mobile',
            label: 'Mobile',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'email',
            label: 'Email',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'contact_number',
            label: 'Contact Number',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'whatsapp_number',
            label: 'Whatsapp Number',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'alternate_number',
            label: 'Alternate Number',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'profile_bio',
            label: 'Profile Bio',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'achievements',
            label: 'Achievements',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'hobbies',
            label: 'Hobbies',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'social_media_links',
            label: 'Social Media Links',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'self_introduction_video',
            label: 'Self Introduction Video',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'location',
            label: 'Location',
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
      },
      {
        title: 'Educations',
        sectionKey: 'educations',
        fields: [
          {
            data: 'institution_name',
            label: 'Educations',
            fieldType: $keys.CUSTOM,
            cols: 12
          }
        ]
      },
      {
        title: 'Address Details',
        sectionKey: 'address_details',
        dialogComponent: 'AddressDetailsDialog',
        fields: [
          {
            data: 'country',
            label: 'Country',
            fieldType: 'TextField',
            cols: 4,
            editable: true,
            defaultValue: 'India'
          },
          {
            data: 'state',
            label: 'State',
            fieldType: 'TextField',
            cols: 4,
            editable: true
          },
          {
            data: 'city',
            label: 'City/District',
            fieldType: 'TextField',
            cols: 4,
            editable: true
          },
          {
            data: 'locality',
            label: 'Locality/Area',
            fieldType: 'TextField',
            cols: 4,
            editable: true
          },
          {
            data: 'address',
            label: 'Street Address',
            fieldType: 'TextArea',
            cols: 4,
            editable: true
          },
          {
            data: 'pin_code',
            label: 'Pincode',
            fieldType: 'Number',
            cols: 4,
            editable: true
          },
          {
            data: 'address_type',
            label: 'Address Type',
            fieldType: 'Dropdown',
            cols: 4,
            editable: true,
            dropdownOptions: [
              { value: 'Permanent', label: 'Permanent' },
              { value: 'Temporary', label: 'Temporary' }
            ],
            defaultValue: 'Permanent'
          },
          {
            data: 'commute_availability',
            label: 'Commute Availability',
            fieldType: 'Checkbox',
            formatType: 'boolean',
            cols: 4,
            editable: true
          }
        ]
      },
      {
        title: 'Professional Details (Advanced)',
        sectionKey: 'professional_details_advanced',
        fields: [
          {
            data: 'professional_details',
            label: 'Professional Details',
            fieldType: 'Display',
            cols: 12
          }
        ]
      },
      {
        title: 'Experiences',
        sectionKey: 'experiences',
        fields: [
          {
            data: 'experiences',
            label: 'Experiences',
            fieldType: 'Display',
            cols: 12
          }
        ]
      },
      {
        title: 'Tutoring Preferences',
        sectionKey: 'tutoring_preferences',
        fields: [
          {
            data: 'tutoring_preferences',
            label: 'Tutoring Preferences',
            fieldType: 'Display',
            cols: 12
          }
        ]
      },
      {
        title: 'Student Preference',
        sectionKey: 'student_preference',
        fields: [
          {
            data: 'student_preference',
            label: 'Student Preference',
            fieldType: 'Display',
            cols: 12
          }
        ]
      },
      {
        title: 'Documents',
        sectionKey: 'documents',
        fields: [
          {
            data: 'documents',
            label: 'Documents',
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
            data: 'id',
            label: 'Id',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'tutor_id',
            label: 'Tutor Id',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'name',
            label: 'Name',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'account_type',
            label: 'Account Type',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'user_id',
            label: 'User Id',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'signup_date',
            label: 'Signup Date',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'date_of_birth',
            label: 'Date Of Birth',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'gender',
            label: 'Gender',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'religion',
            label: 'Religion',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'marital_status',
            label: 'Marital Status',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'mobile',
            label: 'Mobile',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'email',
            label: 'Email',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'contact_number',
            label: 'Contact Number',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'whatsapp_number',
            label: 'Whatsapp Number',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'alternate_number',
            label: 'Alternate Number',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'profile_bio',
            label: 'Profile Bio',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'achievements',
            label: 'Achievements',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'hobbies',
            label: 'Hobbies',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'social_media_links',
            label: 'Social Media Links',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'self_introduction_video',
            label: 'Self Introduction Video',
            fieldType: 'Display',
            cols: 4
          },
          {
            data: 'location',
            label: 'Location',
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
      },
      {
        title: 'Educations',
        sectionKey: 'educations',
        fields: [
          {
            data: 'educations',
            label: 'Educations',
            fieldType: 'Display',
            cols: 12
          }
        ]
      },
      {
        title: 'Addresses',
        sectionKey: 'addresses',
        fields: [
          {
            data: 'addresses',
            label: 'Addresses',
            fieldType: 'Display',
            cols: 12
          }
        ]
      },
      {
        title: 'Professional Details (Advanced)',
        sectionKey: 'professional_details_advanced',
        fields: [
          {
            data: 'professional_details',
            label: 'Professional Details',
            fieldType: 'Display',
            cols: 12
          }
        ]
      },
      {
        title: 'Experiences',
        sectionKey: 'experiences',
        fields: [
          {
            data: 'experiences',
            label: 'Experiences',
            fieldType: 'Display',
            cols: 12
          }
        ]
      },
      {
        title: 'Tutoring Preferences',
        sectionKey: 'tutoring_preferences',
        fields: [
          {
            data: 'tutoring_preferences',
            label: 'Tutoring Preferences',
            fieldType: 'Display',
            cols: 12
          }
        ]
      },
      {
        title: 'Student Preference',
        sectionKey: 'student_preference',
        fields: [
          {
            data: 'student_preference',
            label: 'Student Preference',
            fieldType: 'Display',
            cols: 12
          }
        ]
      },
      {
        title: 'Documents',
        sectionKey: 'documents',
        fields: [
          {
            data: 'documents',
            label: 'Documents',
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

