import React from 'react';

interface PromotionHeaderProps {
    text?: string;
    link?: string;
    primaryColor?: string;
}

export function PromotionHeaderProps({ text, link, primaryColor }: PromotionHeaderProps) {
    return (
        <section
            style={{ backgroundColor: primaryColor || '#2563eb' }}
            className="py-4 text-center text-white"
        >
            <div className="container mx-auto px-4">
                <p className="text-lg">{text}</p>
                {link && (
                    <a href={link} className="ml-4 font-semibold text-white underline">
                        {link}
                    </a>
                )}
            </div>
        </section>
    );
}
