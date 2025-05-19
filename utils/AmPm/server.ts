"use server";

import Almacen from "@/models/almacenesEnvios/Almacen";
import Producto from "@/models/Productos";
import { connectToDB } from "../mongoDB";
import Pedido from "@/models/Pedidos/Pedido";
import { HorarioType } from "@/typings/types";
import { currentUser } from "@/lib/auth";

// Tipo para el resultado de la función
type HorarioDisponible = {
  principio: string; // Fecha y hora de inicio en formato ISO 8601
  fin: string; // Fecha y hora de fin en formato ISO 8601
  texto: string; // Texto descriptivo del horario
  dias: number; // Número de días que faltan para el horario disponible
};

const globalUsername = process.env.AmPmUsername || "GENERAL";
const globalPassword = process.env.AmPmPassword || "G3NER4l061118%";
const globalCuenta = process.env.AmPmAccountNumber;
const apiUrlStart = process.env.AmPmUrl || "https://qaptpak.grupoampm.com";

export async function obtenerSiguienteHorarioDisponible(
  horario: HorarioType | undefined
): Promise<HorarioDisponible | null> {
  if (!horario) {
    throw new Error("No hay horario definido");
  }

  const diasSemana = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];

  const ahora = new Date();
  let diaActual = ahora.getDay(); // 0 = Domingo, 1 = Lunes, ...
  const fechaActual = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());

  let intentos = 0; // Controlar las semanas iteradas
  while (intentos < 4) {
    for (let i = 2; i <= 7; i++) {
      // Buscar horario disponible mínimo un día de distancia
      const diaChequeo = (diaActual + i) % 7;
      const nombreDia = diasSemana[diaChequeo];
      const horarioDia = horario[nombreDia] || null;

      if (horarioDia && horarioDia.inicio !== "00:00" && horarioDia.fin !== "00:00") {
        const inicio = horarioDia.inicio;
        const fin = horarioDia.fin;

        if (inicio < fin) {
          // Asegurarse de que el horario sea válido
          const fecha = new Date(fechaActual);
          const dias = i + intentos * 7; // Calcular días de diferencia
          fecha.setDate(fecha.getDate() + dias);

          const principio = new Date(`${fecha.toISOString().split("T")[0]}T${inicio}:00`);
          const finHorario = new Date(`${fecha.toISOString().split("T")[0]}T${fin}:00`);

          const month = fecha.getMonth() + 1;
          const year = fecha.getFullYear();
          const texto = `${nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1)} ${fecha.getDate()}/${month}/${year} entre ${inicio} y ${fin}`;

          return {
            principio: principio.toISOString(),
            fin: finHorario.toISOString(),
            texto,
            dias,
          };
        }
      }
    }

    intentos++; // Pasar a la próxima semana
    fechaActual.setDate(fechaActual.getDate() + 7);
    diaActual = 0; // Reiniciar búsqueda desde domingo
  }

  return null; // En caso extremo donde no haya horarios disponibles en varias semanas
}

