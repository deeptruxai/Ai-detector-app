import React from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/core/theme';

/** Figma 4311:9 — default tile */
const DEFAULT_BACKGROUND = '#2a2a2a';
const DEFAULT_BORDER_RADIUS = 16;
const DEFAULT_BOX_SIZE = 56;
const DEFAULT_ICON_NAME = 'shield-check';
const DEFAULT_ICON_SIZE = 24;

export interface IconWithBackgroundProps {
  /** `MaterialCommunityIcons` glyph name */
  iconName?: string;
  /** Icon size in dp (default matches Figma proportions). */
  iconSize?: number;
  /** Icon tint; defaults to theme primary (mint). */
  iconColor?: string;
  /** Extra styles for the vector icon (e.g. opacity). */
  iconStyle?: StyleProp<TextStyle>;
  /** Tile fill; defaults to Figma `#2a2a2a`. */
  backgroundColor?: string;
  /** Overrides size, radius, margin, etc. Defaults are applied first. */
  containerStyle?: StyleProp<ViewStyle>;
}

const IconWithBackground: React.FC<IconWithBackgroundProps> = ({
  iconName = DEFAULT_ICON_NAME,
  iconSize = DEFAULT_ICON_SIZE,
  iconColor,
  iconStyle,
  backgroundColor = DEFAULT_BACKGROUND,
  containerStyle,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          borderRadius: DEFAULT_BORDER_RADIUS,
        },
        containerStyle,
      ]}
    >
      <Icon
        name={iconName}
        size={iconSize}
        color={iconColor ?? theme.colors.primary}
        style={iconStyle}
      />
    </View>
  );
};

export default IconWithBackground;

const styles = StyleSheet.create({
  container: {
    width: DEFAULT_BOX_SIZE,
    height: DEFAULT_BOX_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
