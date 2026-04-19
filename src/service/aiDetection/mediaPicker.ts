/**
 * Media picker for AI detection.
 *
 * Wraps `react-native-image-picker` so screens never have to deal with the
 * library's response shape directly. Returns the same `DetectionInput` that
 * `analyzeMedia` expects.
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
import { AiDetectionError, DetectionInput, DetectionMediaKind } from './types';

interface PickOptions {
  kind: DetectionMediaKind;
}

const toMediaType = (kind: DetectionMediaKind): MediaType =>
  kind === 'video' ? 'video' : 'photo';

const assetToInput = (asset: Asset): DetectionInput => {
  if (!asset.base64) {
    throw new AiDetectionError(
      'invalid_input',
      'Could not read this image. Try a smaller file or another photo.',
    );
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

  return {
    base64: asset.base64,
    mimeType,
    sizeBytes: typeof asset.fileSize === 'number' ? asset.fileSize : undefined,
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

  return assetToInput(asset);
};
