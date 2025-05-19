/* El ConditionalLayout existe para no mostrar el navbar y footer en componentes hijos donde no sean deseados */
'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/navbarPublic';
import Footer from '@/components/newFooter';
import FeedbackBubble from '../FeedbackBubble';

interface ConditionalLayoutProps {
    children: React.ReactNode;
    footerLinks: Array<{ label: string; url: string; section: string }>;
}

export function ConditionalLayout({ children, footerLinks }: ConditionalLayoutProps) {
    const pathname = usePathname();
    /* Actualmente la única pantalla donde necesitamos este Layout es en auth, pero si es necesario en otras partes, podemos modificarlo para que use una lista de diferentes paths*/
    const isAuthRoute = pathname?.startsWith('/auth') ?? false;

    return (
        <>
            {!isAuthRoute && <Navbar />}
            {!isAuthRoute && <FeedbackBubble />}
            {children}
            {!isAuthRoute && <Footer links={footerLinks} />}
        </>
    );
}