export const getOpcionesDeEntregaAmPm = async (
  shoppingCart: ShoppingCartItem[],
  codigoPostalEntrega: string
) => {
  await connectToDB();
  const userId = process.env.LOLA_USER_ID;
  console.log("shoppingCart", shoppingCart);
  const ids = shoppingCart.map((item) => item.productoId || item.id);
  const productos = await Producto.find({ _id: { $in: ids } });
  if (!productos || productos.length === 0) {
    throw new Error("No se encontraron productos para los IDs proporcionados");
  }
  const almacen = await Almacen.findOne({ userId });

  if (!almacen?.direccion?.codigoPostal) {
    throw new Error("No se encontró un código postal en la dirección del almacén");
  }

  const Detalle = shoppingCart.flatMap((item) => {
    const prodId = item.productoId || item.id;
    const producto = productos.find((p) => p._id.toString() === prodId);
    if (!producto) {
      throw new Error(`Producto con ID ${prodId} no encontrado`);
    }
    // Determinar si se usa una variante combinada o el producto general
    const varianteCombinada =
      Array.isArray(producto.variantesCombinadas) && producto.variantesCombinadas.length > 0
        ? producto.variantesCombinadas.find((variante) => variante._id.toString() === item.variante)
        : undefined;
    const largo = producto.largo;
    const alto = producto.alto;
    const ancho = producto.ancho;
    if (
      largo === undefined ||
      largo === null ||
      alto === undefined ||
      alto === null ||
      ancho === undefined ||
      ancho === null
    ) {
      throw new Error(`Producto con ID ${prodId} no tiene alto, ancho o largo`);
    }

    const peso = varianteCombinada?.peso ?? producto.peso;
    if (!peso) {
      throw new Error(`Producto con ID ${prodId} no tiene peso`);
    }

    const precio = varianteCombinada?.precio ?? producto.precio;
    if (!precio) {
      throw new Error(`Producto con ID ${prodId} no tiene precio`);
    }

    const quantity = item.cantidad || item.quantity;

    return Array.from({ length: quantity }, () => ({
      ValorDeclarado: precio,
      Dimensiones: {
        Largo: largo, // Centimetros
        Alto: alto, // Centimetros
        Ancho: ancho, // Centimetros
        Peso: peso, // Kilogramos
      },
    }));
  });

  const data = {
    Opciones: {
      TipoEnvio: "P", // Pueden ser tres tipos de envió, paquete (P) sobre (S) y valija (V).
      TipoEntrega: "D", // Tipo de entrega deseado, valores permitidos: “O” (Ocurre), “D” (Domicilio)
      TipoServicio: "", // Enviar vacio
      TipoCobro: shoppingCart.length > 1 ? "M" : "P", // Tipo de tarifa a aplicar, valores permitidos “P” (Pieza), “M” (Múltiples).
    },
    Origen: {
      Domicilio: {
        CodigoPostal: almacen?.direccion.codigoPostal,
      },
    },
    Destino: {
      Domicilio: {
        CodigoPostal: codigoPostalEntrega,
      },
    },
    Detalle,
  };
  const response = await cotizarPedidoAmPm(data);
  return response;
};

// Funcion hermanda de getOpcionesDeEntregaAmPm para generar el shoppingCartItem que espera la funcion
export const getOpcionesDeEntregaBackend = async (pedidoId: string) => {
  const pedido = await Pedido.findById(pedidoId);
  if (!pedido) {
    throw new Error("Pedido no encontrado");
  }
  // Simulamos el ShoppingCart
  const shoppingCart = pedido.productos.map((item: any) => ({
    productoId: item.producto.toString(),
    variante: item.variantesSeleccionada?.[0]?.id,
    cantidad: item.cantidad,
  }));
  const codigoPostal = pedido.informacionCliente.direccion?.codigoPostal;
  if (!codigoPostal) {
    throw new Error("Código postal no encontrado en el pedido");
  }
  //llamamos la funcion original de getOpcionesAmPm
  const opciones = await getOpcionesDeEntregaAmPm(shoppingCart, codigoPostal);
  return opciones;
};

