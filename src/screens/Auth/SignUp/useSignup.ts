import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authService } from '@/service/firebase';
import type { SignupScreenProps } from '@/navigation/types';

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
  errors: SignupErrors;
  loading: boolean;
  passwordStrength: PasswordStrength;

  // Actions
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  handleSignup: () => Promise<void>;
  navigateToLogin: () => void;
}

export const useSignup = (): UseSignupReturn => {
  const navigation = useNavigation<SignupScreenProps['navigation']>();

  const [name, setNameState] = useState('');
  const [email, setEmailState] = useState('');
  const [password, setPasswordState] = useState('');
  const [errors, setErrors] = useState<SignupErrors>({});
  const [loading, setLoading] = useState(false);

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
      newErrors.name = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!passwordStrength.hasMinLength) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!passwordStrength.hasUppercase) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!passwordStrength.hasNumber) {
      newErrors.password = 'Password must contain at least one number';
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

  const handleSignup = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);
    const response = await authService.signUp(email.trim(), password, name.trim());
    setLoading(false);

    if (response.success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } else {
      Alert.alert('Signup Failed', response.error || 'Please try again.');
    }
  }, [name, email, password, navigation, validateForm]);

  const navigateToLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  return {
    name,
    email,
    password,
    errors,
    loading,
    passwordStrength,
    setName,
    setEmail,
    setPassword,
    handleSignup,
    navigateToLogin,
  };
};

export default useSignup;
