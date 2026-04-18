import React, { useEffect, useState, useMemo, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { Text, SafeScreen } from '@/core/components';
import { Theme, useTheme } from '@/core/theme';
import { ScanningStatusScreenProps } from '@/navigation/types';
import { StatusConst } from '@/utils/Constants';

const ScanningStatusScreen: React.FC<ScanningStatusScreenProps> = ({ route, navigation }) => {
  const { mode } = route.params;
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    const timer = setTimeout(() => {
      navigation.replace('Dashboard'); // For now, go back to dashboard
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigation, progressAnim]);

  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeScreen style={styles.container}>
      <View style={styles.content}>
        <Text size="xxxl" style={styles.title}>
          {StatusConst.scanningPrefix} {mode}{StatusConst.scanningSuffix}
        </Text>
        <Text size="md" style={styles.subtitle}>
          {StatusConst.scanningSubtitle}
        </Text>

        <View style={styles.progressContainer}>
          <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
            <Animated.View
              style={[
                styles.progressBar,
                { backgroundColor: theme.colors.primary, width },
              ]}
            />
          </View>
          <Text style={styles.percentage}>{progress}%</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>{StatusConst.confidenceLabel}</Text>
            <Text style={styles.statValue}>{StatusConst.confidenceValue}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>{StatusConst.securityLabel}</Text>
            <Text style={styles.statValue}>{StatusConst.securityValue}</Text>
          </View>
        </View>
      </View>
    </SafeScreen>
  );
};

// Use useRef in functional component correctly
const ScanningStatusWrapper: React.FC<ScanningStatusScreenProps> = (props) => {
    return <ScanningStatusScreen {...props} />;
};

// Re-writing with useRef properly inside the main component
const ScanningStatusScreenCorrect: React.FC<ScanningStatusScreenProps> = ({ route, navigation }) => {
  const { mode } = route.params;
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const progressAnim = React.useRef(new Animated.Value(0)).current;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    const timer = setTimeout(() => {
       navigation.goBack(); // Simplified for now
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
     <SafeScreen style={styles.container}>
      <View style={styles.content}>
        <Text size="xxxl" style={styles.title}>
          {StatusConst.scanningPrefix} {mode}{StatusConst.scanningSuffix}
        </Text>
        <Text size="md" style={styles.subtitle}>
          {StatusConst.scanningSubtitle}
        </Text>

        <View style={styles.progressContainer}>
          <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
            <Animated.View
              style={[
                styles.progressBar,
                { backgroundColor: theme.colors.primary, width },
              ]}
            />
          </View>
          <Text style={styles.percentage}>{progress}%</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>{StatusConst.confidenceLabel}</Text>
            <Text style={styles.statValue}>{StatusConst.confidenceValue}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>{StatusConst.securityLabel}</Text>
            <Text style={styles.statValue}>{StatusConst.securityValue}</Text>
          </View>
        </View>
      </View>
    </SafeScreen>
  );
}

export default ScanningStatusScreenCorrect;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    title: {
      fontWeight: '900',
      color: theme.colors.text,
      textTransform: 'capitalize',
      marginBottom: 8,
    },
    subtitle: {
      color: theme.colors.primary,
      marginBottom: 60,
    },
    progressContainer: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 40,
    },
    progressTrack: {
      width: '100%',
      height: 6,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
    },
    percentage: {
      marginTop: 12,
      color: theme.colors.text,
      fontSize: 24,
      fontWeight: 'bold',
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      backgroundColor: theme.colors.surface,
      padding: 24,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    statItem: {
      alignItems: 'center',
    },
    statLabel: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      marginBottom: 4,
    },
    statValue: {
      color: theme.colors.primary,
      fontWeight: 'bold',
      fontSize: 18,
    },
  });
