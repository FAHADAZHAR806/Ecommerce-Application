"use client";

import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
} from "lucide-react";
import DashboardLayoutShell from "@/components/shared/DashboardLayoutShell";

const adminNavItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "User Management", href: "/admin/users", icon: Users },
  { label: "Seller Approvals", href: "/admin/approvals", icon: Users },
  { label: "Global Products", href: "/admin/products", icon: ShoppingBag },
  { label: "System Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export default function AdminDashboardPage() {
  // Mock statistical matrices representing core transactional parameters
  const statistics = [
    {
      label: "Gross Platform Volume",
      value: "$148,920.50",
      change: "+14.2%",
      color: "from-purple-500 to-indigo-500",
    },
    {
      label: "Active Platform Accounts",
      value: "3,842",
      change: "+21.8%",
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Vendor Verification Queue",
      value: "7 Accounts",
      change: "Action Req.",
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Platform Conversion Rate",
      value: "4.12%",
      change: "+0.4%",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <DashboardLayoutShell title="Admin Core" navigationItems={adminNavItems}>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold font-plus-jakarta tracking-tight text-zinc-100">
            System Overview
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Real-time macro transaction monitoring and configuration nodes.
          </p>
        </div>

        {/* Premium Bento UI Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-md group hover:border-purple-500/30 transition-all duration-300 shadow-xl"
            >
              {/* Dynamic Accent Lighting Effect */}
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
                    stat.change.startsWith("+")
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Asymmetric Bento Body Components */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Analytics Graph Stand-In Frame (Large Box) */}
          <div className="lg:col-span-2 bg-white/[0.01] border border-white/[0.04] rounded-2xl p-6 min-h-[350px] flex flex-col justify-between backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold font-plus-jakarta text-zinc-200">
                  Global Revenue Pipeline
                </h4>
                <p className="text-xs text-zinc-500">
                  Aggregated payments collected across all storefront
                  parameters.
                </p>
              </div>
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            </div>
            <div className="flex-grow flex items-center justify-center border border-dashed border-white/[0.06] rounded-xl mt-6 bg-[#030014]/50">
              <span className="text-xs text-zinc-600 font-medium tracking-wide uppercase">
                Chart Engine Mock (Phase 18 Integration)
              </span>
            </div>
          </div>

          {/* System Status Modals Box (Small Box) */}
          <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-6 flex flex-col justify-between backdrop-blur-xl">
            <div>
              <h4 className="text-base font-bold font-plus-jakarta text-zinc-200">
                Recent Server Log Activity
              </h4>
              <p className="text-xs text-zinc-500">
                Live configuration captures.
              </p>
            </div>
            <div className="space-y-3 mt-6 flex-grow">
              {[
                "User auth token successfully generated",
                "Database pool scaling triggered (+2)",
                "Stripe webhook processed payment_intent",
              ].map((log, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-white/[0.01] border border-white/[0.04] text-[11px] text-zinc-400 font-mono truncate"
                >
                  <span className="text-purple-500 mr-2">➜</span> {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayoutShell>
  );
}
