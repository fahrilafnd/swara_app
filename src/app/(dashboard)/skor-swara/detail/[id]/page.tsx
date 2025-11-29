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
  topic?: string;
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
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server mengembalikan response yang tidak valid");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || "Gagal mengambil detail");
      }

      // Map data dari response
      const detailData: DetailData = {
        id: data.data?.id || data.id,
        title: data.data?.title || data.title || "Latihan Skor Swara",
        date: data.data?.date || data.date || data.created_at,
        score: data.data?.score || data.score || data.total_score || 0,
        status: data.data?.status || data.status || "completed",
        tempo: data.data?.tempo || data.tempo,
        artikulasi: data.data?.artikulasi || data.artikulasi,
        kontakMata: data.data?.kontak_mata || data.kontak_mata,
        kesesuaianTopik: data.data?.kesesuaian_topik || data.kesesuaian_topik,
        struktur: data.data?.struktur || data.struktur,
        duration: data.data?.duration || data.duration,
        topic: data.data?.topic || data.topic,
        mode: data.data?.mode || data.mode,
        feedback: data.data?.feedback || data.feedback,
        videoUrl: data.data?.video_url || data.video_url,
        transcript: data.data?.transcript || data.transcript,
      };

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
            onClick={() => router.back()}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
          >
            Kembali
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
            onClick={() => router.back()}
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
            <span className="font-semibold">Kembali</span>
          </button>
        </div>

        {/* Title & Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-4">
            {detail.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              📅 {new Date(detail.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              ⏰ {new Date(detail.date).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {detail.duration && (
              <span className="flex items-center gap-1">
                ⏱️ {Math.floor(detail.duration / 60)}:{(detail.duration % 60).toString().padStart(2, '0')}
              </span>
            )}
            {detail.topic && (
              <span className="flex items-center gap-1">
                📝 {detail.topic}
              </span>
            )}
            {detail.mode && (
              <span className="flex items-center gap-1">
                🎯 {detail.mode}
              </span>
            )}
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-gradient-to-r from-orange-50 to-purple-50 rounded-3xl p-8 mb-8 border-2 border-orange-200">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Total Skor</div>
            <div className={`text-6xl font-black ${getScoreColor(detail.score)} mb-2`}>
              {detail.score}
            </div>
            <div className={`text-xl font-bold ${getScoreColor(detail.score)}`}>
              {getScoreLabel(detail.score)}
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {detail.tempo !== undefined && (
            <ScoreItem icon="⏱️" label="Tempo" score={detail.tempo} />
          )}
          {detail.artikulasi !== undefined && (
            <ScoreItem icon="🗣️" label="Artikulasi" score={detail.artikulasi} />
          )}
          {detail.kontakMata !== undefined && (
            <ScoreItem icon="👀" label="Kontak Mata" score={detail.kontakMata} />
          )}
          {detail.kesesuaianTopik !== undefined && (
            <ScoreItem icon="👌🏻" label="Kesesuaian Topik" score={detail.kesesuaianTopik} />
          )}
          {detail.struktur !== undefined && (
            <ScoreItem icon="📑" label="Struktur" score={detail.struktur} />
          )}
        </div>

        {/* Feedback */}
        {detail.feedback && (
          <div className="bg-blue-50 rounded-2xl p-6 mb-8 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              💬 Feedback
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">{detail.feedback}</p>
          </div>
        )}

        {/* Transcript */}
        {detail.transcript && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              📝 Transkrip
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">{detail.transcript}</p>
          </div>
        )}

        {/* Video */}
        {detail.videoUrl && (
          <div className="rounded-2xl overflow-hidden border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 p-6 pb-4 flex items-center gap-2">
              🎥 Rekaman Video
            </h3>
            <video controls className="w-full" src={detail.videoUrl}>
              Browser Anda tidak mendukung video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
}

// Component untuk menampilkan score item
function ScoreItem({ icon, label, score }: { icon: string; label: string; score: number }) {
  const getColor = (score: number) => {
    if (score >= 80) return "bg-green-100 border-green-300 text-green-800";
    if (score >= 60) return "bg-yellow-100 border-yellow-300 text-yellow-800";
    return "bg-red-100 border-red-300 text-red-800";
  };

  return (
    <div className={`rounded-2xl p-4 border-2 ${getColor(score)}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <span className="font-bold">{label}</span>
        </div>
        <div className="text-3xl font-black">{score}</div>
      </div>
    </div>
  );
}