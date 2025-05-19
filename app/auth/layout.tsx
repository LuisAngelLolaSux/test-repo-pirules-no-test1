"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Loader from "@/components/loader";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Si no ha  do montado, no renderizar nada
  // para evitar el parpadeo, preguntar si queremos el Loader aquí, creo que sería innecesario
  if (!mounted) {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAFAFA]">
      {/* Logo at the top left */}
      <div className="absolute left-6 top-4 flex items-center justify-center md:mb-4 md:justify-start">
        <Image src={"/LolaSux-multicolor.svg"} width={100} height={30} alt="logo_lola" />
      </div>

      {/* Full-screen loader */}
      {!imageLoaded && <Loader />}

      {/* Background image con visibilidad 0 si no ha cargado */}
      <div
        className={`absolute bottom-0 z-0 w-full overflow-hidden transition-opacity duration-500 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}>
        <Image
          src={"/auth/newLoginBg.svg"}
          alt="background"
          height={200}
          width={1920}
          priority
          className="h-auto w-full"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
      </div>

      {/* Content area */}
      <div
        className={`z-10 flex h-full w-full items-center justify-center overflow-y-auto transition-opacity duration-500 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}>
        {children}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 flex flex-row items-center space-x-4 text-sm text-white md:text-lg">
        <span>© Lola Sux</span>
        <span>|</span>
        <Link href="/contacto" className="hover:underline">
          Contacto
        </Link>
        <span>|</span>
        <Link href="/aviso-de-privacidad" target="_blank" className="hover:underline">
          Privacidad y términos
        </Link>
      </div>
    </div>
  );
};

export default AuthLayout;
