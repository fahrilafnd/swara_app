"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HistorySection from "@/app/components/skor-swara/HistorySection";

interface HistoryItem {
  id: number;
  title: string;
  date: string;
  score: string;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [errorHistory, setErrorHistory] = useState<string | null>(null);

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const fetchRiwayat = async () => {
    try {
      setLoadingHistory(true);
      setErrorHistory(null);

      const response = await fetch("/api/dashboard/riwayat", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server mengembalikan response yang tidak valid");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || "Gagal mengambil riwayat");
      }

      console.log("Full response data:", data);

      let historyData: any[] = [];
      
      if (data.data) {
        if (Array.isArray(data.data)) {
          historyData = data.data;
        } else if (typeof data.data === 'object' && data.data !== null) {
          if (data.data.items && Array.isArray(data.data.items)) {
            historyData = data.data.items;
          } else if (data.data.list && Array.isArray(data.data.list)) {
            historyData = data.data.list;
          } else if (data.data.history && Array.isArray(data.data.history)) {
            historyData = data.data.history;
          } else {
            historyData = Object.values(data.data).filter(item => 
              item && typeof item === 'object'
            );
          }
        }
      } else if (Array.isArray(data)) {
        historyData = data;
      }

      if (!Array.isArray(historyData)) {
        console.warn("historyData is not an array, setting empty array");
        historyData = [];
      }

      const mappedHistory = historyData.map((item: any, index: number) => ({
        id: item.id || item._id || item.skor_swara_id || index,
        title: item.title || item.topic || item.topic_name || item.name || "Latihan Skor Swara",
        date: item.date || item.created_at || item.createdAt || item.timestamp || new Date().toISOString(),
        score: item.score?.toString() || item.total_score?.toString() || item.totalScore?.toString() || "0",
        status: item.status || "completed",
      }));

      setHistoryItems(mappedHistory);
    } catch (error) {
      console.error("Error fetching riwayat:", error);
      
      let errorMessage = "Terjadi kesalahan";
      
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage = "Tidak dapat terhubung ke server";
        } else {
          errorMessage = error.message;
        }
      }
      
      setErrorHistory(errorMessage);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="min-h-screen mb-10 bg-white rounded-3xl p-3 md:p-6 lg:p-8">
        <div className="w-full">
          {/* Header Dashboard */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              Dashboard 👋
            </h1>
            <p className="text-gray-600">
              Pantau perkembangan latihan public speaking Anda
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200">
              <div className="text-orange-600 text-2xl mb-2">🎯</div>
              <div className="text-2xl font-black text-gray-900">
                {historyItems.length}
              </div>
              <div className="text-sm text-gray-600">Total Latihan</div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200">
              <div className="text-purple-600 text-2xl mb-2">⭐</div>
              <div className="text-2xl font-black text-gray-900">
                {historyItems.length > 0
                  ? Math.round(
                      historyItems.reduce(
                        (acc, item) => acc + parseFloat(item.score),
                        0
                      ) / historyItems.length
                    )
                  : 0}
              </div>
              <div className="text-sm text-gray-600">Rata-rata Skor</div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
              <div className="text-green-600 text-2xl mb-2">🏆</div>
              <div className="text-2xl font-black text-gray-900">
                {historyItems.length > 0
                  ? Math.max(
                      ...historyItems.map((item) => parseFloat(item.score))
                    )
                  : 0}
              </div>
              <div className="text-sm text-gray-600">Skor Tertinggi</div>
            </div>
          </div>

          {/* Riwayat Latihan Section */}
          {loadingHistory ? (
            <div className="mt-12 text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className="text-gray-600 mt-4">Memuat riwayat...</p>
            </div>
          ) : errorHistory ? (
            <div className="mt-12 text-center py-8 bg-red-50 rounded-2xl p-6">
              <p className="text-red-600 font-semibold mb-2">
                ❌ Gagal Memuat Riwayat
              </p>
              <p className="text-red-500 text-sm mb-4">{errorHistory}</p>
              <button
                onClick={fetchRiwayat}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                🔄 Coba Lagi
              </button>
            </div>
          ) : (
            <HistorySection historyItems={historyItems} />
          )}
        </div>
      </div>
    </div>
  );
}