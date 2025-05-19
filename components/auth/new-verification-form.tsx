'use client';

import { BeatLoader } from 'react-spinners';

import { CardWrapper } from './card-wrapper';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { newVerification } from '@/actions/new-verification';
import { FormError, FormSuccess } from '../ui/form';

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const onSubmit = useCallback(async () => {
        if (success || error) {
            return;
        }
        if (!token) {
            setError('Token faltante');
            return;
        }
        try {
            const result = await newVerification(token);
            setSuccess(result.succes);
            setError(result.error);
        } catch (error) {
            setError('Algo salio mal!');
        }
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);
    return (
        <CardWrapper
            headerLabel="Verificación confirmada!"
            backButtonHref="/auth/login"
            backButtonLabel="Iniciar Sesión"
        >
            <div className="flex w-full items-center justify-center">
                {!success && !error && <BeatLoader />}
                <FormSuccess message={success} />
                {!success && <FormError message={error} />}
            </div>
        </CardWrapper>
    );
};
