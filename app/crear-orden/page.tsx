"use client";

import React, { Suspense, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import DualPanelContainer from "@/components/DualPanelContainer";
import { useCartStore } from "@/store/cartStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import DeliveryOptionsForm from "./_componentes/CarrierOptions/Delivery/DeliveryOptions";
import CartReview from "./_componentes/CartReview";
import { Button } from "@/components/ui/button";
import CheckoutPageSkeleton from "./CheckoutPageSkeleton";
import { sentEmailsOrdenCreada } from "./_utils/server";
import { useCompanyDetails } from "@/utils/companyDetails";
import { fetchExchangeRate } from "@/utils/EnviosManuales/server";
import { useRouter } from "next/navigation";
import CartLoader from "@/components/CartLoader";
import ErrorModal from "../checkout/_componentes/ErrorModal";

const OptionsScreensSinRecoleccion = [
  {
    label: "Crear orden",
    content: <DeliveryOptionsForm />,
  },
];

const CheckoutPage = () => {
  const router = useRouter(); // Added: initialize router
  const {
    getTotals,
    cartItems: ShoppingCartState,
    setShippingOption,
    botId,
    carritoId,
  } = useCartStore();
  const { setActiveTab, buyerInfo, addressInfo } = useCheckoutStore();
  const { total } = getTotals();
  const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { companyDetails } = useCompanyDetails();

  useEffect(() => {
    const getExchange = async () => {
      const rate = await fetchExchangeRate("USD", "MXN");
      if (rate !== null) {
        const extraCentavos = 0.1;
        setExchangeRate(rate + extraCentavos);
      }
    };
    getExchange();
  }, []);

  useEffect(() => {
    if (setShippingOption) setShippingOption(null);
  }, []);

  const pedido = {
    _id: crypto.randomUUID(),
    statusPedido: "Cotizacion",
    productos: ShoppingCartState,
    precioTotalPedido: total,
    informacionCliente: {
      nombre: buyerInfo.lastName + ", " + buyerInfo.name,
      email: buyerInfo.email,
      telefono: buyerInfo.phone,
      direccion: {
        calle: addressInfo.street,
        ciudad: addressInfo.city,
        estado: addressInfo.state,
        codigoPostal: addressInfo.zip,
        numeroExterior: addressInfo.extNumber,
        numeroInterior: addressInfo.intNumber,
        datosAdicionales: addressInfo.additionalInfo,
        colonia: addressInfo.colony,
      },
    },
    informacionPago: null,
    metodoEnvio: null,
    numeroRastreo: null, //pendiente a logistica
    fechaEntregaEstimada: null, //pendiente a logistica
    fechaCompletado: null, //pendiente a logistica
    descuento: {
      codigo: null,
      monto: 0,
    },
    impuestos: 0,
    tarifaServicio: 0,
    notasCliente: addressInfo.additionalInfo,
    agenteId: botId,
    carritoId: carritoId,
    errores: [],
    etiquetas: [],
    exchangeRate, // incluce el exchange rate cuando este disponible
    tipoPedido: "Orden",
  };

  const validateFields = () => {
    const { direccion } = pedido.informacionCliente;
    const { email, telefono } = pedido.informacionCliente;

    // Validar dirección (todos los campos menos numeroInterior)
    if (
      !direccion.calle ||
      !direccion.ciudad ||
      !direccion.estado ||
      !direccion.codigoPostal ||
      !direccion.numeroExterior ||
      !direccion.colonia
    ) {
      setErrorMsg("Dirección incompleta");
      return false;
    }

    // Validar nombre completo y teléfono
    if (!buyerInfo.name || !buyerInfo.lastName || !telefono) {
      setErrorMsg("Datos personales incompletos");
      return false;
    }

    // Validar correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Correo no valido");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;

    setLoading(true);
    let didRedirect = false; // agregamos una bandera para la redireccion

    const clientInfo = {
      apellidos: buyerInfo.lastName,
      nombre: buyerInfo.name,
      correo: buyerInfo.email,
      telefono: buyerInfo.phone,
      direcciones: [
        {
          calle: addressInfo.street,
          ciudad: addressInfo.city,
          estado: addressInfo.state,
          codigoPostal: addressInfo.zip,
          numeroExterior: addressInfo.extNumber,
          numeroInterior: addressInfo.intNumber || null,
          datosAdicionales: addressInfo.additionalInfo || null,
          colonia: addressInfo.colony,
        },
      ],
    };

    try {
      const clientResponse = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formInfo: clientInfo }),
      });
      if (!clientResponse.ok) {
        setErrorMsg("Fallo al crear cliente");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error creating client", error);
      setErrorMsg("Error al crear cliente");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pedidoInfo: pedido, exchangeRate }),
      });

      if (response.ok) {
        toast.success("¡Orden enviada con éxito! redirigiendo...");
        await sentEmailsOrdenCreada(pedido);
        didRedirect = true; // se setea la bandera
        router.push(`/successOrden?pedidoId=${pedido._id}`); // redirecciona
        return; // salir antes
      } else {
        setErrorMsg("Error al enviar la orden. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Failed to submit order", error);
      setErrorMsg("Ocurrió un error al procesar la orden.");
    } finally {
      if (!didRedirect) {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <CartLoader />;
  }

  return (
    <>
      {errorMsg && (
        <ErrorModal
          errorMsg={errorMsg}
          onClose={() => setErrorMsg(null)}
          primaryColor={companyDetails?.colorPrimario}
        />
      )}{" "}
      <Suspense fallback={<CheckoutPageSkeleton />}>
        <div className="flex w-screen flex-col items-start justify-center gap-4 bg-[#FAFAFA] pt-4 max-lg:items-center lg:h-[calc(100vh-8vh)] lg:flex-row">
          <div className="flex w-full max-w-3xl flex-col px-4 lg:px-0">
            <DualPanelContainer
              primaryColor={companyDetails?.colorPrimario}
              onTabChange={(label) => setActiveTab(label)}
              tabs={OptionsScreensSinRecoleccion}
              label="Detalles del envío"
            />
            <Button
              style={{ backgroundColor: companyDetails?.colorPrimario }}
              variant={"lola"}
              className="hidden w-full lg:flex"
              size={"lola"}
              onClick={handleSubmit}
              disabled={loading}>
              {loading ? "Processing..." : "Enviar la orden"}
            </Button>
          </div>
          <div className="w-full max-w-md px-4 max-lg:max-w-3xl lg:px-0">
            <CartReview />
            <Button
              style={{ backgroundColor: companyDetails?.colorPrimario }}
              variant={"lola"}
              className="my-4 flex w-full lg:hidden"
              size={"lola"}
              onClick={handleSubmit}
              disabled={loading}>
              {loading ? "Processing..." : "Enviar la orden"}
            </Button>
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default CheckoutPage;
