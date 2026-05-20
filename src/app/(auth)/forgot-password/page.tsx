"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      "Security token recovery link transmitted! Verify your mailbox layers.",
    );
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#09090b]/80 border border-white/[0.06] p-8 rounded-2xl space-y-5 backdrop-blur-xl">
        <div className="text-center space-y-1">
          <KeyRound className="h-8 w-8 mx-auto text-purple-400 mb-2" />
          <h2 className="text-xl font-black text-white">
            Reset Credentials Key
          </h2>
          <p className="text-xs text-zinc-400 max-w-[260px] mx-auto">
            Input registered parameters to trigger secure recovery sequences.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-1">
              <input
                type="email"
                required
                placeholder="identity@bento.market"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#030014] border border-white/[0.06] text-xs text-white outline-none focus:border-purple-500/50 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 font-bold text-xs rounded-xl text-white transition"
            >
              Transmit Token Request
            </button>
          </form>
        ) : (
          <div className="text-center p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl text-xs text-purple-300">
            A temporary initialization patch link has been dispatched to your
            identity mailbox network address.
          </div>
        )}

        <div className="text-center pt-2 border-t border-white/[0.04]">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Authorization Terminal
          </Link>
        </div>
      </div>
    </div>
  );
}
