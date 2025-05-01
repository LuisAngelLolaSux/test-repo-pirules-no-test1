import { HeroProps, TextFormat } from '../../types/components';

function renderTextFormat(val: string | TextFormat | undefined) {
    if (!val) return null;
    if (typeof val === 'string') return val;
    return <span className={val.className || ''}>{val.text}</span>;
}

export function Hero1({ title, description, image, ctaText, ctaLink, primaryColor = '#2563eb', textColor = '#1f2937' }: HeroProps) {
    return (
        <div className="relative overflow-hidden bg-white">
            <div className="mx-auto max-w-7xl">
                <div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
                    <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1
                                className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
                                style={{ color: textColor }}
                            >
                                {renderTextFormat(title)}
                            </h1>
                            <p
                                className="mt-3 text-base sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0"
                                style={{ color: textColor, opacity: 0.7 }}
                            >
                                {renderTextFormat(description)}
                            </p>
                            {ctaText && (
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
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
                    </main>
                </div>
            </div>
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <img
                    className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"
                    src={image}
                    alt=""
                />
            </div>
        </div>
    );
}

export default Hero1;
