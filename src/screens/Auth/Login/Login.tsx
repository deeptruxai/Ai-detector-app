import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Text, SafeScreen } from '@/core/components';
import { Theme, useTheme } from '@/core/theme';
import { AuthConst } from '@/utils/Constants';
import { useLogin } from './useLogin';

const LoginScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    email,
    password,
    errors,
    loading,
    setEmail,
    setPassword,
    handleLogin,
    navigateToSignup,
  } = useLogin();

  return (
    <SafeScreen style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text size="xxxl" style={styles.title}>
              {AuthConst.loginTitle}
            </Text>
            <Text size="md" style={styles.subtitle}>
              {AuthConst.loginSubtitle}
            </Text>
          </View>

          <View style={styles.form}>
            <Button
              title={AuthConst.continueWithGoogle}
              variant="secondary"
              onPress={() => {}} // Placeholder for Google Sign In
              style={styles.googleButton}
              // icon={<GoogleIcon />} // If we had icons
            />

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>{AuthConst.dividerOr}</Text>
              <View style={styles.divider} />
            </View>

            <Input
              label={AuthConst.emailLabel}
              placeholder={AuthConst.emailPlaceholder}
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label={AuthConst.passwordLabel}
              placeholder={AuthConst.passwordPlaceholder}
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              title={AuthConst.signInButton}
              variant="primary"
              onPress={handleLogin}
              loading={loading}
              style={styles.signInButton}
            />
          </View>

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
    container: {
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 80,
      paddingBottom: 40,
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
      color: theme.colors.primary,
      fontWeight: '500',
    },
    form: {
      flex: 1,
    },
    googleButton: {
      marginBottom: 24,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    dividerText: {
      marginHorizontal: 16,
      color: theme.colors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    signInButton: {
      marginTop: 24,
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
    signupLink: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '700',
    },
  });
