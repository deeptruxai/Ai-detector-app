import React, { useMemo, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input } from '@/components/Input';
import { AppBar, Text, SafeScreen, PrimaryButton } from '@/core/components';
import { Theme, useTheme } from '@/core/theme';
import { AuthConst } from '@/utils/Constants';
import { authService } from '@/service/firebase';
import { goBack, navigateTo } from '@/navigation/navUtils';
import { RootStackScreens } from '@/navigation/types';

const PLACEHOLDER_MUTED = 'rgba(187, 202, 191, 0.4)';

const PhoneAuthScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const sendCode = useCallback(async () => {
    const trimmed = phone.trim();
    if (!trimmed) {
      Alert.alert(AuthConst.genericErrorTitle, AuthConst.phoneRequiredError);
      return;
    }
    setLoading(true);
    authService.clearPhoneConfirmation();
    const result = await authService.startPhoneSignIn(trimmed);
    setLoading(false);
    if (result.success) {
      navigateTo(RootStackScreens.VerifyOTP, {
        phoneNumber: trimmed,
      });
    } else {
      Alert.alert(AuthConst.genericErrorTitle, result.error || AuthConst.tryAgainMessage);
    }
  }, [phone]);

  const fieldRowStyle = useMemo(
    () => ({
      backgroundColor: '#2a2a2a',
      borderColor: 'rgba(255, 255, 255, 0.06)',
      height: 56,
    }),
    [],
  );

  const fieldLabelStyle = useMemo(
    () => ({
      fontSize: 10,
      lineHeight: 15,
      letterSpacing: 1.5,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      textTransform: 'uppercase' as const,
    }),
    [theme.colors.textSecondary],
  );

  return (
    <SafeScreen style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <AppBar
          title={AuthConst.phoneAuthTitle}
          showBack
          onBackPress={() => goBack()}
          absolute={false}
          containerStyle={styles.appBarPad}
        />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>{AuthConst.phoneAuthHeadline}</Text>
            <Text style={styles.heroSubtitle}>{AuthConst.phoneAuthSubtitle}</Text>
          </View>

          <View style={styles.formCard}>
            <Input
              label={AuthConst.phoneLabelUpper}
              labelStyle={fieldLabelStyle}
              inputRowStyle={fieldRowStyle}
              placeholder={AuthConst.signupPhonePlaceholder}
              placeholderTextColor={PLACEHOLDER_MUTED}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              leftIcon={<Icon name="phone-outline" size={18} color={theme.colors.textSecondary} />}
              containerStyle={styles.inputWrap}
              inputStyle={styles.inputText}
            />

            <PrimaryButton
              title={AuthConst.phoneAuthCta}
              onPress={sendCode}
              loading={loading}
              disabled={loading}
              fullWidth
              size="large"
              rightIcon={<Icon name="arrow-right" size={18} color={theme.colors.onPrimary} />}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

export default PhoneAuthScreen;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.backgroundSecondary,
      flex: 1,
    },
    flex: { flex: 1 },
    appBarPad: {
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingBottom: 48,
    },
    hero: {
      marginBottom: 24,
      gap: 8,
    },
    heroTitle: {
      color: theme.colors.text,
      fontSize: 28,
      lineHeight: 34,
      fontFamily: theme.typography.fontFamily.bold,
    },
    heroSubtitle: {
      color: theme.colors.textSecondary,
      fontSize: 15,
      lineHeight: 22,
      fontFamily: theme.typography.fontFamily.regular,
    },
    formCard: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
      backgroundColor: 'rgba(32, 31, 31, 0.6)',
      padding: 24,
      gap: 20,
    },
    inputWrap: {
      marginBottom: 4,
    },
    inputText: {
      color: theme.colors.text,
    },
  });
