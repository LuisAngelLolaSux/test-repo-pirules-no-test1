'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const Reload = () => {
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.has('reload')) {
            // Remover el parámetro de la URL
            const params = new URLSearchParams(searchParams);
            params.delete('reload');

            // Redirigir a la página sin el parámetro reload
            const newUrl = `${window.location.pathname}?${params.toString()}`;
            window.location.assign(newUrl);
        }
    }, [searchParams]);

    return null;
};

export default Reload;
