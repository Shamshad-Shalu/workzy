import type { UploadPurpose } from '@/constants/upload';
import api from '@/lib/api/axios';

interface UploadUrlResponse {
  uploadUrl: string;
  publicUrl: string;
}

interface UploadProps {
  file: File;
  purpose: UploadPurpose;
}

export async function uploadToS3({ file, purpose }: UploadProps): Promise<string> {
  const { data } = await api.post<UploadUrlResponse>('/upload/request-url', {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    purpose
  });

  const res = await fetch(data.uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });

  if (!res.ok) {
    throw new Error('S3 upload failed');
  }

  return data.publicUrl;
}
