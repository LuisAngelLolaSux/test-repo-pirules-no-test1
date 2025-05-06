"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CategoryGridProps {
  primaryColor?: string;
}

export function CategoryGrid({ primaryColor = "#2563eb" }: CategoryGridProps) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        console.log("Fetched categories:", data);
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCategories();
  }, []);

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="mb-4 text-2xl font-semibold" style={{ color: primaryColor }}>
        Product Categories
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/categorias/${cat}`}
            className="block rounded border p-4 text-center">
            {cat}
          </Link>
        ))}
      </div>
    </section>
  );
}
