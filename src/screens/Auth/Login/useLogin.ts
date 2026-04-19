import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { authService } from '@/service/firebase';
import { RootStackScreens } from '@/navigation/types';
import {
  navigateTo,
  resetNavigation,
  resetToMainTab,
  type RootStackNavigation,
} from '@/navigation/navUtils';
import { AuthConst } from '@/utils/Constants';

interface LoginErrors {
  email?: string;
  password?: string;
}

interface UseLoginReturn {
  email: string;
  password: string;
  errors: LoginErrors;
  loading: boolean;
  googleLoading: boolean;

  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  handleLogin: () => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
  handleForgotPassword: () => Promise<void>;
  navigateToSignup: () => void;
  navigateToPhoneAuth: () => void;
}

export const useLogin = (navigation: RootStackNavigation): UseLoginReturn => {
  const [email, setEmailState] = useState('');
  const [password, setPasswordState] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validateEmail = useCallback((value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: LoginErrors = {};

    if (!email.trim()) {
      newErrors.email = AuthConst.emailRequiredError;
    } else if (!validateEmail(email)) {
      newErrors.email = AuthConst.validEmailError;
    }

    if (!password) {
      newErrors.password = AuthConst.passwordRequiredError;
    } else if (password.length < 6) {
      newErrors.password = AuthConst.passwordMinLengthError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password, validateEmail]);

  const setEmail = useCallback(
    (value: string) => {
      setEmailState(value);
      if (errors.email) {
        setErrors(prev => ({ ...prev, email: undefined }));
      }
    },
    [errors.email],
  );

  const setPassword = useCallback(
    (value: string) => {
      setPasswordState(value);
      if (errors.password) {
        setErrors(prev => ({ ...prev, password: undefined }));
      }
    },
    [errors.password],
  );

  const handleLogin = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);
    const response = await authService.signIn(email.trim(), password);
    setLoading(false);

    if (response.success) {
      resetToMainTab(navigation, 'Home');
    } else {
      Alert.alert(
        AuthConst.loginFailedTitle,
        response.error || AuthConst.tryAgainMessage,
      );
    }
  }, [email, password, navigation, validateForm]);

  const handleGoogleLogin = useCallback(async () => {
    setGoogleLoading(true);
    const response = await authService.signInWithGoogle();
    setGoogleLoading(false);
    if (response.success) {
      resetToMainTab(navigation, 'Home');
    } else {
      Alert.alert(
        AuthConst.loginFailedTitle,
        response.error || AuthConst.tryAgainMessage,
      );
    }
  }, [navigation]);

  const handleForgotPassword = useCallback(async () => {
    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: AuthConst.resetEmailRequired }));
      return;
    }
    if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: AuthConst.validEmailError }));
      return;
    }

    setLoading(true);
    const response = await authService.sendPasswordResetEmail(email.trim());
    setLoading(false);

    if (response.success) {
      Alert.alert(
        AuthConst.resetEmailSentTitle,
        AuthConst.resetEmailSentMessage,
      );
    } else {
      Alert.alert(
        AuthConst.genericErrorTitle,
        response.error || AuthConst.resetEmailFailedMessage,
      );
    }
  }, [email, validateEmail]);

  const navigateToSignup = useCallback(() => {
    resetNavigation(navigation, RootStackScreens.Signup);
  }, [navigation]);

  const navigateToPhoneAuth = useCallback(() => {
    navigateTo(navigation, RootStackScreens.PhoneAuth);
  }, [navigation]);

  return {
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
  };
};

export default useLogin;
