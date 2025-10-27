"use client";

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useRouter } from 'next/navigation';

export default function PresentationScore() {
  const router = useRouter();

  const analysisMetrics = [
    { name: 'Intonasi', value: 85, color: 'bg-purple-500', score: '85%' },
    { name: 'Kecepatan Bicara', value: 90, color: 'bg-green-500', score: '90%' },
    { name: 'Kejelasan Pengucapan', value: 60, color: 'bg-orange-500', score: '60%' },
    { name: 'Ekspresi Wajah', value: 78, color: 'bg-yellow-500', score: '78%' }
  ];


  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isCollapsed={false} setIsCollapsed={function (v: boolean): void {
        throw new Error('Function not implemented.');
      } } />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 md:ml-60">
        <Header />
        
        {/* Spacer to offset fixed header on desktop */}
        <div className="hidden md:block h-14" />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Kembali</span>
              </button>
            </div>

            {/* Video Representation Results */}
            <div className="mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Hasil Representasi Video</h2>
                <div className="space-y-4">
                  <div className="relative">
                    <video
                      src="/sample-video.mp4"
                      controls
                      className="w-full rounded-lg shadow-md"
                      poster="/video-poster.jpg"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      02:45
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>Durasi:</strong> 2 menit 45 detik</p>
                    <p><strong>Kualitas:</strong> HD (1080p)</p>
                    <p><strong>Format:</strong> MP4</p>
                  </div>
                </div>
              </div>
            </div>

          {/* Analysis Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Real-time Analysis */}
            <div className="lg:col-span-1 bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Analisis Real Time</h2>
              <div className="space-y-5">
                {analysisMetrics.map((metric, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                      <span className="text-sm font-semibold text-gray-800">{metric.score}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${metric.color} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Topic Discussion and AI Suggestions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Topic Discussion */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium w-fit mb-4">
                  Topik Pembicaraan
                </div>
                <h3 className="font-bold text-xl text-orange-600 mb-4">
                  Merancang Masa Depan: Membangun Karier di Era Digital
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Keterampilan komunikasi yang kuat dan kemampuan beradaptasi adalah dua hal yang saya anggap sangat penting di dunia kerja. Dengan komunikasi yang efektif, saya dapat menyampaikan.
                  </p>
                  <p>
                    Dalam era saat ini, ketepatan bicara, cara menyampaikan informasi dengan jelas juga menjadi harga mahal yang memang sangat berguna di era Industri 5.0 di mana banyak persaingan dalam berbagai bidang.
                  </p>
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Saran AI</h2>
                <p className="text-gray-600">
                  Pertahankan kontak mata dengan kamera. Variasikan intonasi untuk menekankan poin penting.
                </p>
              </div>
            </div>
          </div>


          </div>
        </main>
      </div>
    </div>
  );
}