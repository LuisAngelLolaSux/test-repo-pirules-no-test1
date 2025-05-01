import { HeaderProps, TextFormat } from '../../types/components';

function renderTextFormat(val: string | TextFormat | undefined) {
    if (!val) return null;
    if (typeof val === 'string') return val;
    return <span className={val.className || ''}>{val.text}</span>;
}

export function Header3({ title, subtitle, ctaText, ctaLink, primaryColor = '#2563eb', textColor = '#1f2937' }: HeaderProps) {
    return (
        <header className="bg-gray-900 py-16">
            <div className="mx-auto max-w-7xl px-4">
                <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                            {renderTextFormat(title)}
                        </h1>
                        {subtitle && (
                            <p className="mt-3 text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl">
                                {renderTextFormat(subtitle)}
                            </p>
                        )}
                        {ctaText && (
                            <div className="mt-5 sm:mt-8">
                                <a
                                    href={ctaLink}
                                    className="inline-flex items-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white md:px-8 md:py-4 md:text-lg"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    {renderTextFormat(ctaText)}
                                </a>
                            </div>
                        )}
                    </div>
                    <div className="mt-12 lg:mt-0">
                        <div className="-mr-48 pl-4 sm:pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                            <div className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none">
                                <div className="h-64 w-full rounded-xl bg-gray-800"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header3;
