// lib/mongodb.js
import mongoose from "mongoose";

let isConnected = false; 


export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    // Already connected
    console.log("MongoDB already connected ✅");
    return;
  }

  if (isConnected) {
    console.log("MongoDB already connected (flag) ✅");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "Blog",
    });

    isConnected = true;
    console.log(`MongoDB connected ✅ ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error ❌", error);
    throw new Error("Failed to connect to MongoDB");
  }
};
