'use client';

import type React from 'react';
import Image from 'next/image';
import { useCompanyDetails } from '@/utils/companyDetails';

const CheckoutHeader: React.FC = () => {
    const { companyDetails, loadingCompanyInfo } = useCompanyDetails();

    if (loadingCompanyInfo) {
        // Retornamos un contenedor vacío en lugar del loader ya que el loader se ve mal en el header, si se llama aquí y en CartUI, se verán dos loaders.
        return <></>;
    }

    if (!companyDetails) {
        return <div className="hidden h-[8vh] w-full bg-slate-300"></div>;
    }

    return (
        <div
            className="relative h-[8vh] min-h-[50px] w-full overflow-hidden text-white"
            style={{ backgroundColor: companyDetails.colorPrimario }}
        >
            <Image
                src={companyDetails.logo || '/placeholder.svg'}
                alt={companyDetails.nombre || 'Logo'}
                height={32}
                width={102.55}
                className="absolute inset-0 m-auto max-h-full max-w-full object-contain"
            />
        </div>
    );
};

export default CheckoutHeader;
