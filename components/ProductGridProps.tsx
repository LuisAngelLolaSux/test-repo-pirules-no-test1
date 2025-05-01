'use client';
import React, { useState, useEffect } from 'react';

interface ProductGridPropsData {
    image?: string;
    title?: string;
    text?: string;
    ctaText?: string;
    ctaText2?: string;
    primaryColor?: string;
}

export function ProductGridProps({
    image,
    title,
    text,
    ctaText,
    ctaText2,
    primaryColor,
}: ProductGridPropsData) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/productos');
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
        console.log('Products fetched:', products);
    }, []);

    return (
        <section className="py-10">
            <div className="container mx-auto px-4">
                <h2 className="mb-2 text-2xl font-semibold">{title}</h2>
                <p className="mb-6">{text}</p>
                <div className="mb-6 space-x-4">
                    <button
                        style={{ backgroundColor: primaryColor || '#2563eb' }}
                        className="rounded px-6 py-2 text-white"
                    >
                        {ctaText}
                    </button>
                    <button className="rounded bg-blue-100 px-6 py-2 text-blue-600">
                        {ctaText2}
                    </button>
                </div>
                {image && <img src={image} alt={title} className="max-w-md rounded shadow-md" />}
                {loading && <p>Loading...</p>}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product: any) => (
                        <div key={product._id} className="rounded border p-4">
                            <img
                                src={
                                    product.imagenes && product.imagenes.length > 0
                                        ? product.imagenes[0]
                                        : '/placeholder.png'
                                }
                                alt={product.nombre}
                                className="mb-2"
                            />
                            <h3 className="font-semibold">{product.nombre}</h3>
                            <p>{product.descripcion}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
