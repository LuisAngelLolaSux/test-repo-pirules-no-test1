'use client';
import { Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import CheckoutHeader from './_componentes/CheckoutHeader';
import { loadStripe } from '@stripe/stripe-js';

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined');
}

// Cargar la clave pública de Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Elements stripe={stripePromise}>
                <CheckoutHeader />
                <div>{children}</div>
            </Elements>
        </div>
    );
};

export default CheckoutLayout;
