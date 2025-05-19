'use client';

import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '@/lib/utils';

interface ScrollGridProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
    columns?: number;
    rows?: number;
    gap?: number;
    children: React.ReactNode;
}

const ScrollGrid = React.forwardRef<
    React.ElementRef<typeof ScrollAreaPrimitive.Root>,
    ScrollGridProps
>(({ className, columns = 3, rows, gap = 4, children, ...props }, ref) => {
    return (
        <ScrollAreaPrimitive.Root
            ref={ref}
            className={cn('w-full overflow-hidden', className)}
            {...props}
        >
            <ScrollAreaPrimitive.Viewport className="h-full w-full">
                <div
                    className={cn('grid grid-cols-1', {
                        'md:grid-cols-2': columns >= 3,
                        'lg:grid-cols-3': columns >= 4,
                        'xl:grid-cols-4': columns >= 5,
                    })}
                    style={{
                        gridTemplateRows: rows ? `repeat(${rows}, minmax(0, 1fr))` : 'auto',
                        gridAutoRows: rows ? undefined : 'min-content',
                        gap: `${gap * 0.25}rem`,
                        minHeight: '100%',
                    }}
                >
                    {children}
                </div>
            </ScrollAreaPrimitive.Viewport>
            <ScrollAreaPrimitive.Scrollbar
                orientation="vertical"
                className="flex w-2.5 touch-none select-none border-l border-l-transparent p-[1px] transition-colors"
            >
                <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
            </ScrollAreaPrimitive.Scrollbar>
            <ScrollAreaPrimitive.Scrollbar
                orientation="horizontal"
                className="flex h-2.5 touch-none select-none flex-col border-t border-t-transparent p-[1px] transition-colors"
            >
                <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
            </ScrollAreaPrimitive.Scrollbar>
            <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>
    );
});
ScrollGrid.displayName = 'ScrollGrid';

export { ScrollGrid };
