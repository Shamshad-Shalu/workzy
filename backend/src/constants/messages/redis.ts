export const REDIS = {
  GET_ERROR: (key: string) => `Redis GET error for key ${key}:`,
  SET_ERROR: (key: string) => `Redis SET error for key ${key}:`,
  SET_TTL_ERROR: (key: string) => `Redis SET WITH TTL error for key ${key}:`,
  DELETE_ERROR: (key: string) => `Redis DELETE error for key ${key}:`,
  DELETE_MANY_ERROR: "Redis DELETE MANY error:",
  CLEAR_PATTERN_SUCCESS: (prefix: string) => `Redis: Cleared keys for prefix "${prefix}"`,
  CLEAR_PATTERN_ERROR: (prefix: string) => `Redis CLEAR PATTERN error for ${prefix}:`,
};
