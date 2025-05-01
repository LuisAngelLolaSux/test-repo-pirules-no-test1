import { NavbarProps, TextFormat } from '../../types/components';

function renderTextFormat(val: string | TextFormat | undefined) {
    if (!val) return null;
    if (typeof val === 'string') return val;
    return <span className={val.className || ''}>{val.text}</span>;
}

export function Navbar2({ links, logo, primaryColor = '#2563eb', secondaryColor = '#1e40af' }: NavbarProps) {
    const gradientStyle = {
        background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
    };

    return (
        <nav style={gradientStyle} className="text-white">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex h-16 justify-between">
                    <div className="flex items-center">
                        {logo ? (
                            <img src={logo} alt="Logo" className="h-8 w-auto" />
                        ) : (
                            <span className="text-xl font-bold">Logo</span>
                        )}
                    </div>

                    <div className="flex items-center space-x-8">
                        {links.map((link) => (
                            <a
                                key={link.link}
                                href={link.link}
                                className="px-3 py-2 text-sm font-medium transition-opacity hover:opacity-75"
                            >
                                {renderTextFormat(link.name)}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar2;
