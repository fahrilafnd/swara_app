// app/components/skor-swara/CustomTopicInput.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3, Sparkles, Lightbulb } from "lucide-react";

export default function CustomTopicInput() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [targetDuration, setTargetDuration] = useState(60); // in seconds

  const MIN_TITLE_LENGTH = 10;
  const MAX_TITLE_LENGTH = 100;

  const titleValid =
    title.length >= MIN_TITLE_LENGTH && title.length <= MAX_TITLE_LENGTH;

  const handleSubmit = () => {
    if (!titleValid) {
      alert("Mohon masukkan judul topik minimal 10 karakter!");
      return;
    }

    const customTopic = {
      id: `custom-${Date.now()}`,
      title,
      category: "Custom",
      difficulty: "custom" as const,
      targetDuration,
    };

    sessionStorage.setItem(
      "skor-swara:selectedTopic",
      JSON.stringify(customTopic)
    );
    router.push("/skor-swara/sesi-latihan");
  };

  const suggestedTopics = [
    "Pengalaman Magang di Perusahaan Startup",
    "Hobi Fotografi dan Kreativitas Visual",
    "Perjalanan Mendaki Gunung Favorit",
    "Pentingnya Work-Life Balance",
    "Belajar Bahasa Baru di Era Digital",
    "Strategi Menghadapi Interview Kerja",
    "Tips Produktivitas untuk Mahasiswa",
    "Pengalaman Mengikuti Kompetisi",
  ];

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r rounded-xl from-blue-500 to-pink-600 p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Edit3 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black">Topik Kustom</h1>
            <p className="text-purple-100">
              Buat topik presentasi sesuai keinginanmu
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Info Banner */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-purple-900 mb-2">
                Mode Topik Kustom
              </h3>
              <p className="text-sm text-purple-800 leading-relaxed">
                Dalam mode ini, kamu hanya perlu menentukan{" "}
                <strong>judul topik</strong>. Tidak ada teks atau outline yang
                akan ditampilkan. Ini adalah latihan{" "}
                <strong>improvisasi murni</strong> untuk melatih kemampuan
                berbicara spontan tentang topik yang kamu kuasai.
              </p>
            </div>
          </div>
        </div>

        {/* Title Input */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Judul Topik Presentasi *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={MAX_TITLE_LENGTH}
            placeholder="Contoh: Pengalaman Saya Belajar Public Speaking"
            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-lg"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {title.length}/{MAX_TITLE_LENGTH} karakter
            </span>
            {titleValid ? (
              <span className="text-xs text-green-600 font-semibold">
                ✓ Judul valid
              </span>
            ) : (
              title.length > 0 && (
                <span className="text-xs text-orange-600 font-semibold">
                  Minimal {MIN_TITLE_LENGTH} karakter
                </span>
              )
            )}
          </div>
        </div>

        {/* Duration Slider */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Target Durasi Presentasi
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={30}
              max={60}
              step={10}
              value={targetDuration}
              onChange={(e) => setTargetDuration(parseInt(e.target.value))}
              className="flex-1"
            />
            <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl font-bold min-w-[100px] text-center">
              {targetDuration} detik
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Atur durasi yang sesuai dengan kompleksitas topik Anda
          </p>
        </div>

        {/* Suggested Topics */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-gray-900">Inspirasi Topik</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestedTopics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => setTitle(topic)}
                className="text-left px-4 py-3 bg-white hover:bg-purple-100 rounded-xl transition-colors text-sm text-gray-700 border border-gray-200 hover:border-purple-300"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!titleValid}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            titleValid
              ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-xl hover:-translate-y-1"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {titleValid
            ? "Mulai Latihan dengan Topik Ini"
            : "Masukkan Judul Topik untuk Melanjutkan"}
        </button>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
          <p className="text-sm text-blue-900 font-semibold mb-2">
            💡 Tips Mode Kustom:
          </p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Pilih topik yang kamu kuasai dengan baik</li>
            <li>• Tidak ada teleprompter - ini latihan improvisasi murni</li>
            <li>• Pikirkan struktur: pembukaan, isi, penutup</li>
            <li>• Berbicara natural dan percaya diri</li>
            <li>• Gunakan contoh dan cerita untuk menjelaskan</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
