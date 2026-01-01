/**
 * Reusable validation rules for forms
 * These are plain functions that can be used with Vuetify's :rules prop
 */

/**
 * Mobile number validation rules
 * Validates 10-digit mobile numbers
 */
export const mobileRules = [
  (v: string) => !!v || 'Mobile number is required',
  (v: string) => {
    const cleaned = v.replace(/\D/g, '');
    return cleaned.length === 10 || 'Please enter a valid 10-digit mobile number';
  }
];

/**
 * Email validation rules
 */
export const emailRules = [
  (v: string) => !!v || 'E-mail is required',
  (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
];

/**
 * Password validation rules
 * @param minLength - Minimum password length (default: 6)
 */
export const passwordRules = (minLength: number = 6) => [
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length >= minLength) || `Password must be at least ${minLength} characters`
];

/**
 * Required field validation
 */
export const requiredRule = (fieldName: string = 'This field') => [
  (v: any) => !!v || `${fieldName} is required`
];

/**
 * Phone number validation (with country code)
 */
export const phoneRules = [
  (v: string) => !!v || 'Phone number is required',
  (v: string) => {
    const cleaned = v.replace(/\D/g, '');
    return cleaned.length >= 10 || 'Please enter a valid phone number';
  }
];

/**
 * OTP validation rules
 * @param length - OTP length (default: 4)
 */
export const otpRules = (length: number = 4) => [
  (v: string) => !!v || 'OTP is required',
  (v: string) => {
    const cleaned = v.replace(/\D/g, '');
    return cleaned.length === length || `Please enter a valid ${length}-digit OTP`;
  }
];

/**
 * Name validation rules
 */
export const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) => (v && v.length >= 2) || 'Name must be at least 2 characters',
  (v: string) => (v && v.length <= 50) || 'Name must be less than 50 characters'
];

/**
 * All rules object for easy import
 */
const RULES = {
  mobileRules,
  emailRules,
  passwordRules,
  requiredRule,
  phoneRules,
  otpRules,
  nameRules
} as const;

export default RULES;
