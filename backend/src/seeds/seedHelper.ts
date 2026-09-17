import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from '../config/env';

let mongod: MongoMemoryServer | null = null;

export const ensureDbForSeed = async (): Promise<string> => {
  if (mongoose.connection.readyState === 1) {
    return 'ALREADY_CONNECTED';
  }

  try {
    const connPromise = mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    await connPromise;
    console.log(`[SEED DB] Connected to external MongoDB at ${config.MONGODB_URI}`);
    return 'EXTERNAL_MONGODB';
  } catch (err) {
    console.log('[SEED DB] External MongoDB not reachable. Initializing In-Memory MongoDB for seeding...');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log(`[SEED DB] In-Memory MongoDB initialized at ${uri}`);
    return 'IN_MEMORY_MONGODB';
  }
};

export const closeDbForSeed = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  if (mongod) {
    await mongod.stop();
    mongod = null;
  }
  console.log('[SEED DB] Database connection closed cleanly.');
};
