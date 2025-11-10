// src/app/components/dashboard/SkillCards.tsx
"use client";

import React from "react";
import { Mic } from "lucide-react";

type ModalType =
  | "skor-swara"
  | "adu-swara"
  | "inspira-swara"
  | "podium-swara"
  | "latih-swara";

interface SkillCardsProps {
  onModalOpen: (modalType: ModalType) => void;
  micBalance: number;
}

export default function SkillCards({
  onModalOpen,
  micBalance,
}: SkillCardsProps) {
  const skillCards = [
    {
      id: "skor-swara" as ModalType,
      title: "Skor Swara",
      bg: "from-[#34C38F] to-[#11998E]",
      micCost: [1, 2, 3],
    },
    {
      id: "adu-swara" as ModalType,
      title: "Adu Swara",
      bg: "from-[#F6D365] to-[#FDA085]",
      micCost: 3,
    },
    {
      id: "inspira-swara" as ModalType,
      title: "Inspira Swara",
      bg: "from-[#F093FB] to-[#F5576C]",
      micCost: 0,
    },
    {
      id: "podium-swara" as ModalType,
      title: "Podium Swara",
      bg: "from-[#A18CD1] to-[#FBC2EB]",
      micCost: 2,
    },
    {
      id: "latih-swara" as ModalType,
      title: "Latih Swara",
      bg: "from-[#56CCF2] to-[#2F80ED]",
      micCost: 0,
    },
  ];

  return (
    <section className="mb-6 sm:mb-8">
      <h2 className="text-gray-900 text-lg sm:text-xl font-extrabold tracking-tight mb-1">
        Petunjuk Penggunaan
      </h2>
      <p className="text-sm text-gray-600 mb-5">
        Pelajari cara memakai tiap fitur Swara dengan cepat.
      </p>

      <div className="rounded-3xl bg-white/90 border border-gray-100 shadow-md p-4 sm:p-6">
        {/* Grid: 1 col (mobile), 2 col (sm), 12 col (lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
          {skillCards.map((card, i) => {
            // 3 kartu pertama di baris atas (col-span-4), 2 kartu berikutnya di baris bawah (col-span-6)
            const span = i < 3 ? "lg:col-span-4" : "lg:col-span-6";
            const hasSufficientMic = micBalance >= card.micCost;

            return (
              <button
                key={card.id}
                onClick={() => onModalOpen(card.id)}
                disabled={!hasSufficientMic && card.micCost > 0}
                className={[
                  span,
                  "group relative isolate w-full overflow-hidden rounded-2xl p-4 sm:p-5 text-left",
                  "shadow-sm ring-1 ring-black/5 transition-all duration-300",
                  hasSufficientMic || card.micCost === 0
                    ? "hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                    : "opacity-60 cursor-not-allowed",
                ].join(" ")}
              >
                {/* Background gradient */}
                <div
                  className={[
                    "absolute inset-0 -z-10 bg-gradient-to-br",
                    card.bg,
                    "opacity-90",
                  ].join(" ")}
                />
                <div className="absolute inset-0 -z-0 bg-white/10 " />

                {/* Mic Cost Badge */}
                {card.micCost > 0 ? (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full border-2 border-white/50 shadow-sm">
                    <Mic className="w-3.5 h-3.5 text-orange-600" />
                    <span className="text-xs font-bold text-orange-600">
                      {card.micCost}
                    </span>
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-green-500/90 backdrop-blur text-white rounded-full text-[10px] font-bold border-2 border-white/50">
                    GRATIS
                  </div>
                )}

                <div className="flex flex-col h-[180px] sm:h-[200px] justify-between">
                  {/* Avatar & title */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-3">
                      <div className="size-20 sm:size-24 rounded-full bg-black/70 ring-4 ring-white/30 shadow-xl grid place-items-center">
                        <span className="text-white text-3xl sm:text-4xl">
                          👤
                        </span>
                      </div>
                      <div className="absolute inset-0 -z-10 rounded-full blur-xl opacity-60 group-hover:opacity-90 transition-opacity bg-white/30" />
                    </div>
                    <h3 className="text-white drop-shadow-sm font-extrabold text-sm sm:text-base tracking-wide">
                      {card.title}
                    </h3>
                  </div>

                  {/* CTA & progress line */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] sm:text-xs font-medium text-white/90">
                        Buka panduan singkat
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-lg bg-black/40 text-white group-hover:bg-black/60 transition-colors">
                        Petunjuk
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/30 overflow-hidden">
                      <div className="h-full w-0 group-hover:w-full transition-[width] duration-700 ease-out bg-white" />
                    </div>
                  </div>
                </div>

                {/* Insufficient Mic Overlay */}
                {!hasSufficientMic && card.micCost > 0 && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                    <div className="text-center text-white">
                      <Mic className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-bold">Mic Tidak Cukup</p>
                      <p className="text-xs opacity-80">
                        Butuh {card.micCost} mic
                      </p>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mic Usage Info */}
      <div className="mt-6 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-4 border-2 border-orange-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-2">
              Panduan Penggunaan Mic
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              Setiap fitur membutuhkan mic untuk digunakan. Stock mic direset
              setiap hari pukul 00:00 WIB.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded-lg p-2 text-center border border-orange-200">
                <p className="text-lg font-bold text-gray-900">1</p>
                <p className="text-[10px] text-gray-600">Skor Swara</p>
              </div>
              <div className="bg-white rounded-lg p-2 text-center border border-orange-200">
                <p className="text-lg font-bold text-gray-900">2</p>
                <p className="text-[10px] text-gray-600">Podium Swara</p>
              </div>
              <div className="bg-white rounded-lg p-2 text-center border border-orange-200">
                <p className="text-lg font-bold text-gray-900">3</p>
                <p className="text-[10px] text-gray-600">Adu Swara</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
