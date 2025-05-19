import React from 'react';
import { Img, Heading, Row, Column } from '@react-email/components';
import { ProductMailType } from '../types';

interface ProductListItemProps {
    producto: ProductMailType;
    exchangeRate?: number;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ producto, exchangeRate }) => {
    // Default currency to MXN if not provided
    const currency = producto.currency || 'MXN';
    const formattedPrice = `${producto.precio.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} ${currency}`;

    // If the product is in USD and an exchangeRate exists, calculate the price in MXN
    const convertedPrice =
        producto.currency === 'USD' && exchangeRate
            ? (producto.precio * exchangeRate).toLocaleString('es-MX', {
                  style: 'currency',
                  currency: 'MXN',
              })
            : null;

    return (
        <div className="mb-2 flex w-full items-center justify-between">
            <div className="flex w-full space-x-5">
                <Row>
                    <Column>
                        <Img
                            src={producto.imagen}
                            alt={producto.nombre}
                            width={48}
                            height={48}
                            className="aspect-square rounded-[10px] bg-[#FAFAFA] object-cover"
                        />
                    </Column>
                    <Column>
                        <Heading my={0} className="mb-2" as="h4">
                            {producto.nombre}
                        </Heading>
                        {producto.variante && producto.subvariante && (
                            <div className="flex h-4 w-fit items-center rounded-full bg-[#E7EBEF] p-0.5 px-2">
                                <Heading as="h6" my={0} className="font-thin">
                                    {producto.variante}
                                </Heading>
                                {producto.subvariante && (
                                    <Heading as="h6" my={0} className="font-thin">
                                        /
                                    </Heading>
                                )}
                                <Heading as="h6" my={0} className="font-thin">
                                    {producto.subvariante}
                                </Heading>
                            </div>
                        )}
                    </Column>
                </Row>
            </div>
            <div className="flex w-32 space-x-5 text-xs sm:ml-16 sm:w-64 sm:text-sm">
                <Row>
                    <Column className="flex w-full gap-3">
                        <Heading as="h4" className="inline font-thin">
                            {producto.cantidad} x
                        </Heading>
                        <Heading as="h4" className="inline">
                            $ {formattedPrice}
                            {convertedPrice && (
                                <>
                                    {' '}
                                    <small>(precio MXN: {convertedPrice})</small>
                                </>
                            )}
                        </Heading>
                    </Column>
                </Row>
            </div>
        </div>
    );
};

export default ProductListItem;
