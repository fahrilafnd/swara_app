"use client";

import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function Mulai() {
  const [copied, setCopied] = useState(false);

  const mentoringData = {
    mentor: {
      name: "Udin Syarifudin",
      title: "Head of Marketing InnovateTech",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      rating: 4.0,
    },
    session: {
      date: "17 September 2025",
      time: "14.00 - 15.00 WIB",
      duration: "60 Menit",
      method: "Zoom Meeting",
      meetingLink: "https://zoom.us/j/123456789?pwd=abcdefgh",
      meetingId: "123 456 789",
      passcode: "swara123",
    },
    agenda: {
      title: "Meningkatkan Kemampuan Public Speaking",
      topics: [
        "Teknik vokal dan intonasi yang efektif",
        "Mengatasi nervous saat berbicara di depan umum",
        "Cara menyusun struktur presentasi yang menarik",
        "Body language dan gesture yang tepat",
        "Tips dan trik untuk Q&A session",
      ],
    },
    notes:
      "Siapkan laptop/HP dengan koneksi internet stabil. Disarankan menggunakan headset untuk kualitas audio yang lebih baik. Pastikan kamera dalam kondisi menyala untuk interaksi yang lebih efektif.",
    materials: [
      { name: "Materi Public Speaking Dasar.pdf", size: "2.5 MB" },
      { name: "Checklist Presentasi Efektif.pdf", size: "1.2 MB" },
    ],
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mentoringData.session.meetingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinMeeting = () => {
    window.open(mentoringData.session.meetingLink, "_blank");
  };

  return (
    <div className="pr-8 pb-8">
      <div className="flex bg-white px-6 py-4 rounded-xl items-center gap-2 mb-6">
        <Link
          href="/latih-swara/mentor-saya"
          className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-orange-500" />
        </Link>
        <h1 className="text-orange-500 font-semibold text-xl">
          Detail Sesi Mentoring
        </h1>
      </div>
      <div className="bg-white shadow-md p-8 rounded-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mentor Info Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Informasi Mentor
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-orange-100">
                  <img
                    src={mentoringData.mentor.image}
                    alt={mentoringData.mentor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {mentoringData.mentor.name}
                  </h3>
                  <p className="text-gray-600 font-medium">
                    {mentoringData.mentor.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-500 text-sm">★</span>
                    <span className="text-gray-700 font-semibold">
                      {mentoringData.mentor.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Detail Sesi
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Tanggal</p>
                    <p className="text-gray-900 font-semibold">
                      {mentoringData.session.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Waktu</p>
                    <p className="text-gray-900 font-semibold">
                      {mentoringData.session.time}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Durasi: {mentoringData.session.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Metode</p>
                    <p className="text-gray-900 font-semibold">
                      {mentoringData.session.method}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Agenda */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Agenda & Topik Pembahasan
              </h2>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {mentoringData.agenda.title}
              </h3>
              <ul className="space-y-3">
                {mentoringData.agenda.topics.map((topic, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{topic}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Materials */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Materi Pembelajaran
              </h2>
              <div className="space-y-3">
                {mentoringData.materials.map((material, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100 hover:bg-orange-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-900 font-semibold">
                          {material.name}
                        </p>
                        <p className="text-gray-500 text-sm">{material.size}</p>
                      </div>
                    </div>
                    <button className="text-orange-600 hover:text-orange-700 font-semibold text-sm">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Catatan Penting
              </h2>
              <p className="text-blue-800 leading-relaxed">
                {mentoringData.notes}
              </p>
            </div>
          </div>

          {/* Right Column - Meeting Link */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white sticky top-8">
              <h2 className="text-xl font-bold mb-6">Link Meeting</h2>

              {/* Meeting Link */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                <p className="text-sm text-white/80 mb-2">Zoom Meeting URL</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono break-all flex-1">
                    {mentoringData.session.meetingLink}
                  </p>
                  <button
                    onClick={handleCopyLink}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex-shrink-0"
                    title="Copy link"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Meeting ID */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                <p className="text-sm text-white/80 mb-1">Meeting ID</p>
                <p className="text-lg font-bold">
                  {mentoringData.session.meetingId}
                </p>
              </div>

              {/* Passcode */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6">
                <p className="text-sm text-white/80 mb-1">Passcode</p>
                <p className="text-lg font-bold">
                  {mentoringData.session.passcode}
                </p>
              </div>

              {/* Join Button */}
              <button
                onClick={handleJoinMeeting}
                className="w-full bg-white text-orange-600 font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                Gabung Meeting
              </button>

              {/* Timer Info */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-white/80 text-center">
                  Sesi akan dimulai dalam
                </p>
                <p className="text-2xl font-bold text-center mt-2">
                  2 Jam 15 Menit
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
