'use client';
import { CardWrapper } from './card-wrapper';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { RegisterSchema } from '@/schemas';
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
import { Checkbox } from '../ui/checkbox'; // Importa el componente Checkbox
import { useState, useTransition } from 'react';
import { register } from '@/actions/register';
import { CardFooter } from '../ui/card';
import Social from './social';
import Link from 'next/link';

// Extiende el esquema de validación para incluir el checkbox
const ExtendedRegisterSchema = RegisterSchema.extend({
    acceptPrivacyPolicy: z.boolean().refine((val) => val, {
        message: 'Debes aceptar el aviso de privacidad.',
    }),
});

export const RegisterForm = () => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const form = useForm<z.infer<typeof ExtendedRegisterSchema>>({
        resolver: zodResolver(ExtendedRegisterSchema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
            acceptPrivacyPolicy: false, // Valor inicial del checkbox
        },
    });

    const onSubmit = (values: z.infer<typeof ExtendedRegisterSchema>) => {
        setError('');
        setSuccess('');
        startTransition(async () => {
            const data = await register(values);
            setError(data.error);
            setSuccess(data.success);
        });
    };

    return (
        <div className="">
            <CardWrapper title="Comienza tu ecosistema" contentClassName="p-0">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4 px-9">
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
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre completo</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Juan Rodriguez"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contraseña</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="******"
                                                type="password"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="acceptPrivacyPolicy"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center space-x-2 px-1">
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled={isPending}
                                                />
                                                <FormLabel>
                                                    Acepto el{' '}
                                                    <Link
                                                        href="/aviso-de-privacidad"
                                                        target="_blank"
                                                        className="text-primary-lola underline-offset-2 hover:underline"
                                                    >
                                                        aviso de privacidad
                                                    </Link>
                                                </FormLabel>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormError message={error} />
                        <FormSuccess message={success} />

                        <div className="px-9">
                            <Button
                                type="submit"
                                className="w-full bg-primary-lola-light transition-all duration-300 hover:bg-primary-lola"
                                disabled={isPending}
                            >
                                Crear Cuenta
                            </Button>
                        </div>
                        <CardFooter className="px-9 pb-6">
                            <Social />
                        </CardFooter>
                        <div className="rounded-b-lg p-1">
                            <div className="flex h-[64px] w-full items-center justify-center gap-2 rounded-b-lg bg-[#EBFFF0] text-sm">
                                <div className="font-medium">¿Ya tienes cuenta? </div>{' '}
                                <Link
                                    className="text-primary-lola underline-offset-2 hover:underline"
                                    href={'/auth/login'}
                                >
                                    Inicia sesión
                                </Link>
                            </div>
                        </div>
                    </form>
                </Form>
            </CardWrapper>
        </div>
    );
};
