"use client";
import React, { useEffect, useState } from "react";
import AddPaymentMethodDialog from "./AddPaymentMethodDialog";

export default function PaymentMethodsClient({ stripeCustomerId }: { stripeCustomerId: string }) {
  const [methods, setMethods] = useState<any[]>([]);
  const [defaultMethod, setDefaultMethod] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const res = await fetch("/api/payment-methods", { method: "GET" });
        const data = await res.json();
        if (!data.paymentMethods) {
          throw new Error("Invalid API response");
        }
        setMethods(data.paymentMethods);
        setDefaultMethod(data.defaultMethod);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMethods();
    console.log("stripeCustomerId", stripeCustomerId);
    console.log("methods", methods);
  }, [stripeCustomerId]);

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      const res = await fetch("/api/payment-methods/default", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethodId }),
      });
      const data = await res.json();
      if (data.success) {
        setDefaultMethod(paymentMethodId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Tus Métodos de Pago</h2>
      <ul>
        {methods.map((method) => (
          <li key={method.id} className="mb-2 p-4 border border-gray-200 rounded">
            <p>
              <strong>Tarjeta:</strong> {method.card.brand} ****{method.card.last4}
            </p>
            <p>
              <strong>Expira:</strong> {method.card.exp_month}/{method.card.exp_year}
            </p>
            {defaultMethod === method.id ? (
              <span className="text-green-500 font-semibold">Predeterminado</span>
            ) : (
              <button
                onClick={() => handleSetDefault(method.id)}
                className="ml-4 text-blue-500 underline">
                Establecer como predeterminado
              </button>
            )}
          </li>
        ))}
      </ul>
      <AddPaymentMethodDialog />
    </div>
  );
}
