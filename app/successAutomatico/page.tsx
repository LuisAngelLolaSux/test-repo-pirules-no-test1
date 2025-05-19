'use client';
import React from 'react';

const SuccessPage = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#155024]">
            <div className="bg-white rounded-lg shadow-lg p-10 flex flex-col items-center">
                <img src="/static/LolaSux.png" alt="LolaSux" width={60} height={60} className="mb-6" />
                <h1 className="text-3xl font-bold text-[#155024] mb-4 text-center">
                    ¡Su orden fue realizada con éxito!
                </h1>
                <p className="text-gray-700 text-center">
                    Gracias por su compra. Pronto recibirá información sobre su pedido.
                </p>
            </div>
        </div>
    );
};

export default SuccessPage;
