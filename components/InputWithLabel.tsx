import { cn } from '@/lib/utils';
import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface IInputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    className?: string;
    icon?: React.ReactNode;
    inputClassName?: string;
    ref?: React.Ref<HTMLInputElement>;
    primaryColor?: string;
}
const InputWithLabel = ({
    icon: propIcons,
    primaryColor,
    ...props
}: IInputWithLabelProps): React.ReactElement => {
    return (
        <div
            className={cn(
                'flex w-full flex-col space-y-2',
                props.className,
                props.disabled && 'cursor-not-allowed',
            )}
        >
            <Label htmlFor={props.id}>
                {props.label} {props.required ? '*' : null}
            </Label>
            <div className="relative w-full">
                <Input
                    id={props.id}
                    {...props}
                    style={{ '--focus-color': primaryColor || '#34c85a' } as React.CSSProperties}
                    className={cn(
                        'w-full rounded-[10px] border border-neutral-300 bg-white px-3 py-[20px] focus:border-[var(--focus-color)] focus:outline-none focus:ring-1 focus:ring-[var(--focus-color)]',
                        props.type === 'number' &&
                            '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                        props.disabled &&
                            'pointer-events-none cursor-not-allowed bg-gray-100 bg-opacity-50 text-gray-400',
                        props.inputClassName,
                    )}
                />
                {propIcons && <div className="absolute right-4 top-2">{propIcons}</div>}
            </div>
        </div>
    );
};

export default InputWithLabel;
