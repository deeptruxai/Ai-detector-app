import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input } from '@/components/Input';
import { Text, SafeScreen } from '@/core/components';
import { Theme, useTheme } from '@/core/theme';
import { AuthConst } from '@/utils/Constants';
import { useSignup } from './useSignup';

const SignupScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    name,
    email,
    password,
    errors,
    loading,
    setName,
    setEmail,
    setPassword,
    handleSignup,
    navigateToLogin,
  } = useSignup();

  return (
    <SafeScreen style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.topGlow} />
          <View style={styles.bottomGlow} />

          <View style={styles.header}>
            <View style={styles.logoOuterGlow}>
              <View style={styles.logoWrap}>
                <Icon name="shield-check" size={26} color={theme.colors.primary} />
              </View>
            </View>
            <Text style={styles.title}>AIDetect</Text>
            <Text style={styles.subtitle}>Verify truth in a synthetic world</Text>
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.socialButton}>
            <Icon name="google" size={18} color={theme.colors.text} />
            <Text style={styles.socialButtonText}>{AuthConst.continueWithGoogle}</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR CONTINUE WITH EMAIL</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.form}>
            <Input
              label={AuthConst.signupNameLabel}
              placeholder={AuthConst.signupNamePlaceholder}
              value={name}
              onChangeText={setName}
              error={errors.name}
              autoCapitalize="words"
              rightIcon={<Icon name="account-outline" size={18} color={theme.colors.textSecondary} />}
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
            />

            <Input
              label={AuthConst.emailLabel}
              placeholder={AuthConst.emailPlaceholder}
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              rightIcon={<Icon name="at" size={18} color={theme.colors.textSecondary} />}
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
            />

            <Input
              label={AuthConst.passwordLabel}
              placeholder={AuthConst.passwordPlaceholder}
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry
              autoCapitalize="none"
              rightIcon={<Icon name="lock-outline" size={18} color={theme.colors.textSecondary} />}
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
            />

            <View style={styles.optionsRow}>
              <TouchableOpacity activeOpacity={0.85} style={styles.rememberRow}>
                <Icon name="checkbox-blank-outline" size={16} color={theme.colors.borderLight} />
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.85}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSignup}
              disabled={loading}
              style={[styles.signupButton, loading && styles.signupButtonDisabled]}>
              <Text style={styles.signupButtonText}>
                {loading ? 'Please wait...' : AuthConst.signUpButton}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.phoneButton}>
            <Icon name="cellphone" size={16} color={theme.colors.primary} />
            <Text style={styles.phoneButtonText}>Sign in with Phone Number (OTP)</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{AuthConst.signupFooterPrefix}</Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLink}>{AuthConst.signupFooterCta}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

export default SignupScreen;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 42,
      paddingBottom: 40,
      justifyContent: 'center',
      position: 'relative',
    },
    topGlow: {
      position: 'absolute',
      width: 156,
      height: 353,
      borderRadius: 999,
      backgroundColor: theme.colors.brandGlow,
      top: -80,
      left: -24,
      opacity: 0.18,
    },
    bottomGlow: {
      position: 'absolute',
      width: 150,
      height: 280,
      borderRadius: 999,
      backgroundColor: theme.colors.brandGlow,
      bottom: -90,
      right: -24,
      opacity: 0.18,
    },
    header: {
      alignItems: 'center',
      marginBottom: 48,
    },
    logoOuterGlow: {
      borderRadius: 999,
      padding: 16,
      backgroundColor: theme.colors.brandGlow,
      marginBottom: 16,
    },
    logoWrap: {
      width: 64,
      height: 64,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
    },
    title: {
      color: theme.colors.text,
      marginBottom: 6,
      fontSize: 36,
      lineHeight: 40,
      letterSpacing: -1.8,
      fontFamily: theme.typography.fontFamily.bold,
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.md,
      lineHeight: 24,
      fontFamily: theme.typography.fontFamily.regular,
    },
    socialButton: {
      height: 56,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    socialButtonText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.md,
      lineHeight: 24,
      fontFamily: theme.typography.fontFamily.medium,
    },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 20,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
      opacity: 0.7,
    },
    dividerText: {
      color: theme.colors.textDisabled,
      fontSize: 10,
      letterSpacing: 2,
      fontFamily: theme.typography.fontFamily.medium,
    },
    form: {
      marginBottom: 16,
    },
    inputContainer: {
      marginBottom: 14,
    },
    inputText: {
      color: theme.colors.text,
    },
    signupButton: {
      marginTop: 8,
      height: 56,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 18,
      elevation: 8,
    },
    signupButtonDisabled: {
      opacity: 0.6,
    },
    signupButtonText: {
      color: theme.colors.onPrimary,
      fontSize: theme.typography.fontSize.lg,
      lineHeight: 28,
      fontFamily: theme.typography.fontFamily.semiBold,
    },
    optionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingHorizontal: 2,
    },
    rememberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    rememberText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.xs,
      lineHeight: 16,
      fontFamily: theme.typography.fontFamily.regular,
    },
    forgotText: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.xs,
      lineHeight: 16,
      fontFamily: theme.typography.fontFamily.semiBold,
    },
    phoneButton: {
      height: 44,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
      marginBottom: 32,
      alignSelf: 'center',
      paddingHorizontal: 22,
    },
    phoneButtonText: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: 20,
      fontFamily: theme.typography.fontFamily.medium,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
    },
    footerText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    loginLink: {
      fontSize: 14,
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.semiBold,
    },
  });
