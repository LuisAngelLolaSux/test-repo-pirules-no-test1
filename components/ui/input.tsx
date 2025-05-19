import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, icon, ...props }, ref) => {
        return (
            <div className={cn('relative w-full', props.containerClassName)}>
                <input
                    type={type}
                    className={cn(
                        'h-[44px] w-full rounded-md border border-neutral-300 bg-white px-3 text-sm shadow-sm transition-colors',
                        'placeholder:text-muted-foreground',
                        'focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500',
                        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
                        'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:bg-opacity-50 disabled:text-gray-400',
                        type === 'number' &&
                            '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                        type === 'password' &&
                            'disabled:cursor-default disabled:bg-white disabled:text-gray-400',
                        className,
                    )}
                    ref={ref}
                    {...props}
                />
                {icon && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 transform">
                        {icon}
                    </div>
                )}
            </div>
        );
    },
);
Input.displayName = 'Input';

export { Input };
