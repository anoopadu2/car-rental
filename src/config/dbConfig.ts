import mongoose from "mongoose";

export async function connectDB() {
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    throw new Error("MONGO_URL is not defined in environment variables");
  }

  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB Connection Successful");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
