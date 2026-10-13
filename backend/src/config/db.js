import mongoose from 'mongoose';
import { env } from './env.js';

// Cache the connection on globalThis.
// Vercel reuses warm serverless instances, so this avoids a new
// connection on every request.
const cached = globalThis.__mongoose || (globalThis.__mongoose = { conn: null, promise: null });

export async function connectDB() {
  if (!env.mongodbUri) {
    console.warn('[db] MONGODB_URI is not set. Running without a database.');
    return null;
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(env.mongodbUri, { serverSelectionTimeoutMS: 5000 })
      .then((m) => m);
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}

export function dbStatus() {
  if (!env.mongodbUri) return 'not-configured';
  return ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
}
