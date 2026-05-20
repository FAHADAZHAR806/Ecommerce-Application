"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingCart,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  const getDashboardLink = () => {
    const role = (session?.user as any)?.role;
    if (role === "admin") return "/admin";
    if (role === "vendor") return "/seller";
    return null;
  };

  const dashboardPath = getDashboardLink();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#030014]/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
        >
          BENTO<span className="text-purple-500">.</span>MARKET
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative p-2 hover:bg-white/5 text-zinc-400 hover:text-zinc-100 rounded-xl transition"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 bg-purple-600 text-[9px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </Link>

          {session ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="h-5 w-5 rounded-md bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                  {session.user?.name?.[0]}
                </div>
                <span className="text-xs font-medium text-zinc-300 hidden md:inline">
                  {session.user?.name}
                </span>
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-purple-400 font-bold border border-white/5">
                  {(session.user as any).role}
                </span>
              </div>

              {dashboardPath && (
                <Link
                  href={dashboardPath}
                  className="p-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl hover:bg-purple-500/20 transition flex items-center gap-1.5 text-xs font-bold"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" /> Panel
                </Link>
              )}

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition text-xs font-bold flex items-center gap-1"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/20 hover:opacity-90 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
