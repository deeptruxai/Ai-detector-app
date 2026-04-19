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
import { Text, SafeScreen, IconWithBackground } from '@/core/components';
import { Theme, useTheme } from '@/core/theme';
import { AuthConst } from '@/utils/Constants';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigation } from '@/navigation/navUtils';
import { useLogin } from './useLogin';

const LoginScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<RootStackNavigation>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    email,
    password,
    errors,
    loading,
    googleLoading,
    setEmail,
    setPassword,
    handleLogin,
    handleGoogleLogin,
    handleForgotPassword,
    navigateToSignup,
    navigateToPhoneAuth,
  } = useLogin(navigation);

  return (
    <SafeScreen
      statusBarColor={theme.colors.appBarBackground}
      bottomInsetColor={theme.colors.background}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <IconWithBackground
              iconName={'shield'}
              containerStyle={styles.iconcontainer}
            />
            <Text style={styles.title}>AIDetect</Text>
            <Text style={styles.subtitle}>
              Verify truth in a synthetic world
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.socialButton,
              (loading || googleLoading) && styles.socialButtonDisabled,
            ]}
            onPress={handleGoogleLogin}
            disabled={loading || googleLoading}
          >
            <Icon name="google" size={20} color={theme.colors.text} />
            <Text style={styles.socialButtonText}>
              {googleLoading
                ? AuthConst.signingInWithGoogle
                : AuthConst.continueWithGoogle}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>{AuthConst.dividerOrEmail}</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.form}>
            <Input
              label={AuthConst.emailLabelUpper}
              labelStyle={styles.fieldLabel}
              placeholder={AuthConst.loginEmailPlaceholder}
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              rightIcon={
                <Icon name="at" size={18} color={theme.colors.textSecondary} />
              }
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
            />

            <Input
              label={AuthConst.passwordLabelUpper}
              labelStyle={styles.fieldLabel}
              placeholder={AuthConst.passwordPlaceholder}
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry
              autoCapitalize="none"
              rightIcon={
                <Icon
                  name="lock-outline"
                  size={18}
                  color={theme.colors.textSecondary}
                />
              }
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
            />

            <View style={styles.optionsRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={loading}
              style={[
                styles.signInButton,
                loading && styles.signInButtonDisabled,
              ]}
            >
              <Text style={styles.signInButtonText}>
                {loading ? 'Please wait...' : AuthConst.signInButton}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.phoneButton}
            onPress={navigateToPhoneAuth}
          >
            <Icon name="cellphone" size={16} color={theme.colors.primary} />
            <Text style={styles.phoneButtonText}>
              Sign in with Phone Number (OTP)
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{AuthConst.loginFooterPrefix}</Text>
            <TouchableOpacity onPress={navigateToSignup}>
              <Text style={styles.signupLink}>{AuthConst.loginFooterCta}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

export default LoginScreen;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
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
      backgroundColor: '#2a2a2a',
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
      backgroundColor: '#2a2a2a',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 16,
      marginBottom: 24,
    },
    socialButtonDisabled: {
      opacity: 0.55,
    },
    socialButtonText: {
      color: '#e5e2e1',
      fontSize: theme.typography.fontSize.md,
      lineHeight: 24,
      letterSpacing: -0.4,
      fontFamily: theme.typography.fontFamily.regular,
    },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginBottom: 20,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: 'rgba(60, 74, 66, 0.3)',
    },
    dividerText: {
      color: 'rgba(255, 255, 255, 0.3)',
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
    fieldLabel: {
      fontSize: 10,
      lineHeight: 15,
      letterSpacing: 1,
      color: 'rgba(255, 255, 255, 0.5)',
      marginBottom: 8,
    },
    inputText: {
      color: theme.colors.text,
    },
    optionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 16,
      paddingHorizontal: 2,
      width: '100%',
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
    signInButton: {
      marginTop: 8,
      height: 56,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    signInButtonDisabled: {
      opacity: 0.6,
    },
    signInButtonText: {
      color: theme.colors.onPrimary,
      fontSize: theme.typography.fontSize.lg,
      lineHeight: 28,
      fontFamily: theme.typography.fontFamily.semiBold,
    },
    phoneButton: {
      height: 44,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: 'rgba(60, 74, 66, 0.1)',
      backgroundColor: 'rgba(32, 31, 31, 0.5)',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
      marginBottom: 32,
      alignSelf: 'center',
      paddingHorizontal: 22,
    },
    phoneButtonText: {
      color: 'rgba(255, 255, 255, 0.8)',
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
    signupLink: {
      fontSize: 14,
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.semiBold,
    },
    iconcontainer: {
      marginBottom: 16,
    },
  });
