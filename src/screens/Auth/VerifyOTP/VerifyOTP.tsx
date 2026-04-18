import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Button } from '@/components/Button';
import { Text, SafeScreen } from '@/core/components';
import { Theme, useTheme } from '@/core/theme';
import { VerifyOTPScreenProps } from '@/navigation/types';
import { AuthConst } from '@/utils/Constants';

const VerifyOTPScreen: React.FC<VerifyOTPScreenProps> = ({ route, navigation }) => {
  const { email } = route.params;
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    // Navigate back to login or home after "verifying"
    navigation.replace('Dashboard');
  };

  return (
    <SafeScreen style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          
          <View style={styles.header}>
            <Text size="xxxl" style={styles.title}>
              {AuthConst.verifyOtpTitle}
            </Text>
            <Text size="md" style={styles.subtitle}>
              {AuthConst.verifyOtpSubtitle}
            </Text>
            <Text size="md" style={styles.email}>
              {email}
            </Text>
          </View>

          <View style={styles.otpWrapper}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
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
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ))}
          </View>

          <Button
            title={AuthConst.verifyOtpButton}
            onPress={handleVerify}
            style={styles.verifyButton}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>{AuthConst.otpResendPrefix}</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.resendLink}>{AuthConst.otpResendCta}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

export default VerifyOTPScreen;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
    },
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
    verifyButton: {
      marginTop: 20,
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
