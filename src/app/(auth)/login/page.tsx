"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Lock, ShieldCheck } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    toast.success("Security authorization token synchronization successful!");

    const sessionRes = await fetch("/api/auth/session");
    const sessionData = await sessionRes.json();
    const role = sessionData?.user?.role;

    if (role === "admin") router.push("/admin");
    else if (role === "vendor") router.push("/seller");
    else router.push("/");

    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#09090b]/80 border border-white/[0.06] p-8 rounded-2xl backdrop-blur-xl space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-400 bg-purple-500/5 px-2.5 py-0.5 rounded-full border border-purple-500/10 mb-2">
            <ShieldCheck className="h-3 w-3" /> Identity Security Gate
          </div>
          <h2 className="text-2xl font-black text-white">Access Identity</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Email Vector
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                required
                placeholder="identity@bento.market"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#030014] border border-white/[0.06] text-xs text-white focus:border-purple-500/50 outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Security Key phrase
              </label>
              <Link
                href="/forgot-password"
                prefix=""
                className="text-xs text-purple-400 hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#030014] border border-white/[0.06] text-xs text-white focus:border-purple-500/50 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-600/10 active:scale-[0.99] transition duration-150"
          >
            {loading ? "Verifying Keys..." : "Authorize Portal Entry"}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 pt-2 border-t border-white/[0.04]">
          No membership index?{" "}
          <Link
            href="/register"
            className="text-purple-400 font-bold hover:underline"
          >
            Create Registration Node
          </Link>
        </p>
      </div>
    </div>
  );
}
