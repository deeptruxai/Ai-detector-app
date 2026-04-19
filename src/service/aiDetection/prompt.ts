/**
 * Prompts + structured-response schema used to ask Gemini whether a piece of
 * content (image, video, or text) is AI-generated. Kept in its own file so
 * product/prompt tweaks don't touch the transport layer.
 *
 * The media prompt is intentionally aligned with the web project
 * (`server/services/analysisCore.ts`) so both clients stay comparable.
 */

export const buildMediaDetectionPrompt = (mimeType: string): string => {
  const mediaWord = mimeType.startsWith('video') ? 'video' : 'image';
  return `Analyze this ${mediaWord} to determine if it is AI-generated (e.g., created by Midjourney, DALL-E, Stable Diffusion, Sora).

CRITICAL DISTINCTION:
- AI-GENERATED: The core content of the image/video was synthesized by an AI model. Look for: unnatural textures, "dream-like" distortions, anatomical errors (extra fingers, weird eyes), impossible physics, text that looks like gibberish or has melting letters, and overly smooth/perfect lighting.
- AUTHENTIC/REAL: Photos taken by cameras, screenshots of real apps/websites, or hand-drawn digital art.
- SCREENSHOTS: If the image is a screenshot of a real application, website, or social media post, it should be classified as NOT AI-GENERATED (isAI: false), even if the UI looks "perfect". Sharp UI elements, standard fonts, and clear status bars are indicators of a real screenshot.

Provide a score from 0 to 10:
- 10: Definitely AI-generated.
- 0: Definitely human-made/real/screenshot.

List specific visual artifacts or characteristics that led to this conclusion.
Be precise. If it's a screenshot, identify it as such in your reasoning.`;
};

export const buildTextDetectionPrompt = (text: string): string => {
  return `Analyze the TEXT below to determine if it was written by an AI language model (e.g., ChatGPT, Claude, Gemini, Llama) or by a human.

CRITICAL DISTINCTION:
- AI-WRITTEN: Look for hallmarks such as overly uniform sentence rhythm, excessive use of transition words ("Moreover", "Furthermore", "In conclusion"), generic structure, balanced/hedged tone, lack of specific lived detail, list-heavy formatting, and "perfectly polished" but emotionally flat prose.
- HUMAN-WRITTEN: Look for personal anecdotes, idiosyncratic word choices, typos, varying sentence length, strong opinions, slang, cultural references, or emotional inconsistency.
- MIXED: Text that appears human-edited from an AI draft (or vice versa) — note this in the reasoning if you see it.

Provide a score from 0 to 10:
- 10: Definitely AI-written.
- 0: Definitely human-written.

In "artifacts" list specific phrases, structural patterns, or stylistic markers that drove your conclusion.
Be precise and concise. Do not quote more than 10 words at a time from the source.

TEXT TO ANALYZE:
"""
${text}
"""`;
};

/**
 * JSON schema sent to Gemini's `generationConfig.responseSchema`.
 * Uses the REST API's string enum form (not the SDK's `Type` enum).
 * Shared by media and text detection so the result shape stays consistent.
 */
export const DETECTION_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    score: { type: 'NUMBER' },
    isAI: { type: 'BOOLEAN' },
    reasoning: { type: 'STRING' },
    confidence: { type: 'STRING' },
    artifacts: {
      type: 'ARRAY',
      items: { type: 'STRING' },
    },
  },
  required: ['score', 'isAI', 'reasoning', 'confidence', 'artifacts'],
} as const;
