import React from 'react';

interface FAQQuestion {
    question?: string;
    answer?: string;
}

interface FAQCategory {
    category?: string;
    questions?: FAQQuestion[];
}

interface FAQPropsData {
    categories?: FAQCategory[];
    primaryColor?: string;
}

export function FAQProps({ categories, primaryColor }: FAQPropsData) {
    return (
        <section className="bg-gray-50 py-10">
            <div className="container mx-auto px-4">
                <h2
                    className="mb-4 text-2xl font-bold"
                    style={{ color: primaryColor || '#2563eb' }}
                >
                    FAQ
                </h2>
                {categories &&
                    categories.map((cat, i) => (
                        <div key={i} className="mb-6">
                            <h3 className="mb-2 text-xl font-semibold">{cat.category}</h3>
                            {cat.questions &&
                                cat.questions.map((q, j) => (
                                    <div key={j} className="mb-4">
                                        <strong className="mb-1 block">{q.question}</strong>
                                        <p className="text-sm">{q.answer}</p>
                                    </div>
                                ))}
                        </div>
                    ))}
            </div>
        </section>
    );
}
