'use server';
import { currentRole } from '@/lib/auth';
import { sidebarDevRoutes } from '@/routes';

export const getDevRoutes = async () => {
    const role = await currentRole();
    if (role === 'DEV' || role === 'ADMIN') {
        return sidebarDevRoutes;
    }
    return [];
};
