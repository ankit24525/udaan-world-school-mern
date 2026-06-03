import mongoose from "mongoose";

let cachedConnection = globalThis.__udaanMongoConnection || null;
let cachedPromise = globalThis.__udaanMongoPromise || null;

export default async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing. Copy server/.env.example to server/.env and fill it.");
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(process.env.MONGO_URI).then((connection) => {
      console.log("MongoDB connected");
      return connection;
    });
    globalThis.__udaanMongoPromise = cachedPromise;
  }

  cachedConnection = await cachedPromise;
  globalThis.__udaanMongoConnection = cachedConnection;
  return cachedConnection;
}
