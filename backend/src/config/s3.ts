import { S3Client } from "@aws-sdk/client-s3";
import { AWS_REGION, AWS_S3_ACCESSKEY, AWS_S3_SECRET } from "@/constants";

export const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_S3_ACCESSKEY,
    secretAccessKey: AWS_S3_SECRET,
  },
});
