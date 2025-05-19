import React from "react";
import EditWithDialogContainer from "../../EditWithDialogContainer";
import DeliveryAddressDialog from "./AddressDialog";
import { MapPoint, Map, UserRounded } from "solar-icon-set";
import DeliveryInstructionsDialog from "./DeliveryInstructionsDialog";
import PersonalInfoDialog from "./PersonalInfoDialog";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useCartStore } from "@/store/cartStore";
import DeliveryOptions from "./DeliveryOptionsPicker";
import DevlieryOptionsManual from "./DeliveryOptionsManual";
import { getConfigEnvioCheckout } from "@/utils/EnviosManuales/server";
import { getMexicanStateNameByValue } from "@/lib/utils";

const DeliveryOptionsForm = ({
  primaryColor,
  buyerInfo = { name: "", lastName: "", email: "", phone: "" },
}: {
  primaryColor?: string;
  buyerInfo?: any;
}) => {
  const { addressInfo: safeAddressInfo = {} } = useCheckoutStore();
  const { cartItems: ShoppingCartState, setShippingOption } = useCartStore();

  const [isManual, setIsManual] = React.useState(false);

  React.useEffect(() => {
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

  const fieldOrder: (keyof typeof safeAddressInfo)[] = [
    "street",
    "extNumber",
    "zip",
    "city",
    "state",
    "colony",
  ];
  const shouldAddCommaParams: (keyof typeof safeAddressInfo)[] = ["city", "street"];

  const addressString =
    fieldOrder
      .map((field) => {
        const info = safeAddressInfo[field];
        let value = info && info.trim() !== "" ? info.trim() : null;
        const shouldAddComma = shouldAddCommaParams.includes(field);
        if (field === "state" && value) {
          const newValue = getMexicanStateNameByValue(value);
          if (newValue) {
            value = newValue;
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
        label={safeAddressInfo.street ? addressString : "Agregar dirección de envío"}
      />
      <EditWithDialogContainer
        DialogComponent={<PersonalInfoDialog primaryColor={primaryColor} />}
        icon={<UserRounded size={32} />}
        label={"Información personal"}
      />
      <EditWithDialogContainer
        DialogComponent={<DeliveryInstructionsDialog primaryColor={primaryColor} />}
        icon={<Map size={32} />}
        label={
          safeAddressInfo.additionalInfo
            ? safeAddressInfo.additionalInfo
            : "Instrucciones de entrega"
        }
      />
      <h1 className="mt-4 text-lg font-bold leading-snug text-black">Opciones de entrega</h1>
      {isManual ? (
        <DevlieryOptionsManual
          address={safeAddressInfo}
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
        <DeliveryOptions
          address={safeAddressInfo}
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
