import mongoose from "mongoose";

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  // Use a clear error to know if the ENV is actually missing on Vercel
  throw new Error("Please define DB_URL in your Vercel Environment Variables"); 
}
console.log("🔥 DEBUG: DB_URL is currently:", DB_URL);
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
    cached.promise = mongoose.connect(DB_URL!, opts).then((mongoose) => {
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