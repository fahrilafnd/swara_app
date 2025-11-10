// components/mic/PayButton.tsx
"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        opts?: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

const SNAP_SANDBOX = "https://app.sandbox.midtrans.com/snap/snap.js";
const SNAP_PROD = "https://app.midtrans.com/snap/snap.js";

type Item = {
  id: string;
  price: number;
  quantity: number;
  name: string;
};

type Customer = {
  first_name: string;
  email?: string;
  phone?: string;
};

interface PayButtonProps {
  amount: number;
  items: Item[];
  customer?: Customer;
  /** daftar payment channel midtrans (mis: ['gopay','ovo','qris','bank_transfer']) */
  enabledPayments?: string[];
  /** metadata tambahan agar balik ke server */
  metadata?: Record<string, unknown>;
  className?: string;
  children?: ReactNode;
  onSuccessRedirect?: string;   // default: /latih-swara/mentor-saya
  onPendingRedirect?: string;   // default: /latih-swara/mentor-saya?status=pending
}

export default function PayButton({
  amount,
  items,
  customer = { first_name: "Pengguna" },
  enabledPayments,
  metadata,
  className,
  children,
  onSuccessRedirect = "/latih-swara/mentor-saya",
  onPendingRedirect = "/latih-swara/mentor-saya?status=pending",
}: PayButtonProps) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  // load Snap.js sekali
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
        ? SNAP_PROD
        : SNAP_SANDBOX;
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
    );
    script.onload = () => setReady(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePay = async () => {
    try {
      setLoading(true);

      const payload = {
        amount,
        customer,
        items,
        enabledPayments, // biarkan undefined kalau tidak dipilih; server boleh default-kan
        metadata,
      };

      const res = await fetch("/api/payments/midtrans/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json?.token) {
        alert(json?.message || "Gagal membuat transaksi.");
        setLoading(false);
        return;
      }

      const token = json.token as string;

      window.snap.pay(token, {
        onSuccess() {
          window.location.href = onSuccessRedirect;
        },
        onPending() {
          window.location.href = onPendingRedirect;
        },
        onError() {
          setLoading(false);
          alert("Pembayaran gagal! Silakan coba lagi.");
        },
        onClose() {
          setLoading(false);
          alert("Kamu menutup jendela pembayaran sebelum selesai.");
        },
      });
    } catch (e) {
      console.error(e);
      setLoading(false);
      alert("Terjadi kesalahan jaringan.");
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={!ready || loading}
      className={
        className ??
        "w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-60"
      }
    >
      {loading ? "Memproses…" : ready ? (children ?? "Bayar Sekarang") : "Memuat…"}
    </button>
  );
}
