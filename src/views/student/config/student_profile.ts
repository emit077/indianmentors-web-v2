export interface FieldConfig {
  data: string;
  label: string;
  editable?: boolean;
  fieldType?: String; //'TextField' | 'TextArea' | 'Dropdown' | 'DatePicker' | 'Number' | 'Checkbox' | 'MultiSelect' | 'Display' | 'Avatar';
  dropdownOptions?: Array<{ value: string | number; label: string }>;
  required?: boolean;
  cols?: number | string;
  helpText?: string;
  formatType?: 'date' | 'currency' | 'phone' | 'email' | 'array' | 'boolean';
  class?: string;
  condition?: (data: any) => boolean; // Show field only if condition is true
  defaultValue?: any;
}

export interface SectionConfig {
  title: string;
  icon?: string;
  sectionKey: string;
  dialogComponent?: string;
  fields: FieldConfig[];
}

export const studentProfileConfig: SectionConfig[] = [
  {
    title: '👤 Basic Student Details',
    icon: 'mdi-account',
    sectionKey: 'basic_details',
    dialogComponent: 'BasicDetailsDialog',
    fields: [
      {
        data: 'profile_picture',
        label: 'Profile Picture',
        fieldType: 'Avatar',
        cols: 3,
        editable: true,
        class: 'text-center'
      },
      {
        data: 'name',
        label: 'Full Name',
        fieldType: 'Display',
        cols: 3,
        editable: true,
        required: true
      },
      {
        data: 'date_of_birth',
        label: 'Date of Birth',
        fieldType: 'DatePicker',
        formatType: 'date',
        cols: 3,
        editable: true
      },
      {
        data: 'age',
        label: 'Age',
        fieldType: 'Number',
        cols: 3,
        editable: true
      },
      {
        data: 'gender',
        label: 'Gender',
        fieldType: 'Dropdown',
        cols: 3,
        editable: true,
        dropdownOptions: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        data: 'class_name',
        label: 'Grade/Class',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'school_name',
        label: 'School/College Name',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'education_board',
        label: 'Board/University/Curriculum',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'subjects',
        label: 'Subjects Opted',
        fieldType: 'MultiSelect',
        formatType: 'array',
        cols: 3,
        editable: true
      },
      {
        data: 'learning_mode',
        label: 'Preferred Learning Mode',
        fieldType: 'Dropdown',
        cols: 3,
        editable: true,
        dropdownOptions: [
          { value: 'online', label: 'Online' },
          { value: 'offline', label: 'Offline' },
          { value: 'hybrid', label: 'Hybrid' }
        ]
      },
      {
        data: 'course_name',
        label: 'Course Name',
        fieldType: 'TextField',
        cols: 3,
        editable: true,
        condition: (data) => !!data.course_name
      },
      {
        data: 'student_id',
        label: 'Student ID',
        fieldType: 'Display',
        cols: 3,
        editable: false
      }
    ]
  },
  {
    title: '📘 Academic Details',
    icon: 'mdi-school',
    sectionKey: 'academic_details',
    dialogComponent: 'AcademicDetailsDialog',
    fields: [
      {
        data: 'medium_of_instruction',
        label: 'Medium of Instruction',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'syllabus_coverage',
        label: 'Syllabus Coverage',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'syllabus_type',
        label: 'Syllabus Type',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'academic_stream',
        label: 'Academic Stream',
        fieldType: 'TextField',
        cols: 3,
        editable: true,
        condition: (data) => !!data.academic_stream
      },
      {
        data: 'learning_goals',
        label: 'Learning Goals',
        fieldType: 'MultiSelect',
        formatType: 'array',
        cols: 3,
        editable: true
      },
      {
        data: 'achievements',
        label: 'Achievements',
        fieldType: 'TextArea',
        cols: 3,
        editable: true,
        condition: (data) => !!data.achievements
      },
      {
        data: 'special_concerns',
        label: 'Special Concerns',
        fieldType: 'TextArea',
        cols: 3,
        editable: true,
        condition: (data) => !!data.special_concerns
      },
      {
        data: 'previous_tuition',
        label: 'Previous Tuition Experience',
        fieldType: 'TextField',
        cols: 3,
        editable: true,
        condition: (data) => !!data.previous_tuition
      }
    ]
  },
  {
    title: '📍 Address Details',
    icon: 'mdi-map-marker',
    sectionKey: 'address_details',
    dialogComponent: 'AddressDetailsDialog',
    fields: [
      {
        data: 'country',
        label: 'Country',
        fieldType: 'TextField',
        cols: 3,
        editable: true,
        defaultValue: 'India'
      },
      {
        data: 'state',
        label: 'State',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'city',
        label: 'City/District',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'locality',
        label: 'Locality/Area',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'address',
        label: 'Street Address',
        fieldType: 'TextArea',
        cols: 3,
        editable: true
      },
      {
        data: 'pin_code',
        label: 'Pincode',
        fieldType: 'Number',
        cols: 3,
        editable: true
      },
      {
        data: 'address_type',
        label: 'Address Type',
        fieldType: 'Dropdown',
        cols: 3,
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
        cols: 3,
        editable: true
      }
    ]
  },
  {
    title: '🎯 Tutoring Service Preferences',
    icon: 'mdi-target',
    sectionKey: 'tutoring_preferences',
    dialogComponent: 'TutoringPreferencesDialog',
    fields: [
      {
        data: 'class_mode',
        label: 'Mode of Class',
        fieldType: 'Dropdown',
        cols: 3,
        editable: true
      },
      {
        data: 'batch_type',
        label: 'Batch Type',
        fieldType: 'Dropdown',
        cols: 3,
        editable: true
      },
      {
        data: 'career_aspirations',
        label: 'Career Aspirations',
        fieldType: 'MultiSelect',
        formatType: 'array',
        cols: 3,
        editable: true
      },
      {
        data: 'budget_range',
        label: 'Budget Range',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'plan_to_hire',
        label: 'Plan to Hire',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'session_duration',
        label: 'Session Duration',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'hobbies',
        label: 'Hobbies/Interests',
        fieldType: 'MultiSelect',
        formatType: 'array',
        cols: 3,
        editable: true
      }
    ]
  },
  {
    title: '👨‍🏫 Tutor Preference Details',
    icon: 'mdi-account-tie',
    sectionKey: 'tutor_preferences',
    dialogComponent: 'TutorPreferencesDialog',
    fields: [
      {
        data: 'gender_preference',
        label: 'Gender Preference',
        fieldType: 'Dropdown',
        cols: 3,
        editable: true
      },
      {
        data: 'age_preference',
        label: 'Age Preference',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'tutor_type_preference',
        label: 'Tutor Type',
        fieldType: 'Dropdown',
        cols: 3,
        editable: true
      },
      {
        data: 'qualification_preference',
        label: 'Qualification Preference',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'experience_preference',
        label: 'Experience Preference',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'teaching_style_preference',
        label: 'Teaching Style',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      }
    ]
  },
  {
    title: '👨‍👩‍👧 Parent / Guardian Details',
    icon: 'mdi-account-group',
    sectionKey: 'parent_details',
    dialogComponent: 'ParentDetailsDialog',
    fields: [
      {
        data: 'primary_contact_name',
        label: 'Primary Contact Name',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'primary_contact_relation',
        label: 'Relation',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'primary_contact_mobile',
        label: 'Mobile',
        fieldType: 'TextField',
        formatType: 'phone',
        cols: 3,
        editable: true
      },
      {
        data: 'primary_contact_email',
        label: 'Email',
        fieldType: 'TextField',
        formatType: 'email',
        cols: 3,
        editable: true
      },
      {
        data: 'emergency_contact_name',
        label: 'Emergency Contact',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'father_name',
        label: 'Father Name',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'father_mobile',
        label: 'Father Mobile',
        fieldType: 'TextField',
        formatType: 'phone',
        cols: 3,
        editable: true
      },
      {
        data: 'father_email',
        label: 'Father Email',
        fieldType: 'TextField',
        formatType: 'email',
        cols: 3,
        editable: true
      },
      {
        data: 'mother_name',
        label: 'Mother Name',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'mother_mobile',
        label: 'Mother Mobile',
        fieldType: 'TextField',
        formatType: 'phone',
        cols: 3,
        editable: true
      },
      {
        data: 'mother_email',
        label: 'Mother Email',
        fieldType: 'TextField',
        formatType: 'email',
        cols: 3,
        editable: true
      }
    ]
  },
  {
    title: '📢 How Did You Hear About Us?',
    icon: 'mdi-bullhorn',
    sectionKey: 'referral',
    dialogComponent: 'ReferralDialog',
    fields: [
      {
        data: 'referral_source',
        label: 'Referral Source',
        fieldType: 'TextField',
        cols: 3,
        editable: true
      },
      {
        data: 'referral_other',
        label: 'Details',
        fieldType: 'TextArea',
        cols: 3,
        editable: true,
        condition: (data) => !!data.referral_other
      }
    ]
  },
  {
    title: '📎 Additional Details',
    icon: 'mdi-file-document',
    sectionKey: 'additional_details',
    dialogComponent: 'AdditionalDetailsDialog',
    fields: [
      {
        data: 'id_proof',
        label: 'ID Proof Uploaded',
        fieldType: 'Checkbox',
        formatType: 'boolean',
        cols: 3,
        editable: true
      }
    ]
  }
];

export default studentProfileConfig;
