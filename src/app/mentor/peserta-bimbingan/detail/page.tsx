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

  // Session data states
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
    // Logic untuk update session
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
    <div className="pr-8 pb-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <Link
            href="/mentor/peserta-bimbingan"
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Detail Sesi Mentoring
          </Link>

          <div className="flex gap-3">
            <button className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors flex items-center gap-2">
              <X className="w-4 h-4" />
              Batalkan Sesi
            </button>
            <button className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors flex items-center gap-2">
              <Check className="w-4 h-4" />
              Tandai Selesai
            </button>
          </div>
        </div>
      </div>

      <div className="grid bg-white p-6 rounded-xl shadow-sm grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informasi Mentee */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Informasi Mentee
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-orange-200">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                  alt="Mentee"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Ahmad Rizki Pramono
                </h3>
                <p className="text-gray-600 mb-2">
                  Mahasiswa - Universitas Indonesia
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                    <span className="font-semibold text-gray-900">4.95</span>
                    <span className="text-gray-600 text-sm">
                      (Rating dari anda)
                    </span>
                  </div>
                  <span className="text-orange-600 font-semibold">
                    Total Sesi: 3x
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detail Sesi */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Detail Sesi</h2>
              <button
                onClick={() => setShowEditSessionModal(true)}
                className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-orange-50 p-4 rounded-xl">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Tanggal
                  </p>
                  <p className="text-gray-900 font-bold">23 Agustus 2025</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-orange-50 p-4 rounded-xl">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Waktu
                  </p>
                  <p className="text-gray-900 font-bold">14:00 - 15:00 WIB</p>
                  <p className="text-gray-600 text-sm">Durasi: 60 Menit</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-orange-50 p-4 rounded-xl">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Metode
                  </p>
                  <p className="text-gray-900 font-bold">Zoom Meeting</p>
                </div>
              </div>
            </div>
          </div>

          {/* Agenda & Topik */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Agenda & Topik Pembahasan
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
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

            <h3 className="font-bold text-gray-900 mb-3">
              Meningkatkan Kemampuan Public Speaking
            </h3>

            <div className="space-y-2 mb-4">
              {agendaItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 flex-1">{item}</p>
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
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
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

          {/* Materi Pembelajaran */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Materi Pembelajaran
              </h2>
              <button
                onClick={() => setShowUploadMaterialModal(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload Materi
              </button>
            </div>

            <div className="space-y-3">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between bg-orange-50 p-4 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{material.name}</p>
                      <p className="text-sm text-gray-600">
                        {material.size} • Diunggah {material.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-orange-600 hover:text-orange-700 font-semibold text-sm">
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMaterial(material.id)}
                      className="text-red-600 hover:text-red-700 font-semibold text-sm"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Catatan untuk Mentee */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">
                  Catatan untuk Mentee
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  rows={4}
                />
                <button className="mt-3 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors">
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>

          {/* History Mentoring */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Riwayat Mentoring dengan Mentee Ini
            </h2>
            <div className="space-y-3">
              {menteeHistory.map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-bold text-gray-900">{session.topic}</p>
                    <p className="text-sm text-gray-600">{session.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
                    <span className="font-bold text-gray-900">
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
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white sticky top-8">
            <h3 className="text-xl font-bold mb-6">Link Meeting</h3>

            {/* Zoom Meeting URL */}
            <div className="mb-4">
              <label className="text-orange-100 text-sm mb-2 block">
                Zoom Meeting URL
              </label>
              <div className="bg-orange-400 bg-opacity-50 rounded-xl p-3 flex items-center justify-between">
                <p className="text-sm break-all flex-1">
                  {sessionData.zoomUrl}
                </p>
                <button
                  onClick={() => copyToClipboard(sessionData.zoomUrl)}
                  className="ml-2 p-2 hover:bg-orange-500 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Meeting ID */}
            <div className="mb-4">
              <label className="text-orange-100 text-sm mb-2 block">
                Meeting ID
              </label>
              <div className="bg-orange-400 bg-opacity-50 rounded-xl p-3 flex items-center justify-between">
                <p className="text-lg font-bold">{sessionData.meetingId}</p>
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
              <label className="text-orange-100 text-sm mb-2 block">
                Passcode
              </label>
              <div className="bg-orange-400 bg-opacity-50 rounded-xl p-3 flex items-center justify-between">
                <p className="text-lg font-bold">{sessionData.passcode}</p>
                <button
                  onClick={() => copyToClipboard(sessionData.passcode)}
                  className="p-2 hover:bg-orange-500 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Join Meeting Button */}
            <button className="w-full bg-white text-orange-600 py-3 rounded-xl font-bold mb-6 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Gabung Meeting
            </button>

            {/* Countdown */}
            <div className="text-center">
              <p className="text-orange-100 text-sm mb-2">
                Sesi akan dimulai dalam
              </p>
              <p className="text-4xl font-bold">2 Jam 15 Menit</p>
            </div>

            {/* Share Button */}
            <button className="w-full mt-6 bg-orange-700 hover:bg-orange-800 text-white py-3 rounded-xl font-bold transition-colors">
              Bagikan Link ke Mentee
            </button>
          </div>
        </div>
      </div>

      {/* Modal Edit Detail Sesi */}
      {mounted && showEditSessionModal
        ? createPortal(
            <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Edit Detail Sesi
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowEditSessionModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Tanggal */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">
                      Tanggal Sesi
                    </label>
                    <input
                      type="date"
                      value={sessionData.date}
                      onChange={(e) =>
                        setSessionData({ ...sessionData, date: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Waktu */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">
                        Waktu Mulai
                      </label>
                      <input
                        type="time"
                        value={sessionData.startTime}
                        onChange={(e) =>
                          setSessionData({
                            ...sessionData,
                            startTime: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">
                        Waktu Selesai
                      </label>
                      <input
                        type="time"
                        value={sessionData.endTime}
                        onChange={(e) =>
                          setSessionData({
                            ...sessionData,
                            endTime: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Metode */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">
                      Metode Meeting
                    </label>
                    <select
                      value={sessionData.method}
                      onChange={(e) =>
                        setSessionData({
                          ...sessionData,
                          method: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="zoom">Zoom Meeting</option>
                      <option value="gmeet">Google Meet</option>
                      <option value="teams">Microsoft Teams</option>
                    </select>
                  </div>

                  {/* Link Meeting */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">
                      Link Meeting
                    </label>
                    <input
                      type="url"
                      value={sessionData.zoomUrl}
                      onChange={(e) =>
                        setSessionData({
                          ...sessionData,
                          zoomUrl: e.target.value,
                        })
                      }
                      placeholder="https://zoom.us/j/..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Meeting ID & Passcode */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">
                        Meeting ID
                      </label>
                      <input
                        type="text"
                        value={sessionData.meetingId}
                        onChange={(e) =>
                          setSessionData({
                            ...sessionData,
                            meetingId: e.target.value,
                          })
                        }
                        placeholder="123 456 789"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">
                        Passcode
                      </label>
                      <input
                        type="text"
                        value={sessionData.passcode}
                        onChange={(e) =>
                          setSessionData({
                            ...sessionData,
                            passcode: e.target.value,
                          })
                        }
                        placeholder="swara123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setShowEditSessionModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleUpdateSession}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
      {/* Modal Upload Materi */}
      {mounted && showUploadMaterialModal
        ? createPortal(
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1100] p-4">
              <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Upload Materi Pembelajaran
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowUploadMaterialModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Nama Materi */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">
                      Nama Materi
                    </label>
                    <input
                      type="text"
                      value={newMaterial.name}
                      onChange={(e) =>
                        setNewMaterial({ ...newMaterial, name: e.target.value })
                      }
                      placeholder="Contoh: Materi Public Speaking Dasar.pdf"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Upload File */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">
                      File Materi
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors">
                      <input
                        id="file-upload"
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                        className="hidden"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                          <Upload className="w-8 h-8 text-orange-500" />
                        </div>
                        {newMaterial.file ? (
                          <div>
                            <p className="text-gray-900 font-semibold mb-1">
                              {newMaterial.file.name}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {(newMaterial.file.size / (1024 * 1024)).toFixed(
                                2
                              )}{" "}
                              MB
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-900 font-semibold mb-1">
                              Klik untuk upload file
                            </p>
                            <p className="text-gray-600 text-sm">
                              PDF, DOC, PPT (Max 10MB)
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-700">
                        <p className="font-semibold mb-1">
                          Tips Upload Materi:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Pastikan file berukuran maksimal 10MB</li>
                          <li>
                            Format yang didukung: PDF, DOC, DOCX, PPT, PPTX
                          </li>
                          <li>Gunakan nama file yang deskriptif</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowUploadMaterialModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleUploadMaterial}
                      disabled={!newMaterial.file}
                      className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                        newMaterial.file
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Upload Materi
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
