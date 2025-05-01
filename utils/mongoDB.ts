"use server";
import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async () => {
  if (isConnected) {
    console.log("DB already connected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.DATABASE_URL || "");
    isConnected = true;
    return;
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    throw error;
  }
};
