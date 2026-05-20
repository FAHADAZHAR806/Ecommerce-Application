"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { PackagePlus } from "lucide-react";
import { toast } from "sonner";

export default function SellerWorkspace() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    category: "UI Components",
    stock: "10",
  });
  const [loading, setLoading] = useState(false);

  if (status === "loading")
    return (
      <div className="min-h-screen bg-[#030014] text-white flex items-center justify-center">
        Authentic security handshakes checking...
      </div>
    );
  if (!session || (session.user as any).role !== "vendor") {
    router.push("/login");
    return null;
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(
          "Asset schema transmitted successfully! Staged for deployment indexing pipeline.",
        );
        router.push("/");
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-[#09090b]/90 border border-white/[0.06] p-8 rounded-2xl space-y-6 backdrop-blur-2xl">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <PackagePlus className="text-blue-400 h-5 w-5" /> Deploy Market
              Asset
            </h2>
            <p className="text-xs text-zinc-400">
              Transmit structural components directly onto localized tracking
              array.
            </p>
          </div>

          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-zinc-400 uppercase tracking-wider font-bold">
                Asset Label Title
              </label>
              <input
                type="text"
                required
                placeholder="Tailwind Glassmorphism Layout Kit"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#030014] border border-white/[0.06] text-white outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-400 uppercase tracking-wider font-bold">
                  Price Matrix (USD)
                </label>
                <input
                  type="number"
                  required
                  placeholder="29"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#030014] border border-white/[0.06] text-white outline-none focus:border-purple-500/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-zinc-400 uppercase tracking-wider font-bold">
                  Available Allocation Stock
                </label>
                <input
                  type="number"
                  required
                  placeholder="5"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#030014] border border-white/[0.06] text-white outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 uppercase tracking-wider font-bold">
                Asset Showcase Cover Image URI
              </label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/photo-example"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#030014] border border-white/[0.06] text-white outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 uppercase tracking-wider font-bold">
                Structural Specifications Documentation
              </label>
              <textarea
                rows={4}
                required
                placeholder="State dependencies, layout frameworks, and architecture patterns..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#030014] border border-white/[0.06] text-white outline-none focus:border-purple-500/50 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 font-bold rounded-xl text-white shadow-lg transition shadow-purple-600/10"
            >
              {loading
                ? "Processing Encryption Pipeline..."
                : "Transmit Deployment Payload"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
