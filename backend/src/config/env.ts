import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface AppConfig {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  FRONTEND_URL: string;
}

const getEnv = (): AppConfig => {
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const PORT = parseInt(process.env.PORT || '5000', 10);
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edu4loan';
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

  if (!JWT_SECRET) {
    if (NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable is required in production.');
    }
    console.warn('[CONFIG WARN] JWT_SECRET is not set. Using fallback development secret.');
  }

  return {
    NODE_ENV,
    PORT,
    MONGODB_URI,
    JWT_SECRET: JWT_SECRET || 'edu4loan_dev_fallback_secret_key_38472918471928471928',
    JWT_EXPIRES_IN,
    FRONTEND_URL,
  };
};

export const config = getEnv();
