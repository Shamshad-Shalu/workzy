import { useState } from 'react';
import { toast } from 'sonner';

import type { UploadPurpose } from '@/constants';
import { uploadToS3 } from '@/services/upload.service';
import { handleApiError } from '@/utils/handleApiError';
import { compressAndConvertToWebP, validateImage } from '@/utils/imageCompression';

interface UseImageUploadOptions {
  purpose: UploadPurpose;
  onSuccess?: (url: string) => Promise<void> | void;
  maxSizeMB?: number;
}

export function useImageUpload({ purpose, onSuccess, maxSizeMB = 10 }: UseImageUploadOptions) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file: File): Promise<string | undefined> => {
    if (loading) {
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const error = validateImage(file, maxSizeMB);
      if (error) {
        throw new Error(error);
      }

      const compressed = await compressAndConvertToWebP(file);

      const url = await uploadToS3({
        file: compressed,
        purpose,
        onProgress: p => setProgress(p),
      });

      await onSuccess?.(url);

      setProgress(100);
      return url;
    } catch (err) {
      toast.error(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 800);
    }
  };

  return {
    uploadImage,
    loading,
    progress,
  };
}
