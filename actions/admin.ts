'use server';

import { currentRole } from '@/lib/auth';
import { UserRole } from '@prisma/client';

/**
 * Server side function that only runs when the role is equal to admin
 * @returns { success: "Allowed!" } | { error: "Forbidden!" }
 */
export const admin = async () => {
    const role = await currentRole();
    if (role === UserRole.ADMIN) {
        return { success: 'Allowed!' };
    }
    return { error: 'Forbidden!' };
};
