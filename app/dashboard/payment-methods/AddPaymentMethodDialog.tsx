"use client";
import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImprovedCheckoutPage from "@/app/dashboard/payment-methods/_components/AddPaymentDialog";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function AddPaymentMethodDialog() {
  const [open, setOpen] = React.useState(false);
  const [paymentMethodId, setPaymentMethodId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSaveMethod = async () => {
    try {
      const res = await fetch("/api/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethodId }),
      });
      if (!res.ok) {
        const data = await res.json();
        if (data.error) {
          setError(data.error);
          return;
        }
        throw new Error("Error al comunicar con el servidor");
      }
      setOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>Agregar Nuevo Método de Pago</Button>
      </DialogTrigger>
      <DialogContent className="space-y-5 px-[50px] pb-[25px] pt-[38px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold leading-snug text-black">
            Agregar nueva tarjeta
          </DialogTitle>
        </DialogHeader>
        <Elements stripe={stripePromise}>
          <ImprovedCheckoutPage
            primaryColor="#FF4081"
            setIsOpen={setOpen}
            onPaymentMethodCreated={(id) => setPaymentMethodId(id)}
          />
        </Elements>
        {error && <div className="text-red-500">{error}</div>}
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveMethod}>Guardar Método de Pago</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
