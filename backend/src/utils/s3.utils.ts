import { DEFAULT_IMAGE_URL } from "@/constants";
import { IS3Service } from "@/core/interfaces/services/IS3Service";

export const resolveS3Image = async (
  path: string | undefined,
  s3Service: IS3Service
): Promise<string> => {
  if (!path) return DEFAULT_IMAGE_URL;
  if (path.includes("private/user/profiles")) {
    return (await s3Service.generateSignedUrl(path)) ?? DEFAULT_IMAGE_URL;
  }
  return path;
};
