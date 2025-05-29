"use client";
import React, { useEffect, useState } from "react";
import { HorizontalDivider } from "@/components/ui/horizontalDivider";
import { Box, Bus, CheckCircle, Delivery, Home } from "solar-icon-set";
import DeliveryTracker from "../_components/DeliveryTracker";
import { Check, XCircle } from "lucide-react";
import CardProviderIcon from "@/components/ui/CardProviderIcon";
import { ProductoType, PedidoType } from "@/typings/types";
import { Types } from "mongoose";
import ProductDisplay from "@/components/ui/ProductDisplay";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { rastreoAmPm } from "@/utils/AmPm/server";
import CartLoader from "@/components/CartLoader"; // <-- Newly added import
import { useCartStore } from "@/store/cartStore"; // <-- Add this import

interface SuccessPageProps {
  searchParams: { pedidoId?: string };
}

const initialDeliveryStepsAutomatic = [
  {
    id: 0,
    title: "Pedido Confirmado",
    time: "",
    isCompleted: false,
    isCurrent: false,
    icon: <Check size={18} />,
  },
  {
    id: 1,
    title: "Preparando el Pedido",
    time: "",
    isCompleted: false,
    isCurrent: false,
    icon: <Box size={18} />,
  },
  {
    id: 3,
    title: "En Recolección",
    time: "",
    isCompleted: false,
    isCurrent: false,
    icon: <Bus iconStyle="Linear" />,
  },
  {
    id: 4,
    title: "Recolectado",
    time: "",
    isCompleted: false,
    isCurrent: false,
    icon: <Delivery iconStyle="Linear" />,
  },
  {
    id: 5,
    title: "Entregado",
    time: "",
    isCompleted: false,
    isCurrent: false,
    icon: <Home iconStyle="Linear" />,
  },
];

const initialDeliveryStepsManual = [
  {
    id: 1,
    title: "Pedido Confirmado",
    time: "",
    isCompleted: false,
    isCurrent: false,
    icon: <Check size={18} />,
  },
  {
    id: 2,
    title: "Empaquetado",
    time: "",
    isCompleted: false,
    isCurrent: true,
    icon: <Box size={18} />,
  },
  {
    id: 3,
    title: "Enviado",
    time: "",
    isCompleted: false,
    isCurrent: false,
    icon: <Bus iconStyle="Linear" />,
  },
  {
    id: 4,
    title: "Entregado",
    time: "",
    isCompleted: false,
    isCurrent: false,
    icon: <Home iconStyle="Linear" />,
  },
];

