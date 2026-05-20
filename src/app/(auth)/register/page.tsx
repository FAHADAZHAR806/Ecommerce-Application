"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { UserPlus, Mail, Lock, User } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Direct registration interceptor implementation inline to reduce configuration dependencies
      const res = await fetch("/api/auth/register", {
        // We will map backend processing flow right below
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok)
        throw new Error(json.error || "Fault during structural execution.");

      toast.success(
        "Identity node injected! Route mapping redirection initialized.",
      );
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#09090b]/80 border border-white/[0.06] p-8 rounded-2xl backdrop-blur-xl space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Create System Account
          </h2>
          <p className="text-xs text-zinc-400">
            Initialize secure node parameters within global infrastructure maps.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">
              Public Label Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                required
                placeholder="Alexander Vance"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#030014] border border-white/[0.06] text-xs text-white focus:border-purple-500/50 outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">
              Network Target Mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                required
                placeholder="alex@bento.market"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#030014] border border-white/[0.06] text-xs text-white focus:border-purple-500/50 outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">
              Access Cryptphrase
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#030014] border border-white/[0.06] text-xs text-white focus:border-purple-500/50 outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">
              Operational Role Matrix Vector
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#030014] border border-white/[0.06] text-xs text-white focus:border-purple-500/50 outline-none transition"
            >
              <option value="customer">Customer Node (Asset Buyer)</option>
              <option value="vendor">
                Vendor Node (Asset Merchant/Seller)
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl text-xs transition duration-150 shadow-md hover:opacity-95"
          >
            {loading
              ? "Compiling Node Parameters..."
              : "Inject Matrix Core Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
