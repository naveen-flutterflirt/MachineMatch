import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

/**
 * Helper to construct S3 bucket config from environment variables
 */
export const getS3Config = () => {
  return {
    bucketName: process.env.AWS_S3_BUCKET_NAME || 'machinematch-production-assets',
    region: process.env.AWS_REGION || 'ap-south-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  };
};

/**
 * Uploads a local file to Amazon S3 bucket (machinematch-production-assets)
 */
export const uploadFileToS3 = async (file) => {
  if (!file || !file.path) return null;

  const { bucketName, region, accessKeyId, secretAccessKey } = getS3Config();

  // If local storage is explicitly forced and S3 credentials aren't provided, fallback
  if (process.env.STORAGE_PROVIDER === 'local' && !accessKeyId && !secretAccessKey) {
    return `/uploads/${file.filename}`;
  }

  try {
    const s3Client = new S3Client({
      region,
      ...(accessKeyId && secretAccessKey
        ? {
            credentials: {
              accessKeyId,
              secretAccessKey,
            },
          }
        : {}), // Automatically fallback to ECS Task IAM Role if credentials omitted
    });

    const fileStream = fs.createReadStream(file.path);
    const key = `pdf-brochures/${Date.now()}-${file.filename || file.originalname}`;

    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: fileStream,
      ContentType: file.mimetype || 'application/pdf',
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
    console.log(`✅ Uploaded ${file.originalname} to S3 bucket [${bucketName}]: ${publicUrl}`);
    return publicUrl;
  } catch (err) {
    console.error(`⚠️ S3 Upload notice for ${file.originalname}:`, err.message);
    return `/uploads/${file.filename}`;
  }
};

/**
 * Utility to generate S3 asset URLs or local static asset URLs seamlessly
 */
export const getFilePublicUrl = (file) => {
  if (!file) return null;

  if (file.location) {
    return file.location;
  }

  return `/uploads/${file.filename}`;
};
