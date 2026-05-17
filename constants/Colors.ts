// FahrProfi v2 — "German Precision" Design System
// Navy + Electric Blue + authentic traffic light colors

export const Colors = {
  dark: {
    // Backgrounds
    background:    '#070B14',
    surface:       '#0D1524',
    surfaceElevated:'#111D30',
    card:          '#111D30',
    cardHover:     '#162340',
    elevated:      '#1A2940',

    // Borders
    border:        '#1E2F47',
    borderHigh:    '#2A4060',

    // Primary — electric blue (replaces harsh yellow)
    primary:       '#4F9EFF',
    primaryDark:   '#1A3A6B',
    primaryGlow:   'rgba(79,158,255,0.15)',

    // Gold — XP/premium
    gold:          '#E8A820',
    goldDim:       '#3D2800',

    // Ampel
    success:       '#30D158',
    successDim:    '#0A2015',
    warning:       '#FF9F0A',
    warningDim:    '#2D1D00',
    danger:        '#FF3B30',
    dangerDim:     '#2D0A08',

    // Text
    text:          '#EDF2FF',
    textSecondary: '#6B84A0',
    textMuted:     '#2D3F55',

    // Overlay
    overlay:       'rgba(0,0,0,0.75)',
  },
  light: {
    background:    '#F0F4FF',
    surface:       '#FFFFFF',
    surfaceElevated:'#FFFFFF',
    card:          '#FFFFFF',
    cardHover:     '#F5F8FF',
    elevated:      '#F8FAFF',
    border:        '#D5DFF0',
    borderHigh:    '#B0C0E0',
    primary:       '#1A6FD4',
    primaryDark:   '#0D3A8A',
    primaryGlow:   'rgba(26,111,212,0.1)',
    gold:          '#C47800',
    goldDim:       '#FFF3D0',
    success:       '#1B8F3A',
    successDim:    '#E0F8E8',
    warning:       '#B56200',
    warningDim:    '#FFF3D0',
    danger:        '#C9221A',
    dangerDim:     '#FFE8E8',
    text:          '#0F1825',
    textSecondary: '#4A6080',
    textMuted:     '#99B0CC',
    overlay:       'rgba(0,0,0,0.5)',
  },
};

export type ColorScheme = 'dark' | 'light';
export type ThemeColors = typeof Colors.dark;
