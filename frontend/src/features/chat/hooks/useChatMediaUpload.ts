import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { MESSAGE_TYPE, type MessageType } from '@/constants/chat';
import { uploadToS3 } from '@/services/upload.service';
import { handleApiError } from '@/utils/handleApiError';
import { compressAndConvertToWebP } from '@/utils/imageCompression';

import {
  CHAT_UPLOAD_LIMITS,
  getChatUploadPurpose,
  normalizeChatFile,
} from '../constants/chatUpload';

function maxBytesForType(type: MessageType): number {
  switch (type) {
    case MESSAGE_TYPE.IMAGE:
      return CHAT_UPLOAD_LIMITS.imageMB * 1024 * 1024;
    case MESSAGE_TYPE.VIDEO:
      return CHAT_UPLOAD_LIMITS.videoMB * 1024 * 1024;
    case MESSAGE_TYPE.AUDIO:
      return CHAT_UPLOAD_LIMITS.audioMB * 1024 * 1024;
    default:
      return 0;
  }
}

export function useChatMediaUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadMedia = useCallback(
    async (
      file: File,
      type: MessageType,
      onProgress?: (percent: number) => void
    ): Promise<string> => {
      const purpose = getChatUploadPurpose(type);
      if (!purpose) {
        throw new Error('Unsupported media type');
      }

      const normalized = normalizeChatFile(file, type);
      const maxBytes = maxBytesForType(type);
      if (normalized.size > maxBytes) {
        const mb = maxBytes / (1024 * 1024);
        throw new Error(`File exceeds ${mb}MB limit`);
      }

      setUploading(true);
      setUploadProgress(0);

      try {
        const fileToUpload =
          type === MESSAGE_TYPE.IMAGE ? await compressAndConvertToWebP(normalized) : normalized;

        const url = await uploadToS3({
          file: fileToUpload,
          purpose,
          onProgress: p => {
            setUploadProgress(p);
            onProgress?.(p);
          },
        });

        setUploadProgress(100);
        return url;
      } catch (err) {
        toast.error(handleApiError(err));
        throw err;
      } finally {
        setUploading(false);
        setTimeout(() => setUploadProgress(0), 300);
      }
    },
    []
  );

  return { uploadMedia, uploading, uploadProgress };
}
