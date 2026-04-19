import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@/core/theme';
import { RootStackParamList, RootStackScreens } from './types';
import MainTabNavigator from './MainTabNavigator';

import SplashScreen from '@/screens/Splash';
import LoginScreen from '@/screens/Auth/Login/Login';
import SignupScreen from '@/screens/Auth/SignUp/Signup';
import VerifyEmailScreen from '@/screens/Auth/VerifyEmail/VerifyEmail';
import PhoneAuthScreen from '@/screens/Auth/PhoneAuth/PhoneAuth';
import VerifyOTPScreen from '@/screens/Auth/VerifyOTP/VerifyOTP';
import WebViewScreen from '@/screens/WebView/WebViewScreen';
import ScanningStatusScreen from '@/screens/Status/ScanningStatus';
import ImageDetectionScreen from '@/screens/Detection/ImageDetection';
import VideoDetectionScreen from '@/screens/Detection/VideoDetection';
import TextDetectionScreen from '@/screens/Detection/TextDetection';
import ComingSoonScreen from '@/screens/ComingSoon/ComingSoonScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { theme } = useTheme();

  const screenOptions = useMemo(
    () => ({
      headerShown: false as const,
      freezeOnBlur: true,
      fullScreenGestureEnabled: true,
      gestureEnabled: true,
      contentStyle: { backgroundColor: theme.colors.backgroundSecondary },
    }),
    [],
  );

  return (
    <Stack.Navigator
      initialRouteName={RootStackScreens.Splash}
      screenOptions={screenOptions}
    >
      <Stack.Screen name={RootStackScreens.Splash} component={SplashScreen} />
      <Stack.Screen name={RootStackScreens.Login} component={LoginScreen} />
      <Stack.Screen name={RootStackScreens.Signup} component={SignupScreen} />
      <Stack.Screen
        name={RootStackScreens.VerifyEmail}
        component={VerifyEmailScreen}
      />
      <Stack.Screen
        name={RootStackScreens.PhoneAuth}
        component={PhoneAuthScreen}
      />
      <Stack.Screen
        name={RootStackScreens.VerifyOTP}
        component={VerifyOTPScreen}
      />
      <Stack.Screen name={RootStackScreens.Main} component={MainTabNavigator} />
      <Stack.Screen name={RootStackScreens.WebView} component={WebViewScreen} />
      <Stack.Screen
        name={RootStackScreens.ScanningStatus}
        component={ScanningStatusScreen}
      />
      <Stack.Screen
        name={RootStackScreens.ImageDetection}
        component={ImageDetectionScreen}
      />
      <Stack.Screen
        name={RootStackScreens.VideoDetection}
        component={VideoDetectionScreen}
      />
      <Stack.Screen
        name={RootStackScreens.TextDetection}
        component={TextDetectionScreen}
      />
      <Stack.Screen
        name={RootStackScreens.ComingSoon}
        component={ComingSoonScreen}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
