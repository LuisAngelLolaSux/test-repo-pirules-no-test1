"use server";

import CarritoWhatsapp from "@/models/agentes-whatsapp/CarritoWhatsapp";
import { connectToDB } from "@/utils/mongoDB";
import { ProductResponse } from "../ShoppingCartContext";
import Producto from "@/models/productos/Productos";
import BotConfig from "@/models/agentes-whatsapp/BotConfig";
import ConfiguracionEnvio from "@/models/configuraciones/ConfiguracionesEnvio";
import Almacen from "@/models/almacenesEnvios/Almacen";
import User from "@/models/auth/User";
import ConfiguracionUsuario from "@/models/configuraciones/ConfiguracioneUsuario";
import { stripe } from "@/lib/utils";
import { ProductoCarritoType } from "@/typings/types";

export const getProductsForCart = async (id: string) => {
  await connectToDB();
  const carrito = await CarritoWhatsapp.findById(id);
  if (!carrito || !carrito.carrito) {
    return JSON.stringify([]);
  }
  const filteredProducts = [];

  for (const item of carrito.carrito) {
    const producto = await Producto.findById(item.productoId);

    if (!producto || producto.eliminado === true || producto.estado === false) {
      continue; // Producto no existe o está inactivo
    }

    if (item.variante) {
      const varianteExiste = producto.variantesCombinadas.some(
        (variante) => variante.variante === item.variante
      );

      if (!varianteExiste) {
        continue; // Variante no existe
      }
    }

    filteredProducts.push({
      productoId: item.productoId,
      cantidad: item.cantidad,
      variante: item.variante,
    });
  }

  return JSON.stringify(filteredProducts);
};

export const getRedirectLinkCarrito = async (carritoId: string | null) => {
  await connectToDB();
  const carrito = await CarritoWhatsapp.findById(carritoId);
  const botId = carrito?.botId;
  if (!botId) {
    return "/carrito-error";
  }
  const bot = await BotConfig.findById(botId);
  if (!bot || bot.eliminado) {
    return "/carrito-error";
  }
  const userId = bot.userId;
  // checar que tenga almacen
  const almacen = await Almacen.findOne({ userId });

  // checar que tenga metodos de envio (manual o automatico)
  const config = await ConfiguracionEnvio.findOne({ userId });

  // checar que tenga stripe connect activo
  const user = await User.findById(userId);
  if (!user) {
    return "/carrito-error";
  }
  // Verificar que haya acabado stripe connect steps
  let onboardingComplete = false;
  if (user.stripeAccountId) {
    const account = await stripe.accounts.retrieve(user.stripeAccountId);
    onboardingComplete = account.requirements.currently_due.length === 0;
  }

  // Realizar Validacion del almacen y su horario
  const isValidAlmacen =
    almacen &&
    almacen.estadoActivo && // Almacén debe estar activo
    almacen.direccion && // Dirección debe estar presente
    almacen.direccion.calle &&
    almacen.direccion.colonia &&
    almacen.direccion.numeroExt &&
    almacen.direccion.codigoPostal &&
    almacen.direccion.pais &&
    almacen.direccion.estado &&
    almacen.direccion.ciudad &&
    (() => {
      // Verificar que tenga al menos un día con horario configurado
      const { horario } = almacen;
      const daysWithHorario = [
        horario.lunes,
        horario.martes,
        horario.miercoles,
        horario.jueves,
        horario.viernes,
        horario.sabado,
        horario.domingo,
      ];
      return daysWithHorario.some((day) => day && day.inicio && day.fin);
    })();
  // Checar para envios manuales
  if (
    config?.ofreceEnvios &&
    config.tipoDeEnvio === "Manual" &&
    bot.crearLinks &&
    onboardingComplete
    // && Checar que haya opciones en envios manuales
  ) {
    return "/checkout";
  }
  // Checar para envios automaticos
  if (
    isValidAlmacen &&
    config?.ofreceEnvios &&
    config.tipoDeEnvio === "Automatico" &&
    bot.crearLinks &&
    onboardingComplete
  ) {
    return "/checkout";
  }
  // Checar para ordenes
  if (bot.crearOrdenes) {
    return "/crear-orden";
  }
  return "/carrito-error";
};

