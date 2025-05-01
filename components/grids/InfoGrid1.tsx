import { InfoGridProps, TextFormat } from '../../types/components';

function renderTextFormat(val: string | TextFormat | undefined) {
    if (!val) return null;
    if (typeof val === 'string') return val;
    return <span className={val.className || ''}>{val.text}</span>;
}

export function InfoGrid1({ title, items, primaryColor = '#2563eb', textColor = '#1f2937' }: InfoGridProps) {
    return (
        <div className="bg-white py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2
                        className="text-3xl font-extrabold sm:text-4xl"
                        style={{ color: textColor }}
                    >
                        {renderTextFormat(title)}
                    </h2>
                </div>

                <div className="mt-10">
                    <div className="space-y-10 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10 md:space-y-0">
                        {items.map((item, index) => (
                            <div key={index} className="relative">
                                <div
                                    className="absolute flex h-12 w-12 items-center justify-center rounded-md text-white"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    {item.icon}
                                </div>
                                <p
                                    className="ml-16 text-lg font-medium leading-6"
                                    style={{ color: textColor }}
                                >
                                    {renderTextFormat(item.title)}
                                </p>
                                <p
                                    className="ml-16 mt-2 text-base"
                                    style={{ color: textColor, opacity: 0.7 }}
                                >
                                    {renderTextFormat(item.description)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoGrid1;
