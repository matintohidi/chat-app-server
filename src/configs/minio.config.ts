import { ClientOptions } from 'minio';

const {
  MINIO_ACCESS_KEY,
  MINIO_HOST,
  MINIO_PORT,
  MINIO_SECRET_KEY,
  MINIO_USE_SSL,
} = process.env;

export const minioConfig: ClientOptions = {
  accessKey: MINIO_ACCESS_KEY || 'admin',
  secretKey: MINIO_SECRET_KEY || '12345678',
  endPoint: MINIO_HOST || 'localhost',
  port: +MINIO_PORT || 9000,
  useSSL: MINIO_USE_SSL === 'true' || false,
};
