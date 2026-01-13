export const $keys = {
  /** ACCOUNT TYPES **/
  ACCOUNT_ADMIN: 'Admin',
  ACCOUNT_SUPER_ADMIN: 'Super Admin',
  ACCOUNT_STUDENT: 'Student',
  ACCOUNT_TEACHER: 'Teacher',
  ACCOUNT_BUSINESS_DEVELOPER: 'Business Developer',
  ACCOUNT_SENIOR_ACADEMIC_COUNSELOR: 'Senior Academic Counselor',
  ACCOUNT_JUNIOR_ACADEMIC_COUNSELOR: 'Junior Academic Counselor',
  /** END OF ACCOUNT TYPES **/

  /** DATA TABLE KEYS **/
  DT_PROFILE: 'dt_profile',
  DT_BTNS: 'dt_btns',
  DT_CHIP: 'dt_chip',
  DT_CUSTOM: 'dt_custom',
  DT_TEXT: 'text',

  CUSTOM: 'custom'
} as const;

export default $keys;
