'use server';

import { signIn } from '@/auth';
import { checkPassword } from '@/data/password';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getUserByEmail } from '@/data/user';
import { sendVerificationEmail, sendTwoFactorTokenEmail } from '@/lib/mail';
import { db } from '@/lib/prismaDB';
import { generateVerificationToken, generateTwoFactorToken } from '@/lib/tokens';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginShema } from '@/schemas';
import AuthError from 'next-auth';
import { z } from 'zod';

export const login = async (values: z.infer<typeof LoginShema>, callbackURL?: string) => {
    const validatedFields = LoginShema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Campos invalidos!' };
    }

    const { email, password, code } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: 'Credenciales invalidas' };
    }

    if (!existingUser.emailVerified && (await checkPassword(password, existingUser.password))) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return { success: 'Mail de confiormacion enviado!' };
    }

    if (
        existingUser.isTwoFactorEnabled &&
        existingUser.email &&
        (await checkPassword(password, existingUser.password))
    ) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
            if (!twoFactorToken || twoFactorToken.token !== code) {
                return {
                    error: 'Codigo invalido!',
                };
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();
            if (hasExpired) {
                return {
                    error: 'Codigo expirado!',
                };
            }
            await db.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id,
                },
            });

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
            if (existingConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: existingConfirmation.id,
                    },
                });
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id,
                },
            });
        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);

            return { twoFactor: true };
        }
    }
    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: callbackURL ? `${callbackURL}?reload` : `${DEFAULT_LOGIN_REDIRECT}?reload`,
        });
        return { success: 'Sesion iniciada' };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        error: 'Credenciales invalidas!',
                    };
                default:
                    return {
                        error: 'Algo salio mal!',
                    };
            }
        }
        throw error;
    }
};
