import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import React from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useCheckoutStore } from "@/store/checkoutStore";
import { Combobox } from "@/components/ComboBox";
import { Button } from "@/components/ui/button";
import InputWithLabel from "@/components/InputWithLabel";
import { mexicanStates } from "@/lib/utils";
import { EditButton } from "../../EditWithDialogContainer";

interface DeliveryAddressDialogProps {
  primaryColor?: string | undefined;
}

const DeliveryAddressDialog = ({ primaryColor }: DeliveryAddressDialogProps) => {
  const { addressInfo, setAddressInfoField } = useCheckoutStore();

  const [newAddressInfo, setNewAddressInfo] = React.useState(addressInfo);
  const [open, setOpen] = React.useState(false);

  const updateCachedAddressField = <K extends keyof typeof addressInfo>(
    field: K,
    value: (typeof addressInfo)[K]
  ) => {
    setNewAddressInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  const handleUpdate = () => {
    setAddressInfoField("street", newAddressInfo.street);
    setAddressInfoField("city", newAddressInfo.city);
    setAddressInfoField("state", newAddressInfo.state);
    setAddressInfoField("zip", newAddressInfo.zip);
    setAddressInfoField("extNumber", newAddressInfo.extNumber);
    setAddressInfoField("intNumber", newAddressInfo.intNumber);
    setAddressInfoField("colony", newAddressInfo.colony);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <EditButton defaultValue={addressInfo.street ? addressInfo.street : undefined} />
      </DialogTrigger>
      <DialogContent className="space-y-2 px-[50px] pb-[25px] pt-[38px]">
        <DialogHeader className="mb-2">
          <DialogTitle>Agregar dirección de envío</DialogTitle>
        </DialogHeader>
        <InputWithLabel
          label="Calle"
          defaultValue={addressInfo.street}
          placeholder="Ej. San Junipero"
          primaryColor={primaryColor}
          onChange={(e) => {
            updateCachedAddressField("street", e.target.value);
          }}
        />

        <div className="flex items-center gap-4">
          <InputWithLabel
            label="Número exterior"
            placeholder="Ej. 2828"
            defaultValue={addressInfo.extNumber}
            primaryColor={primaryColor}
            onChange={(e) => {
              updateCachedAddressField("extNumber", e.target.value);
            }}
          />
          <InputWithLabel
            placeholder="Ej. 10"
            label="Número interior"
            defaultValue={addressInfo.intNumber}
            primaryColor={primaryColor}
            onChange={(e) => {
              updateCachedAddressField("intNumber", e.target.value);
            }}
          />
        </div>
        <div className="flex items-center gap-4">
          <Combobox
            initialVal={addressInfo.state}
            label="Estado"
            contentClassName="w-[400px] h-[150px]"
            placeholder="Selecciona el estado"
            className="w-full"
            options={mexicanStates}
            onChange={(value) => {
              updateCachedAddressField("state", value);
            }}
          />
          <InputWithLabel
            placeholder="Ej. Lomas Altas"
            label="Colonia"
            defaultValue={addressInfo.colony}
            primaryColor={primaryColor}
            onChange={(e) => {
              updateCachedAddressField("colony", e.target.value);
            }}
          />
        </div>
        <div className="flex items-center gap-4">
          <InputWithLabel
            label="Codigo Postal"
            defaultValue={addressInfo.zip}
            placeholder="Ej. 12345"
            primaryColor={primaryColor}
            onChange={(e) => {
              updateCachedAddressField("zip", e.target.value);
            }}
          />
          <InputWithLabel
            label="Ciudad"
            defaultValue={addressInfo.city}
            placeholder="Ej. Babilonia"
            primaryColor={primaryColor}
            onChange={(e) => {
              updateCachedAddressField("city", e.target.value);
            }}
          />
        </div>
        <DialogFooter className="justfy-end flex flex-col items-center space-x-2 pt-2">
          <DialogPrimitive.Close>
            <Button variant={"lolaSecondary"} size={"lola"}>
              Volver
            </Button>
          </DialogPrimitive.Close>
          <Button
            style={{
              backgroundColor: primaryColor || "#34c85a",
            }}
            className="transition-all duration-300 hover:scale-105"
            variant={"lola"}
            size={"lola"}
            onClick={handleUpdate}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryAddressDialog;
