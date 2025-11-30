import mongoose from "mongoose";

const MONGODB_URL = process.env.DB_URL!;
if (!MONGODB_URL) throw new Error("Please define mongo_uri in env variables");


let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { connection: null, promise: null };
}

export async function connectToDatabase() {
    if (cached.connection)
        return cached.connection;

    if (!cached.promise) {
        const opts = {
            // bufferCommands: true,
            // maxPoolSize: 10,
        }
        cached.promise = mongoose.connect(MONGODB_URL, opts).then(() => mongoose.connection)
    }

    try {
        cached.connection = await cached.promise
    } catch (error) {
        cached.promise = null
        console.log("Error in database connection: ", error)
        throw error
    }

    return cached.connection

}
