import Producto from "@/models/Productos";
import { connectToDB } from "@/utils/mongoDB";

/**
 * Obtiene todas las categorias utilizadas en productos por el usuario actual
 * @returns String[]
 */
export const getProductCategories = async () => {
  try {
    const userId = process.env.LOLA_USER_ID;
    if (!userId) {
      console.error("No se encontró la variable LOLA_USER_ID en el entorno");
      throw new Error("Falta la variable LOLA_USER_ID");
    }
    await connectToDB();
    const productos = await Producto.find({ eliminado: false, userId }).select("categorias");

    const categorias = productos
      .flatMap((p) => p.categorias)
      .filter((cat) => typeof cat === "string" && cat.trim() !== "")
      .map((cat) => cat.toLowerCase())
      .filter((cat, index, self) => self.indexOf(cat) === index)
      .map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1));

    return categorias;
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    throw new Error("No se pudo obtener las categorías de productos");
  }
};
