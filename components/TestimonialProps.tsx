import React from 'react';
import { TextFormat } from '../types/components';

interface Testimony {
    name?: string | TextFormat;
    rating?: number;
    comment?: string | TextFormat;
}

interface TestimonialProps {
    testimonies?: Testimony[];
    primaryColor?: string;
}

function renderTextFormat(val: string | TextFormat | undefined) {
    if (!val) return null;
    if (typeof val === 'string') return val;
    return <span className={val.className}>{val.text}</span>;
}

export function TestimonialProps({ testimonies, primaryColor }: TestimonialProps) {
    return (
        <section className="bg-gray-50 py-10">
            <div className="container mx-auto px-4">
                <h2
                    className="mb-6 text-2xl font-semibold"
                    style={{ color: primaryColor || '#2563eb' }}
                >
                    TestimonialProps
                </h2>
                <div className="space-y-4">
                    {testimonies &&
                        testimonies.map((t, i) => (
                            <div key={i} className="rounded bg-white p-4 shadow-sm">
                                <strong className="mb-2 block">
                                    {renderTextFormat(t.name)} {t.rating && `(${t.rating}⭐)`}
                                </strong>
                                <p className="text-sm">{renderTextFormat(t.comment)}</p>
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
}
