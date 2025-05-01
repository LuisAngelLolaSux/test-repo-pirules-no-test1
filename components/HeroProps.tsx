import React from 'react';
import { TextFormat } from '../types/components';

interface HeroPropsData {
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

function HeroProps({ image, title, text, ctaText, ctaText2, primaryColor }: HeroPropsData) {
    return (
        <section className="bg-gray-100 py-12">
            <div className="container mx-auto px-4 text-center">
                <h2 className="mb-4 text-3xl font-bold">{renderTextFormat(title)}</h2>
                <p className="mb-6 text-lg">{renderTextFormat(text)}</p>
                <div className="space-x-4">
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
                {image && (
                    <div className="mt-6 flex justify-center">
                        <img
                            src={image}
                            alt={typeof title === 'string' ? title : title?.text}
                            className="max-h-64 w-auto rounded"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
  
export default HeroProps;
