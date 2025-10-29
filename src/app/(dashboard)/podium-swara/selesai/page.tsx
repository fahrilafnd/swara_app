"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Target,
  Smile,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Play,
  ArrowRight,
  Star,
} from "lucide-react";
import Link from "next/link";

interface EvaluationMetric {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  icon: React.ReactNode;
  description: string;
  feedback?: {
    issue: string;
    suggestions: string[];
    videos: {
      id: number;
      title: string;
      thumbnail: string;
      duration: string;
    }[];
  };
}

export default function HasilEvaluasiPodium() {
  const [expandedCard, setExpandedCard] = useState<string | null>(
    "kontak-mata"
  );

  const totalPoints = 12;
  const stars = 2.5; // 2.5 dari 3 bintang

  const metrics: EvaluationMetric[] = [
    {
      id: "kelancaran",
      title: "Kelancaran & Pengucapan",
      score: 4,
      maxScore: 5,
      icon: <Target className="w-8 h-8 text-orange-600" />,
      description:
        "Pengucapan jelas dengan minimal jeda, tetapi masih ada ruang untuk belajar lagi.",
      feedback: {
        issue:
          "Pengucapan kamu sudah cukup baik, namun masih ada beberapa kata yang terdengar kurang jelas di bagian tengah presentasi.",
        suggestions: [
          "Latih artikulasi dengan membaca nyaring setiap hari",
          "Rekam diri sendiri dan dengarkan kembali untuk evaluasi",
          "Praktikkan tongue twisters untuk melatih kejelasan pengucapan",
        ],
        videos: [
          {
            id: 1,
            title: "Teknik Artikulasi untuk Public Speaking",
            thumbnail:
              "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop",
            duration: "12:30",
          },
          {
            id: 2,
            title: "Cara Mengatasi Nervous Saat Berbicara",
            thumbnail:
              "https://images.unsplash.com/photo-1560439514-4e9645039924?w=400&h=300&fit=crop",
            duration: "15:45",
          },
          {
            id: 3,
            title: "Latihan Vokal untuk Speaker Profesional",
            thumbnail:
              "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
            duration: "18:20",
          },
        ],
      },
    },
    {
      id: "kontak-mata",
      title: "Kontak Mata & Ekspresi",
      score: 3,
      maxScore: 5,
      icon: <Smile className="w-8 h-8 text-orange-600" />,
      description: "Perlu peningkatan dalam kontak mata yang konsisten.",
      feedback: {
        issue:
          "Kontak mata kamu masih perlu ditingkatkan. Terdeteksi bahwa pandangan cenderung bergerak ke bawah atau ke samping sekitar 40% dari waktu berbicara. Ekspresi wajah cukup baik namun kadang terlihat terlalu serius.",
        suggestions: [
          "Sesekali tersenyum atau ubah ekspresi sesuai dengan emosi yang ingin disampaikan",
          "Latih kontak mata dengan teknik 'segitiga' - bayangkan segitiga di wajah lawan bicara dan gerakkan pandangan di area tersebut",
          "Berlatih di depan cermin untuk mengamati dan memperbaiki bahasa tubuh kamu",
        ],
        videos: [
          {
            id: 1,
            title: "Membangun Kepercayaan Diri Saat Berbicara",
            thumbnail:
              "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop",
            duration: "18:42",
          },
          {
            id: 2,
            title: "Teknik Kontak Mata Efektif dalam Public Speaking",
            thumbnail:
              "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
            duration: "11:24",
          },
          {
            id: 3,
            title: "Cara Membaca Audience dengan Kontak Mata",
            thumbnail:
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
            duration: "14:15",
          },
        ],
      },
    },
    {
      id: "bahasa",
      title: "Penggunaan Bahasa",
      score: 5,
      maxScore: 5,
      icon: <MessageCircle className="w-8 h-8 text-orange-600" />,
      description: "Sempurna! Bahasa efektif tanpa kata pengisi.",
    },
  ];

  const getScoreBadge = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) {
      return { label: "Sangat Baik", className: "bg-green-100 text-green-700" };
    } else if (percentage >= 60) {
      return { label: "Baik", className: "bg-blue-100 text-blue-700" };
    } else if (percentage >= 40) {
      return { label: "Cukup", className: "bg-yellow-100 text-yellow-700" };
    } else {
      return {
        label: "Perlu Ditingkatkan",
        className: "bg-red-100 text-red-700",
      };
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-12 h-12 fill-white text-white" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-12 h-12 text-white"
          style={{
            fill: "url(#half-gradient)",
          }}
        />
      );
    }

    const emptyStars = 3 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-12 h-12 text-white fill-none" />
      );
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-white rounded-xl shadow-sm p-8">
      {/* SVG Gradient for half star */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="half-gradient">
            <stop offset="50%" stopColor="white" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      {/* Header */}
      <Link href={"/podium-swara"} className="flex items-center gap-2 text-orange-600 font-semibold mb-6 hover:text-orange-700 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Kembali
      </Link>

      {/* Result Card */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-12 mb-8 text-center text-white shadow-2xl">
        <h1 className="text-3xl font-bold mb-6">Hasil Latihanmu</h1>
        <div className="text-8xl font-black mb-2">+{totalPoints}</div>
        <p className="text-2xl font-semibold mb-6">poin</p>
        <div className="flex items-center justify-center gap-2">
          {renderStars(stars)}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric) => {
          const percentage = (metric.score / metric.maxScore) * 100;
          return (
            <div
              key={metric.id}
              className="bg-white rounded-3xl p-6 border-2 border-orange-200 hover:shadow-lg transition-all"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center">
                  {metric.icon}
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-gray-900">
                    {metric.score}{" "}
                    <span className="text-2xl text-gray-400">
                      / {metric.maxScore}
                    </span>
                  </p>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 mb-4 text-lg">
                {metric.title}
              </h3>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-3 bg-orange-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {metric.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Feedback Section */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-orange-600 mb-8 text-center">
          Saran Perbaikan
        </h2>
        <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent mb-8" />

        <div className="space-y-4">
          {metrics
            .filter((m) => m.feedback)
            .map((metric) => {
              const isExpanded = expandedCard === metric.id;
              const badge = getScoreBadge(metric.score, metric.maxScore);

              return (
                <div
                  key={metric.id}
                  className={`border-2 rounded-2xl overflow-hidden transition-all ${
                    isExpanded
                      ? "border-yellow-300 bg-yellow-50"
                      : "border-gray-200 bg-white hover:border-orange-300"
                  }`}
                >
                  {/* Header */}
                  <button
                    onClick={() =>
                      setExpandedCard(isExpanded ? null : metric.id)
                    }
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-yellow-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900 text-lg">
                        {metric.title}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-600" />
                    )}
                  </button>

                  {/* Content */}
                  {isExpanded && metric.feedback && (
                    <div className="px-6 pb-6 space-y-6">
                      {/* Issue Description */}
                      <p className="text-gray-700 leading-relaxed">
                        {metric.feedback.issue}
                      </p>

                      {/* Suggestions */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">
                          Saran Perbaikan:
                        </h4>
                        <div className="space-y-2">
                          {metric.feedback.suggestions.map(
                            (suggestion, index) => (
                              <div
                                key={index}
                                className="flex gap-3 text-gray-700"
                              >
                                <ArrowRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                <p>{suggestion}</p>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Video Recommendations */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-4">
                          Rekomendasi Video Pendukung
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {metric.feedback.videos.map((video) => (
                            <div
                              key={video.id}
                              className="group relative rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all"
                            >
                              {/* Thumbnail */}
                              <div className="relative h-48">
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                {/* Duration Badge */}
                                <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                                  {video.duration}
                                </div>

                                {/* Play Button */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Play className="w-8 h-8 text-orange-500 fill-orange-500 ml-1" />
                                  </div>
                                </div>

                                {/* Title */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                  <h5 className="text-white font-bold text-sm leading-tight">
                                    {video.title}
                                  </h5>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
