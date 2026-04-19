/**
 * Client-side Firestore logging — same documents and fields as
 * AiDetectorWeb `server/services/dbService.ts` (users + activity_logs).
 */
import firestore from '@react-native-firebase/firestore';

const activityId = (prefix: string): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

const { increment, serverTimestamp } = firestore.FieldValue;

const safeSnippet = (s: string, max = 800): string => {
  if (!s || typeof s !== 'string') return '';
  const t = s.trim();
  return t.length <= max ? t : `${t.slice(0, max)}…`;
};

export const dbService = {
  logVisit: async (
    userId: string,
    sessionId: string,
    userAgent?: string,
    ip?: string,
    deviceId?: string,
  ): Promise<void> => {
    try {
      const userRef = firestore().collection('users').doc(userId);
      await userRef.set(
        {
          userId,
          deviceId,
          totalVisits: increment(1),
          lastActive: serverTimestamp(),
        },
        { merge: true },
      );

      const id = activityId('visit');
      await firestore().collection('activity_logs').doc(id).set({
        activityId: id,
        sessionId,
        userId,
        type: 'visit',
        timestamp: serverTimestamp(),
        userAgent,
        ip,
        deviceId,
      });
    } catch {
      // Non-blocking; avoid surfacing internal failures
    }
  },

  logUsage: async (
    tokens: number,
    mimeType: string,
    isAi: boolean,
    userId: string,
    sessionId: string,
    aiResponse?: string,
    userName?: string,
    userEmail?: string,
  ): Promise<void> => {
    const t = Number.isFinite(tokens) && tokens >= 0 ? Math.floor(tokens) : 0;
    try {
      const userRef = firestore().collection('users').doc(userId);
      await userRef.set(
        {
          totalTokensUsed: increment(t),
          totalImagesUploaded: increment(1),
          aiDetectionCount: increment(isAi ? 1 : 0),
          lastActive: serverTimestamp(),
        },
        { merge: true },
      );

      const id = activityId('act');
      await firestore().collection('activity_logs').doc(id).set({
        activityId: id,
        sessionId,
        userId,
        userName,
        userEmail,
        type: 'analysis',
        timestamp: serverTimestamp(),
        tokensUsed: t,
        mimeType,
        result: isAi ? 'AI' : 'Authentic',
        aiResponse: aiResponse != null ? safeSnippet(aiResponse, 4000) : undefined,
      });
    } catch {
      // Non-blocking
    }
  },

  logError: async (
    userId: string,
    sessionId: string,
    message: string,
    stack?: string,
    endpoint?: string,
  ): Promise<void> => {
    try {
      const id = activityId('err');
      await firestore().collection('activity_logs').doc(id).set({
        activityId: id,
        userId,
        sessionId,
        type: 'error',
        timestamp: serverTimestamp(),
        message: safeSnippet(message, 500),
        stack: stack != null ? safeSnippet(stack, 1500) : undefined,
        endpoint: endpoint != null ? safeSnippet(endpoint, 200) : undefined,
      });
    } catch {
      // Non-blocking
    }
  },

  updateUserProfile: async (
    userId: string,
    name: string,
    email?: string,
  ): Promise<void> => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .set(
          {
            userId,
            name: safeSnippet(name, 200),
            email: email != null ? safeSnippet(email, 320) : undefined,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
    } catch {
      // Non-blocking
    }
  },
};

export default dbService;
