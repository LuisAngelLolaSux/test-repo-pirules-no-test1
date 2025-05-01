import { HeroProps, TextFormat } from '../../types/components';

function renderTextFormat(val: string | TextFormat | undefined) {
    if (!val) return null;
    if (typeof val === 'string') return val;
    return <span className={val.className || ''}>{val.text}</span>;
}

export function Hero2({ title, description, image, ctaText, ctaLink, primaryColor = '#2563eb' }: HeroProps) {
    return (
        <div className="relative">
            <div className="absolute inset-0">
                <img className="h-full w-full object-cover" src={image} alt="" />
                <div className="absolute inset-0 bg-gray-900 mix-blend-multiply" />
            </div>
            <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {renderTextFormat(title)}
                </h1>
                <p className="mt-6 max-w-3xl text-xl text-gray-300">
                    {renderTextFormat(description)}
                </p>
                {ctaText && (
                    <div className="mt-10">
                        <a
                            href={ctaLink}
                            className="inline-flex items-center rounded-md border border-transparent px-6 py-3 text-base font-medium"
                            style={{
                                backgroundColor: 'white',
                                color: primaryColor,
                            }}
                        >
                            {renderTextFormat(ctaText)}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Hero2;
