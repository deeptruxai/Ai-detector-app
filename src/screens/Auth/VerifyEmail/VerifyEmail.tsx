import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  AppState,
  type AppStateStatus,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { Text, SafeScreen, PrimaryButton } from '@/core/components';
import { Theme, useTheme } from '@/core/theme';
import type { RootStackNavigation } from '@/navigation/navUtils';
import { resetNavigation, resetToMainTab } from '@/navigation/navUtils';
import { RootStackScreens } from '@/navigation/types';
import { authService, mustVerifyEmail } from '@/service/firebase';
import { AuthConst } from '@/utils/Constants';

const VerifyEmailScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<RootStackNavigation>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [resendLoading, setResendLoading] = useState(false);
  const [continueLoading, setContinueLoading] = useState(false);

  const email = authService.currentUser?.email ?? '';

  useEffect(() => {
    const onChange = (next: AppStateStatus) => {
      if (next !== 'active') return;
      void (async () => {
        const result = await authService.reloadCurrentUser();
        if (
          result.success &&
          authService.currentUser &&
          !mustVerifyEmail(authService.currentUser)
        ) {
          resetToMainTab(navigation, 'Home');
        }
      })();
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [navigation]);

  const handleResend = useCallback(async () => {
    setResendLoading(true);
    const result = await authService.sendVerificationEmail();
    setResendLoading(false);
    if (result.success) {
      Alert.alert(AuthConst.verifyEmailResentTitle, AuthConst.verifyEmailResentBody);
    } else {
      Alert.alert(AuthConst.genericErrorTitle, result.error || AuthConst.tryAgainMessage);
    }
  }, []);

  const handleContinue = useCallback(async () => {
    setContinueLoading(true);
    const result = await authService.reloadCurrentUser();
    setContinueLoading(false);
    if (!result.success) {
      Alert.alert(AuthConst.genericErrorTitle, result.error || AuthConst.tryAgainMessage);
      return;
    }
    const user = authService.currentUser;
    if (user && !mustVerifyEmail(user)) {
      resetToMainTab(navigation, 'Home');
      return;
    }
    Alert.alert(AuthConst.genericErrorTitle, AuthConst.verifyEmailStillUnverified);
  }, [navigation]);

  const handleSignOut = useCallback(async () => {
    await authService.signOut();
    resetNavigation(navigation, RootStackScreens.Login);
  }, [navigation]);

  return (
    <SafeScreen
      statusBarColor={theme.colors.appBarBackground}
      bottomInsetColor={theme.colors.background}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.iconWrap}>
          <Icon name="email-check-outline" size={48} color={theme.colors.primary} />
        </View>

        <Text style={styles.title}>{AuthConst.verifyEmailTitle}</Text>
        <Text style={styles.subtitle}>{AuthConst.verifyEmailSubtitle}</Text>

        {email ? (
          <View style={styles.emailBox}>
            <Text style={styles.emailLabel}>{AuthConst.verifyEmailAddressLabel}</Text>
            <Text style={styles.emailValue}>{email}</Text>
          </View>
        ) : null}

        <PrimaryButton
          title={
            continueLoading
              ? AuthConst.verifyEmailChecking
              : AuthConst.verifyEmailContinueButton
          }
          onPress={handleContinue}
          loading={continueLoading}
          disabled={continueLoading || resendLoading}
          fullWidth
          size="large"
        />

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.secondaryBtn, resendLoading && styles.secondaryDisabled]}
          onPress={handleResend}
          disabled={resendLoading || continueLoading}>
          <Text style={styles.secondaryText}>
            {resendLoading ? AuthConst.verifyEmailResending : AuthConst.verifyEmailResendButton}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.signOutRow}
          onPress={handleSignOut}>
          <Text style={styles.signOutText}>{AuthConst.verifyEmailSignOutButton}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeScreen>
  );
};

export default VerifyEmailScreen;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    scroll: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 56,
      paddingBottom: 40,
    },
    iconWrap: {
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      color: theme.colors.text,
      fontSize: 28,
      lineHeight: 34,
      fontFamily: theme.typography.fontFamily.bold,
      textAlign: 'center',
      marginBottom: 12,
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.md,
      lineHeight: 22,
      textAlign: 'center',
      marginBottom: 28,
    },
    emailBox: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
      marginBottom: 28,
    },
    emailLabel: {
      fontSize: 10,
      letterSpacing: 1,
      color: theme.colors.textSecondary,
      marginBottom: 6,
      textTransform: 'uppercase',
    },
    emailValue: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
    },
    secondaryBtn: {
      marginTop: 16,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
    },
    secondaryDisabled: {
      opacity: 0.5,
    },
    secondaryText: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.semiBold,
    },
    signOutRow: {
      marginTop: 32,
      alignItems: 'center',
    },
    signOutText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.sm,
    },
  });
