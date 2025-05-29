"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const initialDeliverySteps = [
  { id: 0, title: "Pedido Confirmado", isCompleted: true, isCurrent: true },
  { id: 1, title: "Preparando el Pedido", isCompleted: false, isCurrent: false },
  { id: 2, title: "En Recolección", isCompleted: false, isCurrent: false },
  { id: 3, title: "Enviado", isCompleted: false, isCurrent: false },
  { id: 4, title: "Entregado", isCompleted: false, isCurrent: false },
];

async function fetchPedido(pedidoId: string) {
    console.log("Fetching order with ID:", pedidoId);
  const res = await fetch(`/api/pedidos?pedidoId=${pedidoId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
}

interface SuccessPageProps {
  searchParams: { pedidoId?: string };
}

const SuccessPage = ({ searchParams }: SuccessPageProps) => {
  const [pedido, setPedido] = useState<any>(null);
  const [loadingPedido, setLoadingPedido] = useState(true);

  useEffect(() => {
    const pedidoId = searchParams?.pedidoId;
    if (pedidoId) {
      fetchPedido(pedidoId)
        .then((data) => {
          setPedido(data);
          setLoadingPedido(false);
        })
        .catch(() => setLoadingPedido(false));
    } else {
      setLoadingPedido(false);
    }
  }, [searchParams]);

  if (loadingPedido) {
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>;
  }

  if (!pedido) {
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
  }

  const cliente = pedido.informacionCliente || {};
  const direccion = cliente.direccion || {};
  const shippingAddress = `${direccion.calle || ""}${direccion.ciudad ? ", " + direccion.ciudad : ""}`;
  const informacionPago = pedido.informacionPago || {};

  return (
    <div className="flex flex-col overflow-x-hidden sm:flex-row">
      {/* left container */}
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#155024] py-10 sm:w-[40%] sm:py-5">
        <div className="absolute left-4 top-4 aspect-square rounded-full bg-[#0C3917] p-2">
          <Image src="/static/LolaSux.png" alt="LolaSux" width={34} height={34} />
        </div>
        <div className="flex w-[85%] flex-col items-center justify-center gap-5">
          <div className="text-center text-4xl font-semibold leading-[50px] text-white">
            <h1>¡Gracias por tu compra,</h1>
            <h1>{cliente.nombre?.split(",")[1] || cliente.nombre || "Cliente"}!</h1>
          </div>
          <div className="text-center text-white">
            <h1>Tu pedido ha sido exitoso y está en proceso.</h1>
            <h1>Número de Rastreo: #{pedido.numeroRastreo || "N/A"}</h1>
          </div>
        </div>
      </div>
      {/* right container */}
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white p-10 sm:w-[60%] sm:p-5">
        <div>
          <div className="space-y-4">
            <h1 className="text-black text-2xl font-semibold">Detalles del Pedido:</h1>
            <div className="space-y-1">
              <h1>
                <span className="font-medium">Contacto:</span> {cliente.nombre} ({cliente.email})
              </h1>
              <h1>
                <span className="font-medium">Dirección de Envío:</span> {shippingAddress}
              </h1>
              <h1>
                <span className="font-medium">Método de Envío:</span>{" "}
                {pedido.metodoEnvio?.name || "N/A"}{" "}
                <span className="text-gray-500">
                  ({pedido.metodoEnvio?.price ? `$${pedido.metodoEnvio.price}` : "Gratis"})
                </span>
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <h1>Método de Pago </h1>
            <div className="flex items-center gap-1">
              <h1>**** **** ****</h1>
              <h1>{informacionPago?.paymentMethod?.[0]?.last4 || "0000"}</h1>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <h1>Detalles de la Orden:</h1>
            <div className="sm:px-6">
              <ul>
                {(pedido.productos || []).map((prod: any, idx: number) => (
                  <li key={idx}>
                    {prod.nombre || prod.name} x {prod.cantidad || prod.quantity}
                  </li>
                ))}
              </ul>
              <div className="font-bold mt-2">Total: ${pedido.precioTotalPedido || 0}</div>
            </div>
          </div>
          <div className="mt-20 flex w-full items-center justify-end gap-4">
            <a
              href="/productos"
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition">
              Seguir comprando
            </a>
            {informacionPago?.stripeRecipt && (
              <a
                href={informacionPago.stripeRecipt}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border px-3 py-2 text-green-700 border-green-600 hover:bg-green-50 transition">
                Ver recibo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
