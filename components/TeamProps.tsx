import React from 'react';
import { TextFormat } from '../types/components';

interface TeamMember {
    photo?: string;
    name?: string | TextFormat;
    role?: string | TextFormat;
}

interface TeamPropsData {
    title?: string | TextFormat;
    text?: string | TextFormat;
    members?: TeamMember[];
    primaryColor?: string;
}

function renderTextFormat(val: string | TextFormat | undefined) {
    if (!val) return null;
    if (typeof val === 'string') return val;
    return <span className={val.className}>{val.text}</span>;
}

export function TeamProps({ title, text, members, primaryColor }: TeamPropsData) {
    return (
        <section className="bg-white py-10">
            <div className="container mx-auto px-4">
                <h2
                    className="mb-2 text-2xl font-semibold"
                    style={{ color: primaryColor || '#2563eb' }}
                >
                    {renderTextFormat(title)}
                </h2>
                <p className="mb-6">{renderTextFormat(text)}</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {members &&
                        members.map((m, i) => (
                            <div key={i} className="rounded border p-4 text-center">
                                {m.photo && (
                                    <img
                                        src={m.photo}
                                        alt={typeof m.name === 'string' ? m.name : m.name?.text}
                                        className="mx-auto mb-2 h-24 w-24 rounded-full object-cover"
                                    />
                                )}
                                <h4 className="font-bold">{renderTextFormat(m.name)}</h4>
                                <p className="text-sm">{renderTextFormat(m.role)}</p>
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
}
