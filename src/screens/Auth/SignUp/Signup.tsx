import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input } from '@/components/Input';
import { AppBar, Text, SafeScreen, PrimaryButton } from '@/core/components';
import { Theme, useTheme } from '@/core/theme';
import { AuthConst } from '@/utils/Constants';
import { useSignup } from './useSignup';

const PLACEHOLDER_MUTED = 'rgba(187, 202, 191, 0.4)';

const SignupScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme, insets.top), [theme, insets.top]);
  const [showPassword, setShowPassword] = useState(false);

  const {
    name,
    email,
    password,
    phone,
    errors,
    loading,
    setName,
    setEmail,
    setPassword,
    setPhone,
    handleSignup,
    handleGoogleSignup,
    googleLoading,
    openTerms,
    openPrivacy,
    navigateToLogin,
  } = useSignup();

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
        <View style={styles.glowRight} />
        <View style={styles.glowLeft} />

        <AppBar
          title={AuthConst.brandHeaderTitle}
          rightLabel={AuthConst.brandHeaderSignIn}
          onRightPress={navigateToLogin}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>{AuthConst.signupHeroTitle}</Text>
            <Text style={styles.heroSubtitle}>
              {AuthConst.signupHeroSubtitleLine1}
              {'\n'}
              {AuthConst.signupHeroSubtitleLine2}
            </Text>
          </View>

          <View style={styles.formCard}>
            <Input
              label={AuthConst.fullNameLabelUpper}
              labelStyle={fieldLabelStyle}
              inputRowStyle={fieldRowStyle}
              placeholder={AuthConst.signupNamePlaceholderFigma}
              placeholderTextColor={PLACEHOLDER_MUTED}
              value={name}
              onChangeText={setName}
              error={errors.name}
              autoCapitalize="words"
              leftIcon={<Icon name="account-outline" size={18} color={theme.colors.textSecondary} />}
              containerStyle={styles.inputWrap}
              inputStyle={styles.inputText}
            />

            <Input
              label={AuthConst.signupEmailLabelUpper}
              labelStyle={fieldLabelStyle}
              inputRowStyle={fieldRowStyle}
              placeholder={AuthConst.signupEmailPlaceholderFigma}
              placeholderTextColor={PLACEHOLDER_MUTED}
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<Icon name="email-outline" size={18} color={theme.colors.textSecondary} />}
              containerStyle={styles.inputWrap}
              inputStyle={styles.inputText}
            />

            <Input
              label={AuthConst.signupPasswordLabelUpper}
              labelStyle={fieldLabelStyle}
              inputRowStyle={fieldRowStyle}
              placeholder={AuthConst.passwordPlaceholder}
              placeholderTextColor={PLACEHOLDER_MUTED}
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              leftIcon={<Icon name="lock-outline" size={18} color={theme.colors.textSecondary} />}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowPassword(v => !v)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
                  <Icon
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              }
              containerStyle={styles.inputWrap}
              inputStyle={styles.inputText}
            />

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
              containerStyle={styles.inputWrapLast}
              inputStyle={styles.inputText}
            />

            <PrimaryButton
              title={AuthConst.signupHeroTitle}
              onPress={handleSignup}
              loading={loading}
              disabled={loading || googleLoading}
              fullWidth
              size="large"
              rightIcon={<Icon name="arrow-right" size={16} color={theme.colors.onPrimary} />}
            />

            <View style={styles.legalBlock}>
              <Text style={styles.legalLine}>{AuthConst.signupLegalLine1}</Text>
              <Text style={styles.legalLine}>
                <Text style={styles.legalLink} onPress={openTerms}>
                  {AuthConst.termsOfService}
                </Text>
                {AuthConst.signupLegalAnd}
                <Text style={styles.legalLink} onPress={openPrivacy}>
                  {AuthConst.privacyPolicy}
                </Text>
                {AuthConst.signupLegalSuffix}
              </Text>
            </View>
          </View>

          <View style={styles.altSignup}>
            <Text style={styles.altLabel}>{AuthConst.dividerOrContinueWith}</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.googleRow,
                (loading || googleLoading) && styles.googleRowDisabled,
              ]}
              onPress={handleGoogleSignup}
              disabled={loading || googleLoading}>
              <Icon name="google" size={20} color={theme.colors.text} />
              <Text style={styles.googleRowText}>
                {googleLoading ? AuthConst.signingInWithGoogle : AuthConst.continueWithGoogle}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>{AuthConst.footerSignatureLine}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

