export const ROLE = {
  USER: "user",
  ADMIN: "admin",
  WORKER: "worker",
  SYSTEM: "system",
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];
export const ROLE_VALUES = Object.values(ROLE);
