'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from './ui/label';

interface ComboboxProps {
    onChange: (value: string) => void;
    label?: string;
    initialVal?: string;
    className?: string;
    placeholder?: string;
    contentClassName?: string;
    triggerClassName?: string;
    options: {
        label: string;
        value: string;
    }[];
}

export function Combobox(props: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(props.initialVal ? props.initialVal : '');

    React.useEffect(() => {
        props.onChange(value);
    }, [value]);

    return (
        <div className={cn('flex w-full flex-col space-y-2', props.className)}>
            <Label>{props.label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'flex items-center justify-between px-3 py-[20px]',
                            props.triggerClassName,
                        )}
                        size={'input'}
                        round={'input'}
                        role="combobox"
                        aria-expanded={open}
                    >
                        <h1 className="text-muted-foreground">
                            {value
                                ? props.options.find((option) => option.value === value)?.label
                                : props.placeholder
                                  ? props.placeholder
                                  : 'Selecciona una opción'}
                        </h1>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={cn('w-[500px] p-0', props.contentClassName)}>
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                {props.options.map((option) => (
                                    <CommandItem
                                        className="w-full"
                                        key={option.value}
                                        value={option.value}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? '' : currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value === option.value
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
