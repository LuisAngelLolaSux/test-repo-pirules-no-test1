import { cn } from '@/lib/utils';
import React from 'react';
import Lottie from 'lottie-react';
import cartloader from '@/lib/CartLoader.json';
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

const CartLoader = ({ className }: ILoaderProps) => {
    return (
        <div
            className={cn(
                'flex h-[calc(100vh)] w-full flex-col items-center justify-center gap-3 bg-white',
                className,
            )}
        >
            <Lottie className="h-56 w-56" animationData={cartloader} loop={true} />
        </div>
    );
};

export default CartLoader;
