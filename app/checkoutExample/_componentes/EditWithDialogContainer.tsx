'use client';
import { Button } from '@/components/ui/button';
import React from 'react';

interface iEditWithDialogContainerProps {
    icon?: React.ReactNode;
    DialogComponent: React.ReactNode;
    label?: string;
}

type IEditButtonProps = React.HTMLAttributes<HTMLButtonElement>;
const EditButton = (props: IEditButtonProps) => {
    return (
        <Button size={'lola'} variant={'lolaSecondary'}>
            {props.children || (props.defaultValue ? <h1>Editar</h1> : <h1>Añadir</h1>)}
        </Button>
    );
};

const EditWithDialogContainer = ({
    icon,
    DialogComponent,
    label,
}: iEditWithDialogContainerProps) => {
    return (
        <div className="flex w-full items-center justify-between space-x-[20px] py-[10px]">
            <div className="flex items-center justify-center">{icon && icon}</div>
            <h1 className="flex-grow items-center truncate text-lg font-medium leading-tight text-black">
                {label}
            </h1>
            <div className="flex items-center">{DialogComponent}</div>
        </div>
    );
};

export { EditButton };
export default EditWithDialogContainer;
