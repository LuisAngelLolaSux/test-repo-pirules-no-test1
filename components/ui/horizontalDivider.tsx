import React from 'react';

interface DividerProps {
    className?: string;
    color?: string;
    thickness?: number;
}

export function HorizontalDivider({
    className = '',
    color = 'bg-gray-200',
    thickness = 1,
}: DividerProps) {
    return <div className={`w-full ${color} ${className}`} style={{ height: `${thickness}px` }} />;
}
