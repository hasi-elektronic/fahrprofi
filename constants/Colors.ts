export const Colors = {
  dark: {
    background: '#0D1117',
    surface: '#161B22',
    surfaceElevated: '#1C2128',
    card: '#21262D',
    border: '#30363D',
    primary: '#F4A700',       // Sarı — trafik işareti rengi
    primaryDark: '#C87D00',
    success: '#3FB950',
    danger: '#F85149',
    warning: '#D29922',
    text: '#E6EDF3',
    textSecondary: '#8B949E',
    textMuted: '#484F58',
    overlay: 'rgba(0,0,0,0.7)',
  },
  light: {
    background: '#FFFFFF',
    surface: '#F6F8FA',
    surfaceElevated: '#FFFFFF',
    card: '#FFFFFF',
    border: '#D0D7DE',
    primary: '#D29000',
    primaryDark: '#A67000',
    success: '#1A7F37',
    danger: '#CF222E',
    warning: '#9A6700',
    text: '#1F2328',
    textSecondary: '#636C76',
    textMuted: '#AFB8C1',
    overlay: 'rgba(0,0,0,0.5)',
  },
};

export type ColorScheme = 'dark' | 'light';
export type ThemeColors = typeof Colors.dark;
