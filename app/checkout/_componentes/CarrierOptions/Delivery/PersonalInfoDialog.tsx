import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import React from "react";
import { EditButton } from "../../EditWithDialogContainer";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import InputWithLabel from "@/components/InputWithLabel";
import PhoneCountryPicker from "@/components/PhoneInput/PhoneInput";
import { useCheckoutStore } from "@/store/checkoutStore";

interface DialogProps {
  primaryColor?: string | undefined;
}

const PersonalInfoDialog = ({ primaryColor }: DialogProps) => {
  const { buyerInfo = { name: "", lastName: "", email: "", phone: "" }, setBuyerInfoField } =
    useCheckoutStore();

  const [newBuyerInfo, setNewBuyerInfo] = React.useState(buyerInfo);
  const [open, setOpen] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");
  const [typingTimer, setTypingTimer] = React.useState<NodeJS.Timeout | null>(null);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const updateCachedField = <K extends keyof typeof buyerInfo>(
    field: K,
    value: (typeof buyerInfo)[K]
  ) => {
    setNewBuyerInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  const handleUpdate = () => {
    setBuyerInfoField("name", newBuyerInfo.name);
    setBuyerInfoField("lastName", newBuyerInfo.lastName);
    setBuyerInfoField("email", newBuyerInfo.email);
    setBuyerInfoField("phone", newBuyerInfo.phone);

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <EditButton defaultValue={buyerInfo.name ? buyerInfo.name : undefined} />
      </DialogTrigger>
      <DialogContent className="space-y-2 px-[50px] pb-[25px] pt-[38px]">
        <DialogHeader className="mb-2">
          <DialogTitle>Información personal</DialogTitle>
        </DialogHeader>
        <InputWithLabel
          label="Nombre"
          defaultValue={buyerInfo.name}
          placeholder="Lola"
          primaryColor={primaryColor}
          onChange={(e) => {
            updateCachedField("name", e.target.value);
          }}
        />
        <InputWithLabel
          label="Apellidos"
          defaultValue={buyerInfo.lastName}
          placeholder="Sux"
          primaryColor={primaryColor}
          onChange={(e) => {
            updateCachedField("lastName", e.target.value);
          }}
        />
        <InputWithLabel
          label="Correo electrónico"
          defaultValue={buyerInfo.email}
          placeholder="correo@ejemplo.com"
          primaryColor={primaryColor}
          onChange={(e) => {
            updateCachedField("email", e.target.value);
            if (typingTimer) clearTimeout(typingTimer);
            setTypingTimer(
              setTimeout(() => {
                setEmailError(isValidEmail(e.target.value) ? "" : "Ingresa un correo válido");
              }, 500)
            );
          }}
        />
        {emailError && <p className="text-sm text-red-500">{emailError}</p>}
        <PhoneCountryPicker
          primaryColor={primaryColor}
          onPhoneChange={(phone) => updateCachedField("phone", phone)}
        />
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

export default PersonalInfoDialog;
