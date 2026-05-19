"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Clock, ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SellerPendingApprovalPage() {
  const { data: session } = useSession();

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-24 relative z-10">
      <Card className="w-full max-w-lg bg-white/[0.02] border-white/[0.06] backdrop-blur-xl rounded-2xl p-4 text-center shadow-2xl">
        <CardHeader className="space-y-3 flex flex-col items-center">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 animate-pulse">
            <Clock className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl font-bold font-plus-jakarta tracking-tight text-zinc-100">
            Application Under Review
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm max-w-sm mx-auto">
            Thanks for choosing our platform,{" "}
            <span className="text-zinc-200 font-medium">
              {session?.user?.name}
            </span>
            . Your request to open a vendor storefront is in the verification
            pipeline.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] text-xs text-zinc-400 space-y-2 text-left">
            <div className="flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <p>
                Our administration staff reviews tax registers, branding
                uniqueness, and store validation scopes within a standard 24-48
                hour window.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full sm:w-auto gap-2 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Marketplace</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
