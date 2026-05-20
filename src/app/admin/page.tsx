"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { ShieldAlert, Check } from "lucide-react";
import { toast } from "sonner";

export default function AdminConsole() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (session && (session.user as any).role === "admin") fetchSystemLogs();
  }, [session]);

  if (status === "loading")
    return (
      <div className="min-h-screen bg-[#030014] text-white flex items-center justify-center">
        Connecting central administrative network core...
      </div>
    );
  if (!session || (session.user as any).role !== "admin") {
    router.push("/login");
    return null;
  }

  async function fetchSystemLogs() {
    const res = await fetch("/api/products?scope=admin");
    const json = await res.json();
    if (json.success) setLogs(json.data);
  }

  const handleVerificationSignature = async (id: string) => {
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, approved: true }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          "Validation parameter successfully modified! Indexed live onto global feed maps.",
        );
        fetchSystemLogs();
      }
    } catch (err) {
      toast.error("Internal transaction modification failure sequence.");
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-2xl flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-purple-400" />
          <div>
            <h1 className="text-lg font-black uppercase">
              Root Control Node Gateway
            </h1>
            <p className="text-xs text-zinc-400 font-medium">
              Verify structural payloads, bypass processing holds, override
              deployment variables.
            </p>
          </div>
        </div>

        <div className="bg-[#09090b]/80 border border-white/[0.06] rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.06] text-zinc-400 uppercase tracking-wider font-bold">
                <th className="p-4">Target Title</th>
                <th className="p-4">Merchant Vector</th>
                <th className="p-4">Pricing</th>
                <th className="p-4">State Index Status</th>
                <th className="p-4 text-right">Administrative Execution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {logs.map((item: any) => (
                <tr key={item._id} className="hover:bg-white/[0.01] transition">
                  <td className="p-4 font-bold text-zinc-200">{item.title}</td>
                  <td className="p-4 text-zinc-400">{item.sellerName}</td>
                  <td className="p-4 font-black text-purple-400">
                    ${item.price}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${item.approved ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}
                    >
                      {item.approved ? "Active Live" : "Pending Audit"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {!item.approved && (
                      <button
                        onClick={() => handleVerificationSignature(item._id)}
                        className="px-3 py-1 bg-emerald-500 text-white rounded font-bold hover:bg-emerald-400 transition inline-flex items-center gap-1 text-[11px]"
                      >
                        <Check className="h-3 w-3" /> Grant Authorization
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