export const getNumerodeGuia = async (pedidoId: string, userId: string, tipoEnvioId: string) => {
  if (!pedidoId || !userId || !tipoEnvioId) {
    throw new Error("pedidoId | userId | tipoEnvioId === undefined");
  }
  await connectToDB();
  const pedido = await Pedido.findById(pedidoId);
  if (!pedido || !pedido.productos || pedido.productos.length === 0) {
    throw new Error("No se encontro el pedido");
  }

  const almacen = await Almacen.findOne({ userId });
  if (!almacen) {
    throw new Error("No se encontro el almacen");
  }

  const ids = pedido.productos.map((item) => item.producto);
  const productos = await Producto.find({ _id: { $in: ids } });

  if (!productos || productos.length === 0) {
    throw new Error("No se encontraron productos para los IDs proporcionados");
  }

  const Detalle = pedido.productos.flatMap((item) => {
    const producto = productos.find((prod) => prod._id.toString() === item.producto.toString());

    if (!producto) {
      throw new Error(`Producto con ID ${item.producto.toString()} no encontrado`);
    }

    // Determinar si se usa una variante combinada o el producto general
    const varianteCombinada = producto.variantesCombinadas.find(
      (variante) => variante._id.toString() === item.variantesSeleccionada[0]?.id
    );

    const largo = producto.largo;
    const alto = producto.alto;
    const ancho = producto.ancho;
    if (!largo || !alto || !ancho) {
      throw new Error(`Producto con ID ${item.producto.toString()} no tiene alto, ancho o alto`);
    }

    const peso = varianteCombinada?.peso ?? producto.peso;
    if (!peso) {
      throw new Error(`Producto con ID ${item.producto.toString()} no tiene peso`);
    }

    const precio = varianteCombinada?.precio ?? producto.precio;
    if (!precio) {
      throw new Error(`Producto con ID ${item.producto.toString()} no tiene precio`);
    }

    return Array.from({ length: item.cantidad }, () => ({
      Identificador:
        item.variantesSeleccionada[0]?.id !== null ? item.variantesSeleccionada[0]?.id : undefined,
      Contenido: `${item.nombreProducto}${item.variantesSeleccionada[0]?.nombre && ` - ${item.variantesSeleccionada[0]?.nombre}`}${item.variantesSeleccionada[0]?.subVariante && `/${item.variantesSeleccionada[0]?.subVariante}`}`,
      ValorDeclarado: precio,
      Dimensiones: {
        Largo: largo, // Centimetros
        Alto: alto, // Centimetros
        Ancho: ancho, // Centimetros
        Peso: peso, // Kilogramos
      },
    }));
  });

  if (
    !pedido.informacionCliente.direccion.codigoPostal ||
    !pedido.informacionCliente.direccion.estado ||
    !pedido.informacionCliente.direccion.ciudad ||
    !pedido.informacionCliente.direccion.calle ||
    !pedido.informacionCliente.direccion.numeroExterior ||
    !pedido.informacionCliente.direccion.colonia
  ) {
    throw new Error("Direccion de destino invalida");
  }
  if (!pedido.informacionCliente.nombre) {
    throw new Error("Destinatario invalido");
  }
  if (!pedido.informacionCliente.telefono || !pedido.informacionCliente.email) {
    throw new Error("Informacion del cliente invalida");
  }
  // TODO cambiar tipo de cobra para que acepte paquetes personalizados
  const data = {
    Opciones: {
      TipoEnvio: "P",
      TipoEntrega: "D",
      TipoServicio: tipoEnvioId,
      TipoCobro: pedido.productos.length > 1 || pedido.productos[0].cantidad > 1 ? "M" : "P",
    },
    Referencia1: "Pedido Realizado a traves del agente de whatsapp",
    Contiene: "ND",
    Origen: {
      Remitente: almacen.contacto.nombreDespachador,
      Domicilio: {
        Pais: "MEXICO",
        Estado: almacen.direccion.estado,
        Ciudad: almacen.direccion.ciudad,
        Colonia: almacen.direccion.colonia,
        CodigoPostal: almacen.direccion.codigoPostal,
        Calle: almacen.direccion.calle,
        NumeroInt: almacen.direccion.numeroInt !== null ? almacen.direccion.numeroInt : undefined,
        NumeroExt: almacen.direccion.numeroExt,
      },
      Telefonos: [
        {
          numeroTelefono: almacen.contacto.telefono,
        },
      ],
      Email: almacen.contacto.correo,
      // Referencia: 'PLAZA TARISH',
    },
    Destino: {
      Destinatario: pedido.informacionCliente.nombre,
      // Destinatario2: 'CIRO PROCUNA',
      Domicilio: {
        Pais: "MEXICO",
        Estado: pedido.informacionCliente.direccion.estado,
        Ciudad: pedido.informacionCliente.direccion.ciudad,
        Colonia: pedido.informacionCliente.direccion.colonia,
        CodigoPostal: pedido.informacionCliente.direccion.codigoPostal,
        Calle: pedido.informacionCliente.direccion.calle,
        NumeroInt:
          pedido.informacionCliente.direccion.numeroInterior !== null
            ? pedido.informacionCliente.direccion.numeroInterior
            : undefined,
        NumeroExt: pedido.informacionCliente.direccion.numeroExterior,
      },
      Telefonos: [
        {
          numeroTelefono: pedido.informacionCliente.telefono,
        },
      ],
      Email: pedido.informacionCliente.email,
      Referencia:
        pedido.informacionCliente.direccion.datosAdicionales !== null
          ? pedido.informacionCliente.direccion.datosAdicionales
          : undefined,
    },
    Detalle,
  };

  const res = await documentarEnvioAmPm(data);
  return res;
};

