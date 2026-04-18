/** Allowlisted hosts and paths for in-app legal WebViews (SSRF-safe). */
export const LEGAL_TERMS_URL = 'https://aidetect.in/terms';
export const LEGAL_PRIVACY_URL = 'https://aidetect.in/privacy';

const ALLOWED_HOST = 'aidetect.in';
const ALLOWED_PATHS = new Set(['/terms', '/privacy']);

export function isAllowlistedLegalUrl(uri: string): boolean {
  try {
    const u = new URL(uri);
    if (u.protocol !== 'https:') {
      return false;
    }
    if (u.hostname !== ALLOWED_HOST) {
      return false;
    }
    const path = u.pathname.replace(/\/$/, '') || '/';
    return ALLOWED_PATHS.has(path);
  } catch {
    return false;
  }
}
