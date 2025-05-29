'use client';
import React, { useContext, useEffect, useState } from 'react';
import { HorizontalDivider } from '@/components/ui/horizontalDivider';
import { Box, Bus, CheckCircle, Delivery, Home } from 'solar-icon-set';
import DeliveryTracker from '../_components/DeliveryTracker';
import { Check, Download, Receipt } from 'lucide-react';
import CardProviderIcon from '@/components/CardProviderIcon';
import ProductDisplay from '@/components/ProductDisplay';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import type { PedidoType } from '@/typings/types';
import { ShoppingCartContext } from '@/contexts/ShoppingCartContext/ShoppingCartContext';
import CartLoader from '@/components/CartLoader';
import { deleteCarritoFromDB } from '@/contexts/ShoppingCartContext/_utils/server';
import { getBotNumero } from '@/contexts/ShoppingCartContext/_utils/server';
import GoogleMap from '../_components/GoogleMap';

const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
});
const initialDeliverySteps = [
    {
        id: 0,
        title: 'Pedido Confirmado',
        time: currentTime,
        isCompleted: true,
        isCurrent: true,
        icon: <Check size={18} />,
    },
    {
        id: 1,
        title: 'Preparando el Pedido',
        time: '', // not happened yet
        isCompleted: false,
        isCurrent: false,
        icon: <Box size={18} />,
    },
    {
        id: 2,
        title: 'En Recolección',
        time: '', // not happened yet
        isCompleted: false,
        isCurrent: false,
        icon: <Bus iconStyle="Linear" />,
    },
    {
        id: 3,
        title: 'Enviado',
        time: '', // not happened yet
        isCompleted: false,
        isCurrent: false,
        icon: <Delivery iconStyle="Linear" />,
    },
    {
        id: 4,
        title: 'Entregado',
        time: '', // not happened yet
        isCompleted: false,
        isCurrent: false,
        icon: <Home iconStyle="Linear" />,
    },
];

