import React from 'react';

interface GalleryProps {
    title?: string;
    images?: string[];
    primaryColor?: string;
}

export function GalleryProps({ title, images, primaryColor }: GalleryProps) {
    return (
        <section className="bg-gray-100 py-10">
            <div className="container mx-auto px-4">
                <h2
                    className="mb-6 text-2xl font-semibold"
                    style={{ color: primaryColor || '#2563eb' }}
                >
                    {title}
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {images &&
                        images.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`${title} ${i}`}
                                className="rounded shadow-sm"
                            />
                        ))}
                </div>
            </div>
        </section>
    );
}
