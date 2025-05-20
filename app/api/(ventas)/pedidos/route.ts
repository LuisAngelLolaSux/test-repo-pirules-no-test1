import Producto from "@/models/productos/Productos";
import Pedido from "@/models/Pedidos/Pedido";
import { connectToDB } from "@/utils/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { PedidoType, ProductoType } from "@/typings/types";
import Billing from "@/models/prices/Billing"; // Adjust the path as needed
import Cliente from "@/models/clientes/Cliente";
import Almacen from "@/models/almacenesEnvios/Almacen";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const pedidoId = searchParams.get("pedidoId");
    if (pedidoId) {
      const pedido = await Pedido.findOne({ _id: pedidoId }).populate("productos.producto");

      if (!pedido) return new NextResponse("Pedido not found", { status: 404 });

      // If pedido.informacionPago holds the id of a Billing history element,
      // search the Billing document for that subdocument.
      let billingDetail = null;
      if (pedido.informacionPago) {
        const billingDoc = await Billing.findOne({ "history._id": pedido.informacionPago });
        if (billingDoc) {
          billingDetail = billingDoc.history.find(
            (h) => h._id.toString() === pedido.informacionPago!.toString()
          );
        }
      }

      // --- Nuevas consultas para obtener la información del cliente ---
      const clientEmail = pedido.informacionCliente?.email;
      let clientData = null;
      let orderCount = 0;
      if (clientEmail && pedido.userId) {
        clientData = await Cliente.findOne({ correo: clientEmail, userId: pedido.userId });
        orderCount = await Pedido.countDocuments({
          "informacionCliente.email": clientEmail,
          userId: pedido.userId,
        });
      }
      // --- Fin de nuevas consultas ---

      // --- New query for almacen info using pedido.userId ---
      const almacen = await Almacen.findOne({ userId: pedido.userId });
      // --- End of almacen query ---

      // Attach the found billing detail, client data and almacen info to the pedido response.
      const result = {
        ...pedido.toObject(),
        informacionPago: billingDetail,
        clienteData: {
          calificacion: clientData?.calificacion || null,
          orderCount,
        },
        almacen,
      };

      // Extract datosRecoleccion separately
      let datosRecoleccion = null;
      if (result.fechaRecoleccion) {
        const parts = result.fechaRecoleccion.split(" entre ");
        if (parts.length === 2) {
          const horario = parts[1].replace(" y ", " - ");
          // Extract day information from the first part
          // Expected format: "Miercoles 9/4/2025"
          const fechaComponents = parts[0].split(" ");
          if (fechaComponents.length >= 2) {
            const diaSemana = fechaComponents[0];
            const dateParts = fechaComponents[1].split("/");
            if (dateParts.length === 3) {
              const mes = dateParts[1];
              const año = dateParts[2];
              datosRecoleccion = {
                fecha: {
                  diaSemana,
                  mes,
                  año,
                },
                horario,
              };
            } else {
              datosRecoleccion = {
                fecha: parts[0],
                horario,
              };
            }
          } else {
            datosRecoleccion = {
              fecha: parts[0],
              horario,
            };
          }
        } else {
          datosRecoleccion = {
            fecha: result.fechaRecoleccion,
            horario: "",
          };
        }
      }
      return NextResponse.json({ pedido: result, datosRecoleccion });
    }

    // When no specific pedidoId is provided, return all pedidos
    const userId = process.env.LOLA_USER_ID;
    let pedidos: any[] = [];

    if (userId) {
      pedidos = await Pedido.find({ userId }).populate("productos.producto");
    }

    return NextResponse.json(pedidos);
  } catch (error) {
    console.error("Error fetching pedido:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

/**
 * Handles the POST request for creating a new pedido.
 *
 * @param req - The NextRequest object containing the request details.
 * @returns A NextResponse object with the created pedido information or an error response.
 */
export const POST = async (req: NextRequest) => {
  try {
    // Obtiene el usuario actual
    let userId = null;
    // Conecta a la base de datos
    await connectToDB();

    // Obtiene la información del pedido desde el cuerpo de la solicitud
    const { pedidoInfo, exchangeRate } = await req.json();
    const productosPedido = [];
    console.log("pedidoInfo", pedidoInfo);
    // Inicializa el precio total del pedido en 0
    pedidoInfo.precioTotalPedido = 0;
    // Itera sobre cada producto en el pedido
    for (let i = 0; i < pedidoInfo.productos.length; i++) {
      const variantesSeleccionada = [];

      // Busca el producto en la base de datos usando su ID
      const producto = await Producto.findOne({ _id: pedidoInfo.productos[i].id });
      console.log("producto", producto);
      if (producto) {
        // Checamos si el producto pertenece al mismo proveedor
        if (!userId) {
          userId = process.env.LOLA_USER_ID;
        } else {
          if (!producto.userId?.equals(userId)) {
            return new NextResponse("Productos de distintos provedores", {
              status: 403,
            });
          }
        }


        // Itera sobre las variantes combinadas del producto
        console.log("pedidoInfo.producto.variantesCombinadas.length", producto.variantesCombinadas);
        for (let j = 0; j < producto.variantesCombinadas.length; j++) {
          const varianteCombinada = producto.variantesCombinadas[j];

          // Compara el ID de la variante combinada con la variante seleccionada en el pedido
          if (varianteCombinada._id.toString() === pedidoInfo.productos[i].variante) {
            // Agrega la variante seleccionada al arreglo de variantes seleccionadas
            variantesSeleccionada.push({
              id: varianteCombinada._id.toString(),
              nombre: varianteCombinada.variante,
              subVariante: varianteCombinada.subVariante,
              precio: varianteCombinada.precio,
            });
            break;
          }
        }

        // Parse the quantity into a number
        const quantity = Number(pedidoInfo.productos[i].quantity);
        if (isNaN(quantity)) {
          return new NextResponse("Cantidad inválida", { status: 400 });
        }

        // Agrega el producto al arreglo de productos del pedido
        productosPedido.push({
          producto: producto._id,
          nombreProducto: pedidoInfo.productos[i].name,
          imagenProducto: pedidoInfo.productos[i].image,
          cantidad: quantity,
          variantesSeleccionada,
          precioProducto:
            variantesSeleccionada.length > 0
              ? variantesSeleccionada[0].precio
              : pedidoInfo.productos[i].price,
          currency: producto.currency,
        });

        if (producto.inventario !== -1) {
          // Only handle inventory if it's not unlimited
          producto.inventario! -= quantity;
          if (producto.inventario! < 0) {
            return new NextResponse("No hay suficiente inventario", { status: 400 });
          }
        }
        await producto.save();

        // Calcula el precio total del pedido sumando el precio del producto actual
        if (productosPedido[i]) {
          let precio = productosPedido[i].precioProducto! * quantity;
          if (productosPedido[i].currency === "USD") {
            precio *= exchangeRate;
          }
          pedidoInfo.precioTotalPedido += precio;
          continue;
        }
      } else {
        // Si no se encuentra el producto, devuelve una respuesta de error
        return new NextResponse("no se encontro producto", { status: 404 });
      }
    }

    // Actualiza la información del pedido con los productos y el precio total
    pedidoInfo.productos = productosPedido;
    pedidoInfo.precioTotalPedido += pedidoInfo?.metodoEnvio?.price || 0;

    // Include exchangeRate in the pedido document
    const pedidoInfodb = await Pedido.create({
      ...pedidoInfo,
      userId,
      exchangeRate, // added exchangeRate field
      historialEstados: [{ estado: "Creado", fecha: new Date() }],
      statusPedido: pedidoInfo.statusPedido || "Pendiente",
      productos: productosPedido,
    });

    // Guarda el pedido en la base de datos
    await pedidoInfodb.save();

    // Devuelve una respuesta JSON con el ID del pedido y el precio total
    return NextResponse.json(
      { pedidoId: pedidoInfodb.id, precioTotalPedido: pedidoInfo.precioTotalPedido },
      { status: 200 }
    );
  } catch (error) {
    // Si ocurre un error, devuelve una respuesta de error interno del servidor
    console.log("[PEDIDO_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