export async function cotizarPedidoAmPm(data: {
  Cuenta?: string;
  Opciones: {
    TipoEnvio: string; // Pueden ser tres tipos de envió, paquete (P) sobre (S) y valija (V).
    TipoEntrega: string; // Tipo de entrega deseado, valores permitidos: “O” (Ocurre), “D” (Domicilio)
    TipoServicio?: string; // Enviar vacio
    TipoCobro?: string; // Tipo de tarifa a aplicar, valores permitidos “P” (Pieza), “M” (Múltiples).
  };
  Origen: {
    Domicilio: {
      CodigoPostal: string;
    };
  };
  Destino: {
    Domicilio: {
      CodigoPostal: string;
    };
  };
  Detalle: {
    ValorDeclarado?: number;
    Dimensiones: {
      Largo: number; // Centimetros
      Alto: number; // Centimetros
      Ancho: number; // Centimetros
      Peso: number; // Kilogramos
    };
  }[];
}) {
  const { Opciones, Origen, Destino, Detalle } = data;
  console.log("data", data);
  console.log("detalle", Detalle);
  let { Cuenta } = data;
  if (!Cuenta && globalCuenta) {
    Cuenta = globalCuenta;
  }

  // Credenciales y URL de la API
  const apiUrl = `${apiUrlStart}/ws/api/Cotizador/CotizaCliente`;
  const username = globalUsername;
  const password = globalPassword;

  // Convertir credenciales a Base64
  const authorization = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authorization}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(Cuenta ? { Cuenta } : {}),
        Opciones,
        Origen,
        Destino,
        Detalle,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data;
      throw new Error(`Error en la API: ${JSON.stringify(errorData)}`);
    }

    return data;
  } catch (error: any) {
    console.error("Error al obtener cotización:", error);
    throw new Error(error || "Error al procesar la solicitud.");
  }
}

