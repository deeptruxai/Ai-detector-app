import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from '@/core/components';
import { useTheme } from '@/core/theme';

export type LoadingStateProps = {
  message?: string;
  style?: ViewStyle;
  testID?: string;
};

/**
 * Full-area loading state (Figma-aligned: centered spinner + optional caption).
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.wrap, style]} testID={testID} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message ? (
        <Text style={[styles.caption, { color: theme.colors.textSecondary }]}>
          {message}
        </Text>
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
    gap: 16,
  },
  caption: {
    fontSize: 14,
    textAlign: 'center',
  },
});
