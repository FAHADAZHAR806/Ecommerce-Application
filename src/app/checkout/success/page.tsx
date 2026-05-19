"use client";

import { useEffect, Suspense } from "react"; // <-- Ensure Suspense is imported
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// 1. Extract your core transactional UI into an internal component
function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get("session_id");

  // Automatically flush out cart contents upon an authenticated checkout settlement loop
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <Card className="w-full max-w-md bg-white/[0.03] border-white/[0.08] backdrop-blur-xl rounded-2xl p-2 text-center shadow-2xl shadow-purple-950/10">
      <CardHeader className="flex flex-col items-center justify-center pt-6">
        <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2 animate-bounce">
          <CheckCircle className="h-6 w-6 text-emerald-400" />
        </div>
        <CardTitle className="text-2xl font-bold font-plus-jakarta tracking-tight text-zinc-100">
          Payment Successful!
        </CardTitle>
        <CardDescription className="text-zinc-400 text-sm">
          Thank you for your purchase. Your invoice processing is complete.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {sessionId && (
          <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl text-left">
            <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">
              Stripe Reference ID
            </span>
            <span className="font-mono text-xs text-purple-300 break-all">
              {sessionId}
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            variant="outline"
            className="flex-1 rounded-xl border-white/[0.08] hover:bg-white/5 text-zinc-300"
          >
            <Link
              href="/products"
              className="flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Shop More</span>
            </Link>
          </Button>
          <Button
            asChild
            className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
          >
            <Link
              href="/customer"
              className="flex items-center justify-center gap-2"
            >
              <span>View Orders</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// 2. Export default layout wrapped completely in a Suspense perimeter
export default function CheckoutSuccessPage() {
  return (
    <div className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
      <Suspense
        fallback={
          <Card className="w-full max-w-md bg-white/[0.03] border-white/[0.08] backdrop-blur-xl rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-4" />
            <p className="text-zinc-400 text-sm font-medium">
              Verifying Stripe processing settlements...
            </p>
          </Card>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
