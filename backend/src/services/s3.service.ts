import { s3 } from "@/config/s3";
import { AWS_REGION, AWS_S3_BUCKET } from "@/constants";
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const uploadFileToS3 = async (
  file: Express.Multer.File,
  folder: string
): Promise<string> => {
  const cleanName = file.originalname.replace(/\s+/g, "_");
  const Key = `${folder}/${Date.now()}-${cleanName}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${Key}`;
};

export const deleteFromS3 = async (key: string) => {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: key,
    })
  );
};

export const generateSignedUrl = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
  });
  return await getSignedUrl(s3, command, { expiresIn: 3600 });
};
