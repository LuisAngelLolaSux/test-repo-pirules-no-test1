"use client";
import React, { useState, useEffect } from "react";
import EditWithDialogContainer from "../../EditWithDialogContainer";
import DeliveryAddressDialog from "./AddressDialog";
import { MapPoint, Map, UserRounded, Card } from "solar-icon-set";
import DeliveryInstructionsDialog from "./DeliveryInstructionsDialog";
import PersonalInfoDialog from "./PersonalInfoDialog";
import DeliveryOptionsPicker from "./DeliveryOptionsPicker";
import DevlieryOptionsManual from "./DeliveryOptionsManual";
import { getConfigEnvioCheckout } from "@/utils/EnviosManuales/server";
import { getMexicanStateNameByValue } from "@/lib/utils";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useCartStore } from "@/store/cartStore";

interface DeliveryOptionsFormProps {
  primaryColor?: string | undefined;
}

const DeliveryOptionsForm = ({ primaryColor }: DeliveryOptionsFormProps) => {
  const { addressInfo = {}, buyerInfo: safeBuyerInfo = {} } = useCheckoutStore();
  const { cartItems: ShoppingCartState, setShippingOption } = useCartStore();
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configStr = await getConfigEnvioCheckout(ShoppingCartState ?? []);
        const config = configStr ? JSON.parse(configStr) : null;
        if (config?.tipoDeEnvio === "Manual") setIsManual(true);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConfig();
  }, [ShoppingCartState]);

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

        // aqui se cambia de value con formato del form a el formato de la DB usando una helper function, esta funcion asume que se esta haciendo checkout para mexico
        // cuando se añada una opcion para selccionar el pais se debe de cambiar la logica para que se use el pais seleccionado
        if (field === "state" && value) {
          const newValue = getMexicanStateNameByValue(value);
          if (newValue) {
            value = newValue;
            addressInfo.state = value; // Update the addressInfo state with the new value
          }
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
        label={safeBuyerInfo.name ? safeBuyerInfo.name : "Información personal"}
      />
      <EditWithDialogContainer
        DialogComponent={<DeliveryInstructionsDialog primaryColor={primaryColor} />}
        icon={<Map size={32} />}
        label={addressInfo.additionalInfo ? addressInfo.additionalInfo : "Instrucciones de entrega"}
      />

      <h1 className="mt-4 text-lg font-bold leading-snug text-black">Opciones de entrega</h1>
      {isManual ? (
        <DevlieryOptionsManual
          address={addressInfo}
          primaryColor={primaryColor}
          onChange={(value) => {
            if (value?.id && value?.days && value?.title && value?.price) {
              setShippingOption({
                id: value.id,
                days: value.days,
                name: value.title,
                price: value.price,
              });
            } else {
              setShippingOption(null);
            }
          }}
        />
      ) : (
        <DeliveryOptionsPicker
          address={addressInfo}
          primaryColor={primaryColor}
          onChange={(value) => {
            if (value?.id && value?.days && value?.title && value?.price) {
              setShippingOption({
                id: value.id,
                days: value.days,
                name: value.title,
                price: value.price,
              });
            } else {
              setShippingOption(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default DeliveryOptionsForm;
