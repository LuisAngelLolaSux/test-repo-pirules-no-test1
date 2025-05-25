"use server";

import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import { z } from "zod";
import { db } from "@/lib/prismaDB";
import { getSubUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos!" };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const currentLolaId = process.env.LOLA_USER_ID;

  const existingUser = await getSubUserByEmail(email);

  if (existingUser) {
    if (existingUser.lolaParentId) {
      // La cuenta ya posee un lolaParentId; se crea un nuevo usuario con la misma información.
      // Para evitar violar la restricción de unicidad en email, se modifica el email.
      const newEmail = `${email}+${currentLolaId}`;
      await db.subUser.create({
        data: {
          name,
          email: newEmail,
          password: hashedPassword,
          emailVerified: null,
          lolaParentId: currentLolaId, // Nuevo usuario registrado con el LOLA_USER_ID actual
        },
      });
      return { success: "Cuenta registrada en nueva página" };
    } else {
      // Se actualiza el usuario existente agregando el LOLA_USER_ID.
      await db.subUser.update({
        where: { email },
        data: { lolaParentId: currentLolaId },
      });
      return { success: "Cuenta registrada en nueva página" };
    }
  }

  // Se crea un nuevo usuario normalmente.
  await db.subUser.create({
    data: {
      name,
      email,
      password: hashedPassword,
      emailVerified: null,
      lolaParentId: currentLolaId,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    success: "Hemos enviado un correo de confirmación. Recuerda checar tu folder de spam.",
  };
};
