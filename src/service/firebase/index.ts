// Firebase Services - Central Export
export { firebaseConfig } from './config';
export {
  authService,
  type FirebaseUser,
  type AuthError,
  mustVerifyEmail,
} from './auth';
export { messagingService, type RemoteMessage } from './messaging';
export { storageService, type StorageReference, type UploadTask } from './storage';
export { analyticsService } from './analytics';
export { dbService } from './dbService';
export { getAppSessionId, getOrCreateDeviceId, buildClientUserAgent } from './appSession';
