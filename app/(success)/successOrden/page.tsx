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
import { ShoppingCartContext } from '@/contexts/ShoppingCartContext/ShoppingCartContext';
import type { PedidoType } from '@/typings/types';
import CartLoader from '@/components/CartLoader';
import { deleteCarritoFromDB, getBotNumero } from '@/contexts/ShoppingCartContext/_utils/server';
import GoogleMap from '../_components/GoogleMap';

const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
});
const initialDeliverySteps = [
    {
        id: 1,
        title: 'Orden Realizada',
        time: currentTime,
        isCompleted: true,
        isCurrent: true,
        icon: <Check size={18} />,
    },
    {
        id: 2,
        title: 'Preparando Orden',
        time: '', // not happened yet
        isCompleted: false,
        isCurrent: false,
        icon: <Box size={18} />,
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

    useEffect(() => {
        const pedidoId = searchParams?.pedidoId;
        if (pedidoId) {
            fetchPedido(pedidoId).then(setPedido).catch(console.error);
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
                fechaCompletado: null,
                fechaRecoleccion: null,
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
                tipoPedido: 'Orden', //dummy data
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
                .then((numero) => setBotNumero(numero ?? ''))
                .catch(console.error);
        }
    }, [pedido]);

    if (!pedido) {
        return <CartLoader />;
    }

    const cliente = pedido.informacionCliente;
    const direccion = cliente.direccion;
    const shippingAddress = `${direccion?.calle || ''}${direccion?.ciudad ? ', ' + direccion.ciudad : ''}`;

    return (
        <div className="flex flex-col overflow-x-hidden sm:flex-row">
            {/* left container */}
            <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#155024] py-10 sm:w-[40%] sm:py-5">
                <div className="absolute left-4 top-4 aspect-square rounded-full bg-[#0C3917] p-2">
                    <Image src="/static/LolaSux.png" alt="LolaSux" width={34} height={34} />
                </div>

                <div className="flex w-[85%] flex-col items-center justify-center gap-5">
                    <div className="text-center text-4xl font-semibold leading-[50px] text-white">
                        <h1>¡Gracias por tu Orden,</h1>
                        <h1>{cliente.nombre?.split(',')[1] || cliente.nombre}!</h1>
                    </div>

                    <CheckCircle iconStyle="Bold" size={60} color="#34c85a" />
                    <div className="text-center text-white">
                        <h1>Tu orden ha sido creada exitosamente.</h1>
                        <h1>ID del la orden: #{pedido._id}</h1>
                    </div>

                    <HorizontalDivider />

                    <DeliveryTracker steps={deliverySteps} className="lg:px-28" />
                </div>
            </div>
            {/* right container */}
            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white p-10 sm:w-[60%] sm:p-5">
                <div>
                    <div className="space-y-4">
                        <h1 className="text-2xl font-semibold text-black">
                            Detalles del la orden:
                        </h1>
                        <div className="space-y-1">
                            <h1>
                                <strong>Nombre:</strong> {cliente.nombre}
                            </h1>
                            <h1>
                                <strong>Correo:</strong> {cliente.email}
                            </h1>
                            <h1>
                                <strong>Dirección de Envío:</strong> {shippingAddress}
                            </h1>
                            <div className="my-4">
                                <GoogleMap address={shippingAddress} />
                            </div>
                            <h1>
                                <strong>Teléfono:</strong> {cliente.telefono}
                            </h1>
                        </div>
                    </div>
                    <HorizontalDivider className="my-4" />
                    <div className="flex flex-col gap-2">
                        <h1>Producto:</h1>
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
                                        `https://wa.me/${botNumero}?text=Hola,%20quiero%20información%20sobre%20mi%20orden%20con%20ID%20${pedido._id}`,
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
