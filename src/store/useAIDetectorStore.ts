import { create } from 'zustand';

/**
 * AI Detector Store
 * Manages state for AI detection results, history, and analysis
 */

export type DetectionStatus = 'idle' | 'analyzing' | 'complete' | 'error';

export interface DetectionResult {
  id: string;
  text: string;
  aiProbability: number;    // 0-100
  humanProbability: number; // 0-100
  label: 'AI' | 'Human' | 'Mixed';
  confidence: 'High' | 'Medium' | 'Low';
  analyzedAt: Date;
}

interface AIDetectorState {
  // State
  status: DetectionStatus;
  currentResult: DetectionResult | null;
  history: DetectionResult[];
  error: string | null;

  // Actions
  setStatus: (status: DetectionStatus) => void;
  setResult: (result: DetectionResult) => void;
  addToHistory: (result: DetectionResult) => void;
  clearHistory: () => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAIDetectorStore = create<AIDetectorState>(set => ({
  // Initial state
  status: 'idle',
  currentResult: null,
  history: [],
  error: null,

  // Actions
  setStatus: (status: DetectionStatus) => set({ status }),

  setResult: (result: DetectionResult) =>
    set(state => ({
      currentResult: result,
      status: 'complete',
      history: [result, ...state.history],
    })),

  addToHistory: (result: DetectionResult) =>
    set(state => ({
      history: [result, ...state.history],
    })),

  clearHistory: () => set({ history: [] }),

  setError: (error: string | null) => set({ error, status: error ? 'error' : 'idle' }),

  reset: () =>
    set({
      status: 'idle',
      currentResult: null,
      error: null,
    }),
}));

export default useAIDetectorStore;
