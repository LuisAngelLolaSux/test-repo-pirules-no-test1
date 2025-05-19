"use client";
import React from "react";
import EditWithDialogContainer from "../../EditWithDialogContainer";
import DeliveryAddressDialog from "./AddressDialog";
import { MapPoint, Map, UserRounded, Card } from "solar-icon-set";
import DeliveryInstructionsDialog from "./DeliveryInstructionsDialog";
import { useCheckoutStore } from "@/store/checkoutStore";
import { getMexicanStateNameByValue } from "@/lib/utils";
import PersonalInfoDialog from "./PersonalInfoDialog";

interface DeliveryOptionsFormProps {
  primaryColor?: string | undefined;
}

const DeliveryOptionsForm = ({ primaryColor }: DeliveryOptionsFormProps) => {
  const { addressInfo, buyerInfo } = useCheckoutStore();
  const fieldOrder: (keyof typeof addressInfo)[] = [
    "street",
    "extNumber",
    "zip",
    "city",
    "state",
    "colony",
  ];
  const shouldAddCommaParams: (keyof typeof addressInfo)[] = ["city", "street"];

  const addressString =
    fieldOrder
      .map((field) => {
        const info = addressInfo[field];
        let value = info && info.valueOf().trim() !== "" ? info.valueOf().trim() : null;
        const shouldAddComma = shouldAddCommaParams.includes(field);

        if (field === "state" && value) {
          value = getMexicanStateNameByValue(value);
        }

        return value ? (shouldAddComma ? `${value},` : value) : null;
      })
      .filter((value) => value !== null)
      .join(" ") + ".";

  return (
    <div className="flex w-full flex-col">
      <EditWithDialogContainer
        DialogComponent={<DeliveryAddressDialog primaryColor={primaryColor} />}
        icon={<MapPoint size={32} />}
        label={addressInfo.street ? addressString : "Agregar dirección de envío"}
      />
      <EditWithDialogContainer
        DialogComponent={<PersonalInfoDialog primaryColor={primaryColor} />}
        icon={<UserRounded size={32} />}
        label={buyerInfo.name ? buyerInfo.name : "Información personal"}
      />
      <EditWithDialogContainer
        DialogComponent={<DeliveryInstructionsDialog primaryColor={primaryColor} />}
        icon={<Map size={32} />}
        label={addressInfo.additionalInfo ? addressInfo.additionalInfo : "Instrucciones de entrega"}
      />
    </div>
  );
};

export default DeliveryOptionsForm;
