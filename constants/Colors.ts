// FahrProfi v3 — "German Elegance"
// Light, refined, professional — like a premium German digital product

export const Colors = {
  dark: {
    // Subtle dark version (oyun modu için)
    background:    '#F7F8FC',
    surface:       '#FFFFFF',
    surfaceElevated:'#FFFFFF',
    card:          '#FFFFFF',
    elevated:      '#F3F5FB',
    border:        '#E8ECF5',
    borderHigh:    '#D5DCED',
    primary:       '#1E3A5F',
    primaryLight:  '#EEF3FB',
    success:       '#059669',
    successLight:  '#ECFDF5',
    successMid:    '#D1FAE5',
    warning:       '#B45309',
    warningLight:  '#FFFBEB',
    warningMid:    '#FEF3C7',
    danger:        '#DC2626',
    dangerLight:   '#FEF2F2',
    dangerMid:     '#FEE2E2',
    text:          '#111827',
    textSecondary: '#6B7280',
    textMuted:     '#9CA3AF',
    textLight:     '#D1D5DB',
    overlay:       'rgba(30,58,95,0.5)',
  },
  light: {
    background:    '#F7F8FC',
    surface:       '#FFFFFF',
    surfaceElevated:'#FFFFFF',
    card:          '#FFFFFF',
    elevated:      '#F3F5FB',
    border:        '#E8ECF5',
    borderHigh:    '#D5DCED',
    primary:       '#1E3A5F',
    primaryLight:  '#EEF3FB',
    success:       '#059669',
    successLight:  '#ECFDF5',
    successMid:    '#D1FAE5',
    warning:       '#B45309',
    warningLight:  '#FFFBEB',
    warningMid:    '#FEF3C7',
    danger:        '#DC2626',
    dangerLight:   '#FEF2F2',
    dangerMid:     '#FEE2E2',
    text:          '#111827',
    textSecondary: '#6B7280',
    textMuted:     '#9CA3AF',
    textLight:     '#D1D5DB',
    overlay:       'rgba(30,58,95,0.5)',
  },
};

export type ColorScheme = 'dark' | 'light';
export type ThemeColors = typeof Colors.light;
