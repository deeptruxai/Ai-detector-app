import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { RootStackParamList, RootStackScreens } from './types';
import MainTabNavigator from './MainTabNavigator';

import SplashScreen from '@/screens/Splash';
import LoginScreen from '@/screens/Auth/Login/Login';
import SignupScreen from '@/screens/Auth/SignUp/Signup';
import PhoneAuthScreen from '@/screens/Auth/PhoneAuth/PhoneAuth';
import VerifyOTPScreen from '@/screens/Auth/VerifyOTP/VerifyOTP';
import WebViewScreen from '@/screens/WebView/WebViewScreen';
import ScanningStatusScreen from '@/screens/Status/ScanningStatus';
import ImageDetectionScreen from '@/screens/Detection/ImageDetection';
import TextDetectionScreen from '@/screens/Detection/TextDetection';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={RootStackScreens.Splash}
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'android' ? 'default' : 'slide_from_right',
        freezeOnBlur: true,
        fullScreenGestureEnabled: true,
        gestureEnabled: true,
      }}>
      <Stack.Screen name={RootStackScreens.Splash} component={SplashScreen} />
      <Stack.Screen name={RootStackScreens.Login} component={LoginScreen} />
      <Stack.Screen name={RootStackScreens.Signup} component={SignupScreen} />
      <Stack.Screen name={RootStackScreens.PhoneAuth} component={PhoneAuthScreen} />
      <Stack.Screen name={RootStackScreens.VerifyOTP} component={VerifyOTPScreen} />
      <Stack.Screen name={RootStackScreens.Main} component={MainTabNavigator} />
      <Stack.Screen name={RootStackScreens.WebView} component={WebViewScreen} />
      <Stack.Screen name={RootStackScreens.ScanningStatus} component={ScanningStatusScreen} />
      <Stack.Screen name={RootStackScreens.ImageDetection} component={ImageDetectionScreen} />
      <Stack.Screen name={RootStackScreens.TextDetection} component={TextDetectionScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
