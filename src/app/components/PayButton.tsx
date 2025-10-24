"use client";

import { useEffect, useState } from "react";

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

export default function PayButton() {
  const [ready, setReady] = useState(false);

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
    // contoh data dummy
    const payload = {
      amount: 150000,
      customer: { first_name: "Yudi", email: "yudi@example.com" },
      items: [
        {
          id: "mentor-basic",
          price: 150000,
          quantity: 1,
          name: "Sesi Mentoring",
        },
      ],
    };

    const res = await fetch("/api/payments/midtrans/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      alert("Gagal membuat transaksi");
      return;
    }

    const token = json.token as string;

    window.snap.pay(token, {
      onSuccess: function (result) {
        window.location.href = "/latih-swara/mentor-saya";
      },
      onPending: function (result) {
        window.location.href = "/latih-swara/mentor-saya?status=pending";
      },
      onError: function (result) {
        alert("Pembayaran gagal!");
      },
      onClose: function () {
        alert("Kamu menutup jendela pembayaran sebelum selesai.");
      },
    });
  };

  return (
    <button
      onClick={handlePay}
      disabled={!ready}
      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
    >
      {ready ? "Bayar Sekarang" : "Memuat…"}
    </button>
  );
}
