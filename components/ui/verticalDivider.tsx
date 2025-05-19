import React from 'react';

interface VerticalDividerProps {
    height?: string;
    color?: string;
    className?: string;
}

export function VerticalDivider({
    height = 'h-full',
    color = 'bg-gray-200',
    className = '',
}: VerticalDividerProps) {
    return (
        <div
            className={`w-px ${height} ${color} ${className}`}
            role="separator"
            aria-orientation="vertical"
        />
    );
}
