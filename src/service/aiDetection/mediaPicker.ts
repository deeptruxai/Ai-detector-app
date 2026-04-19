/**
 * Media picker for AI detection.
 *
 * Wraps `react-native-image-picker` so screens never have to deal with the
 * library's response shape directly. Returns the same `DetectionInput` that
 * `analyzeMedia` expects.
 *
 * Note: `react-native-image-picker` does not return `base64` for video on
 * iOS or Android; we read the file from `uri` when needed.
 */

import {
  Asset,
  ImagePickerResponse,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';

import { Tag } from '@/core/types/loggerTags';
import logger from '@/utils/logger';

import { inferVideoMimeFromFileName, normalizeImageMimeType } from './mime';
import { MAX_VIDEO_BYTES } from './mediaLimits';
import { AiDetectionError, DetectionInput, DetectionMediaKind } from './types';

interface PickOptions {
  kind: DetectionMediaKind;
}

const toMediaType = (kind: DetectionMediaKind): MediaType =>
  kind === 'video' ? 'video' : 'photo';

const normalizeFileUri = (uri: string): string => {
  const trimmed = uri.trim();
  if (trimmed.startsWith('file://') || trimmed.startsWith('content://')) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    return `file://${trimmed}`;
  }
  return trimmed;
};

/**
 * Read a local gallery file as raw base64 (no data: prefix).
 * Uses XHR + FileReader — reliable for `file://` URIs returned by the picker.
 */
const readLocalUriAsBase64 = (uri: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const ok = xhr.status === 200 || xhr.status === 0;
      if (!ok || !xhr.response) {
        reject(
          new AiDetectionError(
            'invalid_input',
            'Could not read this video. Try another file or a shorter clip.',
          ),
        );
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        if (typeof dataUrl !== 'string' || dataUrl.length === 0) {
          reject(
            new AiDetectionError(
              'invalid_input',
              'Could not read this video. Try another file or a shorter clip.',
            ),
          );
          return;
        }
        const marker = 'base64,';
        const idx = dataUrl.indexOf(marker);
        resolve(idx >= 0 ? dataUrl.slice(idx + marker.length) : dataUrl);
      };
      reader.onerror = () => {
        reject(
          new AiDetectionError(
            'invalid_input',
            'Could not read this video. Try another file or a shorter clip.',
          ),
        );
      };
      reader.readAsDataURL(xhr.response as Blob);
    };
    xhr.onerror = () => {
      reject(
        new AiDetectionError(
          'invalid_input',
          'Could not read this video. Try another file or a shorter clip.',
        ),
      );
    };
    xhr.open('GET', normalizeFileUri(uri));
    xhr.responseType = 'blob';
    xhr.send();
  });

const approxBytesFromBase64 = (base64: string): number =>
  Math.max(0, Math.floor((base64.length * 3) / 4));

const assetToInput = async (
  asset: Asset,
  kind: DetectionMediaKind,
): Promise<DetectionInput> => {
  let base64: string;

  if (kind === 'video') {
    if (typeof asset.fileSize === 'number' && asset.fileSize > MAX_VIDEO_BYTES) {
      throw new AiDetectionError(
        'media_too_large',
        `File exceeds the ${Math.round(MAX_VIDEO_BYTES / 1024 / 1024)} MB limit.`,
      );
    }
    if (asset.base64) {
      base64 = asset.base64;
    } else if (asset.uri) {
      base64 = await readLocalUriAsBase64(asset.uri);
    } else {
      throw new AiDetectionError(
        'invalid_input',
        'Could not access this video. Try selecting it again.',
      );
    }
  } else {
    if (!asset.base64) {
      throw new AiDetectionError(
        'invalid_input',
        'Could not read this image. Try a smaller file or another photo.',
      );
    }
    base64 = asset.base64;
  }

  const rawType = asset.type?.trim() || '';
  let mimeType: string;

  if (rawType.startsWith('image/')) {
    mimeType = normalizeImageMimeType(rawType, asset.fileName ?? null);
  } else if (rawType.startsWith('video/')) {
    mimeType = rawType.toLowerCase();
  } else if (rawType) {
    mimeType = rawType.toLowerCase();
  } else {
    const fromVideo = inferVideoMimeFromFileName(asset.fileName);
    mimeType = fromVideo ?? normalizeImageMimeType('', asset.fileName ?? null);
  }

  if (!mimeType) {
    throw new AiDetectionError('invalid_input', 'Could not determine the file type.');
  }

  const sizeBytes =
    typeof asset.fileSize === 'number' && asset.fileSize > 0
      ? asset.fileSize
      : kind === 'video'
        ? approxBytesFromBase64(base64)
        : undefined;

  return {
    base64,
    mimeType,
    sizeBytes,
    sourceKind: kind,
  };
};

/**
 * Open the system gallery and return the first selected asset converted to
 * a `DetectionInput`. Resolves to `null` if the user cancels.
 */
export const pickMedia = async (options: PickOptions): Promise<DetectionInput | null> => {
  const response: ImagePickerResponse = await launchImageLibrary({
    mediaType: toMediaType(options.kind),
    selectionLimit: 1,
    includeBase64: true,
    quality: 0.8,
    maxWidth: 2048,
    maxHeight: 2048,
    videoQuality: 'medium',
  });

  if (response.didCancel) {
    return null;
  }

  if (response.errorCode) {
    logger.error(Tag.USER, 'Image picker error', {
      errorCode: response.errorCode,
    });
    throw new AiDetectionError('invalid_input', 'Could not access media library.');
  }

  const asset = response.assets?.[0];
  if (!asset) {
    return null;
  }

  return assetToInput(asset, options.kind);
};
