import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/utils';

/**
 * Crea una sesión de cuenta de Stripe.
 *
 * @param request - El objeto NextRequest.
 * @returns Un objeto NextResponse que contiene el cliente secreto de la sesión de cuenta.
 * @throws Si ocurre un error durante la creación de la sesión de cuenta de Stripe, se devuelve un mensaje de error.
 */
export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();
        const accountSession = await stripe.accountSessions.create({
            account: payload.account,
            components: {
                account_onboarding: { enabled: true },
            },
        });
        return NextResponse.json({ client_secret: accountSession.client_secret });
    } catch (error) {
        console.error('Un error ocurrio en la creacion de la sesion de cuenta de Stripe: ', error);
        return NextResponse.json({ error: `Internal Server Error: ${error}` }, { status: 500 });
    }
}
