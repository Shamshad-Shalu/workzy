export interface IRedisService {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  setWithTTL(key: string, value: string, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clearPattern(pattern: string): Promise<void>;
  deleteMany(keys: string[]): Promise<void>;
}
