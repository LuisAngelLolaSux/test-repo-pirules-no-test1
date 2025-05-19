import React from 'react';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

interface ITextareaWithLabelProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    className?: string;
    labelClassName?: string;
    primaryColor?: string;
}

const TextareaWithLabel = (props: ITextareaWithLabelProps): React.ReactElement => {
    const { primaryColor, style, ...rest } = props;
    return (
        <div className="flex w-full flex-col space-y-2">
            <Label htmlFor={props.id} className={cn(props.labelClassName)}>
                {props.label} {props.required ? '*' : null}
            </Label>
            <Textarea
                id={props.id}
                {...rest}
                style={
                    { '--focus-color': primaryColor || '#34c85a', ...style } as React.CSSProperties
                } // added
                className={cn(
                    'rounded-[10px] border border-neutral-300 bg-white px-3 py-[10px] focus:border-[var(--focus-color)] focus:outline-none focus:ring-1 focus:ring-[var(--focus-color)]',
                    props.className,
                )}
            />
        </div>
    );
};

export default TextareaWithLabel;
