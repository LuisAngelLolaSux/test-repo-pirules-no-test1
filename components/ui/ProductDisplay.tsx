'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ProductDisplayProps {
    products: {
        cantidad: number;
        nombreProducto: string;
        precioProducto: number;
        producto: {
            currency: string;
            imagenes: string[];
            nombre: string;
            variantesCombinadas: {
                precio: number;
                variante: string;
                subVariante?: string;
                imagenes: string[];
            }[];
        };
    }[];
    pedidoTotal: number;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(value);
};

export default function ProductDisplay({ products, pedidoTotal }: ProductDisplayProps) {
    const total = products.reduce((sum, product) => {
        const variantPrice =
            product.producto.variantesCombinadas[0]?.precio || product.precioProducto || 0;
        return sum + variantPrice * product.cantidad;
    }, 0);

    return (
        <Card className="mx-auto w-full max-w-2xl border-none shadow-none">
            <ScrollArea className="h-full max-h-[600px]">
                <div className="space-y-4 p-4">
                    {products.map((product, index) => {
                        const variant = product.producto.variantesCombinadas[0];
                        const price = variant?.precio || product.precioProducto || 0;
                        const totalPrice = price * product.cantidad;

                        return (
                            <div key={index} className="flex items-center gap-1 sm:gap-4">
                                {variant?.imagenes?.[0] || product.producto.imagenes?.[0] ? (
                                    <Image
                                        src={variant?.imagenes?.[0] || product.producto.imagenes[0]}
                                        alt={product.nombreProducto}
                                        width={70}
                                        height={70}
                                        className="rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="h-20 w-20 rounded-lg bg-muted" />
                                )}

                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate text-lg font-medium">
                                        {product.nombreProducto}
                                    </h3>
                                    {variant && (
                                        <Badge variant="secondary" className="mt-1">
                                            {`${variant.variante}${variant.subVariante ? `/${variant.subVariante}` : ''}`}
                                        </Badge>
                                    )}
                                </div>

                                <div className="text-right">
                                    <h1>
                                        {product.cantidad}x{' '}
                                        <span className="font-medium">
                                            {product.producto.currency === 'MXN'
                                                ? `MXN ${formatCurrency(totalPrice)}`
                                                : `USD ${formatCurrency(totalPrice)}`}
                                        </span>
                                    </h1>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>

            <div className="flex items-center justify-end gap-2 p-4 text-xl font-semibold">
                <span>Total:</span>
                <span className="font-medium">MXN {formatCurrency(pedidoTotal)}</span>
            </div>
        </Card>
    );
}
