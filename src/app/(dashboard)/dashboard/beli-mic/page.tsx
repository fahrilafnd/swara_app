// src/app/(dashboard)/dashboard/beli-mic/page.tsx
"use client";

import React, { useState } from "react";
import {
  Mic,
  Check,
  Sparkles,
  Zap,
  Crown,
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building2,
  ShoppingCart,
  Gift,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("gopay");

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

  const paymentMethods = [
    {
      id: "gopay",
      name: "GoPay",
      icon: <Smartphone className="w-5 h-5" />,
      description: "Bayar pakai GoPay",
    },
    {
      id: "dana",
      name: "DANA",
      icon: <Smartphone className="w-5 h-5" />,
      description: "Bayar pakai DANA",
    },
    {
      id: "ovo",
      name: "OVO",
      icon: <Smartphone className="w-5 h-5" />,
      description: "Bayar pakai OVO",
    },
    {
      id: "bank",
      name: "Transfer Bank",
      icon: <Building2 className="w-5 h-5" />,
      description: "Transfer via bank",
    },
    {
      id: "qris",
      name: "QRIS",
      icon: <CreditCard className="w-5 h-5" />,
      description: "Scan QRIS code",
    },
  ];

  const handleBuyPackage = (pkg: MicPackage) => {
    setSelectedPackage(pkg.id);
    // Scroll ke payment section
    document.getElementById("payment-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleCheckout = () => {
    const selectedPkg = packages.find((p) => p.id === selectedPackage);
    if (!selectedPkg) return;

    // TODO: Implement payment gateway integration
    alert(
      `Checkout: ${selectedPkg.name} (${
        selectedPkg.mics
      } mic) - Rp ${selectedPkg.price.toLocaleString(
        "id-ID"
      )} via ${paymentMethod}`
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
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

          {/* Benefits Bar */}
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
                className={`relative bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${
                  selectedPackage === pkg.id
                    ? "border-orange-500 ring-4 ring-orange-200"
                    : "border-gray-100 hover:border-orange-300"
                } ${pkg.popular ? "scale-105" : ""}`}
              >
                {/* Savings Badge */}
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

                {/* Package Name */}
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  {pkg.name}
                </h3>

                {/* Mic Count */}
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

            
                {/* CTA Button */}
                <button
                  onClick={() => handleBuyPackage(pkg)}
                  className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 ${
                    selectedPackage === pkg.id
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105"
                      : `bg-gradient-to-r ${pkg.gradient} text-white hover:shadow-xl hover:scale-105`
                  }`}
                >
                  {selectedPackage === pkg.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-5 h-5" />
                      Dipilih
                    </span>
                  ) : (
                    "Pilih Paket"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Section */}
        {selectedPackage && (
          <div
            id="payment-section"
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-orange-100 mb-8 animate-fade-in"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <CreditCard className="w-7 h-7 text-orange-500" />
              Pilih Metode Pembayaran
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === method.id
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        paymentMethod === method.id
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {method.icon}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        {method.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {method.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Checkout Summary */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Ringkasan Pesanan
              </h3>
              {(() => {
                const pkg = packages.find((p) => p.id === selectedPackage);
                if (!pkg) return null;
                return (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Paket:</span>
                      <span className="font-bold text-gray-900">
                        {pkg.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Jumlah Mic:</span>
                      <span className="font-bold text-orange-600">
                        {pkg.mics} Mic
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Metode Pembayaran:</span>
                      <span className="font-bold text-gray-900">
                        {
                          paymentMethods.find((m) => m.id === paymentMethod)
                            ?.name
                        }
                      </span>
                    </div>
                    <div className="border-t-2 border-orange-200 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">
                          Total Bayar:
                        </span>
                        <span className="text-2xl font-black text-orange-600">
                          {formatPrice(pkg.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-5 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              <ShoppingCart className="w-6 h-6" />
              Lanjutkan Pembayaran
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 Pembayaran aman dan terenkripsi
            </p>
          </div>
        )}

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
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">
                Apakah mic bisa expired?
              </h3>
              <p className="text-sm text-gray-600">
                Mic yang dibeli valid sesuai durasi paket (30-60 hari). Setelah
                expired, mic yang tersisa akan hangus.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">
                Apakah ada cara gratis mendapat mic?
              </h3>
              <p className="text-sm text-gray-600">
                Ya! Selesaikan Daily Mission setiap hari untuk mendapatkan mic
                bonus gratis.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
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
