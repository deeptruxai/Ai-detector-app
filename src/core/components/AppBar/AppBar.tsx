import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../Text/Text';
import { Theme, useTheme } from '@/core/theme';

export interface AppBarProps {
  /** Label beside the leading icon (e.g. app name). */
  title: string;
  /** When set, shows a back control instead of the default leading icon. */
  showBack?: boolean;
  onBackPress?: () => void;
  /** `MaterialCommunityIcons` name for the leading glyph. */
  leadingIconName?: string;
  leadingIconSize?: number;
  /** Optional trailing text control (e.g. “Sign In”). */
  rightLabel?: string;
  onRightPress?: () => void;
  /** Horizontal padding (default 24). */
  paddingHorizontal?: number;
  /** Extra padding below the safe-area inset (default 12). */
  paddingTopOffset?: number;
  /** When true, bar is absolutely positioned at the top (default true). */
  absolute?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const AppBar: React.FC<AppBarProps> = ({
  title,
  showBack,
  onBackPress,
  leadingIconName = 'shield-check',
  leadingIconSize = 20,
  rightLabel,
  onRightPress,
  paddingHorizontal = 24,
  paddingTopOffset = 12,
  absolute = true,
  containerStyle,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const showRight =
    rightLabel != null &&
    String(rightLabel).length > 0 &&
    typeof onRightPress === 'function';

  const resolvedLeading =
    showBack && typeof onBackPress === 'function' ? (
      <TouchableOpacity
        onPress={onBackPress}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Back">
        <Icon name="chevron-left" size={28} color={theme.colors.text} />
      </TouchableOpacity>
    ) : (
      <Icon
        name={leadingIconName}
        size={leadingIconSize}
        color={theme.colors.primary}
      />
    );

  return (
    <View
      style={[
        styles.row,
        absolute && styles.absolute,
        {
          paddingTop: insets.top + paddingTopOffset,
          paddingHorizontal,
        },
        containerStyle,
      ]}>
      <View style={styles.leading}>
        {resolvedLeading}
        <Text style={styles.title}>{title}</Text>
      </View>
      {showRight ? (
        <TouchableOpacity onPress={onRightPress} hitSlop={12}>
          <Text style={styles.rightLabel}>{rightLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default AppBar;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    absolute: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      zIndex: 2,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    leading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    title: {
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: -1,
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.regular,
    },
    rightLabel: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.textSecondary,
      fontFamily: theme.typography.fontFamily.regular,
    },
  });
