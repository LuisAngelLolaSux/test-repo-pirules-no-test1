import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';
import { Img } from '@react-email/components';

interface ICardProviderIconProps {
    provider: string;
    isMail?: boolean;
    height?: number;
    width?: number;
    className?: string;
}

const paymentMethods = [
    {
        name: 'Visa',
        identifier: 'visa',
        logo: '/icons/cards/visa.svg',
    },
    {
        name: 'Mastercard',
        identifier: 'mastercard',
        logo: '/icons/cards/mastercard.svg',
    },
    {
        name: 'American Express',
        identifier: 'amex',
        logo: '/icons/cards/amex.svg',
    },
    {
        name: 'Apple Pay',
        identifier: 'applepay',
        logo: '/icons/cards/applepay.svg',
    },
];
const CardProviderIcon = ({
    className,
    provider,
    isMail = false,
    height = 24,
    width = 24,
}: ICardProviderIconProps) => {
    function getProviderMethod(provider: string) {
        return paymentMethods.find(
            (method) => method.identifier.toLowerCase() === provider.toLowerCase(),
        );
    }
    if (isMail) {
        return (
            <Img
                alt={getProviderMethod(provider)?.name || 'error'}
                src={getProviderMethod(provider)?.logo || ''}
                height={height}
                width={width}
                className={cn(`overflow-hidden h-[${height}] w-[${width}]`, className)}
            />
        );
    }

    return (
        <Image
            className={cn(`overflow-hidden h-[${height}] w-[${width}]`, className)}
            alt={getProviderMethod(provider)?.name || 'error'}
            src={getProviderMethod(provider)?.logo || ''}
            width={width}
            height={height}
        ></Image>
    );
};

export default CardProviderIcon;
