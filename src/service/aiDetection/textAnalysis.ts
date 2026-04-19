/**
 * Text AI-detection.
 *
 * Asks Gemini whether a snippet of text was AI-generated, returning the same
 * `DetectionResult` shape used for image/video so screens can render results
 * with one component.
 */

import { runDetection } from './gemini';
import { buildTextDetectionPrompt } from './prompt';
import { AiDetectionError, DetectionResult, TextDetectionInput } from './types';

/** Match the UI's "Analyze Text" gate: at least 50 visible characters. */
export const MIN_TEXT_LENGTH = 50;
/** Cap to keep request size + token cost bounded. */
export const MAX_TEXT_LENGTH = 50_000;

const validateInput = (input: TextDetectionInput): string => {
  if (!input || typeof input.text !== 'string') {
    throw new AiDetectionError('invalid_input', 'Text payload is missing.');
  }

  const trimmed = input.text.trim();
  if (trimmed.length < MIN_TEXT_LENGTH) {
    throw new AiDetectionError(
      'text_too_short',
      `Please provide at least ${MIN_TEXT_LENGTH} characters of text.`,
    );
  }
  if (trimmed.length > MAX_TEXT_LENGTH) {
    throw new AiDetectionError(
      'text_too_long',
      `Text exceeds the ${MAX_TEXT_LENGTH.toLocaleString()} character limit.`,
    );
  }

  return trimmed;
};

/**
 * Analyze a piece of text and return a typed `DetectionResult`.
 * Throws an `AiDetectionError` (with a safe message) on every failure path.
 */
export const analyzeText = async (input: TextDetectionInput): Promise<DetectionResult> => {
  const safeText = validateInput(input);
  return runDetection([{ text: buildTextDetectionPrompt(safeText) }]);
};
