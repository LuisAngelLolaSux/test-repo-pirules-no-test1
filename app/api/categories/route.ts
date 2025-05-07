import { NextResponse } from "next/server";
import Producto from "@/models/Productos";
import { connectToDB } from "@/utils/mongoDB";

async function getProductCategories() {
  const userId = process.env.LOLA_USER_ID;
  if (!userId) {
    console.error("No se encontró la variable LOLA_USER_ID en el entorno");
    throw new Error("Falta la variable LOLA_USER_ID");
  }
  await connectToDB();
        const productos = await Producto.find({ eliminado: false, userId }).select(
          "categorias"
        );
        console.log("DEBUG: Productos obtenidos:", productos); // Debug log para verificar los productos
        const categorias = productos
          .flatMap((p) => p.categorias) // Unificamos todas las categorías
          .filter(Boolean) // Filtramos valores nulos o vacíos
          .map((cat) => cat.toLowerCase()) // Pasamos todo a minúsculas para normalizar
          .filter((cat, index, self) => self.indexOf(cat) === index) // Eliminamos duplicados
          .map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1)); // Capitalizamos
         console.log("DEBUG: Categorías obtenidas:", categorias); // Debug log para verificar las categorías
        return categorias;
}

export async function GET() {
  try {
    const categories = await getProductCategories();
    return NextResponse.json({ categories });
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
