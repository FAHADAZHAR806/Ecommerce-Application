"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components//shared/Navbar";
import { ShoppingCart, Eye, Layers } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInventory() {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (json.success) setProducts(json.data);
      } catch (err) {
        toast.error("Asset matrix stream synchronization failure.");
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
  }, []);

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-zinc-200 to-blue-400 bg-clip-text text-transparent">
            Ecosystem Core Marketplace
          </h1>
          <p className="text-xs text-zinc-400 max-w-lg mx-auto">
            Deploy production assets instantaneously from verified network
            engineers.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-72 bg-white/[0.02] border border-white/[0.05] rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/[0.06] rounded-2xl bg-white/[0.01]">
            <Layers className="h-8 w-8 mx-auto text-zinc-600 mb-2" />
            <p className="text-xs text-zinc-400">
              No approved products active inside feed indexes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p: any) => (
              <div
                key={p._id}
                className="bg-[#09090b]/60 border border-white/[0.06] rounded-2xl overflow-hidden backdrop-blur-xl flex flex-col justify-between group hover:border-purple-500/20 transition-all duration-300"
              >
                <div>
                  <div className="h-40 bg-zinc-950 relative overflow-hidden">
                    <img
                      src={p.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <p className="text-[9px] font-bold text-zinc-500 uppercase">
                      Vendor: {p.sellerName}
                    </p>
                    <h3 className="text-sm font-bold text-zinc-100 line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between border-t border-white/[0.04] pt-3">
                    <span className="text-base font-black">${p.price}</span>
                    <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md hover:bg-purple-500 transition">
                      <ShoppingCart className="h-3 w-3" /> Get Asset
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
