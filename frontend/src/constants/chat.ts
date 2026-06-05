export const MESSAGE_TYPE = {
  TEXT: 'text',
  AUDIO: 'audio',
  VIDEO: 'video',
  IMAGE: 'image',
} as const;

export const MESSAGE_TYPE_VALUES = Object.values(MESSAGE_TYPE);
export type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];
