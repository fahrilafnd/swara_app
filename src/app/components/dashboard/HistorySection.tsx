"use client";

import React from "react";
import Link from "next/link";

interface HistoryItem {
  id: number;
  title: string;
  date: string;
  description: string;
  points: number;
}

interface HistorySectionProps {
  historyItems: HistoryItem[];
  loading?: boolean;
}

export default function HistorySection({ historyItems, loading = false }: HistorySectionProps) {
  return (
    <div
      className="bg-white rounded-3xl shadow-md p-4 sm:p-5"
      data-tour="history-section"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-gray-800 text-base sm:text-lg font-semibold">
          Riwayat latihanmu
        </h2>
        <Link href={"/riwayat"} className="p-2 rounded-full hover:bg-gray-100">
          <svg
            className="w-5 h-5 text-gray-800"
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
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl p-2.5 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : historyItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">Belum ada riwayat latihan</p>
        </div>
      ) : (
        historyItems.map((item) => (
          <Link
            key={item.id}
            href={`/skor-swara/detail/${item.id}`}
            className="block bg-gray-50 rounded-xl p-2.5 mb-2 hover:shadow-md hover:bg-gray-100 transition-all border border-gray-100 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-gray-900 text-sm font-bold">{item.title}</h4>
              <div className="bg-orange-500 text-white px-2.5 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap">
                {item.date}
              </div>
            </div>
            <p className="text-gray-400 text-[11px] mb-1">
              {item.description}{" "}
              <span className="text-gray-600 font-medium">+{item.points}</span>
            </p>
          </Link>
        ))
      )}
    </div>
  );
}
