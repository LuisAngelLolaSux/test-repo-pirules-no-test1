import { CardWrapper } from './card-wrapper';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export const ErrorCard = () => {
    return (
        <CardWrapper
            headerLabel="Oops! Algo salio mal!"
            backButtonHref="/auth/login"
            backButtonLabel="Iniciar Sesión"
        >
            <div className="flex w-full items-center justify-center">
                <ExclamationTriangleIcon className="text-destructive" />
            </div>
        </CardWrapper>
    );
};
