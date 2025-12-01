import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  // Use a clear error to know if the ENV is actually missing on Vercel
  throw new Error("Please define MONGODB_URL in your Vercel Environment Variables"); 
}

// Ensure the global object is typed correctly to avoid TS errors
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { connection: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering to fail fast if not connected
    };

    // 👇 CRITICAL FIX: You must assign the promise to the variable!
    cached.promise = mongoose.connect(MONGODB_URL!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.connection = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("Error in database connection: ", error); // changed to console.error
    throw error;
  }

  return cached.connection;
}