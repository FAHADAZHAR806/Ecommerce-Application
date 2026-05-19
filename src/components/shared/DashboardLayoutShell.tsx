"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface DashboardLayoutShellProps {
  title: string;
  navigationItems: SidebarItem[];
  children: React.ReactNode;
}

export default function DashboardLayoutShell({
  title,
  navigationItems,
  children,
}: DashboardLayoutShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex-grow flex min-h-[calc(100vh-4rem)] relative z-10">
      {/* Mobile Sidebar Toggle Header Strip */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          size="icon"
          className="h-12 w-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-xl text-white hover:opacity-90"
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation Sidebar Drawer */}
      <aside
        className={`fixed inset-y-16 left-0 z-40 w-64 border-r border-white/[0.06] bg-[#030014]/90 backdrop-blur-xl p-4 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6 mt-2">
          <div className="px-3">
            <p className="text-[10px] font-bold tracking-widest text-purple-400 uppercase">
              Management Portal
            </p>
            <h2 className="text-lg font-bold font-plus-jakarta text-zinc-200 mt-1">
              {title}
            </h2>
          </div>

          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group relative ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600/10 to-blue-600/10 text-purple-400 border border-purple-500/20"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02] border border-transparent"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${isActive ? "text-purple-400" : "text-zinc-500 group-hover:text-zinc-300"}`}
                    />
                    <span>{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-2 border-t border-white/[0.06] pt-4 text-[11px] text-zinc-600 text-center">
          Enterprise Multi-Vendor Engine v1.0
        </div>
      </aside>

      {/* Primary Dashboard Canvas Panel */}
      <main className="flex-1 lg:pl-64 min-w-0 flex flex-col bg-[#030014]">
        <div className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
