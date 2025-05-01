import "server-only";
import mongoose from "mongoose";
import PageConfig from "@/models/PageConfig";

async function connect() {
  const uri = process.env.DATABASE_URL;
  if (!uri || typeof uri !== "string") {
    throw new Error("Missing or invalid MONGODB_URI environment variable");
  }
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
}

export async function getConfig() {
  await connect();
  const cfg = await PageConfig.findOne({}).lean();
  console.log("DEBUG: PageConfig:", cfg); // Debug log to check the fetched config
  if (!cfg) throw new Error("No PageConfig found");
  return cfg;
}
