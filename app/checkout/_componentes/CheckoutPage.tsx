"use client";

import React, { useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useCheckoutStore } from "@/store/checkoutStore";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ICheckoutPageProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  primaryColor?: string | undefined;
}

const CheckoutPage = ({ setIsOpen, primaryColor }: ICheckoutPageProps) => {
  const { setCardInfo, cardInfo } = useCheckoutStore();
  const [newCardInfo, setNewCardInfo] = React.useState("");
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [paymentMethodId, setPaymentMethodId] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTempCardInfo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement)!,
    });

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    setPaymentMethodId(paymentMethod?.id);

    setCardInfo(paymentMethod);

    setLoading(false);
    setIsOpen(false);
  };
  // Custom styling for Stripe Elements
  const stripeElementStyle = {
    base: {
      color: "#555",
      fontFamily: "Montserrat, sans-serif",
      fontSize: "16px",
      "::placeholder": {
        color: "#888",
      },
    },
    invalid: {
      color: "#e5424d",
    },
  };

  if (!stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="text-surface inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Step 1: Add Card */}
      {!paymentMethodId && (
        <form onSubmit={handleTempCardInfo} className="rounded-md bg-white p-2">
          <div className="mb-4">
            <Label htmlFor="card-number" className="mb-2 block text-sm font-medium text-gray-700">
              Numero de tarjeta
            </Label>
            <div id="card-number-element" className="rounded-md border p-2">
              <CardNumberElement id="card-number" options={{ style: stripeElementStyle }} />
            </div>
          </div>

          <div className="flex w-full gap-4">
            <div className="mb-4 w-1/2">
              <Label htmlFor="card-expiry" className="mb-2 block text-sm font-medium text-gray-700">
                Fecha de expiración
              </Label>
              <div id="card-expiry-element" className="rounded-md border p-2">
                <CardExpiryElement id="card-expiry" options={{ style: stripeElementStyle }} />
              </div>
            </div>

            <div className="mb-4 w-1/2">
              <Label htmlFor="card-cvc" className="mb-2 block text-sm font-medium text-gray-700">
                Código de seguridad
              </Label>
              <div id="card-cvc-element" className="rounded-md border p-2">
                <CardCvcElement id="card-cvc" options={{ style: stripeElementStyle }} />
              </div>
            </div>
          </div>
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}

          <div className="mt-4 flex w-full items-center justify-end">
            <Button
              style={{
                backgroundColor: primaryColor || "#34c85a",
              }}
              className="transition-all duration-300 hover:scale-105"
              variant={"lola"}
              size={"lola"}
              type="submit"
              disabled={loading || !stripe}>
              {loading ? "Guardando Tarjeta..." : "Guardar Tarjeta"}
            </Button>
          </div>
        </form>
      )}

      {/* Step 2: Confirm Payment */}
      {/* {paymentMethodId && ( */}
      {/*     <button */}
      {/*         disabled={loading || paymentMethodId} */}
      {/*         className="mt-2 w-full rounded-md bg-green-500 p-5 font-bold text-white" */}
      {/*     > */}
      {/*         {loading ? 'Processing Payment...' : `Tarjeta Guardada`} */}
      {/*     </button> */}
      {/* )} */}
    </div>
  );
};

export default CheckoutPage;
