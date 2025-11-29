"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface HistoryItem {
  id: number;
  title: string;
  date: string;
  score: string;
  status: string;
}

interface HistorySectionProps {
  historyItems: HistoryItem[];
}

export default function HistorySection({ historyItems }: HistorySectionProps) {
  const router = useRouter();

  const handleViewDetail = (id: number) => {
    router.push(`/detail/${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Selesai";
      case "pending":
        return "Menunggu";
      case "failed":
        return "Gagal";
      default:
        return status;
    }
  };

  if (historyItems.length === 0) {
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-black text-gray-900 mb-6">
          Riwayat Latihan
        </h3>
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-600">Belum ada riwayat latihan</p>
          <p className="text-sm text-gray-500 mt-2">
            Mulai latihan pertama Anda untuk melihat riwayat di sini
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-black text-gray-900 mb-6">
        Riwayat Latihan
      </h3>
      <div className="space-y-4">
        {historyItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-orange-300 transition-all cursor-pointer group"
            onClick={() => handleViewDetail(item.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h4>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {getStatusText(item.status)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    📅 {new Date(item.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    ⏰ {new Date(item.date).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Skor</div>
                  <div className="text-2xl font-black text-orange-600">
                    {item.score}
                  </div>
                </div>
                <button className="p-3 rounded-xl bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
