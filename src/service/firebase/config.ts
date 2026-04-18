import { getApps, getApp } from '@react-native-firebase/app';

/**
 * Firebase Configuration
 * Singleton pattern - Firebase app is automatically initialized
 * by @react-native-firebase using GoogleService-Info.plist (iOS)
 * and google-services.json (Android)
 */

class FirebaseConfig {
  private static instance: FirebaseConfig;

  private constructor() {}

  public static getInstance(): FirebaseConfig {
    if (!FirebaseConfig.instance) {
      FirebaseConfig.instance = new FirebaseConfig();
    }
    return FirebaseConfig.instance;
  }

  /**
   * True when the native default app exists (after FirebaseApp.configure() on iOS
   * and the equivalent on Android). Always read fresh — do not cache at module load.
   */
  public get isInitialized(): boolean {
    try {
      return getApps().length > 0;
    } catch {
      return false;
    }
  }

  public get app() {
    return getApp();
  }
}

// Export singleton instance
export const firebaseConfig = FirebaseConfig.getInstance();
export default firebaseConfig;
