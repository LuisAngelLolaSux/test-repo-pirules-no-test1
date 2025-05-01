import { InfoGridProps, TextFormat } from '../../types/components';

function renderTextFormat(val: string | TextFormat | undefined) {
    if (!val) return null;
    if (typeof val === 'string') return val;
    return <span className={val.className}>{val.text}</span>;
}

export function InfoGrid3({ title, items, primaryColor = '#2563eb', textColor = '#1f2937' }: InfoGridProps) {
    return (
        <div className="bg-white py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2
                        className="text-base font-semibold uppercase tracking-wider"
                        style={{ color: primaryColor }}
                    >
                        {renderTextFormat(title)}
                    </h2>
                </div>
                <div className="mt-10">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="relative overflow-hidden rounded-lg bg-gray-50 px-6 pb-8 pt-12 text-center"
                            >
                                <div>
                                    <div className="text-center">
                                        <div
                                            className="inline-flex h-12 w-12 items-center justify-center rounded-md text-white"
                                            style={{ backgroundColor: primaryColor }}
                                        >
                                            {item.icon}
                                        </div>
                                    </div>
                                    <h3
                                        className="mt-6 text-lg font-medium"
                                        style={{ color: textColor }}
                                    >
                                        {renderTextFormat(item.title)}
                                    </h3>
                                    <p
                                        className="mt-4 text-base"
                                        style={{ color: textColor, opacity: 0.7 }}
                                    >
                                        {renderTextFormat(item.description)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoGrid3;
