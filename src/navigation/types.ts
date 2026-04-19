import type { NavigatorScreenParams } from '@react-navigation/native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  PhoneAuth: undefined;
  VerifyOTP: { phoneNumber: string };
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  WebView: { title: string; uri: string };
  ScanningStatus: {
    mode: 'text' | 'image' | 'video';
    /** Optional media payload for image/video scans. */
    media?: {
      base64: string;
      mimeType: string;
      sizeBytes?: number;
      sourceKind?: 'image' | 'video';
    };
    /** Optional text payload for text scans. */
    text?: string;
  };
  ImageDetection: undefined;
  VideoDetection: undefined;
  TextDetection: undefined;
  ComingSoon: undefined;
};

type RootStackScreenProps = NativeStackScreenProps<RootStackParamList>;

export type SplashScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Splash'
>;
export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Login'
>;
export type SignupScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Signup'
>;
export type PhoneAuthScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PhoneAuth'
>;
export type VerifyOTPScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'VerifyOTP'
>;
export type WebViewScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'WebView'
>;
export type ScanningStatusScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ScanningStatus'
>;
export type ImageDetectionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ImageDetection'
>;
export type VideoDetectionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'VideoDetection'
>;
export type TextDetectionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TextDetection'
>;
export type ComingSoonScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ComingSoon'
>;

export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  RootStackScreenProps
>;
export type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  RootStackScreenProps
>;
export type SettingsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Settings'>,
  RootStackScreenProps
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export enum RootStackScreens {
  Splash = 'Splash',
  Login = 'Login',
  Signup = 'Signup',
  PhoneAuth = 'PhoneAuth',
  VerifyOTP = 'VerifyOTP',
  Main = 'Main',
  WebView = 'WebView',
  ScanningStatus = 'ScanningStatus',
  ImageDetection = 'ImageDetection',
  VideoDetection = 'VideoDetection',
  TextDetection = 'TextDetection',
  ComingSoon = 'ComingSoon',
}