async function fetchPedido(pedidoId: string): Promise<PedidoType> {
  const res = await fetch(`/api/pedidos?pedidoId=${pedidoId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch order");
  }
  return res.json();
}

const SuccessPage = ({ searchParams }: SuccessPageProps) => {
  const resetCartContext = useCartStore((state) => state.resetCartContext); // <-- Use Zustand store
  const [pedido, setPedido] = useState<PedidoType | null>(null);
  const [isManualOrder, setIsManualOrder] = useState<boolean>(false);
  const [deliverySteps, setDeliverySteps] = useState(
    isManualOrder ? initialDeliveryStepsManual : initialDeliveryStepsAutomatic
  );
  const [empresaEmail, setEmpresaEmail] = useState("");
  const [botNumero, setBotNumero] = useState("");
  const [loadingPedido, setLoadingPedido] = useState(true);

  const updateSteps = (
    latestState: number,
    steps: typeof initialDeliveryStepsAutomatic | typeof initialDeliveryStepsManual
  ) => {
    return steps.map((step) => {
      if (step.id < latestState) {
        return { ...step, isCompleted: true, isCurrent: false };
      } else if (step.id === latestState) {
        return { ...step, isCompleted: true, isCurrent: true };
      } else {
        return { ...step, isCompleted: false, isCurrent: false };
      }
    });
  };

  useEffect(() => {
    const pedidoId = searchParams?.pedidoId;
    if (pedidoId) {
      fetchPedido(pedidoId)
        .then(async (p) => {
          setPedido(p);
          // Determine if the order is manual using the p._id vs p.numeroRastreo comparison
          const manual = p.numeroRastreo === p._id;
          setIsManualOrder(manual);
          const defaultSteps = manual ? initialDeliveryStepsManual : initialDeliveryStepsAutomatic;
          setDeliverySteps(defaultSteps);

          if (!manual && p.numeroRastreo) {
            try {
              // Use dummy data or real data for tracking
              const useDummyRastreo = false; // change to true if needed
              let rastreoResponse: any;
              if (useDummyRastreo) {
                rastreoResponse = {
                  movimientos: [
                    {
                      fMovimiento: "2023-10-01T10:00:00Z",
                      movimientom: "2023-10-01T10:00:00Z",
                      movimientoId: "1",
                      codigo: "PC",
                      movimiento: "Pedido Confirmado",
                      oficina: "Main",
                    },
                    {
                      fMovimiento: "2023-10-01T10:30:00Z",
                      movimientom: "2023-10-01T10:30:00Z",
                      movimientoId: "2",
                      codigo: "PR",
                      movimiento: "Preparando el Pedido",
                      oficina: "Kitchen",
                    },
                    {
                      fMovimiento: "2023-10-01T11:00:00Z",
                      movimientom: "2023-10-01T11:00:00Z",
                      movimientoId: "3",
                      codigo: "RC",
                      movimiento: "En Recolección",
                      oficina: "Warehouse",
                    },
                    {
                      fMovimiento: "2023-10-01T11:30:00Z",
                      movimientom: "2023-10-01T11:30:00Z",
                      movimientoId: "4",
                      codigo: "ER-01",
                      movimiento: "Enviado",
                      oficina: "Dispatch",
                    },
                    {
                      fMovimiento: "2023-10-01T12:00:00Z",
                      movimientom: "2023-10-01T12:00:00Z",
                      movimientoId: "5",
                      codigo: "EN",
                      movimiento: "Entregado",
                      oficina: "Customer",
                    },
                  ],
                };
              } else {
                rastreoResponse = await rastreoAmPm({ Guia: p.numeroRastreo });
              }
              const movimientos = (rastreoResponse[0] || rastreoResponse)?.movimientos || [];
              let latestState = 3; // default active through "En Recolección"
              if (movimientos.length) {
                if (movimientos.some((m: { codigo: string }) => m.codigo === "EN")) {
                  latestState = 5;
                } else if (
                  movimientos.some((m: { codigo: string }) =>
                    ["CM", "SI", "ER-01"].includes(m.codigo)
                  )
                ) {
                  latestState = 4;
                }
              }
              let updatedSteps = updateSteps(latestState, defaultSteps);
              let movIndex = 0;
              updatedSteps = updatedSteps.map((step) => {
                if (step.isCompleted || step.isCurrent) {
                  if (step.title === "Pedido Confirmado") {
                    return {
                      ...step,
                      time: p.createdAt
                        ? new Date(p.createdAt).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "",
                    };
                  }
                  if (step.title === "Preparando el Pedido") {
                    if (movimientos[movIndex]) {
                      movIndex++;
                    }
                    return { ...step, time: "" };
                  }
                  if (step.title === "En Recolección") {
                    return {
                      ...step,
                      time: p.fechaRecoleccion
                        ? `Est.: ${p.fechaRecoleccion.split(",")[0].trim()}`
                        : "",
                    };
                  }
                  if (movimientos[movIndex]) {
                    const movementTime = new Date(
                      movimientos[movIndex].fMovimiento || movimientos[movIndex].movimientom
                    );
                    const formattedTime = movementTime.toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    movIndex++;
                    return { ...step, time: formattedTime };
                  }
                }
                return step;
              });

              const errorMapping: Record<string, string> = {
                IE: "El paquete no pudo ser entregado, se reintentará la entrega.",
                DAC: "El paquete se devolverá al proveedor.",
                DO: "El paquete se devolvió al proveedor.",
                TS: "El envío no puede ser entregado",
              };
              const errorMovement = movimientos.find(
                (m: { codigo: string }) => errorMapping[m.codigo]
              );
              if (errorMovement) {
                updatedSteps = updatedSteps.map((step) => {
                  if (step.id === latestState) {
                    return {
                      ...step,
                      title: errorMapping[errorMovement.codigo],
                      icon: <XCircle size={18} color="#ff0000" />,
                    };
                  }
                  return step;
                });
              }
              setDeliverySteps(updatedSteps);
            } catch (err) {
              console.error("Error fetching tracking info", err);
            }
          }
          setLoadingPedido(false); // <-- Loading complete after fetch
        })
        .catch((error) => {
          console.error(error);
          setLoadingPedido(false);
        });
    } else {
      // Fallback dummy pedido when no pedidoId is provided
      setPedido({
        createdAt: new Date(),
        _id: "0000",
        statusPedido: "Pendiente",
        productos: [],
        precioTotalPedido: null,
        exchangeRate: 0,
        informacionCliente: {
          nombre: "Cliente Desconocido",
          email: "email@desconocido.com",
          telefono: null,
          direccion: {
            calle: "Dirección desconocida",
            ciudad: "",
            colonia: "",
            estado: "",
            codigoPostal: "",
            numeroExterior: "",
            numeroInterior: "",
            datosAdicionales: "",
          },
        },
        informacionPago: null,
        metodoEnvio: {
          name: "Método desconocido",
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
        userId: "" as any,
        tipoPedido: "Orden",
      });
      setLoadingPedido(false);
    }
  }, [searchParams]);

  // New useEffect: fetch empresa email after pedido is set
  useEffect(() => {
    if (pedido && pedido.agenteId) {
      getEmpresaEmail(pedido.agenteId?.toString() || "")
        .then((email) => setEmpresaEmail(email ?? ""))
        .catch(console.error);
    }
  }, [pedido]);

  useEffect(() => {
    if (pedido && pedido.agenteId) {
      getBotNumero(pedido.agenteId?.toString() || "")
        .then((numero) => setBotNumero(numero ?? ""))
        .catch(console.error);
    }
  }, [pedido]);

  useEffect(() => {
    // Reset cart context on mount (like the original context usage)
    resetCartContext();
  }, [resetCartContext]);

  if (loadingPedido || !pedido || !botNumero) {
    return <CartLoader />;
  }

  const cliente = pedido.informacionCliente;
  const direccion = cliente.direccion;
  const shippingAddress = `${direccion?.calle || ""}${
    direccion?.ciudad ? ", " + direccion.ciudad : ""
  }`;

  return (
    <div className="flex flex-col overflow-x-hidden sm:flex-row">
      {/* Left container */}
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#323F49] py-10 sm:w-[40%] sm:py-5">
        <div className="absolute left-4 top-4 aspect-square rounded-full bg-white p-2">
          <Image src="/static/LolaSux.png" alt="LolaSux" width={34} height={34} />
        </div>
        <div className="flex w-[85%] flex-col items-center justify-center gap-5">
          <div className="text-center font-semibold leading-[50px] text-white md:text-2xl lg:text-4xl">
            <h1>¡Seguimiento de tu envío,</h1>
            <h1>{cliente.nombre?.split(",")[1] || cliente.nombre}!</h1>
          </div>
          <CheckCircle iconStyle="Bold" size={60} color="#34c85a" />
          <div className="text-center text-white">
            <h1>Tu pedido ha sido exitoso y está en proceso.</h1>
            <h1>
              {isManualOrder ? "Número de Pedido" : "Número de Rastreo"}: #
              {isManualOrder ? pedido?._id : pedido?.numeroRastreo}
            </h1>
          </div>
          <HorizontalDivider className="my-10" />
          <DeliveryTracker steps={deliverySteps} className="mb-10 sm:mb-0 lg:px-8" />
          <div className="flex w-full items-center justify-start gap-2 text-white">
            <h1 className="font-semibold">¿Tienes dudas?</h1>
            {empresaEmail ? (
              <a className="underline" href={`mailto:${empresaEmail}`}>
                <h1>Contactar Soporte</h1>
              </a>
            ) : (
              <span className="underline">
                <h1>Contactar Soporte</h1>
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Right container */}
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white p-10 sm:w-[60%] sm:p-5">
        <div>
          <div className="space-y-6">
            <h1 className="text-2xl font-medium text-black">Detalles del Envío:</h1>
            <div className="space-y-1">
              <h1>
                <span className="font-medium">Contacto:</span> {cliente.nombre} ({cliente.email})
              </h1>
              <h1>
                <span className="font-medium">Dirección de Envío:</span> {shippingAddress}
              </h1>
            </div>
          </div>
          <HorizontalDivider className="my-4" />
          <div className="flex items-center justify-between">
            <h1>Método de Envío:</h1>
            <h1 className="rounded-full bg-[#C2CDD6] p-2 text-[#323F49]">
              {pedido.metodoEnvio.name}
            </h1>
          </div>
          <div className="flex flex-col gap-2">
            <h1>Productos ordenados</h1>
            <div className="sm:px-6">
              <ProductDisplay
                products={(pedido as any).productos || []}
                pedidoTotal={pedido.precioTotalPedido || 0}
              />
            </div>
          </div>
          <div className="mt-20 flex w-full items-center justify-end">
            <Button
              variant={"lola"}
              size={"lola"}
              onClick={() => {
                if (botNumero) {
                  window.open(
                    `https://wa.me/${botNumero}?text=Hola,%20quiero%20información%20sobre%20mi%20pedido%20con%20número%20de%20rastreo%20${pedido.numeroRastreo || pedido._id}`,
                    "_blank"
                  );
                } else {
                  window.open(
                    `http://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/dashboard/agentes-whatsapp/chat/${pedido.agenteId}`,
                    "_blank"
                  );
                }
              }}>
              Ir a la Tienda
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
