"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Star,
  Calendar,
  Clock,
  Video,
  Copy,
  ExternalLink,
  FileText,
  Upload,
  Edit2,
  Check,
  X,
  Info,
  Download,
  Plus,
  Trash2,
  Save,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { createPortal } from "react-dom";

export default function DetailMentoring() {
  const [isEditing, setIsEditing] = useState(false);
  const [showEditSessionModal, setShowEditSessionModal] = useState(false);
  const [showUploadMaterialModal, setShowUploadMaterialModal] = useState(false);

  const [agendaItems, setAgendaItems] = useState([
    "Teknik vokal dan intonasi yang efektif",
    "Mengatasi nervous saat berbicara di depan umum",
    "Cara menyusun struktur presentasi yang menarik",
    "Body language dan gesture yang tepat",
    "Tips dan trik untuk Q&A session",
  ]);
  const [newAgenda, setNewAgenda] = useState("");
  const [notes, setNotes] = useState(
    "Siapkan laptop/HP dengan koneksi internet stabil. Disarankan menggunakan headset untuk kualitas audio yang lebih baik. Pastikan kamera dalam kondisi menyala untuk interaksi yang lebih efektif."
  );

  const [sessionData, setSessionData] = useState({
    date: "2025-08-23",
    startTime: "14:00",
    endTime: "15:00",
    method: "zoom",
    zoomUrl: "https://zoom.us/j/123456789?pwd=abcdefgh",
    meetingId: "123 456 789",
    passcode: "swara123",
  });

  const [materials, setMaterials] = useState([
    {
      id: 1,
      name: "Materi Public Speaking Dasar.pdf",
      size: "2.5 MB",
      uploadedAt: "20 Agustus 2025",
    },
    {
      id: 2,
      name: "Checklist Presentasi Efektif.pdf",
      size: "1.2 MB",
      uploadedAt: "20 Agustus 2025",
    },
  ]);

  const [newMaterial, setNewMaterial] = useState({
    name: "",
    file: null as File | null,
  });

  const menteeHistory = [
    { date: "15 Agustus 2025", topic: "Dasar Public Speaking", rating: 5 },
    { date: "8 Agustus 2025", topic: "Presentasi Bisnis", rating: 5 },
    { date: "1 Agustus 2025", topic: "Story Telling", rating: 4.5 },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Berhasil disalin!");
  };

  const addAgenda = () => {
    if (newAgenda.trim()) {
      setAgendaItems([...agendaItems, newAgenda]);
      setNewAgenda("");
    }
  };

  const removeAgenda = (index: number) => {
    setAgendaItems(agendaItems.filter((_, i) => i !== index));
  };

  const handleUpdateSession = () => {
    console.log("Session updated:", sessionData);
    setShowEditSessionModal(false);
    alert("Detail sesi berhasil diperbarui!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewMaterial({
        ...newMaterial,
        file: file,
        name: newMaterial.name || file.name,
      });
    }
  };

  const handleUploadMaterial = () => {
    if (newMaterial.file) {
      const newMat = {
        id: materials.length + 1,
        name: newMaterial.name,
        size: `${(newMaterial.file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      };
      setMaterials([...materials, newMat]);
      setNewMaterial({ name: "", file: null });
      setShowUploadMaterialModal(false);
      alert("Materi berhasil diunggah!");
    }
  };

  const handleDeleteMaterial = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus materi ini?")) {
      setMaterials(materials.filter((m) => m.id !== id));
      alert("Materi berhasil dihapus!");
    }
  };

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/mentor/peserta-bimbingan"
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base">Detail Sesi Mentoring</span>
          </Link>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button className="px-4 sm:px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm">
              <X className="w-4 h-4" />
              Batalkan Sesi
            </button>
            <button className="px-4 sm:px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              Tandai Selesai
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informasi Mentee */}
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Informasi Mentee
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-orange-200 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                  alt="Mentee"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 w-full sm:w-auto">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                  Ahmad Rizki Pramono
                </h3>
                <p className="text-gray-600 mb-2 text-sm sm:text-base">
                  Mahasiswa - Universitas Indonesia
                </p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">4.95</span>
                    <span className="text-gray-600 text-xs sm:text-sm">
                      (Rating dari anda)
                    </span>
                  </div>
                  <span className="text-orange-600 font-semibold text-xs sm:text-sm">
                    Total Sesi: 3x
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detail Sesi */}
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Detail Sesi</h2>
              <button
                onClick={() => setShowEditSessionModal(true)}
                className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 text-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3 sm:gap-4 bg-orange-50 p-4 rounded-xl">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1">
                    Tanggal
                  </p>
                  <p className="text-gray-900 font-bold text-sm sm:text-base">23 Agustus 2025</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4 bg-orange-50 p-4 rounded-xl">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1">
                    Waktu
                  </p>
                  <p className="text-gray-900 font-bold text-sm sm:text-base">14:00 - 15:00 WIB</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Durasi: 60 Menit</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4 bg-orange-50 p-4 rounded-xl">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1">
                    Metode
                  </p>
                  <p className="text-gray-900 font-bold text-sm sm:text-base">Zoom Meeting</p>
                </div>
              </div>
            </div>
          </div>

          {/* Agenda & Topik */}
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Agenda & Topik Pembahasan
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 text-sm"
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </>
                )}
              </button>
            </div>

            <h3 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">
              Meningkatkan Kemampuan Public Speaking
            </h3>

            <div className="space-y-2 mb-4">
              {agendaItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs sm:text-sm">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 flex-1 text-sm sm:text-base">{item}</p>
                  {isEditing && (
                    <button
                      onClick={() => removeAgenda(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAgenda}
                  onChange={(e) => setNewAgenda(e.target.value)}
                  placeholder="Tambah agenda baru..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  onKeyPress={(e) => e.key === "Enter" && addAgenda()}
                />
                <button
                  onClick={addAgenda}
                  className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Materi Pembelajaran - DIPERBAIKI */}
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Materi Pembelajaran
              </h2>
              <button
                onClick={() => setShowUploadMaterialModal(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors text-sm w-full sm:w-auto justify-center"
              >
                <Upload className="w-4 h-4" />
                Upload Materi
              </button>
            </div>

            <div className="space-y-3">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="bg-orange-50 p-4 rounded-xl"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm sm:text-base break-words">
                        {material.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {material.size} • Diunggah {material.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button className="px-3 py-2 text-orange-600 hover:bg-orange-100 rounded-lg font-semibold transition-colors flex items-center gap-1 text-sm">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => handleDeleteMaterial(material.id)}
                      className="px-3 py-2 text-red-600 hover:bg-red-100 rounded-lg font-semibold transition-colors flex items-center gap-1 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Catatan untuk Mentee */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">
                  Catatan untuk Mentee
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm"
                  rows={4}
                />
                <button className="mt-3 px-4 sm:px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors text-sm w-full sm:w-auto">
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>

          {/* History Mentoring */}
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Riwayat Mentoring dengan Mentee Ini
            </h2>
            <div className="space-y-3">
              {menteeHistory.map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">{session.topic}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{session.date}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-orange-400 text-orange-400" />
                    <span className="font-bold text-gray-900 text-sm sm:text-base">
                      {session.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Link Meeting & Countdown */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-5 sm:p-6 text-white lg:sticky lg:top-8">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Link Meeting</h3>

            {/* Zoom Meeting URL */}
            <div className="mb-4">
              <label className="text-orange-100 text-xs sm:text-sm mb-2 block">
                Zoom Meeting URL
              </label>
              <div className="bg-orange-400 bg-opacity-50 rounded-xl p-3 flex items-center justify-between gap-2">
                <p className="text-xs sm:text-sm break-all flex-1">
                  {sessionData.zoomUrl}
                </p>
                <button
                  onClick={() => copyToClipboard(sessionData.zoomUrl)}
                  className="ml-2 p-2 hover:bg-orange-500 rounded-lg transition-colors flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Meeting ID */}
            <div className="mb-4">
              <label className="text-orange-100 text-xs sm:text-sm mb-2 block">
                Meeting ID
              </label>
              <div className="bg-orange-400 bg-opacity-50 rounded-xl p-3 flex items-center justify-between">
                <p className="text-base sm:text-lg font-bold">{sessionData.meetingId}</p>
                <button
                  onClick={() =>
                    copyToClipboard(sessionData.meetingId.replace(/\s/g, ""))
                  }
                  className="p-2 hover:bg-orange-500 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Passcode */}
            <div className="mb-6">
              <label className="text-orange-100 text-xs sm:text-sm mb-2 block">
                Passcode
              </label>
              <div className="bg-orange-400 bg-opacity-50 rounded-xl p-3 flex items-center justify-between">
                <p className="text-base sm:text-lg font-bold">{sessionData.passcode}</p>
                <button
                  onClick={() => copyToClipboard(sessionData.passcode)}
                  className="p-2 hover:bg-orange-500 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Join Meeting Button */}
            <button className="w-full bg-white text-orange-600 py-3 rounded-xl font-bold mb-6 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
              <ExternalLink className="w-5 h-5" />
              Gabung Meeting
            </button>

            {/* Countdown */}
            <div className="text-center">
              <p className="text-orange-100 text-xs sm:text-sm mb-2">
                Sesi akan dimulai dalam
              </p>
              <p className="text-3xl sm:text-4xl font-bold">2 Jam 15 Menit</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Detail Sesi - SAMA SEPERTI SEBELUMNYA */}
      {/* ... existing modal code ... */}

      {/* Modal Upload Materi - SAMA SEPERTI SEBELUMNYA */}
      {/* ... existing modal code ... */}
    </div>
  );
}
