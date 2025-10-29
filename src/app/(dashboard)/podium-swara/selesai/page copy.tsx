"use client";

import React, { useState } from "react";
import { ArrowLeft, Bell } from "lucide-react";
import Link from "next/link";

interface EvaluationCategory {
  id: string;
  title: string;
  percentage: number;
  color: string;
  lightColor: string;
  feedback: string;
  improvements: string[];
}

export default function Selesai() {
  const evaluationData: EvaluationCategory[] = [
    {
      id: "intonasi",
      title: "Intonasi",
      percentage: 37,
      color: "#5B9BD5",
      lightColor: "#E3F2FD",
      feedback:
        "Anda sudah cukup dinamis, tetapi hindari terlalu monoton pada akhir kalimat.",
      improvements: [
        "Latih intonasi dengan membaca teks pendek dengan perubahan nada.",
      ],
    },
    {
      id: "pengucapan",
      title: "Pengucapan",
      percentage: 87,
      color: "#70AD47",
      lightColor: "#E8F5E9",
      feedback: "Pengucapan anda sangat baik.",
      improvements: [
        "Lakukan eksplorasi kosa kata / istilah yang sering muncul di dunia profesional.",
      ],
    },
    {
      id: "kecepatan",
      title: "Kecepatan Berbicara",
      percentage: 35,
      color: "#FFC000",
      lightColor: "#FFF8E1",
      feedback:
        "Anda berbicara terlalu cepat, sehingga pendengar mungkin kesulitan memahami beberapa bagian pembicaraan Anda.",
      improvements: [
        "Ikuti kecepatan membaca teks dengan perubahan warna pada saat berbicara.",
      ],
    },
    {
      id: "ekspresi",
      title: "Ekspresi Wajah",
      percentage: 25,
      color: "#E85D9A",
      lightColor: "#FCE4EC",
      feedback:
        "Ekspresi wajah Anda terlihat datar, cobalah tersenyum lebih sering.",
      improvements: [
        "Cobalah tersenyum sesekali untuk menunjukkan rasa semangat.",
      ],
    },
  ];

  const CircularProgress = ({
    percentage,
    color,
    lightColor,
  }: {
    percentage: number;
    color: string;
    lightColor: string;
  }) => {
    const circumference = 2 * Math.PI * 80;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg className="transform -rotate-90 w-48 h-48">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke={lightColor}
            strokeWidth="20"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke={color}
            strokeWidth="20"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-bold" style={{ color }}>
            {percentage}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex bg-white px-6 py-4 rounded-xl items-center gap-2 mb-4">
        <Link
          href="/podium-swara"
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-orange-500" />
        </Link>{" "}
        <h1 className="text-orange-500 font-semibold text-lg">
          Podium Swara - Hasil Analisis
        </h1>
      </div>
      <div className="h-fit mb-10 bg-white rounded-xl shadow-md p-8">
        <div className="bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-3xl p-8 mb-8 shadow-lg">
          <h2 className="text-white text-2xl font-bold mb-3">
            Kamu sudah mencoba sangat baik!
          </h2>
          <p className="text-white text-base opacity-90">
            Kamu sudah mulai menguasai dasar-dasar public speaking! Teruskan
            latihan untuk mencapai level berikutnya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {evaluationData.map((category) => (
            <div key={category.id} className="flex flex-col">
              {/* Category Title */}
              <div className="text-center mb-4">
                <span
                  className="inline-block px-8 py-3 rounded-full text-white font-semibold text-lg shadow-md"
                  style={{ backgroundColor: category.color }}
                >
                  {category.title}
                </span>
              </div>

              {/* Circular Progress */}
              <CircularProgress
                percentage={category.percentage}
                color={category.color}
                lightColor={category.lightColor}
              />

              {/* Evaluation Card */}
              <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-200">
                {/* Header Evaluasi */}
                <div
                  className="py-4 px-6"
                  style={{ backgroundColor: category.lightColor }}
                >
                  <h3 className="font-bold text-xl text-center text-gray-800">
                    Evaluasi
                  </h3>
                </div>

                {/* Feedback Content */}
                <div className="bg-white py-6 px-6">
                  <p className="text-gray-800 text-base leading-relaxed text-center">
                    {category.feedback}
                  </p>
                </div>

                {/* Saran Perbaikan Header */}
                <div
                  className="py-4 px-6"
                  style={{ backgroundColor: category.lightColor }}
                >
                  <h3 className="font-bold text-xl text-center text-gray-800">
                    Saran Perbaikan
                  </h3>
                </div>

                {/* Improvements Content */}
                <div className="bg-white py-6 px-6">
                  {category.improvements.map((improvement, index) => (
                    <p
                      key={index}
                      className="text-gray-800 text-base leading-relaxed text-center"
                    >
                      {improvement}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
