import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const DefaultTheme: ThemeTypes = {
  name: 'DefaultTheme',
  dark: false,
  variables: {
    'border-color': '#e8ebee',
    'carousel-control-size': 10,
    gradient: 'linear-gradient(to right, #3F78FF, #4680FF)',
    'card-shadow': '0px 8px 24px rgba(19, 25, 32, 0.08)'
  },
  colors: {
    // ============================================
    // Primary Colors - Main Brand Colors
    // ============================================
    primary: '#3e78ff',
    lightprimary: '#E9F0FF',
    darkprimary: '#3F78FF',
    primary50: '#F0F5FF',
    primary100: '#E9F0FF',
    primary200: '#b8ceff',
    primary300: '#87a8ff',
    primary400: '#5f8bff',
    primary500: '#3e78ff',
    primary600: '#2960ff',
    primary700: '#0047ff',
    primary800: '#0038cc',
    primary900: '#002999',

    // ============================================
    // Secondary Colors - Supporting Colors
    // ============================================
    secondary: '#5B6B79',
    lightsecondary: '#F8F9FA',
    darksecondary: '#3E4853',
    secondary50: '#F8F9FA',
    secondary100: '#F1F3F5',
    secondary200: '#d8dadd',
    secondary300: '#A0AEC0',
    secondary400: '#718096',
    secondary500: '#5B6B79',
    secondary600: '#4A5568',
    secondary700: '#3E4853',
    secondary800: '#2D3748',
    secondary900: '#1A202C',

    // ============================================
    // Success Colors - Positive Actions
    // ============================================
    success: '#47B749',
    lightsuccess: '#c0e5d9',
    darksuccess: '#21976c',
    success50: '#F0FFF4',
    success100: '#C6F6D5',
    success200: '#9AE6B4',
    success300: '#68D391',
    success400: '#48BB78',
    success500: '#47B749',
    success600: '#38A169',
    success700: '#2F855A',
    success800: '#276749',
    success900: '#22543D',

    // ============================================
    // Info Colors - Informational
    // ============================================
    info: '#3ec9d6',
    lightinfo: '#c5eff3',
    darkinfo: '#30bccc',
    info50: '#E6FFFA',
    info100: '#B2F5EA',
    info200: '#81E6D9',
    info300: '#4FD1C5',
    info400: '#3ec9d6',
    info500: '#30bccc',
    info600: '#2C7A7B',
    info700: '#285E61',
    info800: '#234E52',
    info900: '#1D4044',

    // ============================================
    // Warning Colors - Caution States
    // ============================================
    warning: '#e58a00',
    lightwarning: '#f7dcb3',
    darkwarning: '#de7700',
    warning50: '#FFFBEB',
    warning100: '#FEF3C7',
    warning200: '#faaf00',
    warning300: '#FCD34D',
    warning400: '#FBBF24',
    warning500: '#e58a00',
    warning600: '#de7700',
    warning700: '#B45309',
    warning800: '#92400E',
    warning900: '#78350F',

    // ============================================
    // Error Colors - Destructive Actions
    // ============================================
    error: '#dc2626',
    lighterror: '#f5bebe',
    darkerror: '#d31c1c',
    error50: '#FEF2F2',
    error100: '#FEE2E2',
    error200: '#FECACA',
    error300: '#FCA5A5',
    error400: '#F87171',
    error500: '#dc2626',
    error600: '#d31c1c',
    error700: '#B91C1C',
    error800: '#991B1B',
    error900: '#7F1D1D',

    // ============================================
    // Neutral Colors - Text & Backgrounds
    // ============================================
    white: '#FFFFFF',
    black: '#000000',
    surface: '#FFFFFF',
    background: '#F8F9FA',
    'on-surface-variant': '#FFFFFF',

    // ============================================
    // Text Colors
    // ============================================
    darkText: '#1D2630',
    lightText: '#5B6B79',
    mediumText: '#4A5568',
    mutedText: '#718096',

    // ============================================
    // Border & Divider Colors
    // ============================================
    borderLight: '#e8ebee',
    borderMedium: '#d1d5db',
    borderDark: '#9ca3af',
    inputBorder: '#BEC8D0',
    divider: '#e8ebee',

    // ============================================
    // Container & Background Colors
    // ============================================
    containerBg: '#F8F9FA',
    cardBg: '#FFFFFF',
    hoverBg: '#F7FAFC',
    activeBg: '#EDF2F7',

    // ============================================
    // Gray Scale
    // ============================================
    gray50: '#F9FAFB',
    gray100: '#f3f5f7',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',

    // ============================================
    // Social Media Colors
    // ============================================
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    instagram: '#E4405F',
    youtube: '#FF0000',
    whatsapp: '#25D366',

    // ============================================
    // Status Colors
    // ============================================
    online: '#10B981',
    offline: '#6B7280',
    away: '#F59E0B',
    busy: '#EF4444',

    // ============================================
    // Chart Colors
    // ============================================
    chart1: '#3e78ff',
    chart2: '#47B749',
    chart3: '#3ec9d6',
    chart4: '#e58a00',
    chart5: '#dc2626',
    chart6: '#8B5CF6',
    chart7: '#EC4899',
    chart8: '#14B8A6'
  }
};

export { DefaultTheme };
