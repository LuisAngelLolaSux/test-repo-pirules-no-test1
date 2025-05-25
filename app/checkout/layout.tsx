'use client';
import { Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import CheckoutHeader from './_componentes/CheckoutHeader';
import { loadStripe } from '@stripe/stripe-js';

if (
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined ||
  process.env.NEXT_PUBLIC_LOLA_USER_STRIPE_ID === undefined
) {
  throw new Error(
    "NEXT_PUBLIC_STRIPE_PUBLIC_KEY or NEXT_PUBLIC_LOLA_USER_STRIPE_ID is not defined"
  );
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!, {
  stripeAccount: process.env.NEXT_PUBLIC_LOLA_USER_STRIPE_ID,
});

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
