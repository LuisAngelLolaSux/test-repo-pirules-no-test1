"use client";
import React from "react";
import { useCartStore } from "../../store/cartStore";

export default function CheckoutPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCartStore();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
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
        ))
      )}
    </div>
  );
}
