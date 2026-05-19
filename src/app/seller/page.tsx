"use client";

import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  ClipboardList,
  BarChart3,
} from "lucide-react";
import DashboardLayoutShell from "@/components/shared/DashboardLayoutShell";

const sellerNavItems = [
  { label: "Store Metrics", href: "/seller", icon: LayoutDashboard },
  { label: "Add Product", href: "/seller/products/new", icon: PlusCircle },
  { label: "Inventory Stock", href: "/seller/products", icon: ShoppingBag },
  { label: "Order Fulfilment", href: "/seller/orders", icon: ClipboardList },
  { label: "Sales Statistics", href: "/seller/analytics", icon: BarChart3 },
];

export default function SellerDashboardPage() {
  const sellerStats = [
    {
      label: "Storefront Revenue",
      value: "$12,450.00",
      change: "+8.4%",
      color: "from-purple-500 to-blue-500",
    },
    {
      label: "Items Sold",
      value: "184 units",
      change: "+12.1%",
      color: "from-indigo-500 to-cyan-500",
    },
    {
      label: "Total Stock Inventory",
      value: "42 Skus",
      change: "Healthy",
      color: "from-teal-500 to-emerald-500",
    },
    {
      label: "Awaiting Shipment",
      value: "3 Orders",
      change: "Action Req.",
      color: "from-rose-500 to-orange-500",
    },
  ];

  return (
    <DashboardLayoutShell title="Vendor Hub" navigationItems={sellerNavItems}>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold font-plus-jakarta tracking-tight text-zinc-100">
            Storefront Metrics
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage inventories, observe store orders, and scale merchant sales.
          </p>
        </div>

        {/* Bento Stat Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sellerStats.map((stat, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-md group hover:border-purple-500/30 transition-all duration-300 shadow-xl"
            >
              <div
                className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`}
              />
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <div className="flex items-baseline justify-between mt-4">
                <h3 className="text-2xl font-bold font-plus-jakarta text-zinc-100 tracking-tight">
                  {stat.value}
                </h3>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                    stat.change.includes("Req.") || stat.change.includes("Down")
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Asymmetric Inventory Action Callout Box */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-purple-950/20 to-blue-950/20 border border-purple-500/10 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-2xl">
          <div>
            <h4 className="text-lg font-bold font-plus-jakarta text-zinc-200">
              Ready to expand your digital catalog?
            </h4>
            <p className="text-sm text-zinc-400 mt-1">
              Deploy fresh product configurations complete with options,
              descriptions, and stock criteria.
            </p>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-500/10 hover:scale-[1.02] active:scale-95 whitespace-nowrap">
            Launch New Product
          </button>
        </div>
      </div>
    </DashboardLayoutShell>
  );
}
