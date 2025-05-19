import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Delivery, Calendar } from "solar-icon-set";
import DatePicker from "@/components/DatePicker";
import { useCheckoutStore } from "@/store/checkoutStore";

type Option = {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: React.ElementType;
};

const options: Option[] = [
  { id: "basic", title: "Básica", description: "7-15 días", price: 99.0, icon: Delivery },
  {
    id: "scheduled",
    title: "Programar",
    description: "Elige un horario",
    price: 110.0,
    icon: Calendar,
  },
];

type PickUpOptionProps = {
  onChange: (selectedOption: Option) => void;
};

export default function PickUpOptionsPicker({ onChange }: PickUpOptionProps) {
  const [selectedId, setSelectedId] = useState<string>("basic");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newScheduledDate, setNewScheduledDate] = useState<string | null>(null);
  const { setAddressInfoField } = useCheckoutStore();

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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    onChange(options.find((opt) => opt.id === "scheduled")!);
    setIsDialogOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setAddressInfoField("scheduledDate", newScheduledDate!);
    setNewScheduledDate(null);
  };

  return (
    <div className="mx-auto mt-4 w-full space-y-2">
      {options.map((option) => (
        <Button
          key={option.id}
          onClick={() => handleSelect(option)}
          variant="outline"
          className={cn(
            "flex h-auto w-full items-center justify-between p-4",
            selectedId === option.id ? "border-2 border-green-500" : "border hover:border-gray-300"
          )}>
          <div className="flex items-center space-x-4">
            <option.icon
              size={24}
              className={cn(selectedId === option.id ? "text-green-500" : "text-gray-500")}
            />
            <div className="text-left">
              <h3 className="font-semibold">{option.title}</h3>
              <p className="text-sm text-gray-500">{option.description}</p>
            </div>
          </div>
          <span className="font-semibold">+${option.price.toFixed(2)}</span>
        </Button>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Programar entrega</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <DatePicker
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
