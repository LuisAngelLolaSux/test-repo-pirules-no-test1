'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-fit rounded-lg bg-white shadow-lg">{children}</div>
        </div>
    );
};

export default Modal;
