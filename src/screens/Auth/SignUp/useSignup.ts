import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { authService } from '@/service/firebase';
import { navigateTo, resetToMainTab } from '@/navigation/navUtils';
import { AuthConst } from '@/utils/Constants';

interface SignupErrors {
  name?: string;
  email?: string;
  password?: string;
}

interface PasswordStrength {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
}

interface UseSignupReturn {
  // State
  name: string;
  email: string;
  password: string;
  /** Collected for UI; not sent to auth API yet */
  phone: string;
  errors: SignupErrors;
  loading: boolean;
  googleLoading: boolean;
  passwordStrength: PasswordStrength;

  // Actions
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setPhone: (value: string) => void;
  handleSignup: () => Promise<void>;
  handleGoogleSignup: () => Promise<void>;
  openTerms: () => void;
  openPrivacy: () => void;
  navigateToLogin: () => void;
}

export const useSignup = (): UseSignupReturn => {
  const [name, setNameState] = useState('');
  const [email, setEmailState] = useState('');
  const [password, setPasswordState] = useState('');
  const [phone, setPhoneState] = useState('');
  const [errors, setErrors] = useState<SignupErrors>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const passwordStrength = useMemo<PasswordStrength>(
    () => ({
      hasMinLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    }),
    [password],
  );

  const validateEmail = useCallback((value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: SignupErrors = {};

    if (!name.trim()) {
      newErrors.name = AuthConst.fullNameRequiredError;
    }

    if (!email.trim()) {
      newErrors.email = AuthConst.emailRequiredError;
    } else if (!validateEmail(email)) {
      newErrors.email = AuthConst.validEmailError;
    }

    if (!password) {
      newErrors.password = AuthConst.passwordRequiredError;
    } else if (!passwordStrength.hasMinLength) {
      newErrors.password = AuthConst.passwordMinLengthError;
    } else if (!passwordStrength.hasUppercase) {
      newErrors.password = AuthConst.passwordUppercaseError;
    } else if (!passwordStrength.hasNumber) {
      newErrors.password = AuthConst.passwordNumberError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, password, passwordStrength, validateEmail]);

  const setName = useCallback(
    (value: string) => {
      setNameState(value);
      if (errors.name) {
        setErrors(prev => ({ ...prev, name: undefined }));
      }
    },
    [errors.name],
  );

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

  const setPhone = useCallback((value: string) => {
    setPhoneState(value);
  }, []);

  const handleSignup = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);
    const response = await authService.signUp(email.trim(), password, name.trim());
    setLoading(false);

    if (response.success) {
      resetToMainTab('Home');
    } else {
      Alert.alert(AuthConst.signupFailedTitle, response.error || AuthConst.tryAgainMessage);
    }
  }, [name, email, password, validateForm]);

  const handleGoogleSignup = useCallback(async () => {
    setGoogleLoading(true);
    const response = await authService.signInWithGoogle();
    setGoogleLoading(false);
    if (response.success) {
      resetToMainTab('Home');
    } else {
      Alert.alert(AuthConst.signupFailedTitle, response.error || AuthConst.tryAgainMessage);
    }
  }, []);

  const openTerms = useCallback(() => {
    navigateTo('WebView', {
      title: AuthConst.webViewTermsTitle,
      uri: AuthConst.termsUrl,
    });
  }, []);

  const openPrivacy = useCallback(() => {
    navigateTo('WebView', {
      title: AuthConst.webViewPrivacyTitle,
      uri: AuthConst.privacyUrl,
    });
  }, []);

  const navigateToLogin = useCallback(() => {
    navigateTo('Login');
  }, []);

  return {
    name,
    email,
    password,
    phone,
    errors,
    loading,
    googleLoading,
    passwordStrength,
    setName,
    setEmail,
    setPassword,
    setPhone,
    handleSignup,
    handleGoogleSignup,
    openTerms,
    openPrivacy,
    navigateToLogin,
  };
};

export default useSignup;