export const fetchExchangeRate = async (): Promise<{ mid: number } | null> => {
  try {
    const response = await fetch(`https://hexarate.paikama.co/api/rates/latest/USD?target=MXN`);
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }
    const res = await response.json();
    return { mid: res.data.mid + 0.1 };
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
};

export const getEstimadoPesos = async (costoDolares: number) => {
  try {
    //aqui se hace la peticion al ai que nos regresa el tipo de cambio provisional/estimado
    const response = await fetch(`https://hexarate.paikama.co/api/rates/latest/USD?target=MXN`);
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }
    const res = await response.json();
    const estimadoPesos = res.data.mid * costoDolares;
    return estimadoPesos;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
};

export const getCompanyDetails = async (carritoId: string) => {
  try {
    await connectToDB();
    const carrito = await CarritoWhatsapp.findById(carritoId);
    if (!carrito || !carrito.botId) {
      throw new Error("Carrito no encontrado");
    }
    const bot = await BotConfig.findById(carrito.botId).select("userId");
    if (!bot) {
      throw new Error("Usuario no encontrado");
    }
    const companyDetails = await ConfiguracionUsuario.findOne({ userId: bot.userId });
    if (!bot) {
      throw new Error("Usuario no encontrado");
    }
    return JSON.stringify({
      colorPrimario: companyDetails?.infoEmpresa?.colorEmpresa?.principal || "#34C85A]",
      logo: companyDetails?.infoEmpresa?.imagenUrl || "/LolaSuxTextWhite.svg",
      nombre: companyDetails?.infoEmpresa?.nombreEmpresa || undefined,
    });
  } catch (error) {
    console.error("Error getCompanyDetails:", error);
    return JSON.stringify(null);
  }
};

export const getBotIdFromCarritoId = async (carritoId: string): Promise<string | null> => {
  await connectToDB();
  const carrito = await CarritoWhatsapp.findById(carritoId);
  return carrito ? carrito.botId || null : null;
};

export const getBotProfilePhoto = async (botId: string): Promise<string | null> => {
  await connectToDB();
  const bot = await BotConfig.findById(botId).select("profilePhoto");
  return bot?.profilePhoto || null;
};

// funcion para borrar el carrito del DB cuando se cree la orden
export const deleteCarritoFromDB = async (carritoId: string): Promise<boolean> => {
  await connectToDB();
  const carrito = await CarritoWhatsapp.findById(carritoId);
  if (!carrito) {
    return false;
  }
  if (carrito.carrito) {
    // Aseguramos que la propiedad carrito existe
    carrito.carrito = [];
    await carrito.save(); // Guardamos los cambios en la base de datos
  }
  return true;
};

export const updateWhatsappCart = async (
  carritoId: string | null,
  carrito: ProductoCarritoType[] | null
): Promise<boolean> => {
  if (!carritoId || !carrito) {
    return false;
  }
  await connectToDB();
  const result = await CarritoWhatsapp.findByIdAndUpdate(carritoId, { carrito });
  return !!result; // returns true if updates, false otherwise
};

export const getBotNumero = async (botId: string): Promise<string | null> => {
  await connectToDB();
  const bot = await BotConfig.findById(botId).select("numero");
  return bot?.numero || null;
};

export const getEmpresaEmail = async (botId: string): Promise<string | null> => {
  await connectToDB();
  const bot = await BotConfig.findById(botId);
  if (!bot || !bot.userId) return null;

  const userId = bot.userId;
  const configUsuario = await ConfiguracionUsuario.findOne({ userId });
  if (configUsuario) {
    const primaryEmail = configUsuario.infoEmpresa?.emailEmpresa;
    if (primaryEmail && primaryEmail.trim() !== "") return primaryEmail;

    const secondaryEmail = configUsuario.emailSecundario;
    if (secondaryEmail && secondaryEmail.trim() !== "") return secondaryEmail;
  }

  const user = await User.findById(userId);
  return user?.email || null;
};
