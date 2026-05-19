"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#030014]/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Branding Logotype */}
        <Link
          href="/"
          className="flex items-center gap-2 font-plus-jakarta font-bold text-xl tracking-tight bg-gradient-to-r from-purple-400 via-indigo-200 to-blue-400 bg-clip-text text-transparent"
        >
          BENTO<span className="text-purple-500">.</span>MARKET
        </Link>

        {/* Global Action Nodes */}
        <div className="flex items-center gap-4">
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-white/5 text-zinc-400 hover:text-zinc-100 rounded-xl transition-all"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-blue-600 text-[10px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center border border-[#030014]">
                0
              </span>
            </Button>
          </Link>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 gap-2 pl-2 pr-3 hover:bg-white/5 text-zinc-300 hover:text-zinc-100 rounded-xl border border-white/[0.05] transition-all"
                >
                  <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {session.user.name?.[0]}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">
                    {session.user.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-[#09090b]/90 border-white/[0.08] backdrop-blur-xl rounded-xl p-1 text-zinc-300"
              >
                <DropdownMenuItem
                  asChild
                  className="hover:bg-white/5 focus:bg-white/5 rounded-lg cursor-pointer transition-colors"
                >
                  <Link
                    href={`/${session.user.role}`}
                    className="flex items-center gap-2 w-full py-2"
                  >
                    <LayoutDashboard className="h-4 w-4 text-purple-400" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="hover:bg-red-500/10 focus:bg-red-500/10 text-red-400 focus:text-red-400 rounded-lg cursor-pointer transition-colors py-2 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-medium shadow-lg shadow-purple-500/10 transition-all duration-300 transform active:scale-95">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
