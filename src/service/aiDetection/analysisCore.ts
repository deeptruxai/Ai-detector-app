/**
 * Image / video AI-generation detection.
 *
 * Mobile equivalent of the web project's `server/services/analysisCore.ts`.
 * Same prompt, same response schema, same output shape — only the transport
 * differs (axios + REST here vs. `@google/genai` SDK on the server).
 */

import { runDetection } from './gemini';
import { MAX_IMAGE_BYTES, MAX_VIDEO_BYTES } from './mediaLimits';
import { normalizeImageMimeType } from './mime';
import { buildMediaDetectionPrompt } from './prompt';
import { AiDetectionError, DetectionInput, DetectionResult } from './types';

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/3gpp'];

const validateInput = (input: DetectionInput): void => {
  if (!input?.base64 || !input?.mimeType) {
    throw new AiDetectionError('invalid_input', 'Media payload is incomplete.');
  }

  const isImage = input.mimeType.startsWith('image/');
  const isVideo = input.mimeType.startsWith('video/');

  if (!isImage && !isVideo) {
    throw new AiDetectionError('unsupported_media', 'Only image or video media is supported.');
  }

  const allowed = isImage ? SUPPORTED_IMAGE_TYPES : SUPPORTED_VIDEO_TYPES;
  if (!allowed.includes(input.mimeType.toLowerCase())) {
    throw new AiDetectionError('unsupported_media', 'This media format is not supported.');
  }

  if (typeof input.sizeBytes === 'number') {
    const limit =
      input.sourceKind === 'video'
        ? MAX_VIDEO_BYTES
        : input.sourceKind === 'image'
          ? MAX_IMAGE_BYTES
          : isImage
            ? MAX_IMAGE_BYTES
            : MAX_VIDEO_BYTES;
    if (input.sizeBytes > limit) {
      throw new AiDetectionError(
        'media_too_large',
        `File exceeds the ${Math.round(limit / 1024 / 1024)} MB limit.`,
      );
    }
  }
};

/**
 * Analyze a base64-encoded image or video and return a typed `DetectionResult`.
 * Throws an `AiDetectionError` (with a safe message) on every failure path.
 */
export const analyzeMedia = async (input: DetectionInput): Promise<DetectionResult> => {
  const mimeType = input.mimeType.startsWith('image/')
    ? normalizeImageMimeType(input.mimeType)
    : input.mimeType.toLowerCase().trim();

  const normalized: DetectionInput = { ...input, mimeType };
  validateInput(normalized);

  return runDetection([
    { text: buildMediaDetectionPrompt(mimeType) },
    { inlineData: { mimeType, data: normalized.base64 } },
  ]);
};
