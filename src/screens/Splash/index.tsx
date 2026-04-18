import React, { useEffect, useMemo } from 'react';
import {
  Image,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { Text } from '@/core/components';
import { Theme, useTheme } from '@/core/theme';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { resetNavigation, RootStackScreens } from '@/navigation';
import { authService } from '@/service/firebase';
import { SplashConst } from '@/utils/Constants';
import AppLogo from '@/images/svg/Logo';

const LOGO_IMAGE_SIZE = 300;
const LOGO_CLUSTER_SIZE = 300;
const PULSE_RING_BASE = 200;
const PULSE_PHASES = [0, 1 / 3, 2 / 3] as const;

const splashLogo = require('@/images/png/splashLogo.png');

type RadialPulseRingProps = {
  pulse: SharedValue<number>;
  phaseOffset: number;
  ringStyle: StyleProp<ViewStyle>;
};

const RadialPulseRing: React.FC<RadialPulseRingProps> = ({
  pulse,
  phaseOffset,
  ringStyle,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const u = (pulse.value + phaseOffset) % 1;
    const scale = interpolate(u, [0, 1], [0.72, 1.48]);
    const opacity = interpolate(
      u,
      [0, 0.08, 0.45, 0.92, 1],
      [0, 0.22, 0.14, 0.04, 0],
    );
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[ringStyle, animatedStyle]} pointerEvents="none" />
  );
};

/** True circle in px — matches Figma (not an ellipse from objectBoundingBox). */
function getSplashRadialGradientGeometry(screenW: number, screenH: number) {
  const cx = screenW / 2;
  /** Figma centers glow slightly above geometric center (~30% from top). */
  const cy = screenH * 0.3;
  const r = Math.max(
    Math.hypot(0 - cx, 0 - cy),
    Math.hypot(screenW - cx, 0 - cy),
    Math.hypot(0 - cx, screenH - cy),
    Math.hypot(screenW - cx, screenH - cy),
  );
  return { cx, cy, r };
}

