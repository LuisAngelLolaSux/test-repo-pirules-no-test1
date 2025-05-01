import React from 'react';

interface CartPropsData {
    image?: string;
    title?: string;
    text?: string;
    ctaText?: string;
    ctaText2?: string;
    primaryColor?: string;
}

export function CartProps({ image, title, text, ctaText, ctaText2, primaryColor }: CartPropsData) {
    return (
        <section className="bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
                <p className="mb-6">{text}</p>
                <div className="mb-6 space-x-4">
                    <button
                        style={{ backgroundColor: primaryColor || '#2563eb' }}
                        className="rounded bg-blue-600 px-6 py-2 text-white"
                    >
                        {ctaText}
                    </button>
                    <button className="rounded bg-blue-100 px-6 py-2 text-blue-600">
                        {ctaText2}
                    </button>
                </div>
                {image && <img src={image} alt={title} className="w-full max-w-xs rounded" />}
            </div>
        </section>
    );
}