export default SignupScreen;

const createStyles = (theme: Theme, insetTop: number) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.backgroundSecondary,
    },
    flex: {
      flex: 1,
    },
    glowRight: {
      position: 'absolute',
      right: -80,
      top: '25%',
      bottom: '38%',
      width: 384,
      borderRadius: 999,
      backgroundColor: 'rgba(78, 222, 163, 0.05)',
      opacity: 0.9,
      zIndex: 0,
    },
    glowLeft: {
      position: 'absolute',
      left: -80,
      top: '38%',
      bottom: '25%',
      width: 384,
      borderRadius: 999,
      backgroundColor: 'rgba(78, 222, 163, 0.05)',
      opacity: 0.9,
      zIndex: 0,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingTop: insetTop + 96,
      paddingBottom: 48,
    },
    hero: {
      alignItems: 'center',
      marginBottom: 32,
      gap: 12,
    },
    heroTitle: {
      color: theme.colors.text,
      fontSize: 36,
      lineHeight: 40,
      letterSpacing: -0.9,
      textAlign: 'center',
      fontFamily: theme.typography.fontFamily.bold,
    },
    heroSubtitle: {
      color: theme.colors.textSecondary,
      fontSize: 18,
      lineHeight: 28,
      textAlign: 'center',
      maxWidth: 384,
      fontFamily: theme.typography.fontFamily.regular,
    },
    formCard: {
      borderRadius: 32,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
      backgroundColor: 'rgba(32, 31, 31, 0.6)',
      paddingHorizontal: 33,
      paddingTop: 41,
      paddingBottom: 33,
      marginBottom: 32,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 40,
      elevation: 12,
    },
    inputWrap: {
      marginBottom: 24,
    },
    inputWrapLast: {
      marginBottom: 24,
    },
    inputText: {
      color: theme.colors.text,
    },
    legalBlock: {
      marginTop: 32,
      paddingTop: 33,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    legalLine: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      lineHeight: 19.5,
      textAlign: 'center',
      fontFamily: theme.typography.fontFamily.regular,
    },
    legalLink: {
      color: theme.colors.text,
      textDecorationLine: 'underline',
      textDecorationColor: 'rgba(255, 255, 255, 0.2)',
    },
    altSignup: {
      alignItems: 'center',
      marginBottom: 24,
    },
    altLabel: {
      fontSize: 10,
      lineHeight: 15,
      letterSpacing: 2,
      color: 'rgba(187, 202, 191, 0.4)',
      marginBottom: 16,
      textTransform: 'uppercase',
      fontFamily: theme.typography.fontFamily.medium,
    },
    googleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      height: 56,
      width: '100%',
      borderRadius: 12,
      backgroundColor: '#2a2a2a',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
      opacity: 1,
    },
    googleRowText: {
      color: '#e5e2e1',
      fontSize: theme.typography.fontSize.md,
      lineHeight: 24,
      fontFamily: theme.typography.fontFamily.regular,
    },
    googleRowDisabled: {
      opacity: 0.55,
    },
    signatureBlock: {
      alignItems: 'center',
      opacity: 0.3,
      paddingVertical: 32,
      gap: 16,
    },
    signatureLine: {
      width: 1,
      height: 48,
      backgroundColor: theme.colors.primary,
      opacity: 0.5,
    },
    signatureText: {
      fontSize: 10,
      lineHeight: 15,
      letterSpacing: 3,
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.regular,
    },
  });
