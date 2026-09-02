import { UPLOAD_API, type UploadPurpose } from '@/constants';
import api from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api';

interface UploadUrlResponse {
  uploadUrl: string;
  publicUrl: string;
}

interface UploadProps {
  file: File;
  purpose: UploadPurpose;
}

function normalizeMimeType(mime: string): string {
  return mime.split(';')[0].trim().toLowerCase();
}

export async function uploadToS3({
  file,
  purpose,
  onProgress,
}: UploadProps & { onProgress?: (p: number) => void }): Promise<string> {
  const fileType = normalizeMimeType(file.type);

  const res = await api.post<ApiResponse<UploadUrlResponse>>(UPLOAD_API.REQUEST_URL, {
    fileName: file.name,
    fileType,
    fileSize: file.size,
    purpose,
  });

  const uploadData = res.data.data;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadData.uploadUrl);
    xhr.setRequestHeader('Content-Type', fileType);

    if (onProgress) {
      xhr.upload.onprogress = e => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(uploadData.publicUrl);
      } else {
        reject(new Error('S3 upload failed'));
      }
    };

    xhr.onerror = () => reject(new Error('S3 upload network error'));
    xhr.send(file);
  });
}
