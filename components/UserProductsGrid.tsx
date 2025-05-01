"use client";

import React, { useEffect, useState } from "react";

interface UserProductsGridProps {
  primaryColor?: string;
}

interface Product {
  _id: string;
  nombre: string;
  descripcion: string;
  imagenes: string[];
}

export function UserProductsGrid({ primaryColor = "#2563eb" }: UserProductsGridProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-semibold" style={{ color: primaryColor }}>
        My Products
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {products.map(({ _id, nombre, descripcion, imagenes }) => (
          <div key={_id} className="rounded-lg bg-white p-4 shadow-md">
            {imagenes[0] && (
              <img src={imagenes[0]} alt={nombre} className="mb-2 h-40 w-full object-cover" />
            )}
            <h3 className="text-lg font-medium">{nombre}</h3>
            <p className="text-sm text-gray-600">{descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
