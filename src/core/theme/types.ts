export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  onPrimary: string; // Text color on primary background

  // Secondary colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  onSecondary: string; // Text color on secondary background

  // Background colors
  background: string;
  backgroundSecondary: string;
  surface: string;

  // Text colors
  text: string;
  textSecondary: string;
  textDisabled: string;

  // Status colors
  success: string;
  error: string;
  warning: string;
  info: string;

  // Border colors
  border: string;
  borderLight: string;

  // Other
  shadow: string;
  overlay: string;
  brandGlow: string;
  appBarBackground: string;
  appBarIcon: string;
  appBarShadow: string;
}

export interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    full: number;
  };
  typography: {
    fontFamily: {
      regular: string;
      medium: string;
      bold: string;
      light: string;
      semiBold: string;
    };
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
      xxxl: number;
      display: number;
    };
  };
}

export type ThemeMode = 'primary' | 'secondary';
