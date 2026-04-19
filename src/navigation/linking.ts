import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './types';

/**
 * Deep links use the custom scheme `aidetector://app/...`.
 * Example: aidetector://app/home — opens the Home tab.
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['aidetector://app'],
  config: {
    screens: {
      Splash: 'splash',
      Login: 'login',
      Signup: 'signup',
      PhoneAuth: 'phone',
      VerifyOTP: 'verify',
      Main: {
        path: '',
        screens: {
          Home: 'home',
          Profile: 'profile',
          Settings: 'settings',
        },
      },
      WebView: 'webview',
      ScanningStatus: 'scan/:mode',
      ImageDetection: 'image-detect',
      TextDetection: 'text-detect',
    },
  },
};
