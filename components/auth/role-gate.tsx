'use client';

import { useCurrentRole } from '@/hooks/use-current-role';
import { UserRole } from '@prisma/client';
import { FormError } from '../ui/form';

interface RoleGateProps {
    children: React.ReactNode;
    allowedRole: UserRole;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
    const role = useCurrentRole();

    if (role !== allowedRole) {
        return <FormError message="No tienes permiso para ver este contenido" />;
    }
    return <>{children}</>;
};
