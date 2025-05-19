'use client';
import { CardWrapper } from './card-wrapper';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoginShema } from '@/schemas';
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
import { login } from '@/actions/login';
import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CardFooter } from '../ui/card';
import Social from './social';

export const LoginForm = () => {
    const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();
    const callbackURL = searchParams.get('callbackUrl');
    const urlError =
        searchParams.get('error') === 'OAuthAccountNotLinked'
            ? 'Email ya utilizado con otro proovedor'
            : '';
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const form = useForm<z.infer<typeof LoginShema>>({
        resolver: zodResolver(LoginShema),
        defaultValues: {
            email: '',
            password: '',
            code: '',
        },
    });

    const onSubmit = (values: z.infer<typeof LoginShema>) => {
        setError('');
        setSuccess('');
        startTransition(async () => {
            try {
                const data = await login(values, callbackURL as string);
                if (data?.error) {
                    form.reset();
                    setError(data.error);
                }
                if (data?.success) {
                    form.reset();
                    setSuccess(data.success);
                }
                if (data?.twoFactor) {
                    setShowTwoFactor(true);
                }
            } catch (error) {
                setError('Something went wrong!');
            }
        });
    };

    return (
        <div className="m-2 p-0">
            <CardWrapper title="Iniciar sesión" contentClassName="p-0">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4 px-9">
                            {showTwoFactor && (
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Código de Verificación</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="123456"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            {!showTwoFactor && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
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
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="space-y-0">
                                                <div className="flex w-full items-center justify-between">
                                                    <FormLabel>Contraseña</FormLabel>
                                                    <Button
                                                        size="sm"
                                                        variant="link"
                                                        asChild
                                                        className="px-0 font-normal text-primary-lola"
                                                    >
                                                        <Link href="/auth/reset">
                                                            ¿Olvidaste tu contraseña?
                                                        </Link>
                                                    </Button>
                                                </div>

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
                                </>
                            )}
                        </div>
                        <FormError message={error || urlError} />
                        <FormSuccess message={success} />
                        <div className="px-9">
                            <Button
                                type="submit"
                                className="mb-5 w-full bg-primary-lola-light transition-all duration-300 hover:bg-primary-lola"
                                disabled={isPending}
                            >
                                {showTwoFactor ? 'Confirmar' : 'Iniciar sesión'}
                            </Button>
                        </div>
                    </form>
                    {!showTwoFactor && (
                        <>
                            <CardFooter className="px-9 pb-6">
                                <Social />
                            </CardFooter>
                            <div className="rounded-b-lg p-1">
                                <div className="flex h-[64px] w-full items-center justify-center gap-2 rounded-b-lg bg-[#EBFFF0] text-sm">
                                    <div className="font-medium">¿Nuevo en Lola Sux?</div>{' '}
                                    <Link
                                        className="text-primary-lola underline-offset-2 hover:underline"
                                        href={'/auth/register'}
                                    >
                                        Crea una cuenta
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </Form>
            </CardWrapper>
        </div>
    );
};
