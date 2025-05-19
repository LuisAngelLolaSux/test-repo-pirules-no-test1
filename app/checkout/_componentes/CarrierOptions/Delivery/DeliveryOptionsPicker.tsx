import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TruckIcon, CircleX } from "lucide-react";
import DatePicker from "@/components/DatePicker";
import { getOpcionesDeEntregaAmPm } from "@/utils/AmPm/server";
import { porcentajeDeComisionParaEnvios } from "@/lib/precios";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useCartStore } from "@/store/cartStore";

type Option = {
  id: string;
  title: string;
  description: string;
  days: string;
  price: number;
  icon?: React.ElementType;
};

type DeliveryOptionsProps = {
  onChange: (selectedOption: Option | null) => void;
};

export default function DeliveryOptionsPicker({ onChange }: DeliveryOptionsProps) {
  const { cartItems: ShoppingCartState } = useCartStore();
  const { addressInfo, setAddressInfoField } = useCheckoutStore();

  const [selectedId, setSelectedId] = useState<string>("basic");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorLoading, setErrorLoading] = useState(false);
  const [options, setOptions] = useState<Option[] | null>(null);
  const [newScheduledDate, setNewScheduledDate] = useState<string | null>(null);

  useEffect(() => {
    const getOpciones = async () => {
      setSelectedId("basic");
      setOptions(null);
      onChange(null);
      if (ShoppingCartState && ShoppingCartState.length > 0 && addressInfo?.zip) {
        setLoading(true);
        setErrorLoading(false);
        try {
          const res = await getOpcionesDeEntregaAmPm(ShoppingCartState, addressInfo.zip);
          const optionsAmPm = res.map((option: any) => {
            return {
              id: option.tipoServicioId.toString(),
              title: option.tipoServicio,
              description: `aprox. ${option.diasCompromiso + 2} días`,
              days: option.diasCompromiso,
              price: option.total + option.total * (porcentajeDeComisionParaEnvios / 100),
            };
          });
          setOptions(optionsAmPm);
        } catch (error) {
          setErrorLoading(true);
        }
        setLoading(false);
      }
    };
    getOpciones();
  }, [ShoppingCartState, addressInfo]);

  const handleSelect = (option: Option) => {
    if (option.id === "scheduled") {
      setIsDialogOpen(true);
    } else {
      setSelectedId(option.id);
      onChange(option);
    }
  };

  const handleSchedule = () => {
    setSelectedId("scheduled");
    onChange(options?.find((opt) => opt.id === "scheduled")!);
    setIsDialogOpen(false);
    setAddressInfoField("scheduledDate", newScheduledDate!);
    setNewScheduledDate(null);
  };

  return errorLoading ? (
    <div className="flex h-40 flex-col items-center justify-center p-4 text-gray-500">
      <CircleX className="h-8 w-8 text-gray-400" />
      Codigo Postal invalido o no disponible
    </div>
  ) : loading ? (
    <div className="mx-auto mt-4 w-full space-y-2">
      <div
        className={cn(
          "flex h-auto w-full animate-pulse items-center justify-between border p-4 hover:border-gray-300"
        )}>
        <div className="flex items-center space-x-4">
          <div className="h-5 w-5 rounded-full bg-gray-200"></div>
          <div className="space-y-2 text-left">
            <div className="h-4 w-32 rounded bg-gray-200"></div>
            <div className="h-3 w-48 rounded bg-gray-200"></div>
          </div>
        </div>
        <div className="h-4 w-16 rounded bg-gray-200"></div>
      </div>
      <div
        className={cn(
          "flex h-auto w-full animate-pulse items-center justify-between border p-4 hover:border-gray-300"
        )}>
        <div className="flex items-center space-x-4">
          <div className="h-5 w-5 rounded-full bg-gray-200"></div>
          <div className="space-y-2 text-left">
            <div className="h-4 w-32 rounded bg-gray-200"></div>
            <div className="h-3 w-48 rounded bg-gray-200"></div>
          </div>
        </div>
        <div className="h-4 w-16 rounded bg-gray-200"></div>
      </div>
    </div>
  ) : (
    <div className="mx-auto mt-4 w-full space-y-2">
      {options ? (
        <div className="max-h-40 w-full space-y-2 overflow-y-auto">
          {options.map((option) => (
            <Button
              key={option.id}
              onClick={() => handleSelect(option)}
              variant="outline"
              className={cn(
                "flex h-auto w-full items-center justify-between p-4",
                selectedId === option.id ? "border-2" : "border hover:border-gray-300"
              )}>
              <div className="flex items-center space-x-4">
                <div className="text-left">
                  <h3 className="font-semibold">{option.title}</h3>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              </div>
              <span className="font-semibold">+${option.price.toFixed(2)}</span>
            </Button>
          ))}
        </div>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center p-4 text-gray-500">
          <TruckIcon className="h-8 w-8 text-gray-400" />
          Agregar un codigo postal en direccion de envio para poder ver las opciones
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Programar entrega</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <DatePicker
              daysAhead={5}
              onDateSelect={(date) => setNewScheduledDate(date.toISOString().split("T")[0])}
            />
          </div>
          <Button
            onClick={newScheduledDate ? handleSchedule : () => setIsDialogOpen(false)}
            variant={newScheduledDate ? "lola" : "lolaSecondary"}
            size={"lola"}>
            {newScheduledDate ? "Confirmar horario" : "Cancelar"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
