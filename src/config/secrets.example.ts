/**
 * Secrets template.
 *
 * Copy this file to `secrets.ts` in the same folder and fill in your values.
 * `secrets.ts` is intentionally gitignored — DO NOT commit real keys.
 *
 * SECURITY NOTES
 * --------------
 * 1. Bundling a Gemini API key inside the mobile app is acceptable for
 *    development and internal builds. For production we strongly recommend
 *    proxying the request through a backend (mirroring the web project's
 *    `/api/analyze` route) so the key never ships to end users.
 * 2. NEVER place server-only secrets (admin credentials, server signing keys,
 *    DB passwords, etc.) in this file — anything bundled into the mobile app
 *    can be extracted from a decompiled binary.
 * 3. Firebase Web SDK config below is OPTIONAL. The React Native Firebase
 *    modules read their config from `google-services.json` (Android) and
 *    `GoogleService-Info.plist` (iOS) at the native layer. Only fill these
 *    in if a JS-only consumer needs them.
 */

export const AiDetectionSecrets = {
  /** Gemini API key (e.g. AIza...). Required. */
  GEMINI_API_KEY: '',

  /**
   * Optional fallback key, used if `GEMINI_API_KEY` is empty or a placeholder.
   * Mirrors the web project's `CUSTOM_DEEPTRUX_KEY`.
   */
  GEMINI_API_KEY_FALLBACK: '',

  /** Generative Language REST base URL. Kept here so no public URI lives in committed code. */
  GEMINI_BASE_URL: '',

  /** Model identifier used by the web project. */
  GEMINI_MODEL: 'gemini-3-flash-preview',
} as const;

export const FirebaseSecrets = {
  API_KEY: '',
  AUTH_DOMAIN: '',
  PROJECT_ID: '',
  STORAGE_BUCKET: '',
  MESSAGING_SENDER_ID: '',
  APP_ID: '',
  MEASUREMENT_ID: '',
} as const;

export const AppSecrets = {
  /** Public URL where the companion web app is hosted. Used for deep links / share text. */
  APP_URL: '',
} as const;

export type AiDetectionSecretsType = typeof AiDetectionSecrets;
export type FirebaseSecretsType = typeof FirebaseSecrets;
export type AppSecretsType = typeof AppSecrets;
