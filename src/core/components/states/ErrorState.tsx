import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from '@/core/components';
import { PrimaryButton } from '@/core/components/button';
import { useTheme } from '@/core/theme';

export type ErrorStateProps = {
  title: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  style?: ViewStyle;
  testID?: string;
};

/**
 * Full-area error state with optional retry (Figma-aligned).
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
  retryLabel = 'Try again',
  style,
  testID,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.wrap, style]} testID={testID} accessibilityRole="alert">
      <Icon name="alert-circle-outline" size={48} color={theme.colors.error} />
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {message ? (
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
          {message}
        </Text>
      ) : null}
      {onRetry ? (
        <PrimaryButton title={retryLabel} onPress={onRetry} variant="outlined" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
});
