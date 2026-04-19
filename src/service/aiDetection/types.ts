/**
 * Public types for the AI detection service.
 * Mirrors `src/types/analysis.ts` in the web project so the result shape
 * stays identical across platforms.
 */

export type DetectionMediaKind = 'image' | 'video';

export interface DetectionInput {
  /** Raw base64 payload (NO data: prefix). */
  base64: string;
  /** Standard MIME type, e.g. 'image/jpeg', 'video/mp4'. */
  mimeType: string;
  /** Optional file size in bytes for client-side guardrails. */
  sizeBytes?: number;
}

export interface TextDetectionInput {
  /** Free-form text to classify as AI-written vs. human-written. */
  text: string;
}

export interface DetectionResult {
  /** AI-generation likelihood on a 0–10 scale. */
  score: number;
  isAI: boolean;
  reasoning: string;
  confidence: string;
  artifacts: string[];
  tokensUsed?: number;
}

export type AiDetectionErrorCode =
  | 'missing_api_key'
  | 'invalid_input'
  | 'unsupported_media'
  | 'media_too_large'
  | 'text_too_short'
  | 'text_too_long'
  | 'network_error'
  | 'upstream_error'
  | 'invalid_response';

export class AiDetectionError extends Error {
  code: AiDetectionErrorCode;
  constructor(code: AiDetectionErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'AiDetectionError';
  }
}
