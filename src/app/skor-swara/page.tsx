"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Volume2, Zap, Smile, User, ChevronRight, Video, BarChart3 } from 'lucide-react';

export default function SkorSwaraPage() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const router = useRouter();

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
            {/* Video Upload Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Video Upload Section */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Upload Video Presentasi</h2>
                <div className="border-4 border-dashed border-gray-300 rounded-xl p-8">
                  {!videoFile ? (
                    <label className="flex flex-col items-center justify-center cursor-pointer">
                      <Video className="w-16 h-16 text-gray-400 mb-4" />
                      <span className="text-gray-600 mb-2">Upload video presentasi Anda</span>
                      <span className="text-sm text-gray-400 mb-4">MP4, MOV, AVI (Max 100MB)</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                      <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                        Pilih Video
                      </button>
                    </label>
                  ) : (
                    <div className="space-y-4">
                      <video
                        src={videoFile}
                        controls
                        className="w-full rounded-lg"
                      />
                      <button
                        onClick={() => setVideoFile(null)}
                        className="text-sm text-gray-600 hover:text-gray-800"
                      >
                        Ganti video
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium w-fit mb-4">
                  Topik Pembicaraan
                </div>
                <h2 className="text-xl font-bold text-orange-600 mb-6">
                  Merancang Masa Depan: Membangun Karier di Era Digital
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Keterampilan komunikasi yang kuat dan kemampuan beradaptasi adalah dua hal yang saya anggap sangat penting di dunia kerja. Dengan komunikasi yang efektif, saya dapat menyampaikan.
                  </p>
                  <p>
                    Dalam era saat ini, ketepatan bicara, cara menyampaikan informasi dengan jelas juga menjadi harga mahal yang memang sangat berguna di era Industri 5.0 di mana banyak persaingan dalam berbagai bidang.
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    onClick={() => router.push('/skor-swara/hasil-skor')}
                    className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <BarChart3 className="w-5 h-5" />
                    Hasil Skor
                  </button>
                  <button
                    onClick={() => router.push('/skor-swara/hasil-analisis')}
                    className="flex-1 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <BarChart3 className="w-5 h-5" />
                    Hasil Analisis
                  </button>
                </div>
              </div>
            </div>

            {/* Assessment Components */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                <Mic className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Menganalisis Intonasi</h3>
              </div>
              
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                <Volume2 className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Menganalisis Pengucapan</h3>
              </div>
              
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                <Zap className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Menganalisis Kecepatan Berbicara</h3>
              </div>
              
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                <Smile className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Menganalisis Ekspresi Wajah</h3>
              </div>
            </div>

            {/* History Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Riwayat Adu Swara</h2>
                <button className="text-orange-500 text-sm hover:text-orange-600 transition-colors">
                  Lihat semua
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Presentasi Bisnis</h3>
                      <p className="text-sm text-gray-500">28 Agustus 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      70/100 Cukup baik
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Presentasi Bisnis</h3>
                      <p className="text-sm text-gray-500">10 Agustus 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      85/100 Baik
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Presentasi Bisnis</h3>
                      <p className="text-sm text-gray-500">5 Agustus 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      78/100 Baik
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
    </div>
  );
}
