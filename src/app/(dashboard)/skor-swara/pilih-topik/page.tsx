// app/skor-swara/pilih-topik/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Filter,
  ChevronRight,
  Shuffle,
  Clock,
} from "lucide-react";
import SkorSwaraHeader from "@/app/components/skor-swara/SkorSwaraHeader";
import CustomTopicInput from "@/app/components/skor-swara/CustomTopicInput";
import {
  TRAINING_TOPICS,
  type TrainingMode,
  type TrainingTopic,
} from "../config/levels";
import Link from "next/link";

export default function PilihTopikPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") as TrainingMode) || "full-text";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [randomTopic, setRandomTopic] = useState<TrainingTopic | null>(null);

  // Filter topics berdasarkan mode
  const availableTopics = TRAINING_TOPICS.filter((topic) => {
    if (mode === "full-text") return topic.text;
    if (mode === "topic-image") return topic.image;
    return false;
  });

  // Get unique categories
  const categories = [
    "all",
    ...new Set(availableTopics.map((t) => t.category)),
  ];

  // Filter topics
  const filteredTopics = availableTopics.filter((topic) => {
    const matchSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "all" || topic.category === selectedCategory;
    const matchDifficulty =
      selectedDifficulty === "all" || topic.difficulty === selectedDifficulty;

    return matchSearch && matchCategory && matchDifficulty;
  });

  // Auto random untuk topic-image mode
  useEffect(() => {
    if (mode === "topic-image" && availableTopics.length > 0) {
      handleRandomTopic();
    }
  }, [mode]);

  // Countdown timer
  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdown === 0 && randomTopic) {
      // Countdown selesai, mulai latihan
      sessionStorage.setItem(
        "skor-swara:selectedTopic",
        JSON.stringify(randomTopic)
      );
      router.push("/skor-swara/sesi-latihan");
    }
  }, [showCountdown, countdown, randomTopic, router]);

  const handleRandomTopic = () => {
    const topics = filteredTopics.length > 0 ? filteredTopics : availableTopics;
    const random = topics[Math.floor(Math.random() * topics.length)];
    setRandomTopic(random);
    setShowCountdown(true);
    setCountdown(10);
  };

  const handleSelectTopic = (topic: TrainingTopic) => {
    sessionStorage.setItem("skor-swara:selectedTopic", JSON.stringify(topic));
    router.push("/skor-swara/sesi-latihan");
  };

  const handleCancelCountdown = () => {
    setShowCountdown(false);
    setCountdown(10);
    setRandomTopic(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Mudah";
      case "medium":
        return "Sedang";
      case "hard":
        return "Sulit";
      default:
        return difficulty;
    }
  };

  // If custom topic mode, show custom input
  if (mode === "custom-topic") {
    return (
      <>
        <div className="min-h-screen bg-white mb-10 rounded-xl p-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Kembali</span>
          </button>

          <CustomTopicInput />
        </div>
      </>
    );
  }

  // Countdown Modal
  if (showCountdown && randomTopic) {
    return (
      <>
        <div className="min-h-screen bg-white rounded-xl shadow-md mb-10 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-12 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-6">
                <Clock className="w-12 h-12 text-orange-600" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">
                Bersiap untuk Latihan!
              </h2>
              <p className="text-gray-600 text-lg">
                Topik acak telah dipilih. Mulai dalam...
              </p>
            </div>

            {/* Countdown Circle */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#fee2e2"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 88 * (1 - countdown / 10)
                  }`}
                  className="transition-all duration-1000 ease-linear"
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl font-black text-gray-900">
                  {countdown}
                </span>
              </div>
            </div>

            {/* Topic Preview */}
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                  {randomTopic.category}
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${getDifficultyColor(
                    randomTopic.difficulty
                  )}`}
                >
                  {getDifficultyLabel(randomTopic.difficulty)}
                </span>
              </div>
              <h3 className="text-xl font-black text-gray-900">
                {randomTopic.title}
              </h3>
            </div>

            {/* Cancel Button */}
            <Link
              href={"/skor-swara/pilih-mode"}
              // onClick={handleCancelCountdown}
              className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Batalkan
            </Link>

            <p className="text-xs text-gray-500 mt-4">
              Latihan akan dimulai otomatis setelah hitungan mundur selesai
            </p>
          </div>
        </div>
      </>
    );
  }

  // Full-text mode: Show topic list with random button
  return (
    <>
      <div className="min-h-screen bg-white rounded-xl py-12 px-4">
        <div className="bg-white shadow-md rounded-xl p-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Kembali</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-4">
              Pilih Topik Latihan
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {mode === "full-text"
                ? "Pilih topik dengan teks lengkap untuk latihan membaca"
                : "Pilih topik dengan visual untuk latihan improvisasi"}
            </p>

            {/* Random Button for Full-Text Mode */}
            {mode === "full-text" && (
              <button
                onClick={handleRandomTopic}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-pink-600 text-white rounded-2xl font-bold hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <Shuffle className="w-5 h-5" />
                Random Topik
              </button>
            )}
          </div>

          {/* Search & Filter */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari topik..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors bg-white"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="md:col-span-1">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors appearance-none bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "Semua Kategori" : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="md:col-span-1">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors appearance-none bg-white"
                >
                  <option value="all">Semua Tingkat</option>
                  <option value="easy">Mudah</option>
                  <option value="medium">Sedang</option>
                  <option value="hard">Sulit</option>
                </select>
              </div>
            </div>
          </div>

          {/* Topics Grid */}
          {filteredTopics.length === 0 ? (
            <div className="text-center py-16">
              <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                Tidak ada topik yang sesuai dengan filter
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
                >
                  {/* Image for topic-image mode */}
                  {mode === "topic-image" && topic.image && (
                    <div className="h-48 bg-gradient-to-br from-orange-400 to-pink-500 relative overflow-hidden">
                      <img
                        src={topic.image}
                        alt={topic.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                        {topic.category}
                      </span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${getDifficultyColor(
                          topic.difficulty
                        )}`}
                      >
                        {getDifficultyLabel(topic.difficulty)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                      {topic.title}
                    </h3>

                    {/* For topic-image mode, show keywords */}
                    {mode === "topic-image" && topic.keywords && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">
                          Keyword hints:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {topic.keywords.slice(0, 3).map((kw, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* For full-text mode, show preview */}
                    {mode === "full-text" && topic.text && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {topic.text}
                      </p>
                    )}

                    <button className="w-full py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 group-hover:shadow-lg transition-all">
                      Pilih Topik
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
