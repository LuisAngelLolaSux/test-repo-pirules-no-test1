'use server';

import { ResetSchema } from '@/schemas';
import z from 'zod';
import { getUserByEmail } from '@/data/user';
import { sendPasswordResetEmail } from '@/lib/mail';
import { generatePasswordResetToken } from '@/lib/tokens';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Mail invalido' };
    }

    const { email } = validatedFields.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return { error: 'Mail no encontrado!' };
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

    return { success: 'Mail enviado!' };
};
