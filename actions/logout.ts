'use server';

import { signOut } from '@/auth';

export const logout = async (redirectTo?: string) => {
    await signOut({
        redirectTo: redirectTo ? `${redirectTo}?reload` : '/?reload',
    });
};
