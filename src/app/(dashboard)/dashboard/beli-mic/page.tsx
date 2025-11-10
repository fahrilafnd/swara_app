// src/app/(dashboard)/dashboard/beli-mic/page.tsx
"use client";

import React, { useEffect } from "react";
import {
  Mic,
  Check,
  Zap,
  Crown,
  ArrowLeft,
  ShoppingCart,
  Gift,
} from "lucide-react";
import Link from "next/link";

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

interface MicPackage {
  id: string;
  name: string;
  price: number;
  mics: number;
  badge?: {
    text: string;
    color: string;
    icon: React.ReactNode;
  };
  popular?: boolean;
  savings?: string;
  gradient: string;
  iconBg: string;
}

export default function BeliMic() {
  // muat Snap.js sekali
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
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const packages: MicPackage[] = [
    {
      id: "starter",
      name: "Starter Pack",
      price: 5000,
      mics: 5,
      gradient: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-100",
    },
    {
      id: "popular",
      name: "Popular Pack",
      price: 10000,
      mics: 20,
      popular: true,
      badge: {
        text: "PALING LARIS",
        color: "bg-orange-500",
        icon: <Zap className="w-3 h-3" />,
      },
      savings: "Hemat 50%",
      gradient: "from-orange-500 to-red-500",
      iconBg: "bg-orange-100",
    },
    {
      id: "value",
      name: "Best Value Pack",
      price: 15000,
      mics: 50,
      badge: {
        text: "BEST VALUE",
        color: "bg-green-500",
        icon: <Crown className="w-3 h-3" />,
      },
      savings: "Hemat 70%",
      gradient: "from-green-500 to-emerald-500",
      iconBg: "bg-green-100",
    },
  ];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  // helper: ambil email dari storage bila ada, kalau tidak buat dummy yang valid
  function resolveBuyerEmail() {
    try {
      // contoh lokasi penyimpanan profilmu (ubah kunci sesuai app-mu)
      const raw1 = localStorage.getItem("swara:user");
      if (raw1) {
        const u = JSON.parse(raw1);
        if (typeof u?.email === "string" && u.email.includes("@"))
          return u.email;
      }
      const raw2 = sessionStorage.getItem("swara:user");
      if (raw2) {
        const u = JSON.parse(raw2);
        if (typeof u?.email === "string" && u.email.includes("@"))
          return u.email;
      }
    } catch {}
    // fallback agar lolos validasi Zod & Midtrans
    return `guest_${Date.now()}@swara.local`;
  }

  const handleBuyNow = async (pkg: MicPackage) => {
    try {
      const email = resolveBuyerEmail();

      const payload = {
        amount: pkg.price, // Rp
        customer: {
          first_name: "Pengguna", // opsional; isi dari profilmu bila ada
          email, // <-- WAJIB untuk Zod schema kamu
        },
        items: [
          {
            id: `mic-${pkg.id}`,
            price: pkg.price,
            quantity: 1,
            name: `${pkg.name} - ${pkg.mics} Mic`,
          },
        ],
        metadata: { mics: pkg.mics, packageId: pkg.id, source: "beli-mic" },
      };

      const res = await fetch("/api/payments/midtrans/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json?.token) {
        alert(json?.message || "Gagal membuat transaksi.");
        return;
      }

      window.snap.pay(json.token, {
        onSuccess() {
          window.location.href = "/latih-swara/mentor-saya";
        },
        onPending() {
          window.location.href = "/latih-swara/mentor-saya?status=pending";
        },
        onError() {
          alert("Pembayaran gagal! Silakan coba lagi.");
        },
        onClose() {
          /* user menutup Snap */
        },
      });
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan jaringan.");
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 mb-10 rounded-xl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Kembali ke Dashboard</span>
          </Link>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-4 shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3">
              Beli Mic Token
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Dapatkan lebih banyak mic untuk mengakses semua fitur SWARA. Pilih
              paket yang sesuai dengan kebutuhanmu!
            </p>
          </div>

          {/* Benefit bar tetap */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-4 mb-8">
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-blue-900">
                  Instant Delivery
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-900">
                  Pembayaran Aman
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-purple-900">
                  Support 24/7
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 mt-20 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative group ${
                pkg.popular ? "md:-mt-4 md:mb-4" : ""
              }`}
            >
              {/* Badge */}
              {pkg.badge && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 ${pkg.badge.color} text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 z-10`}
                >
                  {pkg.badge.icon}
                  {pkg.badge.text}
                </div>
              )}

              {/* Card */}
              <div
                className={`relative bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-orange-300 ${
                  pkg.popular ? "scale-105" : ""
                }`}
              >
                {/* Savings */}
                {pkg.savings && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                    {pkg.savings}
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-16 h-16 ${pkg.iconBg} rounded-2xl flex items-center justify-center mb-4 mx-auto`}
                >
                  <Mic className="w-8 h-8 text-gray-700" />
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  {pkg.name}
                </h3>

                {/* Mic count */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-5xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {pkg.mics}
                    </span>
                    <span className="text-xl font-bold text-gray-600">Mic</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    ≈ Rp {Math.round(pkg.price / pkg.mics).toLocaleString()} per
                    mic
                  </div>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-3xl font-black text-gray-900 mb-1">
                    {formatPrice(pkg.price)}
                  </div>
                  <div className="text-xs text-gray-500">Sekali bayar</div>
                </div>

                {/* BUY NOW -> langsung Snap */}
                <button
                  onClick={() => handleBuyNow(pkg)}
                  className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 bg-gradient-to-r ${pkg.gradient} text-white hover:shadow-xl hover:scale-105`}
                >
                  Beli Paket
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Gift className="w-7 h-7 text-orange-500" />
            Pertanyaan Umum
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">
                Bagaimana cara menggunakan mic?
              </h3>
              <p className="text-sm text-gray-600">
                Setiap kali Anda menggunakan fitur Skor Swara, Adu Swara, atau
                Podium Swara, mic akan otomatis terpotong sesuai kebutuhan
                fitur.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">
                Apakah ada cara mendapat mic selain membeli?
              </h3>
              <p className="text-sm text-gray-600">
                Ya! Selesaikan Daily Mission setiap hari untuk mendapatkan bonus
                mic!
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">
                Bagaimana jika pembayaran gagal?
              </h3>
              <p className="text-sm text-gray-600">
                Jika pembayaran gagal, silakan hubungi support kami di
                support@swara.id atau melalui WhatsApp di 081234567890.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Butuh bantuan? Hubungi tim support kami
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all shadow-lg">
              💬 Chat WhatsApp
            </button>
            <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all shadow-lg">
              📧 Email Support
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
