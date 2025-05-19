import * as React from 'react';

import { cn } from '@/lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    'flex h-auto min-h-[60px] w-full rounded-md border border-input border-neutral-300 bg-transparent bg-white px-3 py-[10px] text-sm shadow-sm placeholder:text-muted-foreground focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
Textarea.displayName = 'Textarea';

export { Textarea };
