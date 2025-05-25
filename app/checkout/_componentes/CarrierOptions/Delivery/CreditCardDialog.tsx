"use client";
import { PaymentMethod } from "@stripe/stripe-js";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import React from "react";
import TextareaWithLabel from "@/components/TextAreaWithLabel";
import { useCheckoutStore } from "@/store/checkoutStore";
import { Button } from "@/components/ui/button";
import { EditButton } from "../../EditWithDialogContainer";
import CheckoutPage from "../../CheckoutPage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

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

interface ICreditCardDialogProps {
  cardInfo: PaymentMethod;
  primaryColor?: string | undefined;
}
const CreditCardDialog = ({ cardInfo, primaryColor }: ICreditCardDialogProps) => {
  const { setAddressInfoField, addressInfo } = useCheckoutStore();
  const [newAdditionalAddressInfo, setNewAdditionalAddressInfo] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const handleUpdate = () => {
    setAddressInfoField("additionalInfo", newAdditionalAddressInfo);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <EditButton defaultValue={cardInfo.card?.last4.toString()} />
      </DialogTrigger>
      <DialogContent className="space-y-5 px-[50px] pb-[25px] pt-[38px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold leading-snug text-black">
            Informacion de tarjeta
          </DialogTitle>
        </DialogHeader>
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: Math.round(100 * 100),
            currency: "mxn",
          }}>
          <CheckoutPage primaryColor={primaryColor} setIsOpen={setIsOpen} />
        </Elements>
        <TextareaWithLabel
          label="Notas adicionales"
          defaultValue={addressInfo.additionalInfo}
          onChange={(e) => setNewAdditionalAddressInfo(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={handleUpdate}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreditCardDialog;
