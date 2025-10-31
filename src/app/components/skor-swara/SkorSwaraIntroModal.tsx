"use client";

import { X, User, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ModalPortal from "../ModalPortal";

type Props = {
  open: boolean;
  onClose: (dontShowAgain: boolean) => void;
};

export default function SkorSwaraIntroModal({ open, onClose }: Props) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

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
      text: "Percaya diri saat berbicara, jangan takut membuat kesalahan.",
    },
    { src: "/modal/modal4.png", text: "Tenangkan diri sebelum mulai." },
    {
      src: "/modal/modal5.png",
      text: "Fokus pada penyampaian dan ekspresi wajah.",
    },
    { src: "/modal/modal6.png", text: "Nikmati proses nya!" },
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
                Tentang Skor Swara
              </h2>
            </div>
            <button
              onClick={() => onClose(dontShowAgain)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Tutup"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Apa itu Skor Swara */}
            <div>
              <h3 className="text-orange-500 font-bold text-lg mb-3">
                Apa itu Skor Swara?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Skor Swara adalah sistem penilaian berbasis AI yang menganalisis
                kemampuan public speaking Anda secara real-time. Sistem ini
                memberikan feedback detail tentang berbagai aspek berbicara
                untuk membantu Anda meningkatkan keterampilan komunikasi.
              </p>
            </div>

            {/* Komponen Penilaian */}
            <div className="bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-2xl p-6 relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">
                  Komponen Penilaian Skor Swara
                </h3>
                <span className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  Durasi: 1 Menit
                </span>
              </div>

              <div className="flex justify-center gap-4 mb-8">
                {[0, 1, 2].map((i) => (
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
            </div>

            {/* Peraturan Latihan */}
            <div>
              <h3 className="text-orange-500 font-bold text-lg mb-4">
                Peraturan Latihan
              </h3>
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
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

            {/* Checkbox + Tombol */}
            <div className="flex flex-col gap-4">
              <label className="inline-flex items-center gap-3 select-none cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                />
                <span className="text-sm text-gray-700">
                  Jangan tampilkan lagi
                </span>
              </label>

              <button
                onClick={() => onClose(dontShowAgain)}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Gas Cobain!
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
