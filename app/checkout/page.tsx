"use client";

import React, { Suspense, useEffect, useState } from "react";
import DualPanelContainer from "@/components/DualPanelContainer";
import DeliveryOptionsForm from "./_componentes/CarrierOptions/Delivery/DeliveryOptions";
import CartReview from "./_componentes/CartReview";
import PickUpOptionsForm from "./_componentes/CarrierOptions/PickUp/PickUpOptions";
import { Button } from "@/components/ui/button";
import { useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import EditWithDialogContainer from "./_componentes/EditWithDialogContainer";
import CreditCardDialog from "./_componentes/CarrierOptions/Delivery/CreditCardDialog";
import { Card } from "solar-icon-set";
import Image from "next/image";
import CheckoutPageSkeleton from "./CheckoutPageSkeleton";
import { useCompanyDetails } from "@/utils/companyDetails";
import { getConfigEnvioCheckout, fetchExchangeRate } from "@/utils/EnviosManuales/server";
import CartLoader from "@/components/CartLoader";
import ErrorModal from "./_componentes/ErrorModal";
import { useCartStore } from "@/store/cartStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { getOpcionesDeEntregaAmPm } from "@/utils/AmPm/server";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

// Cargar la clave pública de Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function CheckoutPage() {
  const { setActiveTab, buyerInfo, addressInfo, cardInfo, setBuyerInfo, setCardInfo } =
    useCheckoutStore();
  const safeBuyerInfo = buyerInfo || { name: "", lastName: "", email: "", phone: "" };

  const OptionsScreensRecoleccion = [
    {
      label: "Entrega a domicilio",
      content: (
        <DeliveryOptionsForm buyerInfo={{ ...safeBuyerInfo, name: safeBuyerInfo.name || "" }} />
      ),
    },
    {
      label: "Recolectar",
      content: <PickUpOptionsForm />,
    },
  ];

  const OptionsScreensSinRecoleccion = [
    {
      label: "Entrega a domicilio",
      content: (
        <DeliveryOptionsForm buyerInfo={{ ...safeBuyerInfo, name: safeBuyerInfo.name || "" }} />
      ),
    },
  ];

  const stripe = useStripe();
  const elements = useElements();
  const {
    getTotals,
    setShippingOption,
    shippingOption,
    resetCartContext,
    cartItems: ShoppingCartState,
    botId,
    carritoId,
  } = useCartStore();
  const { total } = getTotals();
  const safeCardInfo = cardInfo || {};
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isPageReady, setIsPageReady] = useState(false);
  const { companyDetails } = useCompanyDetails();

  const hasUSDProduct = ShoppingCartState?.some(
    (producto) => (producto as any).currency === "USD" // assuming you add a currency field to product if needed
  );

  const pedido = {
    _id: crypto.randomUUID(),
    statusPedido: "Pendiente",
    productos: ShoppingCartState,
    precioTotalPedido: total,
    informacionCliente: {
      nombre: safeBuyerInfo.lastName + ", " + safeBuyerInfo.name,
      email: safeBuyerInfo.email,
      telefono: safeBuyerInfo.phone,
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
    metodoEnvio: shippingOption,
    numeroRastreo: null, //pendiente a logistica
    fechaEntregaEstimada: null, //pendiente a logistica
    fechaCompletado: null, //pendiente a logistica
    descuento: {
      //pendiente de ver todo
      codigo: null,
      monto: 0,
    },
    impuestos: 0,
    tarifaServicio: 0,
    notasCliente: addressInfo.additionalInfo,
    errores: [],
    etiquetas: [],
    agenteId: botId,
    carritoId: carritoId,
    // Added: attach exchangeRate if a product uses USD pricing
    exchangeRate: hasUSDProduct ? exchangeRate : undefined,
    // Removed static "tipoPedido" value; will be set later based on config
    tipoPedido: null,
  };

  const isDemo = false; // Set to true for demo mode

  useEffect(() => {
    setShippingOption(null);
  }, []);

  useEffect(() => {
    const getExchangeRate = async () => {
      const rate = await fetchExchangeRate("USD", "MXN");
      if (rate !== null) {
        const extraCentavos = 0.1;
        setExchangeRate(rate + extraCentavos); // Add 10% commission
        setIsPageReady(true);
      }
    };

    getExchangeRate();
  }, []);

  useEffect(() => {
    async function fetchAmpmDeliveryOptions() {
      if (addressInfo?.zip && ShoppingCartState?.length > 0) {
        try {
          const res = await getOpcionesDeEntregaAmPm(ShoppingCartState, addressInfo.zip);
          console.log("Opciones de entrega AM/PM:", res);
          // setShippingOption(...) or handle the outcome
        } catch (error) {
          console.error(error);
        }
      }
    }
    fetchAmpmDeliveryOptions();
  }, [addressInfo, ShoppingCartState]);

  // Enviar el pedido al servidor
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Submitting checkout form:", {
      buyerInfo,
      addressInfo,
      cardInfo,
      shippingOption,
    });
    e.preventDefault();
    setLoading(true);

    if (isDemo) {
      console.log("Demo mode: skipping real checkout flow.");
      alert("Demo checkout completed!");
      setLoading(false);
      return;
    }

    try {
      // First, create the client via the cliente API
      const clientInfo = {
        apellidos: safeBuyerInfo.lastName,
        nombre: safeBuyerInfo.name,
        correo: safeBuyerInfo.email,
        telefono: safeBuyerInfo.phone,
        direcciones: [
          {
            calle: addressInfo.street,
            ciudad: addressInfo.city,
            estado: addressInfo.state,
            codigoPostal: addressInfo.zip,
            numeroExterior: addressInfo.extNumber,
            numeroInterior: addressInfo.intNumber || null,
            datosAdicionales: addressInfo.additionalInfo || null,
          },
        ],
      };

      const clientResponse = await fetch("/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formInfo: clientInfo }),
      });

      if (!clientResponse.ok) {
        const errorText = await clientResponse.text();
        setErrorMsg(`Error al crear cliente: ${errorText}`);
        setLoading(false);
        return;
      }

      // Fetch the enviosConfig from products
      const configStr = await getConfigEnvioCheckout();
      const config = configStr ? JSON.parse(configStr) : null;
      const enviosConfig = config?.tipoDeEnvio || "Automatic";
      const tipoPedido = enviosConfig.trim().includes("Auto") ? "Automatico" : "Manual";

      // Merge derived tipoPedido into the pedido object
      const pedidoToSend = { ...pedido, tipoPedido };

      // Submit the pedido without clientInfo
      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pedidoInfo: pedidoToSend,
          exchangeRate, // exchangeRate is included here
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setErrorMsg(`Error al crear pedido: ${errorText}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      const { pedidoId, precioTotalPedido } = data;
      const paymentIntentResponse = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: precioTotalPedido,
          pedidoId,
          email: safeBuyerInfo.email,
          shippingOption,
          enviosConfig,
          frontExchangeRate: exchangeRate,
        }),
      });

      if (!paymentIntentResponse.ok) {
        setErrorMsg("Error al generar el intento de pago");
        setLoading(false);
        return;
      }

      const paymentIntentData = await paymentIntentResponse.json();

      if (stripe && elements) {
        const redirectUrl = `http://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/${
          enviosConfig.trim().includes("Auto") ? "successAutomatico" : "successManual"
        }?pedidoId=${pedidoId}`;
        const { error } = await stripe.confirmPayment({
          clientSecret: paymentIntentData.clientSecret,
          confirmParams: {
            return_url: redirectUrl,
            payment_method: safeCardInfo.id,
          },
        });

        if (error) {
          setErrorMsg("Error en la confirmación del pago");
          setLoading(false);
          return;
        } else {
          // console.log('Payment successful');
          resetCartContext();
        }
      }
    } catch (error: any) {
      setErrorMsg(`Error al enviar el pedido: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  // Add dummy payment methods and a state to select a method (moved above the conditional return)
  const paymentMethods = [
    { id: "pm_visa", label: "Visa ending in 1111" },
    { id: "pm_mc", label: "Mastercard ending in 2222" },
    { id: "pm_add", label: "Add new payment method" },
  ];
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0].id);

  // Show a loader while the page is not ready
  if (!isPageReady) {
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
      )}
      <Suspense fallback={<CheckoutPageSkeleton />}>
        <div className="flex w-screen flex-col items-start justify-center gap-4 bg-[#FAFAFA] pt-4 max-lg:items-center lg:h-[calc(100vh-8vh)] lg:flex-row">
          <div className="flex w-full max-w-3xl flex-col px-4 lg:px-0">
            <DualPanelContainer
              primaryColor={companyDetails?.colorPrimario}
              onTabChange={(label) => setActiveTab(label)}
              tabs={OptionsScreensSinRecoleccion}
              label="Detalles del envío"
            />

            {/* New Payment Method Dropdown */}
            <div className="my-4">
              <label className="block mb-2">Select Payment Method:</label>
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="p-2 border rounded">
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-fit w-full max-w-3xl overflow-hidden rounded-lg bg-white">
              <div className="flex flex-col items-start justify-center p-4">
                <h1 className="hidden text-lg font-bold leading-snug text-black md:block">Pago</h1>
                <EditWithDialogContainer
                  DialogComponent={
                    <CreditCardDialog
                      primaryColor={companyDetails?.colorPrimario}
                      cardInfo={safeCardInfo}
                    />
                  }
                  icon={
                    !safeCardInfo.card ? (
                      <Card size={32} />
                    ) : (
                      <Image
                        src={`/icons/cards/${safeCardInfo.card.brand}.svg`}
                        alt={`${safeCardInfo.card.brand} logo`}
                        width={32}
                        height={32}
                      />
                    )
                  }
                  label={
                    safeCardInfo.card
                      ? `···· ···· ···· ${safeCardInfo.card.last4}`
                      : "Agregar método de pago"
                  }
                />
              </div>
            </div>

            <Button
              style={{ backgroundColor: companyDetails?.colorPrimario }}
              variant={"lola"}
              className="hidden w-full lg:flex"
              size={"lola"}
              onClick={handleSubmit}
              disabled={loading}>
              {loading ? "Processing..." : "Hacer el pedido"}
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
              {loading ? "Processing..." : "Hacer el pedido"}
            </Button>
          </div>
        </div>
        <div>{safeBuyerInfo.lastName}</div>
      </Suspense>
    </>
  );
}
