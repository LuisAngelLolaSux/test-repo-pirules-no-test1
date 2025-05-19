"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import React from "react";

import TextareaWithLabel from "@/components/TextAreaWithLabel";
import { useCheckoutStore } from "@/store/checkoutStore";
import { Button } from "@/components/ui/button";
import { EditButton } from "../../EditWithDialogContainer";

interface DialogProps {
  primaryColor?: string | undefined;
}

const DeliveryInstructionsDialog = ({ primaryColor }: DialogProps) => {
  const { addressInfo, setAddressInfoField } = useCheckoutStore();

  const [newAdditionalAddressInfo, setNewAdditionalAddressInfo] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const handleUpdate = () => {
    setAddressInfoField("additionalInfo", newAdditionalAddressInfo);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <EditButton defaultValue={addressInfo.additionalInfo || undefined} />
      </DialogTrigger>
      <DialogContent className="space-y-5 px-[50px] pb-[25px] pt-[38px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold leading-snug text-black">
            Instrucciones de entrega
          </DialogTitle>
        </DialogHeader>
        <div>
          <TextareaWithLabel
            label="Nota para el transportista"
            labelClassName="text-base font-normal leading-tight text-black"
            placeholder="Ej. Tocar el timbre 8"
            className="h-24"
            primaryColor={primaryColor}
            onChange={(e) => {
              setNewAdditionalAddressInfo(e.target.value);
            }}
          />
        </div>
        <DialogFooter className="justfy-end flex flex-col items-center space-x-2">
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
            Actualizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryInstructionsDialog;
