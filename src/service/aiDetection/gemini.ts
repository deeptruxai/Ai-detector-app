/**
 * Shared Gemini transport — knows how to:
 *   1. resolve key/endpoint from local secrets,
 *   2. POST a structured-output request,
 *   3. parse + validate the response into a `DetectionResult`.
 *
 * Feature-specific files (`analyzeMedia`, `analyzeText`) only build the
 * `parts` array and call `runDetection`.
 */

import axios, { AxiosError } from 'axios';

import { Tag } from '@/core/types/loggerTags';
import logger from '@/utils/logger';

import { AiDetectionSecrets } from '@/config/secrets';

import { DETECTION_RESPONSE_SCHEMA } from './prompt';
import { AiDetectionError, DetectionResult } from './types';

const REQUEST_TIMEOUT_MS = 60_000;

const isPlaceholderKey = (key: string | undefined): boolean => {
  if (!key) return true;
  const upper = key.toUpperCase();
  return (
    upper === 'TODO_KEYHERE' ||
    upper === 'YOUR_API_KEY' ||
    upper === 'INSERT_KEY_HERE' ||
    upper === 'REPLACE_WITH_YOUR_KEY' ||
    upper.startsWith('MY_')
  );
};

const resolveApiKey = (): string => {
  // Mirrors the web project's primary → fallback key resolution
  // (DEEPTRUX_API_KEY → CUSTOM_DEEPTRUX_KEY).
  const candidates = [
    AiDetectionSecrets.GEMINI_API_KEY,
    AiDetectionSecrets.GEMINI_API_KEY_FALLBACK,
  ];

  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (!isPlaceholderKey(trimmed)) {
      return trimmed as string;
    }
  }

  throw new AiDetectionError(
    'missing_api_key',
    'Detection service is not configured. Please contact support.',
  );
};

const resolveEndpoint = (): { baseUrl: string; model: string } => {
  const baseUrl = AiDetectionSecrets.GEMINI_BASE_URL?.trim();
  const model = AiDetectionSecrets.GEMINI_MODEL?.trim();
  if (!baseUrl || !model) {
    throw new AiDetectionError(
      'missing_api_key',
      'Detection service is not configured. Please contact support.',
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ''), model };
};

/**
 * REST request parts for `models.generateContent`.
 * The Generative Language API expects **camelCase** JSON field names here
 * (`inlineData`, `mimeType`). Using `inline_data` / `mime_type` causes the
 * image part to be dropped silently, which breaks structured JSON parsing.
 */
export interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  usageMetadata?: { totalTokenCount?: number };
  promptFeedback?: { blockReason?: string };
  error?: { code?: number; message?: string; status?: string };
}

/** Tried after the primary model from secrets (preview IDs are often unavailable). */
const MODEL_FALLBACKS = ['gemini-2.0-flash', 'gemini-1.5-flash'] as const;

const isModelNotFound = (status: number | undefined, body: unknown): boolean => {
  if (status === 404) return true;
  const msg =
    typeof body === 'object' &&
    body !== null &&
    'error' in body &&
    typeof (body as { error?: { message?: string } }).error?.message === 'string'
      ? (body as { error: { message: string } }).error.message
      : '';
  return /not found|does not exist|NOT_FOUND|Invalid model/i.test(msg);
};

const parseGeminiResponse = (data: GeminiResponse): DetectionResult => {
  if (data?.promptFeedback?.blockReason) {
    throw new AiDetectionError(
      'upstream_error',
      'This content could not be analyzed. Try a different image.',
    );
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || typeof text !== 'string') {
    throw new AiDetectionError('invalid_response', 'Detection service returned an empty response.');
  }

  let parsed: Partial<DetectionResult>;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new AiDetectionError('invalid_response', 'Detection service returned malformed data.');
  }

  if (
    typeof parsed.score !== 'number' ||
    typeof parsed.isAI !== 'boolean' ||
    typeof parsed.reasoning !== 'string' ||
    typeof parsed.confidence !== 'string' ||
    !Array.isArray(parsed.artifacts)
  ) {
    throw new AiDetectionError('invalid_response', 'Detection service returned an unexpected shape.');
  }

  const clampedScore = Math.max(0, Math.min(10, parsed.score));

  return {
    score: clampedScore,
    isAI: parsed.isAI,
    reasoning: parsed.reasoning,
    confidence: parsed.confidence,
    artifacts: parsed.artifacts.filter((a): a is string => typeof a === 'string'),
    tokensUsed: data?.usageMetadata?.totalTokenCount,
  };
};

/**
 * Send a structured-output request to Gemini and return a typed
 * `DetectionResult`. All upstream and parsing failures are normalised to
 * `AiDetectionError` with a safe, user-facing message.
 */
const postGenerateContent = async (
  baseUrl: string,
  model: string,
  apiKey: string,
  parts: GeminiPart[],
): Promise<GeminiResponse> => {
  const url = `${baseUrl}/models/${encodeURIComponent(model)}:generateContent`;
  const body = {
    contents: [{ parts }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: DETECTION_RESPONSE_SCHEMA,
    },
  };
  const response = await axios.post<GeminiResponse>(url, body, {
    timeout: REQUEST_TIMEOUT_MS,
    params: { key: apiKey },
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  return response.data;
};

export const runDetection = async (parts: GeminiPart[]): Promise<DetectionResult> => {
  const apiKey = resolveApiKey();
  const { baseUrl, model: primaryModel } = resolveEndpoint();

  const modelsToTry = [primaryModel, ...MODEL_FALLBACKS.filter(m => m !== primaryModel)];

  let lastAxiosError: AxiosError | null = null;

  for (const model of modelsToTry) {
    try {
      const data = await postGenerateContent(baseUrl, model, apiKey, parts);
      return parseGeminiResponse(data);
    } catch (err) {
      if (err instanceof AiDetectionError) throw err;

      const axiosErr = err as AxiosError<{ error?: { message?: string; status?: string } }>;
      if (!axiosErr?.isAxiosError) {
        logger.error(Tag.API, 'AI detection unexpected error');
        throw new AiDetectionError('upstream_error', 'Could not analyze the content.');
      }

      lastAxiosError = axiosErr;
      const status = axiosErr.response?.status;
      const body = axiosErr.response?.data;

      logger.error(Tag.API, 'AI detection upstream error', {
        status,
        code: axiosErr.code,
        modelTried: model,
        apiMessage: body?.error?.message?.slice?.(0, 200),
      });

      if (!axiosErr.response) {
        throw new AiDetectionError('network_error', 'Network error while analyzing content.');
      }

      if (status === 403 || status === 401) {
        throw new AiDetectionError(
          'upstream_error',
          'Detection service rejected the request. Check API key and network settings.',
        );
      }

      if (isModelNotFound(status, body)) {
        continue;
      }

      throw new AiDetectionError('upstream_error', 'Detection service is temporarily unavailable.');
    }
  }

  logger.error(Tag.API, 'All Gemini models failed', { lastStatus: lastAxiosError?.response?.status });
  throw new AiDetectionError('upstream_error', 'Detection service is temporarily unavailable.');
};
