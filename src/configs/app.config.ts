export const API_URL =
  process.env.API_URL || 'https://chat-app-server-k3ih.onrender.com';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const MINIO_HOST = process.env.MINIO_HOST || 'localhost';
export const MINIO_PORT = process.env.MINIO_PORT || '9000';

export const SALT = process.env.SALT || 'salt';
export const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';
export const EXPIRES_IN = process.env.EXPIRES_IN || '60d';
export const JWT_SECRET_SET_PROFILE =
  process.env.JWT_SECRET_SET_PROFILE || 'jwt_secret_set_profile';
export const EXPIRES_IN_SET_PROFILE =
  process.env.EXPIRES_IN_SET_PROFILE || '5m';

export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
