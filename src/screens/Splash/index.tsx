import React, { useEffect, useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, SafeScreen } from '@/core/components';
import { Theme, useTheme } from '@/core/theme';
import { authService } from '@/service/firebase';
import type { SplashScreenProps } from '@/navigation/types';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const SHIELD_LOGO_URL =
  'https://www.figma.com/api/mcp/asset/9e43a6d2-79e9-49e2-96d1-2b620b9b38be';
const STATUS_ICON_URL =
  'https://www.figma.com/api/mcp/asset/c98a683a-554a-4b78-935e-96b3a01b009a';

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenProps['navigation']>();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const dropProgress = useSharedValue(0);
  const logoPulse = useSharedValue(1);
  const progressFill = useSharedValue(0);

  useEffect(() => {
    dropProgress.value = withRepeat(
      withTiming(1, {
        duration: 2600,
        easing: Easing.out(Easing.cubic),
      }),
      -1,
      false
    );
    logoPulse.value = withRepeat(
      withSequence(
        withTiming(1.04, {
          duration: 1700,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(0.98, {
          duration: 1700,
          easing: Easing.inOut(Easing.quad),
        })
      ),
      -1,
      false
    );
    progressFill.value = withRepeat(
      withTiming(1, {
        duration: 1900,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    const checkAuthAndNavigate = () => {
      const isLoggedIn = authService.isLoggedIn;
      if (isLoggedIn) {
        navigation.replace('Dashboard');
      } else {
        navigation.replace('Login');
      }
    };

    const timer = setTimeout(checkAuthAndNavigate, 2800);
    return () => clearTimeout(timer);
  }, [navigation]);

  const movingDropStyle = useAnimatedStyle(() => {
    const dropY = interpolate(dropProgress.value, [0, 1], [-260, 260]);
    const dropScale = interpolate(dropProgress.value, [0, 0.45, 1], [0.72, 1.06, 1.4]);
    const opacity = interpolate(dropProgress.value, [0, 0.35, 0.7, 1], [0, 0.52, 0.24, 0]);

    return {
      transform: [{ translateY: dropY }, { scale: dropScale }],
      opacity,
    };
  });

  const trailingDropStyle = useAnimatedStyle(() => {
    const y = interpolate(dropProgress.value, [0, 1], [-320, 160]);
    const scaleY = interpolate(dropProgress.value, [0, 1], [0.35, 1.15]);
    const opacity = interpolate(dropProgress.value, [0, 0.5, 1], [0, 0.28, 0]);

    return {
      transform: [{ translateY: y }, { scaleY }],
      opacity,
    };
  });

  const logoPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoPulse.value }],
  }));

  const progressFillStyle = useAnimatedStyle(() => ({
    width: interpolate(progressFill.value, [0, 1], [0, 240]),
  }));

  return (
    <SafeScreen style={styles.container} statusBarColor={styles.container.backgroundColor as string}>
      <View style={styles.topGradientAura} />
      <View style={styles.bottomFade} />
      <Animated.View style={[styles.dropTrail, trailingDropStyle]} />
      <Animated.View style={[styles.dropCore, movingDropStyle]} />
      <View style={styles.gridOverlay} />

      <View style={styles.content}>
        <Animated.View style={[styles.brandBlock, logoPulseStyle]}>
          <View style={styles.logoGlowLarge} />
          <View style={styles.logoGlowSoft} />
          <View style={styles.logoCard}>
            <Image source={{ uri: SHIELD_LOGO_URL }} style={styles.logoImage} resizeMode="cover" />
          </View>
        </Animated.View>

        <Text style={styles.title}>
          AIDetect
        </Text>
        <Text style={styles.tagline}>SECURE. VERIFY. PROTECT.</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressFillStyle]} />
        </View>

        <View style={styles.bootRow}>
          <Image source={{ uri: STATUS_ICON_URL }} style={styles.bootIcon} resizeMode="contain" />
          <Text style={styles.bootText}>INITIALIZING NEURAL CORE</Text>
        </View>
      </View>
    </SafeScreen>
  );
};

export default SplashScreen;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: '#050505',
      position: 'relative',
      overflow: 'hidden',
    },
    topGradientAura: {
      position: 'absolute',
      width: 560,
      height: 560,
      borderRadius: 280,
      backgroundColor: 'rgba(16, 185, 129, 0.16)',
      top: -40,
      alignSelf: 'center',
    },
    dropCore: {
      position: 'absolute',
      width: 300,
      height: 420,
      borderRadius: 170,
      backgroundColor: theme.colors.brandGlow,
      top: 200,
      alignSelf: 'center',
    },
    dropTrail: {
      position: 'absolute',
      width: 180,
      height: 520,
      borderRadius: 999,
      backgroundColor: 'rgba(78, 222, 163, 0.12)',
      top: 140,
      alignSelf: 'center',
    },
    gridOverlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: 'rgba(78, 222, 163, 0.02)',
    },
    bottomFade: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 260,
      backgroundColor: 'rgba(0,0,0,0.55)',
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 130,
    },
    brandBlock: {
      width: 128,
      height: 128,
      marginBottom: 36,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    logoGlowLarge: {
      position: 'absolute',
      width: 192,
      height: 192,
      borderRadius: 96,
      backgroundColor: 'rgba(78, 222, 163, 0.1)',
    },
    logoGlowSoft: {
      position: 'absolute',
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: 'rgba(78, 222, 163, 0.06)',
    },
    logoCard: {
      width: 128,
      height: 128,
      borderRadius: 0,
      backgroundColor: '#0D1B22',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      shadowColor: '#4EDEA3',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 14,
    },
    logoImage: {
      width: '100%',
      height: '100%',
    },
    title: {
      color: '#FFFFFF',
      fontSize: 36,
      lineHeight: 40,
      fontFamily: theme.typography.fontFamily.bold,
      letterSpacing: -1.8,
      marginBottom: 8,
      textAlign: 'center',
    },
    tagline: {
      color: theme.colors.primary,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 2,
      fontFamily: theme.typography.fontFamily.medium,
      textAlign: 'center',
      opacity: 0.8,
    },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 68,
      alignItems: 'center',
      paddingHorizontal: 48,
    },
    progressTrack: {
      width: 240,
      height: 2,
      backgroundColor: '#353534',
      marginBottom: 24,
      borderRadius: 999,
      overflow: 'hidden',
    },
    progressFill: {
      width: 0,
      height: 2,
      borderRadius: 999,
      backgroundColor: theme.colors.primary,
    },
    bootRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    bootIcon: {
      width: 10,
      height: 12,
    },
    bootText: {
      color: '#71717A',
      fontSize: 10,
      lineHeight: 15,
      letterSpacing: 1,
      fontFamily: theme.typography.fontFamily.medium,
    },
  });
