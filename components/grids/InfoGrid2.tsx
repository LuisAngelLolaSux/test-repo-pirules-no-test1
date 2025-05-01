import { InfoGridProps, TextFormat } from '../../types/components';

function renderTextFormat(val: string | TextFormat | undefined) {
    if (!val) return null;
    if (typeof val === 'string') return val;
    return <span className={val.className}>{val.text}</span>;
}

export function InfoGrid2({ title, items, primaryColor = '#2563eb', secondaryColor = '#1e40af', textColor = '#1f2937' }: InfoGridProps) {
    const gradientStyle = {
        background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
    };

    return (
        <div className="bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold" style={{ color: textColor }}>
                        {renderTextFormat(title)}
                    </h2>
                </div>
                <div className="mt-10">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((item, index) => (
                            <div key={index} className="pt-6">
                                <div className="flow-root rounded-lg bg-white px-6 pb-8">
                                    <div className="-mt-6">
                                        <div
                                            className="inline-flex -translate-y-1/2 transform items-center justify-center rounded-md p-3 text-white shadow-lg"
                                            style={gradientStyle}
                                        >
                                            {item.icon}
                                        </div>
                                        <h3
                                            className="mt-8 text-lg font-medium tracking-tight"
                                            style={{ color: textColor }}
                                        >
                                            {renderTextFormat(item.title)}
                                        </h3>
                                        <p
                                            className="mt-5 text-base"
                                            style={{ color: textColor, opacity: 0.7 }}
                                        >
                                            {renderTextFormat(item.description)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoGrid2;
