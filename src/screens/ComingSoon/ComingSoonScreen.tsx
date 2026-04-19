import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Text, SafeScreen, HeaderBackButton } from '@/core/components';
import { Theme, useTheme } from '@/core/theme';
import { useNavigation } from '@react-navigation/native';
import { goBack, type RootStackNavigation } from '@/navigation/navUtils';
import { ComingSoonConst, HomeConst } from '@/utils/Constants';

const ComingSoonScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<RootStackNavigation>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeScreen>
      <View style={styles.root}>
        <View style={styles.header}>
          <HeaderBackButton onPress={() => goBack(navigation)} />
          <Text size="xxl" style={styles.title}>
            {HomeConst.newsModeTitle}
          </Text>
        </View>

        <View style={styles.body}>
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: theme.colors.primary + '18' },
            ]}>
            <Text style={styles.icon}>{HomeConst.newsModeIcon}</Text>
          </View>
          <Text size="xxl" style={styles.headline}>
            {ComingSoonConst.headline}
          </Text>
          <Text style={styles.message}>{ComingSoonConst.message}</Text>
        </View>

        <Button
          title={ComingSoonConst.backButton}
          variant="primary"
          onPress={() => goBack(navigation)}
          style={styles.cta}
        />
      </View>
    </SafeScreen>
  );
};

export default ComingSoonScreen;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 40,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontWeight: 'bold',
      color: theme.colors.text,
      flex: 1,
    },
    body: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 8,
    },
    iconWrap: {
      width: 96,
      height: 96,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 28,
    },
    icon: {
      fontSize: 44,
    },
    headline: {
      fontWeight: '800',
      color: theme.colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    message: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      maxWidth: 320,
    },
    cta: {
      marginTop: 'auto',
    },
  });
