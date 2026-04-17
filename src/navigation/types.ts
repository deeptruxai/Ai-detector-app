import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  VerifyOTP: { email: string };
  Home: undefined;
  Dashboard: undefined;
  Profile: undefined;
  Settings: undefined;
  ScanningStatus: { mode: 'text' | 'image' | 'video' | 'news' };
  ImageDetection: undefined;
  TextDetection: undefined;
};

export type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type SignupScreenProps = NativeStackScreenProps<RootStackParamList, 'Signup'>;
export type VerifyOTPScreenProps = NativeStackScreenProps<RootStackParamList, 'VerifyOTP'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;
export type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;
export type ScanningStatusScreenProps = NativeStackScreenProps<RootStackParamList, 'ScanningStatus'>;
export type ImageDetectionScreenProps = NativeStackScreenProps<RootStackParamList, 'ImageDetection'>;
export type TextDetectionScreenProps = NativeStackScreenProps<RootStackParamList, 'TextDetection'>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export enum RootStackScreens {
  Splash = 'Splash',
  Login = 'Login',
  Signup = 'Signup',
  VerifyOTP = 'VerifyOTP',
  Home = 'Home',
  Dashboard = 'Dashboard',
  Profile = 'Profile',
  Settings = 'Settings',
  ScanningStatus = 'ScanningStatus',
  ImageDetection = 'ImageDetection',
  TextDetection = 'TextDetection',
}
