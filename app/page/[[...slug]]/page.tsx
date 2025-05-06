import { notFound } from "next/navigation";
import { getConfig } from "@/lib/getConfig";
import * as R from "@/lib/registry";
import { connectToDB } from "@/utils/mongoDB";
import Producto from "@/models/Productos";

export const revalidate = 60; // ISR 1 min – ajusta o 0 para siempre dinámico

/** Pre-genera paths estáticos */
export async function generateStaticParams() {
  const cfg = await getConfig();

  // Rutas literales
  const staticPaths = cfg.paginas
    .filter((p: any) => !p.ruta.includes("*"))
    .map((p: any) => ({ slug: p.ruta === "/" ? [] : p.ruta.slice(1).split("/") }));

  // Ejemplo wildcard /productos/*
  const wild = cfg.paginas.find((p: any) => p.ruta === "/productos/*");
  let dyn: { slug: string[] }[] = [];
  if (wild) {
    // Use absolute URL for the API call
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const prods = await fetch(new URL("/api/productos", baseUrl)).then((r) => r.json());
    dyn = prods.map((p: any) => ({ slug: ["productos", p._id] }));
  }

  // Ejemplo wildcard /categorias/*
  const cat = cfg.paginas.find((p: any) => p.ruta === "/categorias/*");
  if (cat) {
    await connectToDB();
    const userId = process.env.LOLA_USER_ID;
    const categories = await Producto.distinct("categoria", {
      userId,
      categoria: { $nin: [null, ""] },
    });
    dyn.push(...categories.map((c: string) => ({ slug: ["categorias", c] })));
  }

  return [...staticPaths, ...dyn];
}

export default async function Page(context: { params: { slug?: string[] } }) {
  const { params } = context;
  const path = "/" + (params.slug?.join("/") ?? "");
  const cfg = await getConfig();

  // Debug logs to check what is coming from getConfig and the computed path
  console.log("DEBUG: computed path:", path);
  console.log("DEBUG: available pages:", cfg.paginas);

  // Normalize paths for matching
  const page = cfg.paginas.find((p: any) => {
    const ruta = p.ruta.toLowerCase().replace(/\/+$/, "");
    const current = path.toLowerCase().replace(/\/+$/, "");
    return ruta === current || (ruta.endsWith("*") && current.startsWith(ruta.replace("*", "")));
  });
  if (!page) {
    console.error("No matching page found for path:", path);
    return notFound();
  }

  /* Ejemplo de data extra para /productos/* */
  let extra = {};
  if (page.ruta === "/productos/*") {
    const id = params.slug?.[1];
    if (id) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      // Use absolute URL for the API call
      const productData = await fetch(new URL(`/api/productos/${id}`, baseUrl)).then((r) =>
        r.json()
      );
      extra = { product: productData };
    }
  }

  /* Ejemplo de data extra para /categorias/* */
  if (page.ruta === "/categorias/*") {
    await connectToDB();
    const userId = process.env.LOLA_USER_ID;
    const slug = params.slug?.[1];
    if (!slug) {
      // Show categories grid
      const categories = await Producto.distinct("categoria", {
        userId,
        categoria: { $nin: [null, ""] },
      });
      extra = { categories };
    } else {
      // Show products from this category
      const products = await Producto.find({ userId, categoria: slug }).lean();
      extra = { products, category: slug };
    }
  }

  // Log the array of components for debugging
  console.log("DEBUG: page.componentes:", page.componentes);

  return (
    <>
      {page.componentes.map((c: any, i: number) => {
        const Comp = (R as any)[c.componente];
        return Comp ? <Comp key={i} {...c} {...extra} /> : null;
      })}
    </>
  );
}
