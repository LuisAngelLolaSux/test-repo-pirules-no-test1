import type React from 'react';

interface EmojiCardProps {
    emoji: string;
    label: string;
    selected?: boolean;
    onClick?: () => void;
}

export const EmojiCard: React.FC<EmojiCardProps> = ({
    emoji,
    label,
    selected = false,
    onClick,
}) => {
    return (
        <div
            onClick={onClick}
            className={`flex w-full cursor-pointer items-center justify-center rounded-lg p-4 transition-all duration-200 md:h-40 md:flex-col md:p-8 ${
                selected
                    ? 'border-2 border-green-600 bg-[#34C85A]/30 shadow-lg'
                    : 'border border-gray-100 bg-white hover:bg-[#34C85A]/30 hover:shadow-md'
            } `}
        >
            <div className="text-4xl md:mb-4 md:w-auto md:text-center">{emoji}</div>
            <div
                className={`ml-4 w-full text-left font-medium md:ml-0 md:text-center ${
                    emoji === '' ? 'text-xl' : 'text-lg'
                }`}
            >
                {label}
            </div>
        </div>
    );
};
