import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';
import { AnimatedLoader } from './loaderAnimated';

interface LoaderProps {
    size?: 'full' | undefined;
}

export const LoaderOG: React.FC<LoaderProps> = ({ size }) => {
    let sizeClassname = '100vh';
    if (size == 'full') {
        sizeClassname = '100%';
    }
    return (
        <div className={`flex items-center justify-center`} style={{ height: sizeClassname }}>
            <div
                className={`h-12 w-12 animate-spin rounded-full border-t-4 border-solid border-primary-lola`}
            ></div>
        </div>
    );
};

interface ILoaderProps {
    className?: string;
}

const Loader = ({ className }: ILoaderProps) => {
    return (
        <div
            className={cn(
                'flex h-[calc(100vh)] w-full flex-col items-center justify-center gap-3 bg-gray-100',
                className,
            )}
        >
            <AnimatedLoader duration={2000} />
        </div>
    );
};

export default Loader;
