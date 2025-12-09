import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Global is used here to maintain a cached connection across hot reloads in dev
// and across re-used serverless instances on Vercel.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    // console.log("Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "Blog",
      })
      .then((mongoose) => {
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}




// import mongoose from "mongoose";

// let isConnected = false; 


// export const connectDB = async () => {
//   if (mongoose.connection.readyState === 1) {
//     // Already connected
//     console.log("MongoDB already connected ✅");
//     return;
//   }

//   if (isConnected) {
//     console.log("MongoDB already connected (flag) ✅");
//     return;
//   }

//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       dbName: "Blog",
//     });

//     isConnected = true;
//     console.log(`MongoDB connected ✅ ${conn.connection.host}`);
//   } catch (error) {
//     console.error("MongoDB connection error ❌", error);
//     throw new Error("Failed to connect to MongoDB");
//   }
// };
