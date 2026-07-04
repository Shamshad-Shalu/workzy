import { UploadPurposes } from '@/constants';
import { MESSAGE_TYPE, type MessageType } from '@/constants/chat';

export const CHAT_UPLOAD_LIMITS = {
  imageMB: 10,
  videoMB: 50,
  audioMB: 10,
} as const;

export const CHAT_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/avif,image/jpg';
export const CHAT_VIDEO_ACCEPT = 'video/mp4,video/webm,video/quicktime';
export const CHAT_AUDIO_ACCEPT = 'audio/mpeg,audio/wav,audio/ogg,audio/webm';

export function normalizeMimeType(mime: string): string {
  return mime.split(';')[0].trim().toLowerCase();
}

export function normalizeChatFile(file: File, messageType: MessageType): File {
  let mime = normalizeMimeType(file.type);

  if (messageType === MESSAGE_TYPE.AUDIO) {
    if (!mime || mime === 'application/octet-stream') {
      mime = file.name.endsWith('.ogg') ? 'audio/ogg' : 'audio/webm';
    }
  }

  if (!mime || mime === file.type) {
    return file;
  }

  return new File([file], file.name, { type: mime, lastModified: file.lastModified });
}

export function getChatUploadPurpose(type: MessageType) {
  switch (type) {
    case MESSAGE_TYPE.IMAGE:
      return UploadPurposes.CHAT_IMAGE;
    case MESSAGE_TYPE.VIDEO:
      return UploadPurposes.CHAT_VIDEO;
    case MESSAGE_TYPE.AUDIO:
      return UploadPurposes.CHAT_AUDIO;
    default:
      return null;
  }
}
