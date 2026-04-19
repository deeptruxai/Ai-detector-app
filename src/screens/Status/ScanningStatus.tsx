import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { StyleSheet, View, Animated, Easing, ScrollView } from 'react-native';
import { Text, SafeScreen, HeaderBackButton } from '@/core/components';
import { Button } from '@/components/Button';
import { Theme, useTheme } from '@/core/theme';
import { ScanningStatusScreenProps } from '@/navigation/types';
import { goBack, resetToMainTab } from '@/navigation/navUtils';
import { ResultConst, StatusConst } from '@/utils/Constants';
import {
  AiDetectionError,
  DetectionResult,
  analyzeMedia,
  analyzeText,
} from '@/service/aiDetection';

type Phase = 'scanning' | 'done' | 'error';

const useFakeProgress = (active: boolean) => {
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) return;

    progressAnim.setValue(0);
    setProgress(0);

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 6000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      setProgress(prev => (prev >= 95 ? prev : prev + 1));
    }, 60);

    return () => {
      clearInterval(interval);
      progressAnim.stopAnimation();
    };
  }, [active, progressAnim]);

  const finalize = useCallback(() => {
    setProgress(100);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [progressAnim]);

  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return { progress, width, finalize };
};

const ScanningStatusScreen: React.FC<ScanningStatusScreenProps> = ({
  route,
  navigation,
}) => {
  const { mode, media, text } = route.params;
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [phase, setPhase] = useState<Phase>('scanning');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { progress, width, finalize } = useFakeProgress(phase === 'scanning');

  const runAnalysis = useCallback(
    async (task: () => Promise<DetectionResult>) => {
      try {
        const r = await task();
        finalize();
        setResult(r);
        setPhase('done');
      } catch (err) {
        const message =
          err instanceof AiDetectionError
            ? err.message
            : ResultConst.genericErrorMessage;
        setErrorMessage(message);
        setPhase('error');
      }
    },
    [finalize],
  );

  const handleResetToHome = useCallback(() => {
    resetToMainTab(navigation, 'Home');
  }, [navigation]);

  const handleGoBack = useCallback(() => {
    goBack(navigation);
  }, [navigation]);

  useEffect(() => {
    if (phase !== 'scanning') return;

    if (mode === 'image' || mode === 'video') {
      if (!media) {
        setErrorMessage(ResultConst.genericErrorMessage);
        setPhase('error');
        return;
      }
      runAnalysis(() => analyzeMedia(media));
      return;
    }

    if (mode === 'text') {
      if (!text || !text.trim()) {
        setErrorMessage(ResultConst.genericErrorMessage);
        setPhase('error');
        return;
      }
      runAnalysis(() => analyzeText({ text }));
      return;
    }

    setErrorMessage(ResultConst.genericErrorMessage);
    setPhase('error');
  }, [phase, mode, media, text, runAnalysis]);

  if (phase === 'done' && result) {
    return (
      <ResultView
        result={result}
        onDone={handleResetToHome}
        onRetry={handleGoBack}
      />
    );
  }

  if (phase === 'error') {
    return (
      <ErrorView
        message={errorMessage ?? ResultConst.genericErrorMessage}
        onRetry={handleGoBack}
        onDone={handleResetToHome}
      />
    );
  }

  return (
    <SafeScreen>
      <View style={styles.content}>
        <Text size="xxxl" style={styles.title}>
          {StatusConst.scanningPrefix} {mode}
          {StatusConst.scanningSuffix}
        </Text>
        <Text size="md" style={styles.subtitle}>
          {StatusConst.scanningSubtitle}
        </Text>

        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: theme.colors.border },
            ]}
          >
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

interface ResultViewProps {
  result: DetectionResult;
  onDone: () => void;
  onRetry: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, onDone, onRetry }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const accent = result.isAI ? theme.colors.error : theme.colors.primary;
  const verdict = result.isAI
    ? ResultConst.aiGeneratedLabel
    : ResultConst.authenticLabel;

  return (
    <SafeScreen>
      <ScrollView contentContainerStyle={styles.resultScroll}>
        <View style={styles.resultHeader}>
          <HeaderBackButton onPress={onRetry} />
          <Text size="xxl" style={styles.title}>
            {ResultConst.resultTitle}
          </Text>
        </View>

        <View style={[styles.verdictCard, { borderColor: accent }]}>
          <Text style={[styles.verdictLabel, { color: accent }]}>
            {verdict}
          </Text>
          <Text style={styles.verdictScore}>
            {result.score.toFixed(1)} / 10
          </Text>
          <Text style={styles.verdictHint}>
            {ResultConst.confidenceLabel}: {result.confidence}
          </Text>
        </View>

        <Section title={ResultConst.reasoningLabel}>
          <Text style={styles.body}>{result.reasoning}</Text>
        </Section>

        <Section title={ResultConst.artifactsLabel}>
          {result.artifacts.length === 0 ? (
            <Text style={styles.body}>{ResultConst.noArtifacts}</Text>
          ) : (
            result.artifacts.map((item, idx) => (
              <Text key={`${idx}-${item.slice(0, 8)}`} style={styles.bullet}>
                • {item}
              </Text>
            ))
          )}
        </Section>

        <Button
          title={ResultConst.doneButton}
          variant="primary"
          onPress={onDone}
          style={styles.primaryAction}
        />
        <Button
          title={ResultConst.retryButton}
          variant="outline"
          onPress={onRetry}
        />
      </ScrollView>
    </SafeScreen>
  );
};

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
  onDone: () => void;
}

const ErrorView: React.FC<ErrorViewProps> = ({ message, onRetry, onDone }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeScreen>
      <View style={styles.content}>
        <Text size="xxl" style={[styles.title, { color: theme.colors.error }]}>
          {ResultConst.errorTitle}
        </Text>
        <Text size="md" style={styles.subtitle}>
          {message}
        </Text>
        <Button
          title={ResultConst.retryButton}
          variant="primary"
          onPress={onRetry}
          style={styles.primaryAction}
        />
        <Button
          title={ResultConst.doneButton}
          variant="outline"
          onPress={onDone}
        />
      </View>
    </SafeScreen>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
};

export default ScanningStatusScreen;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
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
      textAlign: 'center',
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
    resultScroll: {
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 40,
    },
    resultHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    verdictCard: {
      borderWidth: 1,
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      marginBottom: 24,
      backgroundColor: theme.colors.surface,
    },
    verdictLabel: {
      fontSize: 14,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginBottom: 8,
    },
    verdictScore: {
      fontSize: 48,
      fontWeight: '900',
      color: theme.colors.text,
      marginBottom: 4,
    },
    verdictHint: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    body: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.text,
    },
    bullet: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.text,
      marginBottom: 4,
    },
    primaryAction: {
      marginTop: 16,
      marginBottom: 12,
    },
  });
