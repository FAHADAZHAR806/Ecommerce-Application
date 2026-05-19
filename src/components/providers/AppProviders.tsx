"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SessionProvider>
      {/* 
        Inject global notification toaster engine configured 
        specifically for a sleek premium dark UI layout 
      */}
      <CartProvider>
        <Toaster
          theme="dark"
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "rgba(9, 9, 11, 0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "#f4f4f5",
            },
          }}
        />
        {children}
      </CartProvider>
    </SessionProvider>
  );
}
