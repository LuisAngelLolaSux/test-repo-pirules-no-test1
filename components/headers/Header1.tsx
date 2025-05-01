import { HeaderProps, TextFormat } from '../../types/components';

function renderTextFormat(val: string | TextFormat | undefined) {
    if (!val) return null;
    if (typeof val === 'string') return val;
    return <span className={val.className || ''}>{val.text}</span>;
}

export function Header1({ title, subtitle, ctaText, ctaLink, primaryColor = '#2563eb', textColor = '#1f2937' }: HeaderProps) {
    return (
        <header className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 text-center">
                <h1
                    className="text-4xl font-bold sm:text-5xl md:text-6xl"
                    style={{ color: textColor }}
                >
                    {renderTextFormat(title)}
                </h1>
                {subtitle && (
                    <p
                        className="mx-auto mt-3 max-w-md text-base sm:text-lg md:mt-5 md:max-w-3xl md:text-xl"
                        style={{ color: textColor, opacity: 0.7 }}
                    >
                        {renderTextFormat(subtitle)}
                    </p>
                )}
                {ctaText && (
                    <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
                        <div className="rounded-md shadow">
                            <a
                                href={ctaLink}
                                className="flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white md:px-10 md:py-4 md:text-lg"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {renderTextFormat(ctaText)}
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header1;