const SplashScreen: React.FC = () => {
  const { theme } = useTheme();
  const { width, height } = useWindowDimensions();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const splashRadial = useMemo(
    () => getSplashRadialGradientGeometry(width, height),
    [width, height],
  );

  const progressFill = useSharedValue(0);
  const radialPulse = useSharedValue(0);

  useEffect(() => {
    progressFill.value = withRepeat(
      withTiming(1, {
        duration: 1900,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [progressFill]);

  useEffect(() => {
    radialPulse.value = withRepeat(
      withTiming(1, {
        duration: 3200,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [radialPulse]);

  useEffect(() => {
    const id = setTimeout(() => {
      const next = authService.isLoggedIn
        ? RootStackScreens.Main
        : RootStackScreens.Login;
      resetNavigation(next);
    }, SplashConst.navigationDelayMs);
    return () => clearTimeout(id);
  }, []);

  const progressFillStyle = useAnimatedStyle(() => ({
    width: interpolate(progressFill.value, [0, 1], [0, 240]),
  }));

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width={width} height={height}>
          <Defs>
            <RadialGradient
              id="splashMainRadial"
              cx={splashRadial.cx}
              cy={splashRadial.cy}
              r={splashRadial.r}
              fx={splashRadial.cx}
              fy={splashRadial.cy}
              gradientUnits="userSpaceOnUse"
            >
              {/*
               * Figma 4311:67 — use design stops, not theme primary (#4EDEA3 is much brighter than
               * the file’s rgba(16,185,129,0.15) center or the background reads overly “glowing”.
               */}
              <Stop
                offset="0%"
                stopColor="rgb(16,185,129)"
                stopOpacity={0.15}
              />
              <Stop
                offset="35%"
                stopColor="rgb(11,95,67)"
                stopOpacity={0.575}
              />
              <Stop
                offset="52.5%"
                stopColor="rgb(8,50,36)"
                stopOpacity={0.7875}
              />
              <Stop
                offset="61.25%"
                stopColor="rgb(6,28,21)"
                stopOpacity={0.89375}
              />
              <Stop
                offset="65.625%"
                stopColor="rgb(6,16,13)"
                stopOpacity={0.94688}
              />
              <Stop offset="70%" stopColor="rgb(5,5,5)" stopOpacity={1} />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#splashMainRadial)" />
        </Svg>
      </View>

      <View style={styles.gridOverlay} pointerEvents="none" />

      <View style={styles.content}>
        <View style={styles.centralCluster}>
          <View style={styles.logoSection}>
            {PULSE_PHASES.map((phase, index) => (
              <RadialPulseRing
                key={index}
                pulse={radialPulse}
                phaseOffset={phase}
                ringStyle={styles.pulseRing}
              />
            ))}
            <View style={styles.logoFrame}>
              <Image
                source={splashLogo}
                style={styles.logoImage}
                resizeMode="contain"
                accessibilityRole="image"
                accessibilityLabel={SplashConst.appName}
              />
            </View>
          </View>

          <View style={styles.typographyBlock}>
            <Text style={styles.title}>{SplashConst.appName}</Text>
            <Text style={styles.tagline}>{SplashConst.tagline}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressFillStyle]} />
        </View>

        <View style={styles.bootRow}>
          <View style={styles.bootIconWrap}>
            <AppLogo width={9} height={12} color={theme.colors.primary} />
          </View>
          <Text style={styles.bootText}>{SplashConst.bootText}</Text>
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.splashRadialEdge,
      overflow: 'hidden',
    },
    gridOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(78, 222, 163, 0.03)',
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xxl,
    },
    centralCluster: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    logoSection: {
      width: LOGO_CLUSTER_SIZE,
      height: LOGO_CLUSTER_SIZE,
      marginBottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible',
    },
    pulseRing: {
      position: 'absolute',
      left: (LOGO_CLUSTER_SIZE - PULSE_RING_BASE) / 2,
      top: (LOGO_CLUSTER_SIZE - PULSE_RING_BASE) / 2,
      width: PULSE_RING_BASE,
      height: PULSE_RING_BASE,
      borderRadius: PULSE_RING_BASE / 2,
      backgroundColor: 'rgba(78, 222, 163, 0.12)',
    },
    logoFrame: {
      width: LOGO_IMAGE_SIZE,
      height: LOGO_IMAGE_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      zIndex: 2,
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 20,
        },
        android: {
          elevation: 14,
          shadowColor: theme.colors.primary,
        },
      }),
    },
    logoImage: {
      width: LOGO_IMAGE_SIZE,
      height: LOGO_IMAGE_SIZE,
      alignSelf: 'center',
    },
    typographyBlock: {
      alignItems: 'center',
      gap: theme.spacing.sm,
      /** Pull up past empty space below the image inside the tall pulse area; gap to image ≈ `theme.spacing.xl` (Figma). */
      marginTop: -50,
    },
    title: {
      color: theme.colors.text,
      fontSize: 36,
      lineHeight: 40,
      fontFamily: theme.typography.fontFamily.regular,
      letterSpacing: -1.8,
      textAlign: 'center',
    },
    tagline: {
      color: theme.colors.primary,
      fontSize: 10,
      lineHeight: 15,
      letterSpacing: 2,
      fontFamily: theme.typography.fontFamily.regular,
      textAlign: 'center',
      opacity: 0.8,
      textTransform: 'uppercase',
    },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 64,
      alignItems: 'center',
      paddingHorizontal: 48,
    },
    progressTrack: {
      width: 240,
      height: 2,
      backgroundColor: theme.colors.splashProgressTrack,
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
    },
    bootIconWrap: {
      width: 9,
      height: 12,
      marginRight: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bootText: {
      color: theme.colors.splashBootCaption,
      fontSize: 10,
      lineHeight: 15,
      letterSpacing: 1,
      fontFamily: theme.typography.fontFamily.regular,
      textTransform: 'uppercase',
    },
  });
