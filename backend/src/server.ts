import http from 'http';
import mongoose from 'mongoose';
import app from './app';
import { config } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';

let server: http.Server;
let memoryServerInstance: any = null;

const startServer = async () => {
  console.log('--------------------------------------------------');
  console.log('  EDU4LOAN BACKEND SERVICE INITIALIZATION');
  console.log('  Smart Education Loan Guidance for VIT Bhopal');
  console.log('--------------------------------------------------');
  console.log(`[CONFIG] Environment: ${config.NODE_ENV}`);
  console.log(`[CONFIG] Port: ${config.PORT}`);

  // Attempt database connection
  const dbConnected = await connectDatabase();

  // If local MongoDB connection failed and we are in development, start MongoMemoryServer fallback
  if (!dbConnected && config.NODE_ENV !== 'production') {
    console.warn('[DATABASE] Standard MongoDB connection failed. Initializing MongoMemoryServer development fallback...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create();
      const memUri = memoryServerInstance.getUri();
      await mongoose.connect(memUri);
      console.log(`[DATABASE] In-Memory MongoDB connected successfully at: ${memUri}`);
    } catch (memErr) {
      console.error('[DATABASE ERROR] Failed to start In-Memory MongoDB fallback:', memErr);
    }
  }

  server = app.listen(config.PORT, () => {
    console.log(`[SERVER] Edu4Loan API server running at http://localhost:${config.PORT}`);
    console.log(`[SERVER] Health check available at http://localhost:${config.PORT}/api/health`);
  });

  // Graceful shutdown handlers
  const shutdown = async (signal: string) => {
    console.log(`\n[SERVER] Received ${signal}. Starting graceful shutdown...`);
    if (server) {
      server.close(() => {
        console.log('[SERVER] HTTP server closed.');
      });
    }

    await disconnectDatabase();

    if (memoryServerInstance) {
      await memoryServerInstance.stop();
      console.log('[DATABASE] In-Memory MongoDB stopped.');
    }

    console.log('[SERVER] Graceful shutdown completed.');
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((err) => {
  console.error('[FATAL SERVER ERROR]', err);
  process.exit(1);
});
