"use server";

import UbicacionEnvio from "@/models/almacenesEnvios/UbicacionEnvio";
import Producto from "@/models/productos/Productos";
import TipoEnvio from "@/models/almacenesEnvios/TipoEnvio";
import ConfiguracionesEnvio from "@/models/configuraciones/ConfiguracionesEnvio";
import { connectToDB } from "../mongoDB";
import Cliente from "@/models/clientes/Cliente";

// Define a local type:
interface ShoppingCartItem {
  productoId: string;
  cantidad: number;
  variante: string;
}

/**
 * Recupera las opciones de envío disponibles basadas en el estado, país y artículos del carrito de compras proporcionados.
 *
 * @param {string} estado - El estado donde se están consultando las opciones de envío.
 * @param {string} pais - El país donde se están consultando las opciones de envío.
 * @param {ShoppingCartItem[]} shoppingCart - Los artículos del carrito de compras para los cuales se necesitan opciones de envío.
 * @returns {Promise<Array<{ id: string, title: string, description: string, days: number, price: number }> | null>}
 *          Una promesa que se resuelve en un array de opciones de envío disponibles o null si ocurre un error.
 */
export async function getAvailableShippingOptions(
  estado: string,
  pais: string,
  shoppingCart: ShoppingCartItem[]
) {
  try {
    await connectToDB();
    const ids = shoppingCart.map((item) => item.productoId);

    const productos = await Producto.find({ _id: { $in: ids } });

    if (!productos || productos.length === 0) {
      throw new Error("No se encontraron productos para los IDs proporcionados");
    }

    const userId = productos[0].userId;
    const ubicacion = await UbicacionEnvio.findOne({
      userId: userId,
      estados: estado,
    });

    if (ubicacion && ubicacion.tiposEnvio) {
      ubicacion.tiposEnvio = await TipoEnvio.find({
        _id: { $in: ubicacion.tiposEnvio },
      });
    }
    if (!ubicacion) {
      return [];
    }

    const shippingOptions = ubicacion.tiposEnvio.map((tipo: any) => ({
      id: tipo._id.toString(),
      title: tipo.nombreEnvio || "",
      description: `aprox. ${tipo.diasEstimadosEntrega || "0"}`,
      days: tipo.diasEstimadosEntrega || "0",
      price: parseFloat(tipo.precioEnvio || "0"),
    }));

    return shippingOptions;
  } catch (error) {
    console.error("[GET_AVAILABLE_SHIPPING_OPTIONS] Error:", error);
    return null;
  }
}

/**
 * Obtiene la configuración de envío para el proceso de checkout basado en los productos del carrito de compras.
 *
 * @param {ShoppingCartItem[]} shoppingCart - Array de objetos que representan los ítems en el carrito de compras.
 * @returns {Promise<string | null>} - Una promesa que resuelve a la configuración de envío en formato JSON si se encuentra, o null si no se encuentra.
 * @throws {Error} - Lanza un error si no se encuentran productos para los IDs proporcionados.
 */
export async function getConfigEnvioCheckout() {
  try {
    await connectToDB();
    const userId = process.env.LOLA_USER_ID;

    const config = await ConfiguracionesEnvio.findOne({ userId });

    if (config) {
      return JSON.stringify(config);
    }

    return null;
  } catch (error) {
    console.error("[GET_CONFIG_ENVIO] Error:", error);
    return null;
  }
}

// New function to store the Cliente document from checkout data
export async function storeClienteFromCheckout(
  clientInfo: {
    apellidos: string;
    nombre: string;
    correo: string;
    telefono?: string;
    direcciones: Array<{
      calle: string;
      ciudad: string;
      estado: string;
      codigoPostal: string;
      numeroExterior: string;
      numeroInterior?: string;
      datosAdicionales?: string;
    }>;
  },
  shoppingCart: ShoppingCartItem[]
) {
  try {
    await connectToDB();
    const ids = shoppingCart.map((item) => item.productoId);
    const productos = await Producto.find({ _id: { $in: ids } });
    if (!productos || productos.length === 0) {
      throw new Error("No se encontraron productos para los IDs proporcionados");
    }
    // Obtener el userId del vendedor del primer producto
    const sellerUserId = productos[0].userId;
    // Crear el documento Cliente
    const nuevoCliente = new Cliente({
      apellidos: clientInfo.apellidos,
      nombre: clientInfo.nombre,
      correo: clientInfo.correo,
      telefono: clientInfo.telefono || null,
      direcciones: clientInfo.direcciones,
      tipo: "Checkout Lola",
      // ...other fields use defaults...
      userId: sellerUserId,
    });
    await nuevoCliente.save();
    return nuevoCliente;
  } catch (error) {
    console.error("[STORE_CLIENTE] Error:", error);
    throw error;
  }
}

export const fetchExchangeRate = async (baseCurrency: string, targetCurrency: string) => {
  try {
    //aqui se hace la peticion al ai que nos regresa el tipo de cambio provisional/estimado
    const response = await fetch(
      `https://hexarate.paikama.co/api/rates/latest/${baseCurrency}?target=${targetCurrency}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }
    const res = await response.json();
    return res.data.mid + 0.1;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
};
