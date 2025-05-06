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
  const productos = await Producto.find({ eliminado: false, userId }).select("categorias");
  console.log("Productos encontrados:", productos);

  // Ensure that each producto has a categorias array, defaulting to [] if undefined
  const allCategorias = productos.flatMap((p) => Array.isArray(p.categorias) ? p.categorias : []);
  console.log("Todas las categorías (antes de filtrar):", allCategorias);

  const filteredCategorias = allCategorias.filter(
    (cat) => typeof cat === "string" && cat.trim() !== ""
  );
  console.log("Categorías después de filtrar solo vacíos/nulos:", filteredCategorias);

  const lowerCaseCategorias = filteredCategorias.map((cat) => cat.toLowerCase());
  console.log("Categorías en minúsculas:", lowerCaseCategorias);

  const uniqueCategorias = lowerCaseCategorias.filter(
    (cat, index, self) => self.indexOf(cat) === index
  );
  console.log("Categorías únicas:", uniqueCategorias);

  const capitalizedCategorias = uniqueCategorias.map(
    (cat) => cat.charAt(0).toUpperCase() + cat.slice(1)
  );
  console.log("Categorías final capitalizadas:", capitalizedCategorias);

  return capitalizedCategorias;
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
