import React, { ReactNode, useCallback } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  BackHandler,
  ViewStyle,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

interface SafeScreenProps {
  children: ReactNode;
  statusBarColor?: string;
  bottomInsetColor?: string;
  barStyle?: 'default' | 'light-content' | 'dark-content';
  gradientColors?: string[];
  onBackPress?: () => boolean;
  style?: ViewStyle;
}

const SafeScreen: React.FC<SafeScreenProps> = ({
  children,
  statusBarColor: statusBarColorProp,
  bottomInsetColor: bottomInsetColorProp,
  barStyle: barStyleProp,
  gradientColors,
  onBackPress,
  style,
}) => {
  const { theme } = useTheme();
  const statusBarColor = statusBarColorProp??theme.colors.appBarBackground;
  const bottomInsetColor = bottomInsetColorProp ?? theme.colors.background;
  const barStyle = barStyleProp ?? 'light-content';
  const insets = useSafeAreaInsets();

  // Handle hardware back button when screen is focused
  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        if (onBackPress) {
          return onBackPress();
        }
        return false;
      };

      if (Platform.OS === 'android') {
        const subscription = BackHandler.addEventListener(
          'hardwareBackPress',
          handleBackPress,
        );
        return () => subscription.remove();
      }

      return undefined;
    }, [onBackPress]),
  );

  // Render with gradient if gradientColors provided
  if (gradientColors && gradientColors.length > 0) {
    // Note: install react-native-linear-gradient if you need gradient support
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: gradientColors[0] },
          style,
        ]}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={gradientColors[0]}
        />
        {children}
      </View>
    );
  }

  // Render with plain background
  return (
    <View style={styles.container}>
      <StatusBar barStyle={barStyle} backgroundColor={statusBarColor} />

      <View style={{ height: insets.top, backgroundColor: statusBarColor }} />

      <View style={[styles.content, style]}>{children}</View>
      <View
        style={{ height: insets.bottom, backgroundColor: bottomInsetColor }}
      />
    </View>
  );
};

export default SafeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
