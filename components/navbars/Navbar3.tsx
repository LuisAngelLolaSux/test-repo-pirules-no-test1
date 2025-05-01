import { NavbarProps, TextFormat } from '../../types/components';
import { ChevronDown } from 'lucide-react';

function renderTextFormat(val: string | TextFormat | undefined) {
    if (!val) return null;
    if (typeof val === 'string') return val;
    return <span className={val.className || ''}>{val.text}</span>;
}

export function Navbar3({ links, logo, primaryColor = '#2563eb', textColor = '#1f2937' }: NavbarProps) {
    return (
        <nav className="border-b bg-white">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex h-20 justify-between">
                    <div className="flex items-center space-x-16">
                        <div>
                            {logo ? (
                                <img src={logo} alt="Logo" className="h-8 w-auto" />
                            ) : (
                                <span className="text-2xl font-bold" style={{ color: textColor }}>
                                    Logo
                                </span>
                            )}
                        </div>

                        <div className="hidden items-center space-x-8 md:flex">
                            {links.map((link) => (
                                <a
                                    key={link.link}
                                    href={link.link}
                                    className="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors hover:opacity-80"
                                    style={{
                                        color: textColor,
                                    }}
                                >
                                    {renderTextFormat(link.name)}
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            className="rounded-md px-4 py-2 text-sm font-medium text-white"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar3;
