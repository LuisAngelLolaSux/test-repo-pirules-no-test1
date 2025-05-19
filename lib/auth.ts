"use server";
import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";
import User from "@/models/auth/User";
import { connectToDB } from "@/utils/mongoDB";

export const currentUser = async () => {
  const session = await getServerSession(authConfig);
  return session?.user;
};

export const currentRole = async () => {
  const session = await getServerSession(authConfig);
  return session?.user?.role;
};
