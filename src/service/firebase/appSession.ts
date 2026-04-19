import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = 'aidetect_install_device_id';

let memorySessionId: string | null = null;

const createId = (prefix: string): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

/**
 * New id each JS cold start — matches “session” semantics with the web app’s session logs.
 */
export function getAppSessionId(): string {
  if (!memorySessionId) {
    memorySessionId = createId('sess');
  }
  return memorySessionId;
}

/**
 * Stable per-install id for `users` / `activity_logs.deviceId` (aligned with web `deviceId`).
 */
export async function getOrCreateDeviceId(): Promise<string> {
  try {
    const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (existing && existing.length > 0) {
      return existing;
    }
    const next = createId('device');
    await AsyncStorage.setItem(DEVICE_ID_KEY, next);
    return next;
  } catch {
    return createId('device');
  }
}

export function buildClientUserAgent(): string {
  const v =
    Platform.OS === 'ios' || Platform.OS === 'android'
      ? String(Platform.Version)
      : 'unknown';
  return `AIDetect-RN/${Platform.OS}/${v}`;
}
