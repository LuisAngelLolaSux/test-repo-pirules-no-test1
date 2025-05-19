"use client";
import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";

interface Product {
  _id: string;
  nombre: string;
  descripcion: string;
  imagenes?: string[];
  categorias?: string[];
}

interface CategoryProductsProps {
  category?: string;
  primaryColor?: string;
}

export function CategoryProducts({ category, primaryColor = "#2563eb" }: CategoryProductsProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/productos");
        const data = await response.json();
        setAllProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (category) {
      const filtered = allProducts.filter(
        (product) =>
          product.categorias &&
          product.categorias.map((c) => c.toLowerCase()).includes(category.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts);
    }
  }, [allProducts, category]);

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="mb-4 text-2xl font-semibold" style={{ color: primaryColor }}>
        {category ? `Productos para "${category}"` : "Todos los Productos"}
      </h2>
      {filteredProducts && filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filteredProducts.map((product) => (
            <div key={product._id} className="rounded border p-4 shadow-sm">
              {product.imagenes && product.imagenes[0] && (
                <img
                  src={product.imagenes[0]}
                  alt={product.nombre}
                  className="mb-2 w-full object-cover rounded"
                  style={{
                    width: "240px",
                    height: "160px",
                    objectFit: "cover",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              )}
              <h3 className="font-semibold">{product.nombre}</h3>
              <p className="text-sm text-gray-600">{product.descripcion}</p>
              <button
                onClick={() => {
                  const firstVariant = (product as any).variantesCombinadas?.[0];
                  const price = firstVariant?.precio ?? (product as any).precio ?? 0;
                  const variantId = firstVariant?._id?.toString() || undefined;

                  useCartStore.getState().addToCart({
                    id: product._id,
                    name: product.nombre,
                    image: product.imagenes?.[0] || "",
                    quantity: 1,
                    price,
                    variante: variantId,
                  });
                }}
                className="mt-2 rounded bg-blue-500 px-4 py-2 text-white">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay productos para esta categoría.</p>
      )}
    </section>
  );
}

export default CategoryProducts;
