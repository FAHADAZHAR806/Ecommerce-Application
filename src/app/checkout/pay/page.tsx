"use client";

import { useState } from "react";
import { CheckCircle2, Mail, Truck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function SecurePaymentCheckout() {
  const [selectedWallet, setSelectedWallet] = useState("Stripe");
  const [processing, setProcessing] = useState(false);
  const [finalizedRecord, setFinalizedRecord] = useState<any>(null);

  const processOrderPaymentPayload = async () => {
    setProcessing(true);
    // Simulate transaction execution loops through database engines
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setFinalizedRecord({
      id: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      trackingCode: `NEX-TRACK-${Math.random().toString(36).substring(3, 11).toUpperCase()}`,
    });
    toast.success(
      "Transaction cleared! Dispatching invoice email confirmation updates.",
    );
    setProcessing(false);
  };

  if (finalizedRecord) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-200 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-zinc-900 border border-white/[0.06] rounded-2xl p-6 text-center space-y-6">
          <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Order Confirmed!</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Your invoicing profile status statement updated to: PAID
            </p>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-white/[0.04] text-left space-y-3">
            <div className="flex justify-between text-xs border-b border-white/[0.04] pb-2">
              <span className="text-zinc-500">Invoice Registry Reference</span>
              <span className="font-mono text-purple-400 font-bold">
                {finalizedRecord.id}
              </span>
            </div>
            <div className="flex gap-2 text-xs text-purple-300 bg-purple-500/5 border border-purple-500/10 p-2 rounded-lg">
              <Mail className="h-4 w-4 shrink-0" />{" "}
              <span>
                Confirmation dispatch email tracking transmission routed
                successfully.
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                Logistics Live Route Pin
              </span>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 bg-zinc-900 p-2 rounded border border-white/[0.04]">
                <Truck className="h-4 w-4 text-blue-400" />{" "}
                <span>{finalizedRecord.trackingCode} (Processing)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-zinc-900 border border-white/[0.06] rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-lg font-black text-white">
            Secure Settlement Core
          </h2>
          <p className="text-xs text-zinc-500">
            Select active clearing payment node channel.
          </p>
        </div>

        <div className="space-y-3">
          {["Stripe", "PayPal Ecosystem", "Cash On Delivery (COD)"].map(
            (gate) => (
              <div
                key={gate}
                onClick={() => setSelectedWallet(gate)}
                className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center transition ${selectedWallet === gate ? "border-purple-500 bg-purple-500/5" : "border-white/[0.04] bg-zinc-950/40 hover:bg-zinc-950"}`}
              >
                <span className="text-xs font-bold">{gate}</span>
                <span
                  className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${selectedWallet === gate ? "border-purple-400" : "border-zinc-700"}`}
                >
                  {selectedWallet === gate && (
                    <span className="h-1.5 w-1.5 bg-purple-400 rounded-full" />
                  )}
                </span>
              </div>
            ),
          )}
        </div>

        <button
          onClick={processOrderPaymentPayload}
          disabled={processing}
          className="w-full bg-purple-600 hover:bg-purple-500 transition text-white py-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
        >
          {processing ? (
            "Settling Balances..."
          ) : (
            <>
              {" "}
              <ShieldCheck className="h-4 w-4" /> Clear Settlement Invoice{" "}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
