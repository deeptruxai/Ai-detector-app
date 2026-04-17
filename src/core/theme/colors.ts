import { ThemeColors } from './types';

/** AIDetect — Luminescent Guardian (dark + emerald verification) */
export const primaryThemeColors: ThemeColors = {
  // Brand
  primary: '#4EDEA3',
  primaryLight: '#72F0BA',
  primaryDark: '#35BE84',
  onPrimary: '#0B1914',

  secondary: '#43CF95',
  secondaryLight: '#67E2AE',
  secondaryDark: '#2CAA77',
  onSecondary: '#07100D',

  // Surfaces: base → primary card → elevated
  background: '#0E1110',
  backgroundSecondary: '#131313',
  surface: '#171C1A',

  text: '#ECF4F0',
  textSecondary: '#A3B3AD',
  textDisabled: '#5C6C66',

  success: '#4EDEA3',
  error: '#F87171',
  warning: '#FBBF24',
  info: '#60A5FA',

  border: '#25312D',
  borderLight: '#33423D',

  shadow: 'rgba(0, 0, 0, 0.55)',
  overlay: 'rgba(7, 10, 9, 0.75)',
  brandGlow: 'rgba(78, 222, 163, 0.22)',
  appBarBackground: 'rgba(19, 19, 19, 0.6)',
  appBarIcon: '#D0D5D3',
  appBarShadow: 'rgba(78, 222, 163, 0.06)',
};

/** Alternate accent; same dark surfaces (optional second palette) */
export const secondaryThemeColors: ThemeColors = {
  ...primaryThemeColors,
  primary: '#7CE8FF',
  primaryLight: '#A6F1FF',
  primaryDark: '#4CCFEF',
  onPrimary: '#051217',
  secondary: '#4EDEA3',
  secondaryLight: '#6EE7B7',
  secondaryDark: '#2CAA77',
  onSecondary: '#07100D',
  brandGlow: 'rgba(124, 232, 255, 0.22)',
  appBarShadow: 'rgba(124, 232, 255, 0.07)',
};
