import { Theme } from './types';
import { primaryThemeColors, secondaryThemeColors } from './colors';

const commonTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 9999,
  },
  typography: {
    fontFamily: {
      regular: 'Inter',
      medium: 'Inter-Medium',
      bold: 'Inter-Bold',
      light: 'Inter-Light',
      semiBold: 'Inter-SemiBold',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20, // Adjusted for mobile
      xxl: 24,
      xxxl: 32,
      display: 48,
    },
  },
};

export const primaryTheme: Theme = {
  colors: primaryThemeColors,
  ...commonTheme,
};

export const secondaryTheme: Theme = {
  colors: secondaryThemeColors,
  ...commonTheme,
};

export const themes = {
  primary: primaryTheme,
  secondary: secondaryTheme,
};
