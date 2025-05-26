import "server-only";
import mongoose from "mongoose";
import PageConfig from "@/models/PageConfig";
import Producto from "@/models/Productos";
import { PAGE_CONFIG } from "@/pageConfigConst";

async function connect() {
  const uri = process.env.DATABASE_URL;
  if (!uri || typeof uri !== "string") {
    throw new Error("Missing or invalid MONGODB_URI environment variable");
  }
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
}

export async function getLocalConfig() {
  await connect(); // Ensure DB connection before any DB operation

  // Copia el PAGE_CONFIG base
  const cfg = { ...PAGE_CONFIG };

  // Obtén productos y categorías desde la base de datos
  const productos = await Producto.find({}).select("_id").lean();
  const categorias = await Producto.distinct("categorias", { categorias: { $nin: [null, ""] } });

  // Asegúrate de que cfg.paginas exista
  cfg.paginas = cfg.paginas || [];

  // Agrega la ruta dinámica de productos si no existe
  if (!cfg.paginas.some((p: any) => p.ruta === "/productos/*")) {
    cfg.paginas.push({
      ruta: "/productos/*",
      componentes: [
        {
          componente: "ProductoIndividual",
          // ...otros props si necesitas...
        },
      ],
    });
  }

  // Agrega la ruta dinámica de categorías si no existe
  if (!cfg.paginas.some((p: any) => p.ruta === "/categorias/*")) {
    cfg.paginas.push({
      ruta: "/categorias/*",
      componentes: [
        {
          componente: "CategoryProducts",
          title: "Productos por Categoría",
          images: [
            "/media/images.jpeg",
            "/media/pexels-pixabay-104827.jpg",
            "/media/photo-1529778873920-4da4926a72c2.jpeg",
          ],
          // ...otros props si necesitas...
        },
      ],
    });
  }

  // Puedes devolver también los productos y categorías si lo necesitas en otras partes
  return { ...cfg, productos, categorias };
}

export async function getConfig() {
  await connect();
  const cfg = await PageConfig.findOne({}).lean();
  console.log("DEBUG: PageConfig:", cfg); // Debug log to check the fetched config
  if (!cfg) throw new Error("No PageConfig found");

  const config = {
    ...cfg,
    paginas: [
      ...(cfg.paginas || []),
      {
        ruta: "/productos/*",
        componentes: [
          {
            componente: "ProductoIndividual",
            // ...other props as needed...
          },
        ],
      },
      {
        ruta: "/categorias/*",
        componentes: [
          {
            componente: "CategoryProducts",
            title: "Productos por Categoría",
            // ...other props as needed...
          },
        ],
      },
    ],
  };

  console.log("DEBUG: available pages:", config.paginas); // Debug log to check available pages
  return config;
}
