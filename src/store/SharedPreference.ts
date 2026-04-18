import { useAIDetectorStore } from './useAIDetectorStore';
import type { SharedPrefValue } from './useAIDetectorStore';

export type { SharedPrefValue };

/**
 * Key–value helpers over {@link useAIDetectorStore}.preferences.
 * No separate store — reads/writes the same Zustand state.
 */
export const SharedPreference = {
  get: (key: string): SharedPrefValue => useAIDetectorStore.getState().getPref(key),

  set: (key: string, value: SharedPrefValue): void => {
    useAIDetectorStore.getState().setPref(key, value);
  },

  remove: (key: string): void => {
    useAIDetectorStore.getState().removePref(key);
  },

  clear: (): void => {
    useAIDetectorStore.getState().clearPrefs();
  },
};
