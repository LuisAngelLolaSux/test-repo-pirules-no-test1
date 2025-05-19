import { NextResponse } from 'next/server';
import { stripe } from '@/lib/utils';
import { connectToDB } from '@/utils/mongoDB';
import User from '@/models/auth/User';
import { currentUser } from '@/lib/auth';

export async function POST() {
    try {
        const user = await currentUser();
        await connectToDB();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Revisa si la cuenta ya tiene un ID de Stripe
        const existingAccountInfo = await User.findById(user?.id);
        if (existingAccountInfo && existingAccountInfo.stripeAccountId) {
            const account = await stripe.accounts.retrieve(existingAccountInfo.stripeAccountId);
            // Check if the account has completed onboarding
            const onboardingComplete = account.requirements.currently_due.length === 0;

            return NextResponse.json({
                account: existingAccountInfo.stripeAccountId,
                exists: true,
                onboardingComplete,
            });
        }
        // Estos parametros estan basados en las opciones elejidas para stripe connect
        const account = await stripe.accounts.create({
            controller: {
                stripe_dashboard: {
                    type: 'none',
                },
                fees: {
                    payer: 'application',
                },
                losses: {
                    payments: 'application',
                },
                requirement_collection: 'application',
            },
            capabilities: {
                transfers: { requested: true },
            },
            country: 'MX',
        });

        // Actualizar el Account con el ID de la cuenta de Stripe
        if (existingAccountInfo) {
            existingAccountInfo.stripeAccountId = account.id;
            await existingAccountInfo.save();
        }

        return NextResponse.json({ account: account.id });
    } catch (error) {
        console.error('Ocurrio un error en la creacion de la cuenta de Stripe', error);
        return NextResponse.json({ error: `Internal Server Error: ${error}` }, { status: 500 });
    }
}

export async function GET() {
    try {
        const user = await currentUser();
        await connectToDB();
        if (!user) {
            return NextResponse.json({ hasStripeId: false }, { status: 200 });
        }
        const existingAccountInfo = await User.findById(user?.id);
        if (existingAccountInfo && existingAccountInfo.stripeAccountId) {
            return NextResponse.json({ hasStripeId: true }, { status: 200 });
        }
        return NextResponse.json({ hasStripeId: false }, { status: 200 });
    } catch (error) {
        console.error('Error checking Stripe ID', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
