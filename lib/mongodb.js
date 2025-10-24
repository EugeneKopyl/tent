import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('MONGODB_URI not found in environment variables. Admin features will not work.');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('MongoDB URI not configured. Please set MONGODB_URI environment variable.');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    let opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    const proxyOptions = {
      proxyHost: process.env.MONGODB_PROXY_HOST,
      proxyPort: process.env.MONGODB_PROXY_PORT,
    };
    if (process.env.NODE_ENV === 'development' && process.env.MONGODB_PROXY) {
      try {
        opts = { ...opts, ...proxyOptions };
        console.log('Using proxy for MongoDB connection:', process.env.MONGODB_PROXY + ':' + process.env.MONGODB_PROXY_PORT);
      } catch (error) {
        console.warn('Failed to configure proxy for MongoDB:', error.message);
        console.warn('Continuing without proxy...');
      }
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    }).catch((error) => {
      console.error('MongoDB connection error:', error);
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
