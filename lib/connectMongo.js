import mongoose from "mongoose";

let isConnected = false;

const connectMongo = async () => {
  if (isConnected) return;

  try {
    let dbName = "allAtlas"
    if (process.env.ENVIRONMENT === "development") {
      dbName = "ecomData";
    }
console.log(dbName)
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName,
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

export default connectMongo;
