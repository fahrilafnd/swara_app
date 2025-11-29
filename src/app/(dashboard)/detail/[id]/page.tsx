"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface DetailData {
  id: number;
  title: string;
  date: string;
  score: number;
  status: string;
  tempo?: number;
  artikulasi?: number;
  kontakMata?: number;
  kesesuaianTopik?: number;
  struktur?: number;
  duration?: number;
  topic?: string | { topic: string; text: string };
  mode?: string;
  feedback?: string;
  videoUrl?: string;
  transcript?: string;
}

export default function DetailSkorSwaraPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [detail, setDetail] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect ke halaman hasil skor yang lebih lengkap
    router.push("/skor-swara/hasil-skor");
  }, [id, router]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/skor-swara/detail/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const contentType = response.headers.get("content-type");
      
      // Log untuk debugging
      console.log("Response status:", response.status);
      console.log("Content-Type:", contentType);

      // Jika bukan JSON, coba baca sebagai text untuk debugging
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        throw new Error(
          `Server mengembalikan response yang tidak valid (${response.status}). ` +
          `Pastikan endpoint /api/dashboard/detail/${id} ada dan mengembalikan JSON.`
        );
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      if (data.success === false) {
        throw new Error(data.message || "Gagal mengambil detail");
      }

      // Normalisasi data dengan lebih flexible
      const rawData = data.data || data;
      
      const detailData: DetailData = {
        id: rawData.id || parseInt(id),
        title: rawData.title || "Latihan Skor Swara",
        date: rawData.date || rawData.created_at || new Date().toISOString(),
        score: rawData.score || rawData.total_score || 0,
        status: rawData.status || "completed",
        tempo: rawData.tempo,
        artikulasi: rawData.artikulasi,
        kontakMata: rawData.kontak_mata || rawData.kontakMata,
        kesesuaianTopik: rawData.kesesuaian_topik || rawData.kesesuaianTopik,
        struktur: rawData.struktur,
        duration: rawData.duration,
        topic: rawData.topic,
        mode: rawData.mode,
        feedback: rawData.feedback,
        videoUrl: rawData.video_url || rawData.videoUrl,
        transcript: rawData.transcript,
      };

      console.log("Parsed detail data:", detailData);
      setDetail(detailData);
    } catch (error) {
      console.error("Error fetching detail:", error);
      setError(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Sangat Baik";
    if (score >= 60) return "Baik";
    if (score >= 40) return "Cukup";
    return "Perlu Perbaikan";
  };

  const getTopicText = (topic: string | { topic: string; text: string } | undefined) => {
    if (!topic) return "-";
    if (typeof topic === "string") return topic;
    return topic.topic || topic.text || "-";
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white rounded-3xl p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">Memuat detail...</p>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-white rounded-3xl p-8">
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Gagal Memuat Detail
          </h2>
          <p className="text-gray-600 mb-6">{error || "Data tidak ditemukan"}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white rounded-3xl p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-semibold">Kembali ke Dashboard</span>
          </button>
        </div>

        {/* Title and Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {detail.title}
          </h1>
          <p className="text-gray-600">{formatDate(detail.date)}</p>
        </div>

        {/* Score Card */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 mb-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Skor Total</p>
            <div className={`text-6xl font-bold ${getScoreColor(detail.score)} mb-2`}>
              {detail.score}
            </div>
            <p className={`text-lg font-semibold ${getScoreColor(detail.score)}`}>
              {getScoreLabel(detail.score)}
            </p>
          </div>
        </div>

        {/* Detail Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {detail.tempo !== undefined && (
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-600 mb-2">Tempo</p>
              <p className={`text-3xl font-bold ${getScoreColor(detail.tempo)}`}>
                {detail.tempo}
              </p>
            </div>
          )}
          {detail.artikulasi !== undefined && (
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-600 mb-2">Artikulasi</p>
              <p className={`text-3xl font-bold ${getScoreColor(detail.artikulasi)}`}>
                {detail.artikulasi}
              </p>
            </div>
          )}
          {detail.kontakMata !== undefined && (
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-600 mb-2">Kontak Mata</p>
              <p className={`text-3xl font-bold ${getScoreColor(detail.kontakMata)}`}>
                {detail.kontakMata}
              </p>
            </div>
          )}
          {detail.kesesuaianTopik !== undefined && (
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-600 mb-2">Kesesuaian Topik</p>
              <p className={`text-3xl font-bold ${getScoreColor(detail.kesesuaianTopik)}`}>
                {detail.kesesuaianTopik}
              </p>
            </div>
          )}
          {detail.struktur !== undefined && (
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-600 mb-2">Struktur</p>
              <p className={`text-3xl font-bold ${getScoreColor(detail.struktur)}`}>
                {detail.struktur}
              </p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Informasi Latihan</h3>
          <div className="space-y-3">
            {detail.topic && (
              <div className="flex justify-between">
                <span className="text-gray-600">Topik:</span>
                <span className="font-semibold text-gray-900">{getTopicText(detail.topic)}</span>
              </div>
            )}
            {detail.mode && (
              <div className="flex justify-between">
                <span className="text-gray-600">Mode:</span>
                <span className="font-semibold text-gray-900">{detail.mode}</span>
              </div>
            )}
            {detail.duration !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-600">Durasi:</span>
                <span className="font-semibold text-gray-900">{formatDuration(detail.duration)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-semibold text-gray-900 capitalize">{detail.status}</span>
            </div>
          </div>
        </div>

        {/* Feedback */}
        {detail.feedback && (
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Feedback</h3>
            <p className="text-gray-700 whitespace-pre-line">{detail.feedback}</p>
          </div>
        )}

        {/* Video */}
        {detail.videoUrl && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Video Latihan</h3>
            <video
              src={detail.videoUrl}
              controls
              className="w-full rounded-lg"
            />
          </div>
        )}

        {/* Transcript */}
        {detail.transcript && (
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Transkrip</h3>
            <p className="text-gray-700 whitespace-pre-line">{detail.transcript}</p>
          </div>
        )}
      </div>
    </div>
  );
}
