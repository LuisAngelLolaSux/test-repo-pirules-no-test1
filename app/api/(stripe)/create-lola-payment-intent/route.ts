import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/utils';
import { currentUser } from '@/lib/auth';
import { getStripeCustomer } from '@/utils/stripeUtils';

export async function POST(request: NextRequest) {
    try {
        const user = await currentUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { cantidadCreditos, metodoPagoId } = await request.json();

        if (cantidadCreditos < 50) {
            return new NextResponse('Cantidad de créditos mínima es 50', { status: 400 });
        }

        const stripeCustomerId = await getStripeCustomer();

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(cantidadCreditos * 100),
            currency: 'mxn',
            customer: stripeCustomerId,
            payment_method: metodoPagoId,
            description: 'Lola Credit Payment',
            payment_method_types: ['card'],
            metadata: { userId: user?.id, creditosAdquiridos: cantidadCreditos },
            confirm: true,
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Internal Error:', error);

        return NextResponse.json({ error: `Internal Server Error: ${error}` }, { status: 500 });
    }
}
