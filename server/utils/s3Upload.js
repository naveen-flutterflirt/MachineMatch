import path from 'path';

/**
 * Utility to generate S3 asset URLs or local static asset URLs seamlessly
 */
export const getFilePublicUrl = (file) => {
  if (!file) return null;

  // If uploaded via AWS S3 / Cloud Storage (location populated by S3 storage engines)
  if (file.location) {
    return file.location;
  }

  // Fallback to local server path
  return `/uploads/${file.filename}`;
};

/**
 * Helper to construct S3 bucket config from environment variables
 */
export const getS3Config = () => {
  return {
    bucketName: process.env.AWS_S3_BUCKET_NAME || 'machinematch-assets',
    region: process.env.AWS_REGION || 'ap-south-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  };
};
