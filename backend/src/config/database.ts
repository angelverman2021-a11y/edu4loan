import mongoose from 'mongoose';
import { config } from './env';

let isConnected = false;

export const connectDatabase = async (): Promise<boolean> => {
  if (isConnected) {
    console.log('[DATABASE] MongoDB connection already established.');
    return true;
  }

  try {
    console.log(`[DATABASE] Attempting connection to MongoDB at: ${config.MONGODB_URI}`);
    const conn = await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = conn.connection.readyState === 1;
    console.log(`[DATABASE] MongoDB Connected successfully: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error('[DATABASE ERROR] Runtime MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[DATABASE WARN] MongoDB connection disconnected.');
      isConnected = false;
    });

    return true;
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error(`[DATABASE ERROR] Failed to connect to MongoDB (${config.MONGODB_URI}): ${errMessage}`);
    isConnected = false;
    return false;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (isConnected || mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    isConnected = false;
    console.log('[DATABASE] MongoDB connection closed gracefully.');
  }
};

export const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};
