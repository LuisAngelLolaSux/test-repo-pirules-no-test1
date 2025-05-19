'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Danger } from 'solar-icon-set';

interface ErrorModalProps {
    errorMsg: string;
    onClose: () => void;
    primaryColor?: string; // Added: primaryColor prop
}

const ErrorModal: React.FC<ErrorModalProps> = ({ errorMsg, onClose, primaryColor }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
                {/* Warning Icon & Title */}
                <div className="flex items-center space-x-3">
                    <Danger className="text-red-500" size={32} color="FF0000" />
                </div>

                {/* Error Message */}
                <p className="mt-4 font-bold text-black">{errorMsg}</p>
                <p className="text-gray-600">
                    Verifica tu información o actualiza tu método de pago.
                </p>

                {/* Support Link */}
                <p className="mt-4 text-sm text-gray-500">
                    ¿Tienes alguna pregunta?{' '}
                    <a
                        href="https://wa.me/523320499331?text=Hola,%20Necesito%20ayuda%20para%20hacer%20mi%20pedido"
                        className="text-green-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Contactar soporte
                    </a>
                </p>

                <div className="mt-6 flex justify-end space-x-3">
                    <Button
                        style={{ backgroundColor: primaryColor }} // Updated: use primaryColor prop
                        className="text-white hover:opacity-90"
                        onClick={onClose}
                    >
                        Actualizar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;
