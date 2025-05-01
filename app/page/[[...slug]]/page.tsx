import { notFound } from "next/navigation";
import { getConfig } from "@/lib/getConfig";
import * as R from "@/lib/registry";

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
    // ← reemplaza con tu fetch de slugs
    const prods = await fetch(process.env.PRODUCT_API!).then((r) => r.json());
    dyn = prods.map((p: any) => ({ slug: ["productos", p.slug] }));
  }

  return [...staticPaths, ...dyn];
}

export default async function Page({ params }: { params: { slug?: string[] } }) {
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
    const slug = params.slug![1];
    extra = await fetch(`${process.env.PRODUCT_API}/${slug}`).then((r) => r.json());
  }

  return (
    <>
      {page.componentes.map((c: any, i: number) => {
        const Comp = (R as any)[c.componente];
        return Comp ? <Comp key={i} {...c} {...extra} /> : null;
      })}
    </>
  );
}
