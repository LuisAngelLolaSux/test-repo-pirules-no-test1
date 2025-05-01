import { HeroProps, TextFormat } from '../../types/components';

function renderTextFormat(val: string | TextFormat | undefined) {
    if (!val) return null;
    if (typeof val === 'string') return val;
    return <span className={val.className || ''}>{val.text}</span>;
}

export function Hero3({ title, description, image, ctaText, ctaLink, primaryColor = '#2563eb', secondaryColor = '#1e40af' }: HeroProps) {
    const gradientStyle = {
        background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
    };

    return (
        <div className="bg-white">
            <div className="relative">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
                        <div className="absolute inset-0">
                            <img className="h-full w-full object-cover" src={image} alt="" />
                            <div
                                className="absolute inset-0 mix-blend-multiply"
                                style={gradientStyle}
                            />
                        </div>
                        <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
                            <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                                <span className="block text-white">{renderTextFormat(title)}</span>
                            </h1>
                            <p className="mx-auto mt-6 max-w-lg text-center text-xl text-gray-200 sm:max-w-3xl">
                                {renderTextFormat(description)}
                            </p>
                            {ctaText && (
                                <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                                    <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5 sm:space-y-0">
                                        <a
                                            href={ctaLink}
                                            className="flex items-center justify-center rounded-md border border-transparent px-4 py-3 text-base font-medium shadow-sm hover:bg-opacity-90 sm:px-8"
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero3;
