import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/core/theme';

export interface HeaderBackButtonProps {
  onPress: () => void;
  /** Matches `AppBar` back control (28). */
  iconSize?: number;
  iconColor?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Header back control: same vector glyph as `AppBar` for consistent Android/iOS UI.
 */
const HeaderBackButton: React.FC<HeaderBackButtonProps> = ({
  onPress,
  iconSize = 28,
  iconColor: iconColorProp,
  style,
}) => {
  const { theme } = useTheme();
  const iconColor = iconColorProp ?? theme.colors.text;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.root, style]}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityRole="button"
      accessibilityLabel="Back">
      <Icon name="chevron-left" size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

export default HeaderBackButton;

const styles = StyleSheet.create({
  root: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
