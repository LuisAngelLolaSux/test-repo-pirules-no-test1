import { cn } from '@/lib/utils';
import React from 'react';
import { Img } from '@react-email/components';

interface ICardProviderIconProps {
    provider: string;
    height?: number;
    width?: number;
    className?: string;
    isMail?: boolean;
}

const paymentMethods = [
    {
        name: 'Visa',
        identifier: 'visa',
        logo: 'https://www.lolasux.com/icons/cards/visa.svg',
    },
    {
        name: 'Mastercard',
        identifier: 'mastercard',
        logo: 'https://www.lolasux.com/icons/cards/mastercard.svg',
    },
    {
        name: 'American Express',
        identifier: 'amex',
        logo: 'https://www.lolasux.com/icons/cards/amex.svg',
    },
    {
        name: 'Apple Pay',
        identifier: 'applepay',
        logo: 'https://www.lolasux.com/icons/cards/applepay.svg',
    },
];

const paymentMethodsMails = [
    {
        name: 'Visa',
        identifier: 'visa',
        logo: 'https://www.lolasux.com/static/mail-icons/cards/visa.png',
    },
    {
        name: 'Mastercard',
        identifier: 'mastercard',
        logo: 'https://www.lolasux.com/static/mail-icons/cards/mastercard.png',
    },
    {
        name: 'American Express',
        identifier: 'amex',
        logo: 'https://www.lolasux.com/static/mail-icons/cards/amex.png',
    },
    {
        name: 'Apple Pay',
        identifier: 'applepay',
        logo: 'https://www.lolasux.com/static/mail-icons/cards/applepay.png',
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
        if (isMail) {
            return paymentMethodsMails.find(
                (method) => method.identifier.toLowerCase() === provider.toLowerCase(),
            );
        }

        return paymentMethods.find(
            (method) => method.identifier.toLowerCase() === provider.toLowerCase(),
        );
    }

    return (
        <Img
            alt={getProviderMethod(provider)?.name || 'error'}
            src={getProviderMethod(provider)?.logo || ''}
            height={height}
            width={width}
            className={cn(`overflow-hidden h-[${height}] w-[${width}]`, className)}
        />
    );
};

export default CardProviderIcon;
