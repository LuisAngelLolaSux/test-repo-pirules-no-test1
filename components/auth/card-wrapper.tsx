'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

import Social from './social';
import BackButton from './back-button';

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel?: string;
    backButtonLabel?: string;
    backButtonHref?: string;
    showSocial?: boolean;
    title?: string;
    contentClassName?: string;
}

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonHref,
    backButtonLabel,
    showSocial,
    title,
    contentClassName,
}: CardWrapperProps) => {
    return (
        <Card className="z-10 min-w-[450px] shadow-md">
            <CardHeader>
                <div className="flex w-full flex-col gap-y-2 p-3 font-bold">
                    <h1
                        className={`${
                            title && title?.length > 20 ? 'text-2xl' : 'text-3xl'
                        } font-semibold`}
                    >
                        {title}
                    </h1>
                    <p className="text-sm text-muted-foreground">{headerLabel}</p>
                </div>
            </CardHeader>
            <CardContent className={contentClassName}>{children}</CardContent>
            {showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>
            )}
            {backButtonHref && backButtonLabel && (
                <CardFooter>
                    <BackButton label={backButtonLabel} href={backButtonHref}></BackButton>
                </CardFooter>
            )}
        </Card>
    );
};
