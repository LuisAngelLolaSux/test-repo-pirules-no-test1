"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, ShoppingCart, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useCompanyDetails } from "@/utils/companyDetails";
import useMeasure from "react-use-measure";
import { cn } from "@/lib/utils";
import {
  fetchExchangeRate,
  getBotProfilePhoto,
} from "@/utils/server";

export default function CartSummary() {
  const {
    cartItems: ShoppingCartState,
    getTotals,
    updateQuantity,
    removeFromCart,
    botId,
  } = useCartStore();
  const { companyDetails } = useCompanyDetails();
  const [isOpen, setIsOpen] = useState(false);
  const [ref, { height }] = useMeasure();
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [botImg, setBotImg] = useState<string | null>(null);

  const { subTotal } = getTotals();

  const handleQuantityChange = (id: string, variantId: string, newQuantity: string) => {
    const quantity = parseInt(newQuantity, 10);
    if (!isNaN(quantity) && quantity > 0) {
      updateQuantity(id, quantity);
    }
  };

  useEffect(() => {
    const getExchangeRate = async () => {
      const result = await fetchExchangeRate();
      if (result) {
        setExchangeRate(result.mid);
      }
    };
    getExchangeRate();
  }, []);

  useEffect(() => {
    const fetchBotImg = async () => {
      if (botId) {
        const img = await getBotProfilePhoto(botId);
        setBotImg(img);
      }
    };
    fetchBotImg();
  }, [botId]);

  const MXNPesos = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  return (
    <div className="flex max-h-[calc(100vh-11vh)] w-full flex-col space-y-1 overflow-hidden lg:w-auto">
      <Card className="h-fit w-full rounded-b-none shadow-none lg:max-w-md">
        <CardHeader className="flex flex-row items-center space-x-4 py-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-full">
            <Image
              src={botImg ? botImg : "/placeholder.svg"}
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
                  Resumen de la orden ({ShoppingCartState?.length || 0} Artículos)
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
                        const product = products.find((p) => p._id === item.productoId);
                        if (!product) return null;

                        const variant =
                          product.variantesCombinadas && product.variantesCombinadas.length > 0
                            ? product.variantesCombinadas.find((v) => v._id === item.variante)
                            : null;

                        const price = variant ? variant.precio : product.precio || 0;
                        const variantInfo = variant
                          ? `${variant.variante}/${variant.subVariante}`
                          : "Sin variante";
                        const currency = product.currency || "MXN";
                        const finalPrice = price * item.cantidad;

                        return (
                          <div
                            key={`${item.productoId}-${item.variante}`}
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
                                    onClick={() => removeFromCart(item.productoId)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  <Input
                                    containerClassName="w-fit"
                                    className="mr-[1px] h-[40px] w-[40px] p-0 text-center"
                                    min="1"
                                    value={item.cantidad}
                                    onChange={(e) =>
                                      handleQuantityChange(
                                        item.productoId,
                                        item.variante,
                                        e.target.value
                                      )
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
      <Card className="rounded-t-none pb-2 shadow-none">
        <CardContent className="py-2">
          <div className="flex flex-col gap-2">
            <div className="mt-3 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>MXN ${subTotal?.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
