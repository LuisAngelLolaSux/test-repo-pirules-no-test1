import React from "react";
import { useCheckoutStore } from "@/store/checkoutStore";

export default function DeliveryOptionsForm({ buyerInfo }) {
  const { setBuyerInfo, buyerInfo: storedBuyerInfo } = useCheckoutStore();

  const handleChange = (field: string, value: string) => {
    setBuyerInfo({ ...storedBuyerInfo, [field]: value });
  };

  return <div>{/* Add your input fields here and use handleChange for updates */}</div>;
}
