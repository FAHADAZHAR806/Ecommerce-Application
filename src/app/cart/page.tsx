"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import {
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Loader2,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShoppingCartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartItemCount } =
    useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckoutRedirect = async () => {
    setIsCheckingOut(true);
    try {
      // MANDATORY RULE: Processing our secured checkout assembly line strictly via Axios
      const response = await axios.post("/api/checkout", { items: cart });

      if (response.status === 200 && response.data.url) {
        // Hand off the user cleanly to Stripe's securely hosted external billing checkout UI
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Checkout pipeline initialization encountered an error.";
      toast.error(msg);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center px-4 py-24 relative z-10">
        <div className="text-center max-w-sm rounded-2xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-xl p-8 shadow-xl">
          <ShoppingBag className="h-12 w-12 text-zinc-600 mx-auto mb-4 animate-bounce" />
          <h2 className="text-xl font-bold font-plus-jakarta text-zinc-200">
            Your cart is empty
          </h2>
          <p className="text-xs text-zinc-500 mt-2 mb-6">
            Explore our curated marketplace catalog to add elite engineering or
            design inventory components.
          </p>
          <Link href="/products">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-medium transition-all">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 flex-grow">
      <h1 className="text-3xl font-extrabold font-plus-jakarta tracking-tight text-zinc-100 mb-8">
        Review Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Active Items Component Stack */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.sku}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md transition-all hover:border-white/[0.1]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-16 w-16 rounded-lg object-cover bg-zinc-900 flex-shrink-0"
              />

              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-zinc-200 text-sm tracking-tight truncate">
                  {item.title}
                </h3>
                <p className="text-[11px] font-mono text-purple-400 mt-0.5">
                  {item.sku}
                </p>
                <p className="text-xs text-zinc-400 font-bold mt-1">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity Step Controllers */}
              <div className="flex items-center gap-2 bg-[#09090b] border border-white/[0.08] rounded-xl p-1">
                <button
                  onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs font-mono font-bold text-zinc-300 w-6 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Hard Item Deletion Trigger */}
              <button
                onClick={() => removeFromCart(item.sku)}
                className="h-9 w-9 rounded-xl flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Financial Order Aggregations Summary Box */}
        <div className="bg-white/[0.01] border border-white/[0.06] backdrop-blur-xl rounded-2xl p-6 space-y-6 shadow-2xl">
          <h3 className="font-bold font-plus-jakarta text-zinc-200 text-lg border-b border-white/[0.06] pb-4">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Total Selected Items</span>
              <span className="font-mono font-medium text-zinc-200">
                {cartItemCount} units
              </span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Estimated VAT / Shipping</span>
              <span className="font-mono text-emerald-400 uppercase text-xs font-bold tracking-wider">
                Free / Digital
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-3 border-t border-white/[0.04]">
              <span className="text-zinc-300">Total Order Valuation</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-plus-jakarta font-black text-xl">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            onClick={handleCheckoutRedirect}
            disabled={isCheckingOut}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-purple-500/10 flex items-center justify-center gap-2 group"
          >
            {isCheckingOut ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <>
                <CreditCard className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Initialize Secure Payment</span>
              </>
            )}
          </Button>

          <Link
            href="/products"
            className="flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors pt-2"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Continue Discovering Items</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
