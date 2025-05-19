"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, ShoppingCart, Trash2 } from "lucide-react";
import useMeasure from "react-use-measure";
import { Checkbox } from "@/components/ui/checkbox";
import { Gift } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useCompanyDetails } from "@/utils/companyDetails";
import InputWithLabel from "@/components/InputWithLabel";
import TextAreaWithLabel from "@/app/dashboard/agentes-whatsapp/registro-agente/_components/TextAreaWithLabel";
import PhoneCountryPicker from "@/components/PhoneInput/PhoneInput";
import { fetchExchangeRate } from "@/utils/server";
import { getBotProfilePhoto } from "@/utils/server";

export default function CartSummary() {
  const {
    cartItems: ShoppingCartState,
    products,
    getTotals,
    updateQuantity,
    removeFromCart,
    botId,
  } = useCartStore();
  const { giftDetails, setGiftDetailsField, activeTab } = useCheckoutStore();
  const { companyDetails, loadingCompanyInfo } = useCompanyDetails();
  const [isOpen, setIsOpen] = useState(false);
  const [ref, { height }] = useMeasure();
  const [giftRef, bounds] = useMeasure();
  const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [botImg, setBotImg] = useState<string | null>(null);

  const { total, subTotal, shippingPrice, fees } = getTotals();

  useEffect(() => {
    const getExchangeRate = async () => {
      const result = await fetchExchangeRate();
      if (result) {
        setExchangeRate(result.mid);
      }
    };
    const fetchBotImg = async () => {
      if (botId) {
        const botImg = await getBotProfilePhoto(botId);
        setBotImg(botImg);
      }
    };
    fetchBotImg();
    getExchangeRate();
  }, [botId]);

  const handleQuantityChange = (id: string, variantId: string, newQuantity: string) => {
    const quantity = parseInt(newQuantity, 10);
    if (!isNaN(quantity) && quantity > 0) {
      const currentItem = ShoppingCartState?.find(
        (item) => item.id === id && item.variant === variantId
      );
      if (currentItem) {
        const change = quantity - currentItem.quantity;
        updateQuantity(id, quantity);
      }
    }
  };

  const handleGiftCheckbox = () => {
    if (!isGift) {
      setIsGiftDialogOpen(true);
    } else {
      setIsGift(false);
      setGiftDetailsField("senderName", "");
      setGiftDetailsField("recipientName", "");
      setGiftDetailsField("message", "");
      setGiftDetailsField("recipientPhone", "");
    }
  };

  const handleGiftConfirm = () => {
    setIsGift(true);
    setIsGiftDialogOpen(false);
  };

  const MXNPesos = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  return (
    <div className="flex max-h-[calc(100vh-11vh)] w-full flex-col space-y-1 lg:w-auto">
      <Card className="h-fit w-full rounded-b-none shadow-none lg:max-w-md">
        <CardHeader className="flex flex-row items-center space-x-4 py-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-full">
            <Image
              src={botImg ? botImg : "/LolaCircle.svg"}
              alt="Company logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <CardTitle>{companyDetails?.nombre || "Company Name"}</CardTitle>
            <p className="text-sm text-muted-foreground"></p>
          </div>
        </CardHeader>
      </Card>
      <Card className="h-fit w-full overflow-y-scroll rounded-none shadow-none lg:max-w-md">
        <CardContent className="space-y-4 py-0">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="link"
                className={cn("my-4 flex w-full justify-between rounded-none p-2 py-[30px]")}>
                <span className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Resumen del carrito ({ShoppingCartState?.length || 0} Artículos)
                </span>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }}>
                  <div ref={ref}>
                    <ScrollArea className="mt-2 h-fit w-full pr-4">
                      {ShoppingCartState?.map((item) => {
                        const product = products?.find((p) => p._id === item.id);
                        if (!product) return null;

                        const variant =
                          product.variantesCombinadas && product.variantesCombinadas.length > 0
                            ? product.variantesCombinadas.find((v) => v._id === item.variant)
                            : null;

                        const price = variant ? variant.precio : product.precio || 0;
                        const variantInfo = variant
                          ? `${variant.variante}/${variant.subVariante}`
                          : "Sin variante";

                        const currency = product.currency || "MXN";
                        const finalPrice = price * item.quantity;

                        return (
                          <div
                            key={`${item.id}-${item.variant}`}
                            className="mb-4 flex items-center pb-4">
                            <Image
                              src={product.imagenes[0] || "/placeholder.svg"}
                              alt={product.nombre}
                              width={64}
                              height={64}
                              objectFit="cover"
                              className="rounded-md"
                            />
                            <div className="ml-2 flex w-full items-center justify-between gap-0">
                              <div className="space-y-2">
                                <h3 className="font-medium">{product.nombre}</h3>
                                {product.variantesCombinadas.length > 0 && (
                                  <p className="w-fit rounded-full bg-[#DAE1E7] px-2 py-1 text-xs text-black">
                                    {variantInfo}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col justify-end">
                                <div className="mt-2 flex items-center justify-end">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFromCart(item.id, item.variant)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  <Input
                                    containerClassName="w-fit"
                                    className="mr-[1px] h-[40px] w-[40px] p-0 text-center"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      handleQuantityChange(item.id, item.variant, e.target.value)
                                    }
                                  />
                                </div>
                                <p className="mt-4 text-sm font-medium">
                                  {currency === "USD" ? "USD $" : "MXN $"}
                                  {finalPrice.toFixed(2)}
                                </p>
                                {currency === "USD" && exchangeRate && (
                                  <p className="text-xs text-gray-600">
                                    Estimado en MXN ${(finalPrice * exchangeRate).toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </ScrollArea>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Collapsible>
        </CardContent>
      </Card>
      {/* TODO ACTIVAR ENVIAR COMO REGALO */}
      {/* <AnimatePresence initial={false} mode="wait">
                {activeTab === 'Entrega a domicilio' ? (
                    <Card className="h-fit w-full rounded-none shadow-none lg:max-w-md">
                        <CardContent className="py-0">
                            <>
                                <motion.div
                                    animate={{
                                        height: bounds.height,
                                        opacity: 1,
                                        display: 'flex',
                                    }}
                                    initial={false}
                                    exit={{
                                        opacity: 0,
                                        height: 0,
                                        transitionEnd: {
                                            display: 'none',
                                        },
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center justify-between space-x-2"
                                >
                                    <div
                                        className="flex w-full items-center justify-between"
                                        ref={giftRef}
                                    >
                                        <div className="flex items-center justify-between space-x-1 p-2 py-[30px]">
                                            <Gift className="h-5 w-5 text-muted-foreground" />
                                            <label
                                                htmlFor="gift"
                                                className="pl-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Enviar como regalo
                                            </label>
                                        </div>
                                        <Checkbox
                                            id="gift"
                                            checked={isGift}
                                            onCheckedChange={handleGiftCheckbox}
                                        />
                                    </div>
                                </motion.div>

                                <Dialog open={isGiftDialogOpen} onOpenChange={setIsGiftDialogOpen}>
                                    <DialogContent>
                                        <DialogHeader className="mb-4">
                                            <DialogTitle>Enviar como regalo</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <InputWithLabel
                                                label="¿De parte de quién es el regalo?"
                                                placeholder="Ej. John Due"
                                                id="senderName"
                                                value={giftDetails.senderName}
                                                onChange={(e) =>
                                                    setGiftDetailsField(
                                                        'senderName',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <InputWithLabel
                                                label="¿Para quién es el regalo?"
                                                id="recipientName"
                                                value={giftDetails.recipientName}
                                                placeholder="Ej. Oscar Flowers"
                                                onChange={(e) =>
                                                    setGiftDetailsField(
                                                        'recipientName',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <PhoneCountryPicker
                                                onPhoneChange={(fullNumber) =>
                                                    setGiftDetailsField(
                                                        'recipientPhone',
                                                        fullNumber,
                                                    )
                                                }
                                            />
                                            <TextAreaWithLabel
                                                id="giftMessage"
                                                label="Mensaje de regalo"
                                                placeholder="Ej. ¡Feliz cumpleaños!"
                                                value={giftDetails.message}
                                                onChange={(e) =>
                                                    setGiftDetailsField('message', e.target.value)
                                                }
                                            />
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="lolaSecondary" size={'lola'}>
                                                    Cancelar
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                onClick={handleGiftConfirm}
                                                variant={'lola'}
                                                size={'lola'}
                                            >
                                                Guardar
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </>
                        </CardContent>
                    </Card>
                ) : null}
            </AnimatePresence> */}
      <Card className="rounded-t-none pb-2 shadow-none">
        <CardContent className="py-2">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Total del pedido</h3>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>MXN ${(subTotal ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Costo de envío</span>
              <span>MXN ${(shippingPrice ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tarifas</span>
              {/* <span className="text-muted-foreground line-through">MXN $10.00</span> */}
              <span>MXN ${(fees ?? 0).toFixed(2)}</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>MXN ${(total ?? 0).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
