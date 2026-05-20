"use client";

import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  CreditCard,
  Package,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock transactional history data linked to an active user session
const MOCK_ORDERS = [
  {
    id: "ORD-9832",
    date: "2026-05-18",
    total: 378,
    status: "Delivered",
    items: "Quantum Headphones x1, Vector Icon Set x1",
  },
  {
    id: "ORD-1102",
    date: "2026-05-20",
    total: 85,
    status: "Processing",
    items: "Oversized Heavyweight Hoodie x1",
  },
];

export default function CustomerDashboard() {
  const { data: session } = useSession();
  const { cartItems } = useCart() || { cartItems: [] };

  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-200">
        <p className="mb-4 text-zinc-400">
          Secure session authentication required.
        </p>
        <Button asChild>
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 relative z-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link
              href="/"
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Storefront
            </Link>
            <h1 className="text-3xl font-black font-plus-jakarta text-white tracking-tight">
              Welcome Back, {session.user.name || "Customer"}
            </h1>
            <p className="text-xs text-zinc-400">
              Manage your payment transactions and active order histories.
            </p>
          </div>
        </div>

        {/* Overview Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/[0.02] border-white/[0.06] rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Active Cart Items
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black font-mono text-zinc-100">
                {cartItems.length} Items
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/[0.06] rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Total Lifetime Invested
              </CardTitle>
              <CreditCard className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black font-mono text-zinc-100">
                $463.00
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/[0.06] rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Completed Deliveries
              </CardTitle>
              <Package className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black font-mono text-zinc-100">
                01 Package
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Order History Listing Tracker */}
        <div>
          <h2 className="text-xl font-bold text-zinc-200 font-plus-jakarta mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-400" /> Recent Purchase
            Orders
          </h2>
          <div className="space-y-3">
            {MOCK_ORDERS.map((order) => (
              <div
                key={order.id}
                className="bg-white/[0.01] border border-white/[0.05] hover:border-white/[0.08] transition-all p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold text-zinc-200">
                      {order.id}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-medium">
                      {order.date}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-1">
                    {order.items}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t sm:border-0 border-white/[0.04] pt-2 sm:pt-0">
                  <span className="font-mono font-bold text-zinc-100">
                    ${order.total}.00
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md flex items-center gap-1 ${
                      order.status === "Delivered"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {order.status === "Delivered" ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
