import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, SafeScreen, PrimaryButton, LoadingState } from '@/core/components';
import { Theme, useTheme } from '@/core/theme';
import { VerifyOTPScreenProps } from '@/navigation/types';
import { AuthConst } from '@/utils/Constants';
import { authService } from '@/service/firebase';
import { resetToMainTab } from '@/navigation/navUtils';

const VerifyOTPScreen: React.FC<VerifyOTPScreenProps> = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (value: string, index: number) => {
    const next = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = next;
    setOtp(newOtp);

    if (next && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: { nativeEvent: { key: string } }, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verify = useCallback(async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      Alert.alert(AuthConst.genericErrorTitle, AuthConst.otpIncompleteError);
      return;
    }
    setLoading(true);
    const result = await authService.confirmPhoneCode(code);
    setLoading(false);
    if (result.success) {
      resetToMainTab(navigation, 'Home');
    } else {
      Alert.alert(AuthConst.loginFailedTitle, result.error || AuthConst.tryAgainMessage);
    }
  }, [navigation, otp]);

  const resend = useCallback(async () => {
    setResendLoading(true);
    authService.clearPhoneConfirmation();
    const result = await authService.startPhoneSignIn(phoneNumber, true);
    setResendLoading(false);
    if (result.success) {
      Alert.alert(AuthConst.genericErrorTitle, AuthConst.otpResentMessage);
    } else {
      Alert.alert(AuthConst.genericErrorTitle, result.error || AuthConst.tryAgainMessage);
    }
  }, [phoneNumber]);

  return (
    <SafeScreen
      statusBarColor={theme.colors.appBarBackground}
      bottomInsetColor={theme.colors.background}
      backgroundColor={theme.colors.background}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text size="xxxl" style={styles.title}>
              {AuthConst.verifyOtpTitle}
            </Text>
            <Text size="md" style={styles.subtitle}>
              {AuthConst.verifyOtpSubtitle}
            </Text>
            <Text size="md" style={styles.email}>
              {phoneNumber}
            </Text>
          </View>

          {loading ? (
            <LoadingState message={AuthConst.otpVerifyingMessage} />
          ) : (
            <>
              <View style={styles.otpWrapper}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => {
                      inputs.current[index] = ref;
                    }}
                    style={[
                      styles.otpInput,
                      {
                        backgroundColor: theme.colors.backgroundSecondary,
                        borderColor: digit ? theme.colors.primary : theme.colors.border,
                        color: theme.colors.text,
                        borderRadius: theme.borderRadius.md,
                      },
                    ]}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={digit}
                    onChangeText={value => handleOtpChange(value, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
                  />
                ))}
              </View>

              <PrimaryButton
                title={AuthConst.verifyOtpButton}
                onPress={verify}
                fullWidth
                size="large"
                disabled={otp.join('').length !== 6}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>{AuthConst.otpResendPrefix}</Text>
                <TouchableOpacity onPress={resend} disabled={resendLoading}>
                  <Text style={styles.resendLink}>
                    {resendLoading ? AuthConst.otpResending : AuthConst.otpResendCta}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

export default VerifyOTPScreen;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 80,
    },
    header: {
      marginBottom: 48,
    },
    title: {
      fontWeight: '900',
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      color: theme.colors.textSecondary,
    },
    email: {
      color: theme.colors.primary,
      fontWeight: '600',
      marginTop: 2,
    },
    otpWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 40,
    },
    otpInput: {
      width: 48,
      height: 56,
      borderWidth: 1,
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '700',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 32,
    },
    footerText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    resendLink: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '700',
    },
  });
