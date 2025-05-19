'use client';
import CheckoutHeader from '../checkout/_componentes/CheckoutHeader';

const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <CheckoutHeader />
            <div className="h-[calc(100vh-8vh)]">{children}</div>
        </div>
    );
};

export default CheckoutLayout;
