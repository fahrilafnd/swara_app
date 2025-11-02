// app/skor-swara/pilih-topik/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Search, Filter, ChevronRight } from "lucide-react";
import SkorSwaraHeader from "@/app/components/skor-swara/SkorSwaraHeader";
import CustomTopicInput from "@/app/components/skor-swara/CustomTopicInput";
import {
  TRAINING_TOPICS,
  type TrainingMode,
  type TrainingTopic,
} from "../config/levels";

export default function PilihTopikPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") as TrainingMode) || "full-text";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

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

  const handleSelectTopic = (topic: TrainingTopic) => {
    sessionStorage.setItem("skor-swara:selectedTopic", JSON.stringify(topic));
    router.push("/skor-swara/sesi-latihan");
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
        <div className="bg-white shadow-md rounded-xl p-8 mb-10">
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

  return (
    <>
      <div className="bg-white shadow-md rounded-xl p-8 mb-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Kembali</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Pilih Topik Latihan
          </h1>
          <p className="text-lg text-gray-600">
            {mode === "full-text"
              ? "Pilih topik dengan teks lengkap untuk latihan membaca"
              : "Pilih topik dengan visual untuk latihan improvisasi"}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
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
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
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
                        // Fallback jika gambar gagal load
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
    </>
  );
}
