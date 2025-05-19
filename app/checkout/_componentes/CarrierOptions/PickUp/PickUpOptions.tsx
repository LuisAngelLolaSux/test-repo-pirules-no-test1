import React from "react";
import { useCartStore } from "@/store/cartStore";
import PickUpOptions from "./PickUpOptionsPicker";

const PickUpOptionsForm = () => {
  const { setShippingOption } = useCartStore();
  return (
    <div className="flex flex-col items-center justify-center">
      <PickUpOptions
        onChange={(value) => {
          setShippingOption({
            days: "0",
            id: value.id,
            name: value.title,
            price: value.price,
          });
        }}
      />
    </div>
  );
};

export default PickUpOptionsForm;
