/**
 * Normalize MIME strings from image pickers (Android/iOS often differ).
 */

export const normalizeImageMimeType = (mime: string, fileName?: string | null): string => {
  const lower = mime.toLowerCase().trim();

  const map: Record<string, string> = {
    'image/jpg': 'image/jpeg',
    'image/x-jpeg': 'image/jpeg',
    'image/pjpeg': 'image/jpeg',
  };
  if (map[lower]) return map[lower];

  if (lower && lower !== 'image' && lower.includes('/')) {
    return lower;
  }

  const ext = fileName?.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'heic':
    case 'heif':
      return 'image/heic';
    default:
      return lower || 'image/jpeg';
  }
};

export const inferVideoMimeFromFileName = (fileName?: string | null): string | null => {
  const ext = fileName?.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'mp4':
      return 'video/mp4';
    case 'mov':
      return 'video/quicktime';
    case 'webm':
      return 'video/webm';
    case '3gp':
    case '3gpp':
      return 'video/3gpp';
    default:
      return null;
  }
};
