"use client";

import { X, User, ArrowRight } from "lucide-react";
import Image from "next/image";
import ModalPortal from "../ModalPortal";
import { useState, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AduSwaraIntroModal({ open, onClose }: Props) {
  if (!open) return null;

  const RULES = [
    {
      src: "/modal/modal1.png",
      text: "(Dilarang) berkata kasar, menghina, atau bersikap anarkis selama latihan.",
    },
    {
      src: "/modal/modal2.png",
      text: "Gunakan bahasa yang sopan dan komunikatif.",
    },
    {
      src: "/modal/modal3.png",
      text: "Hormati lawan bicara dan hindari serangan pribadi.",
    },
    {
      src: "/modal/modal5.png",
      text: " Percaya diri dalam menyampaikan pendapat, tetap tenang dan terarah.",
    },
    {
      src: "/modal/modal6.png",
      text: "Nikmati proses nya!",
    },
  ];

  return (
    <ModalPortal>
      <div className="fixed font-lexend inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-900">
                Tentang Adu Swara
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Apa itu Skor Swara */}
            <div>
              <h3 className="text-orange-500 font-bold text-lg mb-3">
                Apa itu Adu Swara?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Adu Swara adalah sistem duel berbicara berbasis AI yang
                mempertemukan dua pengguna untuk saling adu kemampuan public
                speaking secara interaktif. Sistem ini mencocokkan lawan dengan
                tingkat kemampuan serupa, dan jika tidak tersedia, AI akan
                menyesuaikan dengan peserta dari level terdekat.
              </p>
            </div>

            {/* Komponen Penilaian */}
            <div className="bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-2xl p-6 relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">
                  Komponen Penilaian Adu Swara
                </h3>
                <span className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  Durasi: 1 Menit
                </span>
              </div>

              <div className="flex justify-center gap-4 mb-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 flex items-center justify-center"
                  >
                    <span className="text-4xl">⭐</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { score: 5, label: "Kelancaran & Pengucapan" },
                  { score: 5, label: "Kontak Mata & Gestur" },
                  { score: 5, label: "Penggunaan Bahasa" },
                ].map((it, idx) => (
                  <div
                    key={idx}
                    className="bg-indigo-300/50 backdrop-blur rounded-xl p-4 text-center"
                  >
                    <div className="text-5xl font-bold text-yellow-400 mb-2">
                      {it.score}
                    </div>
                    <p className="text-white text-sm font-medium">{it.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 mt-4 gap-4">
                {[
                  { score: 5, label: "Isi" },
                  { score: 5, label: "Organisasi & Struktur" },
                ].map((it, idx) => (
                  <div
                    key={idx}
                    className="bg-indigo-300/50 backdrop-blur rounded-xl p-4 text-center"
                  >
                    <div className="text-5xl font-bold text-yellow-400 mb-2">
                      {it.score}
                    </div>
                    <p className="text-white text-sm font-medium">{it.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Peraturan Latihan (pakai gambar dan teks) */}
            <div>
              <h3 className="text-orange-500 font-bold text-lg mb-4">
                Peraturan Latihan
              </h3>
              <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
                {RULES.map((rule, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mb-2">
                      <Image
                        src={rule.src}
                        alt={rule.text}
                        width={96}
                        height={96}
                        className="w-full h-full object-contain"
                        priority={i < 3}
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700">
                      {rule.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tombol */}
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Gas Cobain!
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
