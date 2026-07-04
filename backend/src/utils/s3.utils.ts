import { IS3Service } from "@/core/interfaces/services/IS3Service";

export const resolveS3Url = async (
  path: string | undefined,
  s3Service: IS3Service
): Promise<string | undefined> => {
  if (!path) return undefined;
  if (path.includes("private")) {
    return await s3Service.generateSignedUrl(path);
  }
  return path;
};
