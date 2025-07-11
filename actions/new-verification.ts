'use server';

import { db } from '@/lib/prismaDB';
import { getSubUserByEmail } from '@/data/user';
import { getVerificationTokenByToken } from '@/data/verification-token';

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return { error: 'Token inexistente!' };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: 'Token expirado!' };
    }

    const existingUser = await getSubUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: 'Mail inexistente!' };
    }

    await db.subUser.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
            email: existingToken.email,
        },
    });

    await db.verificationToken.delete({
        where: { id: existingToken.id },
    });

    return { succes: 'Mail verificado!' };
};
