import mongoose from "mongoose";
import { DB_URL } from "../config/config.js";

export const connectDB = async () => {
  if (!DB_URL) {
    console.error("DB_URL is not defined in environment variables");
    process.exit(1);
  }
  try {
    await mongoose.connect(DB_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
