import { useEffect } from 'react';
import { useFCM, useNotifications } from '@/hooks';
import {
  authService,
  buildClientUserAgent,
  dbService,
  getAppSessionId,
  getOrCreateDeviceId,
  mustVerifyEmail,
} from '@/service/firebase';

let loggedHomeVisitThisRuntime = false;

const useHomeScreen = () => {
  useFCM();
  useNotifications();

  useEffect(() => {
    const run = async () => {
      if (loggedHomeVisitThisRuntime) return;
      const user = authService.currentUser;
      if (!user || mustVerifyEmail(user)) return;
      loggedHomeVisitThisRuntime = true;
      const sessionId = getAppSessionId();
      const deviceId = await getOrCreateDeviceId();
      await dbService.logVisit(
        user.uid,
        sessionId,
        buildClientUserAgent(),
        undefined,
        deviceId,
      );
    };

    void run();
  }, []);
};

export default useHomeScreen;
