import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number; // new: added price field
  variante?: string; // new: added variante field
  variantesCombinadas?: Array<{
    variante: string;
    subVariante: string;
    precio: number;
    peso: number;
    imagenes: any[];
    inventario: number;
    sku: string | null;
    _id: any; // You can use `string` if you serialize ObjectId to string, or keep `any` if it's a raw ObjectId
  }>;
}

interface CartState {
  cartItems: CartItem[];
  shippingOption: string | null;
  botId: string | null;
  carritoId: string | null;
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  setShippingOption: (option: string | null) => void;
  resetCartContext: () => void;
  getTotals: () => { total: number };
}

export const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      cartItems: [
        {
          id: "demo1",
          name: "Demo Product A",
          image: "/demoA.jpg",
          quantity: 2,
          price: 100, // new: demo price
        },
        {
          id: "demo2",
          name: "Demo Product B",
          image: "/demoB.jpg",
          quantity: 1,
          price: 150, // new: demo price
        },
      ],
      shippingOption: null,
      botId: null,
      carritoId: null,
      addToCart: (item: CartItem) => {
        const existing = get().cartItems.find((ci) => ci.id === item.id);
        if (existing) {
          set({
            cartItems: get().cartItems.map((ci) =>
              ci.id === item.id ? { ...ci, quantity: ci.quantity + item.quantity } : ci
            ),
          });
        } else {
          set({ cartItems: [...get().cartItems, item] });
        }
      },
      updateQuantity: (id: string, quantity: number) => {
        set({
          cartItems: get().cartItems.map((ci) => (ci.id === id ? { ...ci, quantity } : ci)),
        });
      },
      removeFromCart: (id: string) => {
        set({
          cartItems: get().cartItems.filter((ci) => ci.id !== id),
        });
      },
      setShippingOption: (option) => set({ shippingOption: option }),
      resetCartContext: () =>
        set({
          cartItems: [],
          shippingOption: null,
          botId: null,
          carritoId: null,
        }),
      getTotals: () => {
        const total = get().cartItems.reduce(
          (acc, item) => acc + item.quantity * item.price, // changed: now uses item's price
          0
        );
        return { total };
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
