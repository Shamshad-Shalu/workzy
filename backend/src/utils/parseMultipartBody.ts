export function parseMultipartBody<T extends Record<string, any>>(
  body: Record<string, any>,
  options?: { jsonFields?: string[]; skip?: string[] }
): Partial<T> {
  const skip = options?.skip || [];
  const forceJson = options?.jsonFields || [];

  const parsed: Record<string, any> = {};

  for (const [key, value] of Object.entries(body)) {
    if (skip.includes(key)) continue;

    if (typeof value !== "string") {
      parsed[key] = value;
      continue;
    }
    if (forceJson.includes(key)) {
      parsed[key] = JSON.parse(value);
      continue;
    }
    try {
      parsed[key] = JSON.parse(value);
    } catch {
      parsed[key] = value;
    }
  }

  return parsed as Partial<T>;
}
