"use client";
import React, { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useCheckoutStore } from "@/store/checkoutStore";

export default function CheckoutPage() {
  const { cartItems, resetCart, updateQuantity, removeFromCart } = useCartStore();
  const { shippingInfo, orderSummary } = useCheckoutStore();
  const [shippingOption, setShippingOption] = useState(null);
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [addressInfo, setAddressInfo] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [cardInfo, setCardInfo] = useState({
    id: "",
    card: null,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setShippingOption(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Example payment flow with Stripe:
      // if (stripe && elements) {
      //   const { error } = await stripe.confirmPayment({ ... });
      //   if (error) setErrorMsg("Payment error");
      //   else resetCart();
      // }
    } catch (error: any) {
      setErrorMsg(error.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-8">
      {errorMsg && <div className="bg-red-300 p-2 text-red-800">{errorMsg}</div>}
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 mb-4">
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "240px",
                  height: "160px",
                  objectFit: "cover",
                  display: "block",
                  margin: "0 auto",
                }}
                className="w-24 h-24 object-cover"
              />
              <div className="flex flex-col">
                <span className="font-semibold">{item.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(item.quantity - 1, 1))}
                    className="px-2 py-1 border">
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 border">
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="px-2 py-1 bg-red-500 text-white">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Shipping Info */}
          <section className="mb-6">
            <h3 className="font-semibold">Shipping Info</h3>
            <p className="text-sm text-gray-700">{shippingInfo}</p>
          </section>

          {/* Order Summary */}
          <section className="mb-6">
            <h3 className="font-semibold">Order Summary</h3>
            <p className="text-sm text-gray-700">{orderSummary}</p>
          </section>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 text-white">
            {loading ? "Processing..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
}
