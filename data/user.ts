import { db } from "@/lib/prismaDB";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } });
    return user;
  } catch (error) {
    return null;
  }
};

export const getSubUserByEmail = async (email: string) => {
  try {
    const user = await db.subUser.findUnique({ where: { email } });
    return user;
  } catch (error) {
    return null;
  }
};

export const getSubUserById = async (id: string) => {
  try {
    const user = await db.subUser.findUnique({ where: { id } });
    return user;
  } catch (error) {
    return null;
  }
};
