import React from "react";
import { useCheckoutStore } from "@/store/checkoutStore";

export function PersonalInfoDialog(/* props */) {
  const { buyerInfo, setBuyerInfo } = useCheckoutStore();

  // Replace old update method
  const handleUpdate = (field: string, value: string) => {
    setBuyerInfo({ ...buyerInfo, [field]: value });
  };

  return (
    <div>
      {/* Example input field */}
      <label>
        Name:
        <input
          type="text"
          value={buyerInfo.name || ""}
          onChange={(e) => handleUpdate("name", e.target.value)}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={buyerInfo.email || ""}
          onChange={(e) => handleUpdate("email", e.target.value)}
        />
      </label>
      {/* Add more fields as needed */}
    </div>
  );
}
