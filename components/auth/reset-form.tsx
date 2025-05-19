'use client';
import { CardWrapper } from './card-wrapper';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ResetSchema } from '@/schemas';
import {
    Form,
    FormControl,
    FormError,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormSuccess,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useState, useTransition } from 'react';
import { reset } from '@/actions/reset';
import Link from 'next/link';

export const ResetForm = () => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        setError('');
        setSuccess('');

        startTransition(async () => {
            const data = await reset(values);
            setError(data.error);
            setSuccess(data.success);
        });
    };

    return (
        <CardWrapper headerLabel="Recupera tu contraseña">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo electrónico</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="juan.rodriguez@ejemplo.com"
                                            type="email"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                        type="submit"
                        className="w-full bg-primary-lola transition-all duration-300 hover:bg-primary-lola-light"
                        disabled={isPending}
                    >
                        Enviar correo
                    </Button>
                </form>
            </Form>
            <div className="mt-6 flex w-full items-center justify-center gap-2 text-sm">
                <div className="font-semibold">¿Listo para volver? </div>{' '}
                <Link
                    className="text-primary-lola underline-offset-2 hover:underline"
                    href={'/auth/login'}
                >
                    Inicia sesión
                </Link>
            </div>
        </CardWrapper>
    );
};
