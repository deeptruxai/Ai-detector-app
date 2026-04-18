/**
 * Google Sign-In for Firebase requires the Web client ID from the Firebase console
 * (Project settings → Your apps → Web client, or Authentication → Sign-in method → Google).
 * This is not a secret server key; it identifies the OAuth client to Google.
 * Prefer injecting at build time in your CI; empty disables Google sign-in until set.
 */
export const GOOGLE_WEB_CLIENT_ID = '';
