import { create } from "zustand";

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface AddressInfo {
  street: string;
  city: string;
  state: string;
  zip: string;
  extNumber: string;
  intNumber: string;
  colony: string;
  additionalInfo: string;
}

interface BuyerInfo {
  name: string;
  lastName: string;
  email: string;
  phone: string;
}

interface CheckoutState {
  items: CheckoutItem[];
  shippingInfo: string;
  orderSummary: string;
  addressInfo: AddressInfo;
  buyerInfo: BuyerInfo;
  cardInfo: any;
  addItem: (item: CheckoutItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setShippingInfo: (info: string) => void;
  setOrderSummary: (summary: string) => void;
  setAddressInfoField: <K extends keyof AddressInfo>(field: K, value: AddressInfo[K]) => void;
  setBuyerInfo: (info: BuyerInfo) => void;
  setCardInfo: (info: any) => void;
  setBuyerInfoField: <K extends keyof BuyerInfo>(field: K, value: BuyerInfo[K]) => void;
  setCardInfoField: (field: string, value: any) => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  items: [],
  shippingInfo: "",
  orderSummary: "",
  addressInfo: {
    street: "",
    city: "",
    state: "",
    zip: "",
    extNumber: "",
    intNumber: "",
    colony: "",
    additionalInfo: "",
  },
  buyerInfo: {
    name: "",
    lastName: "",
    email: "",
    phone: "",
  },
  cardInfo: null,
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clearCart: () => set({ items: [] }),
  setShippingInfo: (info) => set({ shippingInfo: info }),
  setOrderSummary: (summary) => set({ orderSummary: summary }),
  setAddressInfoField: (field, value) => {
    set((state) => ({
      addressInfo: {
        ...state.addressInfo,
        [field]: value,
      },
    }));
  },
  setBuyerInfo: (info) => set({ buyerInfo: info }),
  setCardInfo: (info) => set({ cardInfo: info }),
  setBuyerInfoField: (field, value) =>
    set((state) => ({
      buyerInfo: {
        ...state.buyerInfo,
        [field]: value,
      },
    })),
  setCardInfoField: (field, value) =>
    set((state) => ({
      cardInfo: {
        ...state.cardInfo,
        [field]: value,
      },
    })),
}));

export default useCheckoutStore;