export async function documentarEnvioAmPm(data: {
  Cuenta?: string; // Numero del contrato default si no lo encuentra
  Opciones: {
    TipoEnvio: string; // Pueden ser tres tipos de envió, paquete (P) sobre (S) y valija (V).
    TipoEntrega: string; // Tipo de entrega: O (Ocurre), D (Domicilio)
    TipoServicio: string; // Se obtienen las opciones de la cotizacion
    TipoCobro: string; // Tipo de tarifa a aplicar, valores permitidos “P” (Pieza), “M” (Múltiples).
  };
  Referencia1?: string; // Campo de texto libre para información adicional que el cliente proporcione.
  Referencia2?: string; // Campo de texto libre para información adicional que el cliente proporcione.
  Contiene: string; //Tipo de contenido del envío valores permitidos: “D” (Documentos), “ND” (No documentos),
  Origen: {
    // Actualmente solo permite “México”
    Remitente: string;
    Domicilio: {
      Pais: string;
      Estado: string;
      Ciudad: string;
      Colonia: string;
      CodigoPostal: string;
      Calle: string;
      NumeroInt?: string; // En caso de existir
      NumeroExt: string;
    };
    Telefonos: { numeroTelefono: string }[]; // Al menos 1
    Email: string;
    Referencia?: string; // Informacion adicional (cerca de parque, frente a mueblería, etc…)
  };
  Destino: {
    // Actualmente solo permite “México”
    Destinatario: string; // Persona o empresa a quien va dirigido el envío
    Destinatario2?: string; // Persona alterna autorizada para recibir el envío.
    Domicilio: {
      Pais: string;
      Estado: string;
      Ciudad: string;
      Colonia: string;
      CodigoPostal: string;
      Calle: string;
      NumeroInt?: string; // En caso de existir
      NumeroExt: string;
    };
    Telefonos: { numeroTelefono: string }[]; // Al menos 1
    Email?: string;
    Referencia?: string; // Informacion adicional (cerca de parque, frente a mueblería, etc…)
  };
  Detalle: {
    Identificador?: string; // Campo libre para que el cliente asigne un identificador al paquete
    Contenido: string; // Campo para la captura de la descripción del contenido del paquete.
    ValorDeclarado?: number;
    Dimensiones: {
      Largo: number; // Centimetros
      Alto: number; // Centimetros
      Ancho: number; // Centimetros
      Peso: number; // Kilogramos
    };
  }[];
}) {
  const { Opciones, Referencia1, Referencia2, Contiene, Origen, Destino, Detalle } = data;
  let { Cuenta } = data;
  if (!Cuenta && globalCuenta) {
    Cuenta = globalCuenta;
  }
  // Credenciales y URL de la API
  const apiUrl = `${apiUrlStart}/ws/api/Documentacion/Documentar`;
  const username = globalUsername;
  const password = globalPassword;
  const cuentaDefaultPruebas = "1000260";

  // Convertir credenciales a Base64
  const authorization = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authorization}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Cuenta: Cuenta ? Cuenta : cuentaDefaultPruebas,
        Opciones,
        Referencia1,
        Referencia2,
        Contiene,
        Origen,
        Destino,
        Detalle,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error en la API: ${JSON.stringify(errorData)}`);
    }
    const res = await response.json();
    // const pdfRes = await crearEtiquetaAmPm({ Guia: res.guia });
    // return JSON.stringify(pdfRes);
    return res.guia;
  } catch (error: any) {
    console.error("Error al obtener documentacion:", error);
    throw new Error(error || "Error al procesar la solicitud.");
  }
}

export async function getGuiaWithAuth(Guia: string, TipoImpresion?: number) {
  try {
    const user = await currentUser();
    const userId = process.env.LOLA_USER_ID;
    console.log("userId", userId);
    if (!user) {
      throw new Error("Unauthorized, not user found");
    }
    await connectToDB();
    const pedido = await Pedido.findOne({ numeroRastreo: Guia, userId });
    if (!pedido) {
      throw new Error("Guia not found for this user");
    }
    const pdf = await crearEtiquetaAmPm({ Guia, TipoImpresion });
    return JSON.stringify(pdf);
  } catch (error) {
    throw new Error("Error getting Guia");
  }
}

export async function crearEtiquetaAmPm(data: { Guia: string; TipoImpresion?: number }) {
  const { Guia, TipoImpresion } = data;

  // Credenciales y URL de la API
  const apiUrl = `${apiUrlStart}/ws/api/Documentacion/EtiquetaEnvio`;
  const username = globalUsername;
  const password = globalPassword;

  // Convertir credenciales a Base64
  const authorization = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authorization}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Guia, TipoImpresion: TipoImpresion || 2 }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error en la API: ${JSON.stringify(errorData)}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return {
      pdfBuffer: Buffer.from(arrayBuffer),
    };
  } catch (error: any) {
    console.error("Error al obtener etiqueta:", error);
    throw new Error(error || "Error al procesar la solicitud.");
  }
}

export async function pedirRecoleccionAmPm(data: {
  fPropuestaInicial: Date;
  fPropuestaFinal: Date;
  solicita: string;
  contacto: string;
  comentarios?: string;
  telefonos: {
    numeroTelefono: string;
  }[];
  email: string;
  detalle: {
    paquete: number;
    sobre?: number;
    valijas?: number;
    tarimas?: number;
  };
  domicilio: {
    Pais: string;
    Estado: string;
    Ciudad: string;
    Colonia: string;
    CodigoPostal: string;
    Calle: string;
    NumeroInt?: string; // En caso de existir
    NumeroExt: string;
  };
}) {
  const {
    fPropuestaInicial,
    fPropuestaFinal,
    solicita,
    contacto,
    comentarios,
    telefonos,
    email,
    detalle,
    domicilio,
  } = data;

  // Credenciales y URL de la API
  const apiUrl = `${apiUrlStart}/ws/api/Recoleccion/Solicitar`;
  const username = globalUsername;
  const password = globalPassword;

  // Convertir credenciales a Base64
  const authorization = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authorization}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fPropuestaInicial,
        fPropuestaFinal,
        solicita,
        contacto,
        comentarios,
        telefonos,
        email,
        detalle,
        domicilio,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error en la API: ${JSON.stringify(errorData)}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error al pedir recoleccion:", error);
    throw new Error(error || "Error al procesar la solicitud.");
  }
}

export async function rastreoAmPm(data: { Guia: string }) {
  const { Guia } = data;
  // Credenciales y URL de la API
  const apiUrl = `${apiUrlStart}/ws/api/Rastreo`;
  const username = globalUsername;
  const password = globalPassword;

  // Convertir credenciales a Base64
  const authorization = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authorization}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          Guia,
          Referencia: null,
        },
      ]),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error en la API: ${JSON.stringify(errorData)}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error al pedir recoleccion:", error);
    throw new Error(error || "Error al procesar la solicitud.");
  }
}
