import Cliente from "@/models/clientes/Cliente";
import { connectToDB } from "@/utils/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const eliminados = searchParams.get("eliminados");
    const userId = process.env.LOLA_USER_ID;

    await connectToDB();

    if (id) {
      const cliente = await Cliente.findOne({ _id: id, userId });
      if (!cliente) {
        return new NextResponse("Cliente no encontrado", { status: 404 });
      }
      return NextResponse.json(cliente, { status: 200 });
    } else {
      let clientes;
      if (eliminados) {
        clientes = await Cliente.find({ userId, eliminado: true });
      } else {
        clientes = await Cliente.find({ userId, eliminado: false });
      }
      return NextResponse.json(clientes, { status: 200 });
    }
  } catch (error) {
    console.log("[CLIENTE_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const userId = process.env.LOLA_USER_ID;

    await connectToDB();
    const { formInfo } = await req.json();

    // Normalizamos el correo a minúsculas para evitar duplicados
    formInfo.correo = formInfo.correo.toLowerCase();

    if (!formInfo.nombre || !formInfo.apellidos || !formInfo.correo) {
      return new NextResponse("No hay suficientes datos para crear Cliente", { status: 400 });
    }

    // Revisa si hay un cliente existente con el mismo mail para el usuario en particular
    const existingCliente = await Cliente.findOne({
      correo: { $regex: `^${formInfo.correo}$`, $options: "i" },
      userId,
      eliminado: false,
    });
    if (existingCliente) {
      return new NextResponse(
        JSON.stringify({
          message: "Cliente already exists",
          existing: true,
          client: existingCliente,
        }),
        { status: 200 }
      );
    }

    const cliente = await Cliente.create({
      ...formInfo,
      userId,
    });
    await cliente.save();

    return new NextResponse("Client created", { status: 200 });
  } catch (error) {
    console.log("[CLIENTE_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const userId = process.env.LOLA_USER_ID;
    await connectToDB();
    const { formInfo, id } = await req.json();

    // Normalizamos el correo a minúsculas
    formInfo.correo = formInfo.correo.toLowerCase();

    if (!formInfo.nombre || !formInfo.apellidos || !formInfo.correo || !id) {
      return new NextResponse("Datos insuficientes para actualizar cliente", { status: 400 });
    }

    const cliente = await Cliente.findById(id);
    if (!cliente) {
      return new NextResponse("Client not found", { status: 404 });
    }

    if (cliente.userId && cliente.userId.toString() !== userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    Object.assign(cliente, { ...formInfo, userId });
    await cliente.save();

    return new NextResponse("Client updated", { status: 200 });
  } catch (error) {
    console.log("[CLIENTE_PUT]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const userId = process.env.LOLA_USER_ID;
    await connectToDB();
    const { id } = await req.json();

    if (!id) {
      return new NextResponse("Id requerido para borrar Cliente", { status: 400 });
    }

    const cliente = await Cliente.findById(id);
    if (!cliente) {
      return new NextResponse("Client not found", { status: 404 });
    }

    if (cliente.userId && cliente.userId.toString() !== userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    cliente.eliminado = true;
    await cliente.save();

    return new NextResponse("Client deleted", { status: 200 });
  } catch (error) {
    console.log("[CLIENTE_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
