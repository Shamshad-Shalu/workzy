import { ROLE, Role, ROLE_VALUES } from "./roles";

export const MESSAGE_TYPE = {
  TEXT: "text",
  AUDIO: "audio",
  VIDEO: "video",
  IMAGE: "image",
  BOOKING_EVENT: "booking_event",
} as const;

export const MESSAGE_TYPE_VALUES = Object.values(MESSAGE_TYPE);
export type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];

export type SenderRole = Exclude<Role, typeof ROLE.SYSTEM>;
export const SENDER_ROLE_VALUES = ROLE_VALUES.filter((v): v is SenderRole => v !== ROLE.SYSTEM);
