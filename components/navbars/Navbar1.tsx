'use client';

import { NavbarProps, TextFormat } from '../../types/components';
import { Menu } from 'lucide-react';
import { useState } from 'react';

function renderTextFormat(val: string | TextFormat | undefined) {
    if (!val) return null;
    if (typeof val === 'string') return val;
    return <span className={val.className || ''}>{val.text}</span>;
}

export function Navbar1({ links, logo, primaryColor = '#2563eb', textColor = '#1f2937' }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white shadow-lg">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex h-16 justify-between">
                    <div className="flex items-center">
                        {logo ? (
                            <img src={logo} alt="Logo" className="h-8 w-auto" />
                        ) : (
                            <span className="text-xl font-bold" style={{ color: textColor }}>
                                Logo
                            </span>
                        )}
                    </div>

                    <div className="hidden items-center space-x-4 md:flex">
                        {links.map((link) => (
                            <a
                                key={link.link}
                                href={link.link}
                                className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:opacity-80"
                                style={{
                                    color: textColor,
                                }}
                            >
                                {renderTextFormat(link.name)}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            style={{ color: textColor }}
                            className="hover:opacity-75"
                        >
                            <Menu />
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden">
                    <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                        {links.map((link) => (
                            <a
                                key={link.link}
                                href={link.link}
                                className="block rounded-md px-3 py-2 text-base font-medium hover:opacity-80"
                                style={{
                                    color: textColor,
                                }}
                            >
                                {renderTextFormat(link.name)}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar1;
