'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FaUser } from 'react-icons/fa';
import { useCurrentUser } from '@/hooks/use-current-user';
import { LogoutButton } from './logout-button';
import { ExitIcon } from '@radix-ui/react-icons';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const UserButton = () => {
    const pathname = usePathname();
    const user = useCurrentUser();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="h-11 w-11">
                    <AvatarImage src={user?.image || ''} />
                    <AvatarFallback className="bg-gradient-to-r from-primary-lola-xlight to-primary-lola-ldark text-white">
                        <FaUser />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
                <Link href="/configuracion">
                    <DropdownMenuItem
                        className={`cursor-pointer ${pathname === '/dashboard/configuracion' && 'bg-gray-200'}`}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        Configuracion
                    </DropdownMenuItem>
                </Link>
                <LogoutButton>
                    <DropdownMenuItem className="cursor-pointer">
                        <ExitIcon className="mr-2 h-4 w-4" />
                        Cerrar sesión
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
