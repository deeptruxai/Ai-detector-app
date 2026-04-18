import { Platform } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  signInWithCredential,
  GoogleAuthProvider,
  signInWithPhoneNumber,
  FirebaseAuthTypes,
} from '@react-native-firebase/auth';
import { GOOGLE_WEB_CLIENT_ID } from '@/config/googleSignIn';
import { firebaseConfig } from './config';

export type FirebaseUser = FirebaseAuthTypes.User;
export type AuthError = FirebaseAuthTypes.NativeFirebaseAuthError;

interface AuthResponse {
  success: boolean;
  user?: FirebaseUser;
  error?: string;
}

/**
 * Firebase Authentication Service
 * Singleton pattern for auth operations (Modular API)
 */
class AuthService {
  private static instance: AuthService;
  private auth: FirebaseAuthTypes.Module;
  private phoneConfirmation: FirebaseAuthTypes.ConfirmationResult | null = null;

  private constructor() {
    if (!firebaseConfig.isInitialized) {
      console.warn('Firebase not initialized. Auth service may not work properly.');
    }
    this.auth = getAuth();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public get currentUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }

  public get isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  public get hasPendingPhoneConfirmation(): boolean {
    return this.phoneConfirmation !== null;
  }

  /**
   * Call once at app startup when webClientId is set (see `src/config/googleSignIn.ts`).
   */
  public configureGoogleSignIn(): void {
    if (!GOOGLE_WEB_CLIENT_ID) {
      return;
    }
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: false,
    });
  }

  public isGoogleSignInConfigured(): boolean {
    return GOOGLE_WEB_CLIENT_ID.length > 0;
  }

  public async signInWithGoogle(): Promise<AuthResponse> {
    if (!this.isGoogleSignInConfigured()) {
      return {
        success: false,
        error: 'Google sign-in is not configured. Add your Web client ID in src/config/googleSignIn.ts.',
      };
    }

    try {
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }

      const response = await GoogleSignin.signIn();
      if (response.type !== 'success') {
        return { success: false, error: 'Sign in was cancelled.' };
      }

      const idToken = response.data.idToken;
      if (!idToken) {
        return {
          success: false,
          error: 'Could not complete Google sign-in. Please try again.',
        };
      }

      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(this.auth, credential);

      return {
        success: true,
        user: userCredential.user,
      };
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        return { success: false, error: 'Sign in was cancelled.' };
      }
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError),
      };
    }
  }

  /**
   * Start SMS verification. Call `confirmPhoneCode` after the user enters the code.
   */
  public async startPhoneSignIn(phoneNumber: string, forceResend?: boolean): Promise<AuthResponse> {
    const e164 = phoneNumber.trim();
    if (!e164) {
      return { success: false, error: 'Please enter a phone number.' };
    }

    try {
      const confirmation = await signInWithPhoneNumber(this.auth, e164, undefined, forceResend);
      this.phoneConfirmation = confirmation;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError),
      };
    }
  }

  public async confirmPhoneCode(code: string): Promise<AuthResponse> {
    const trimmed = code.replace(/\s/g, '');
    if (!trimmed) {
      return { success: false, error: 'Please enter the verification code.' };
    }
    if (!this.phoneConfirmation) {
      return {
        success: false,
        error: 'No verification is in progress. Request a new code.',
      };
    }

    try {
      const userCredential = await this.phoneConfirmation.confirm(trimmed);
      this.phoneConfirmation = null;
      if (!userCredential?.user) {
        return {
          success: false,
          error: 'Verification did not complete. Please try again.',
        };
      }
      return {
        success: true,
        user: userCredential.user,
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError),
      };
    }
  }

  public clearPhoneConfirmation(): void {
    this.phoneConfirmation = null;
  }

  public async signUp(email: string, password: string, displayName?: string): Promise<AuthResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      if (displayName && userCredential.user) {
        await firebaseUpdateProfile(userCredential.user, { displayName });
      }

      return {
        success: true,
        user: userCredential.user,
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError),
      };
    }
  }

  public async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return {
        success: true,
        user: userCredential.user,
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError),
      };
    }
  }

  public async signOut(): Promise<AuthResponse> {
    try {
      this.phoneConfirmation = null;
      if (this.isGoogleSignInConfigured()) {
        try {
          const hasPrev = GoogleSignin.hasPreviousSignIn();
          if (hasPrev) {
            await GoogleSignin.signOut();
          }
        } catch {
          // Ignore Google sign-out errors so Firebase sign-out still runs
        }
      }
      await firebaseSignOut(this.auth);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError),
      };
    }
  }

  public async sendPasswordResetEmail(email: string): Promise<AuthResponse> {
    try {
      await firebaseSendPasswordResetEmail(this.auth, email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError),
      };
    }
  }

  public onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return firebaseOnAuthStateChanged(this.auth, callback);
  }

  private getErrorMessage(error: AuthError): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please sign in instead.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/operation-not-allowed':
        return 'This sign-in method is not enabled.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use a stronger password.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/invalid-phone-number':
        return 'Please enter a valid phone number with country code (e.g. +15551234567).';
      case 'auth/missing-phone-number':
        return 'Please enter a phone number.';
      case 'auth/invalid-verification-code':
        return 'That code is not valid. Please check and try again.';
      case 'auth/session-expired':
        return 'This code has expired. Request a new one.';
      case 'auth/credential-already-in-use':
        return 'This account is already linked to another user.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email using a different sign-in method.';
      default:
        return error.message || 'Something went wrong. Please try again.';
    }
  }
}

export const authService = AuthService.getInstance();
export default authService;
