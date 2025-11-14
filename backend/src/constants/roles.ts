export const ROLE = {
  USER: "user",
  ADMIN: "admin",
  WORKER: "worker",
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];
