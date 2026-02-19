import { UPLOAD_API, type UploadPurpose } from '@/constants';
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
  const { data } = await api.post<UploadUrlResponse>(UPLOAD_API.REQUEST_URL, {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    purpose,
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
