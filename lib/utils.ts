import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { colord, extend } from "colord";
import mixPlugin from "colord/plugins/mix";
import harmoniesPlugin from "colord/plugins/harmonies";

extend([mixPlugin, harmoniesPlugin]);

export const ICON_LINKS: Record<string, string> = {
  shop: "/tienda",
  global: "/servicios-internacionales",
  "chat-round-dots": "/contacto",
  "chat-round-unread": "/mensajes",
  usb: "/hardware",
  link: "/integraciones",
  "magnet-wave": "/conectividad",
  delivery: "/envios",
};

export function generateColors(mainColor: string) {
  const color = colord(mainColor);
  const harmonies = color.harmonies("analogous");

  return {
    mainColor,
    secondaryColor: color.darken(0.1).toHex(),
    highlightColor: harmonies[2].toHex(),
    textColor: color.isDark() ? "#ffffff" : "#020617",
    bgColor: color.isDark() ? "#020617" : "#ffffff",
    secondaryBgColor: color.isDark() ? color.lighten(0.1).toHex() : color.darken(0.1).toHex(),
  };
}

export const mexicanStates = [
  {
    label: "Aguascalientes",
    value: "aguascalientes",
  },
  {
    label: "Baja California",
    value: "baja_california",
  },
  {
    label: "Baja California Sur",
    value: "baja_california_sur",
  },
  {
    label: "Campeche",
    value: "campeche",
  },
  {
    label: "Chiapas",
    value: "chiapas",
  },
  {
    label: "Chihuahua",
    value: "chihuahua",
  },
  {
    label: "Ciudad de México",
    value: "ciudad_de_mexico",
  },
  {
    label: "Coahuila",
    value: "coahuila",
  },
  {
    label: "Colima",
    value: "colima",
  },
  {
    label: "Durango",
    value: "durango",
  },
  {
    label: "Estado de México",
    value: "estado_de_mexico",
  },
  {
    label: "Guanajuato",
    value: "guanajuato",
  },
  {
    label: "Guerrero",
    value: "guerrero",
  },
  {
    label: "Hidalgo",
    value: "hidalgo",
  },
  {
    label: "Jalisco",
    value: "jalisco",
  },
  {
    label: "Michoacán",
    value: "michoacan",
  },
  {
    label: "Morelos",
    value: "morelos",
  },
  {
    label: "Nayarit",
    value: "nayarit",
  },
  {
    label: "Nuevo León",
    value: "nuevo_leon",
  },
  {
    label: "Oaxaca",
    value: "oaxaca",
  },
  {
    label: "Puebla",
    value: "puebla",
  },
  {
    label: "Querétaro",
    value: "queretaro",
  },
  {
    label: "Quintana Roo",
    value: "quintana_roo",
  },
  {
    label: "San Luis Potosí",
    value: "san_luis_potosi",
  },
  {
    label: "Sinaloa",
    value: "sinaloa",
  },
  {
    label: "Sonora",
    value: "sonora",
  },
  {
    label: "Tabasco",
    value: "tabasco",
  },
  {
    label: "Tamaulipas",
    value: "tamaulipas",
  },
  {
    label: "Tlaxcala",
    value: "tlaxcala",
  },
  {
    label: "Veracruz",
    value: "veracruz",
  },
  {
    label: "Yucatán",
    value: "yucatan",
  },
  {
    label: "Zacatecas",
    value: "zacatecas",
  },
];

export const getMexicanStateNameByValue = (value: string) => {
  return mexicanStates.find((state) => state.value === value)?.label || "";
};
export const getMexicanStateValueByName = (name: string): string => {
  return (
    mexicanStates.find((state) => state.label.toLowerCase() === name.toLowerCase())?.value || ""
  );
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default convertFileToBase64;

let stripeInstance = null;
if (typeof window === "undefined") {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable");
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  stripeInstance = require("stripe")(process.env.STRIPE_SECRET_KEY);
}
export const stripe = stripeInstance;