async function fetchPedido(pedidoId: string): Promise<PedidoType> {
    const res = await fetch(`/api/pedidos?pedidoId=${pedidoId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) {
        throw new Error('Failed to fetch order');
    }
    return res.json();
}

interface SuccessPageProps {
    searchParams: { pedidoId?: string };
}
const SuccessPage = ({ searchParams }: SuccessPageProps) => {
    const [pedido, setPedido] = useState<PedidoType | null>(null);
    const [deliverySteps, setDeliverySteps] = useState(initialDeliverySteps);
    const { resetCartContext } = useContext(ShoppingCartContext);

    const [botNumero, setBotNumero] = useState('');

    const getUpdatedPedido = async (pedidoId: string) => {
        try {
            const fetchedPedido = await fetchPedido(pedidoId);
            if (!fetchedPedido.informacionPago) {
                return null;
            }
            return fetchedPedido;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    useEffect(() => {
        const pedidoId = searchParams?.pedidoId;
        if (pedidoId) {
            fetchPedido(pedidoId)
                .then((data) => {
                    if (data.informacionPago) {
                        setPedido(data);
                    } else {
                        const interval = setInterval(async () => {
                            const updated = await getUpdatedPedido(pedidoId);
                            if (updated) {
                                setPedido(updated);
                                clearInterval(interval);
                            }
                        }, 4000);
                    }
                })
                .catch(console.error);
        } else {
            setPedido({
                createdAt: new Date(),
                _id: '0000',
                statusPedido: 'Pendiente',
                productos: [],
                precioTotalPedido: null,
                exchangeRate: 0,
                informacionCliente: {
                    nombre: 'Cliente Desconocido',
                    email: 'email@desconocido.com',
                    telefono: null,
                    direccion: {
                        calle: 'Dirección desconocida',
                        ciudad: '',
                        colonia: '',
                        estado: '',
                        codigoPostal: '',
                        numeroExterior: '',
                        numeroInterior: '',
                        datosAdicionales: '',
                    },
                },
                informacionPago: null,
                metodoEnvio: {
                    name: 'Método desconocido',
                    price: null,
                    days: null,
                    id: null,
                },
                numeroRastreo: null,
                fechaEntregaEstimada: null,
                fechaRecoleccion: null,
                fechaCompletado: null,
                historialEstados: [],
                descuento: { codigo: null, monto: 0 },
                impuestos: 0,
                tarifaServicio: 0,
                notasCliente: null,
                agenteId: null,
                carritoId: null,
                errores: [],
                etiquetas: [],
                userId: '' as any,
                tipoPedido: 'Orden',
            });
        }
    }, [searchParams]);

    useEffect(() => {
        resetCartContext();
    }, []);

    useEffect(() => {
        if (pedido && pedido.carritoId) {
            deleteCarritoFromDB(pedido.carritoId)
                .then((res) => {
                    if (!res) {
                        console.error('Error deleting carrito');
                    }
                })
                .catch(console.error);
        }
    }, [pedido]);

    useEffect(() => {
        if (pedido) {
            getBotNumero(pedido.agenteId?.toString() || '')
                .then((num) => setBotNumero(num ?? ''))
                .catch(console.error);
        }
    }, [pedido]);

    if (!pedido || !pedido.informacionPago) {
        return <CartLoader />;
    }

    const cliente = pedido.informacionCliente;
    const direccion = cliente.direccion;
    const shippingAddress = `${direccion?.calle || ''}${direccion?.ciudad ? ', ' + direccion.ciudad : ''}`;
    const informacionPago = pedido.informacionPago;

    return (
        <div className="flex flex-col overflow-x-hidden sm:flex-row">
            <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#155024] py-10 sm:w-[40%] sm:py-5">
                <div className="absolute left-4 top-4 aspect-square rounded-full bg-[#0C3917] p-2">
                    <Image src="/static/LolaSux.png" alt="LolaSux" width={34} height={34} />
                </div>

                <div className="flex w-[85%] flex-col items-center justify-center gap-5">
                    <div className="text-center text-4xl font-semibold leading-[50px] text-white">
                        <h1>¡Gracias por tu compra,</h1>
                        <h1>{cliente.nombre?.split(',')[1] || cliente.nombre}!</h1>
                    </div>

                    <CheckCircle iconStyle="Bold" size={60} color="#34c85a" />
                    <div className="text-center text-white">
                        <h1>Tu pedido ha sido exitoso y está en proceso.</h1>
                        <h1>ID del pedido: #{pedido._id}</h1>
                    </div>

                    <HorizontalDivider />

                    <DeliveryTracker steps={deliverySteps} className="lg:px-28" />
                </div>
            </div>
            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white p-10 sm:w-[60%] sm:p-5">
                <div>
                    <div className="space-y-4">
                        <h1 className="text black text-2xl font-semibold">Detalles del Pedido:</h1>
                        <div className="space-y-1">
                            <h1>
                                <span className="font-medium">Contacto:</span> {cliente.nombre} (
                                {cliente.email})
                            </h1>
                            <h1>
                                <span className="font-medium">Dirección de Envío:</span>{' '}
                                {shippingAddress}
                            </h1>
                            <div className="my-4">
                                <GoogleMap address={shippingAddress} />
                            </div>
                            <h1>
                                <span className="font-medium">Método de Envío:</span>{' '}
                                {pedido.metodoEnvio.name}{' '}
                                <span className="text-gray-500">
                                    (
                                    {pedido.metodoEnvio.price
                                        ? `$${pedido.metodoEnvio.price}`
                                        : 'Gratis'}
                                    )
                                </span>
                            </h1>
                        </div>
                    </div>
                    <HorizontalDivider className="my-4" />
                    <div className="flex items-center justify-between">
                        <h1>Método de Pago </h1>
                        <div className="flex items-center gap-1">
                            <CardProviderIcon
                                provider={
                                    (informacionPago as any)?.paymentMethod?.[0]?.brand || 'visa'
                                }
                            />
                            <h1>**** **** ****</h1>
                            <h1>{(informacionPago as any)?.paymentMethod?.[0]?.last4 || '0000'}</h1>
                        </div>
                    </div>
                    <HorizontalDivider className="my-4" />
                    <div className="flex flex-col gap-2">
                        <h1>Detalles de la Orden:</h1>
                        <div className="sm:px-6">
                            <ProductDisplay
                                products={(pedido as any).productos || []}
                                pedidoTotal={pedido.precioTotalPedido || 0}
                            />
                        </div>
                    </div>
                    <div className="mt-20 flex w-full items-center justify-end gap-4">
                        <Button
                            variant={'lola'}
                            size={'lola'}
                            onClick={() => {
                                if (botNumero) {
                                    window.open(
                                        `https://wa.me/${botNumero}?text=Hola,%20quiero%20información%20sobre%20mi%20pedido%20con%20número%20de%20rastreo%20${pedido.numeroRastreo}`,
                                        '_blank',
                                    );
                                } else {
                                    window.open(
                                        `http://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/dashboard/agentes-whatsapp/chat/${pedido.agenteId}`,
                                        '_blank',
                                    );
                                }
                            }}
                        >
                            Seguir comprando
                        </Button>
                        <Button
                            variant={'outline'}
                            size={'icon'}
                            onClick={() => {
                                const receiptUrl = (informacionPago as any)?.stripeRecipt;
                                window.open(receiptUrl, '_blank');
                            }}
                        >
                            <Receipt size={18} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
