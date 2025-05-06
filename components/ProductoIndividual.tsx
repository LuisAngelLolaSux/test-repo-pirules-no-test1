"use client";

import React, { useEffect, useState } from "react";

interface Producto {
  _id: string;
  nombre: string;
  descripcion: string;
  imagenes?: string[];
  precio?: number;
  variante?: {
    nombre: string;
    opciones: string[];
  };
  variantesCombinadas?: {
    variante: string;
    precio: number;
    inventario: number;
  }[];
}

export function ProductoIndividual({ product }: { product?: Producto }) {
  const [productState, setProduct] = useState<Producto | null>(null);
  const [selectedVariant, setSelectedVariant] = useState("");

  useEffect(() => {
    if (product) {
      setProduct(product);
      return;
    }
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data: Producto[]) => {
        // Pick the first product that has variants, or fallback to the first product
        const withVariants = data.find(
          (p) => p.variantesCombinadas && p.variantesCombinadas.length > 0
        );
        setProduct(withVariants || data[0] || null);
      })
      .catch(() => setProduct(null));
  }, [product]);

  if (!productState) {
    return (
      <div className="flex h-80 items-center justify-center">
        <span className="text-lg text-gray-400">Cargando producto...</span>
      </div>
    );
  }

  const hasVariants =
    productState.variantesCombinadas && productState.variantesCombinadas.length > 0;
  const selectedVariantObj = hasVariants
    ? productState.variantesCombinadas?.find((v) => v.variante === selectedVariant)
    : null;

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-xl bg-white p-6 shadow-md">
      <div className="flex flex-col items-center">
        <img
          src={
            productState.imagenes && productState.imagenes[0]
              ? productState.imagenes[0]
              : "/placeholder.png"
          }
          alt={productState.nombre}
          className="mb-4 h-60 w-full rounded-lg object-cover"
        />
        <h2 className="mb-2 text-center text-2xl font-bold">{productState.nombre}</h2>
        <p className="mb-4 text-center text-gray-600">{productState.descripcion}</p>
        {hasVariants && (
          <div className="mb-4 w-full">
            <label className="mb-1 block font-medium text-gray-700">Variante:</label>
            <select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Seleccione variante</option>
              {productState.variantesCombinadas?.map((v) => (
                <option key={v.variante} value={v.variante}>
                  {v.variante}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="mt-2 flex w-full items-center justify-between">
          <span className="text-lg font-semibold text-blue-600">
            $
            {hasVariants && selectedVariantObj
              ? selectedVariantObj.precio.toFixed(2)
              : productState.precio?.toFixed(2) || "N/A"}
          </span>
          {hasVariants && selectedVariantObj && (
            <span className="text-sm text-gray-500">Stock: {selectedVariantObj.inventario}</span>
          )}
        </div>
      </div>
    </div>
  );
}
