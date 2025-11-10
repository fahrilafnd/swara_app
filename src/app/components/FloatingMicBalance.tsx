// src/app/components/dashboard/FloatingMicBalance.tsx
"use client";

import React, { useState } from "react";
import { Mic, Plus, X, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";

interface FloatingMicBalanceProps {
  micBalance: number;
  maxMic?: number;
}

export default function FloatingMicBalance({
  micBalance,
  maxMic = 6,
}: FloatingMicBalanceProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const progressPercentage = (micBalance / maxMic) * 100;

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 group animate-bounce"
        >
          <Mic className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-orange-600 border-2 border-orange-500 shadow-lg">
            {micBalance}
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 rounded-3xl shadow-2xl transition-all duration-300 ${
          isExpanded ? "w-80 sm:w-96" : "w-72 sm:w-80"
        }`}
      >
        {/* Header */}
        <div className="relative p-4 sm:p-5">
          {/* Close/Minimize Button */}
          <button
            onClick={() => setIsMinimized(true)}
            className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute top-3 right-12 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-white" />
            ) : (
              <ChevronUp className="w-4 h-4 text-white" />
            )}
          </button>

          {/* Icon & Title */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Stock Mic Kamu</p>
              <p className="text-white/70 text-xs">
                Reset setiap hari (00:00 WIB)
              </p>
            </div>
          </div>

          {/* Mic Balance */}
          <div className="flex justify-between items-center">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-5xl font-black text-white">
                {micBalance}  
              </span>
              <span className="text-2xl font-bold text-white/80">
                / {maxMic}
              </span>
            </div>
            <p className="text-white">Level 3</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden mb-3">
            <div
              className="bg-white h-full rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Buy Button */}
          <Link href="/dashboard/beli-mic">
            <button className="w-full bg-white hover:bg-orange-50 text-orange-600 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Beli Mic
            </button>
          </Link>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 animate-slide-down">
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/20">
              <p className="text-white/90 text-xs leading-relaxed">
                💡 Selesaikan Daily Mission untuk mendapat mic tambahan gratis
                setiap hari!
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-white/10 backdrop-blur rounded-lg p-2 border border-white/20">
                <p className="text-white/70 text-[10px] mb-1">Digunakan</p>
                <p className="text-white font-bold text-sm">
                  {maxMic - micBalance} Mic
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-2 border border-white/20">
                <p className="text-white/70 text-[10px] mb-1">Tersisa</p>
                <p className="text-white font-bold text-sm">{micBalance} Mic</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Animation Circles */}
      <div className="absolute -z-10 top-0 right-0 w-32 h-32 bg-orange-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -z-10 bottom-0 left-0 w-24 h-24 bg-red-400 rounded-full blur-2xl opacity-20 animate-pulse-slow"></div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 300px;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
