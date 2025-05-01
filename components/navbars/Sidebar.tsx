import React from 'react';

interface SidebarProps {
    title?: string;
    children?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ title, children }) => {
    return (
        <div className="rounded bg-gray-50 p-4 shadow-md">
            {title && <h2 className="text-xl font-semibold">{title}</h2>}
            <div className="space-y-2">
                {children || <p className="text-gray-500">Sidebar content goes here.</p>}
            </div>
        </div>
    );
};
