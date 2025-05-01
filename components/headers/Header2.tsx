import { HeaderProps, TextFormat } from '../../types/components';

function renderTextFormat(val: string | TextFormat | undefined) {
    if (!val) return null;
    if (typeof val === 'string') return val;
    return <span className={val.className || ''}>{val.text}</span>;
}

export function Header2({ title, subtitle, ctaText, ctaLink, primaryColor = '#2563eb', secondaryColor = '#1e40af', textColor = '#1f2937', companyName }: HeaderProps) {
    const gradientStyle = {
        background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
    };

    return (
        <header style={gradientStyle} className="py-16">
            <div className="mx-auto max-w-7xl px-4 text-center">
                <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                    {renderTextFormat(title)}
                </h1>
                {subtitle && (
                    <p className="mx-auto mt-3 max-w-md text-base text-gray-100 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
                        {renderTextFormat(subtitle)}
                    </p>
                )}
                {ctaText && (
                    <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
                        <div className="rounded-md shadow">
                            <a
                                href={ctaLink}
                                className="flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium hover:bg-gray-50 md:px-10 md:py-4 md:text-lg"
                                style={{
                                    backgroundColor: 'white',
                                    color: primaryColor,
                                }}
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

export default Header2;
