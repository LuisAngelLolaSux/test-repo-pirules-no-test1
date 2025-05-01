import React from 'react';
import { TextFormat } from '../types/components';

interface FormPropsData {
    image?: string;
    title?: string | TextFormat;
    text?: string | TextFormat;
    ctaText?: string;
    ctaText2?: string;
    primaryColor?: string;
}

function renderTextFormat(val: string | TextFormat | undefined) {
    if (!val) return null;
    if (typeof val === 'string') return val;
    return <span className={val.className}>{val.text}</span>;
}

export function FormProps({ image, title, text, ctaText, ctaText2, primaryColor }: FormPropsData) {
    return (
        <section className="bg-white py-12">
            <div className="container mx-auto px-4">
                <h2 className="mb-4 text-3xl font-bold">{renderTextFormat(title)}</h2>
                <p className="mb-6">{renderTextFormat(text)}</p>
                <div className="mb-8 space-x-4">
                    <button
                        style={{ backgroundColor: primaryColor || '#2563eb' }}
                        className="rounded bg-blue-600 px-6 py-2 text-white"
                    >
                        {ctaText}
                    </button>
                    <button className="rounded bg-gray-100 px-6 py-2 text-blue-600">
                        {ctaText2}
                    </button>
                </div>
                {image && (
                    <img
                        src={image}
                        alt={typeof title === 'string' ? title : title?.text}
                        className="max-h-64 rounded shadow-md"
                    />
                )}
            </div>
        </section>
    );
}
