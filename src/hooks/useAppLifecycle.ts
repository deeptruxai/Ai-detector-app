/**
 * App Lifecycle Hook
 *
 * Handles app state changes — extend this hook for sync, analytics, etc.
 */

import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { logger } from '@/utils/logger';

export const useAppLifecycle = () => {
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        logger.info('App became active');
        // TODO: Add sync logic here when stores are set up
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);
};
