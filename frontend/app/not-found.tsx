"use client";

import Image from "next/image";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="">
        <div className="mb-4">
          <Image
            alt="Logo"
            src="https://clublavictoria.com.ar/static/media/logo.6dafc533b0491900e9a6.png"
            width={128}
            height={96}
          />
        </div>
        <div className="flex gap-8 items-center h-full">
          <h2 className="text-2xl">404</h2>
          <div className="w-[1px] h-full bg-black"/>
          <p>Página no encontrada</p>
        </div>
      </div>
    </div>
  );
}
