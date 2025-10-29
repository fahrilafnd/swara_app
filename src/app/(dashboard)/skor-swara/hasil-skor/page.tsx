"use client";

import React, { useEffect, useState } from 'react';
import SkorSwaraHeader from '@/app/components/skor-swara/SkorSwaraHeader';

type LastRecording = {
  src: string;
  durationSeconds: number;
  createdAt: number;
  topic?: string;
  text?: string;
  mimeType?: string;
};

export default function PresentationScore() {
  const [lastRecording, setLastRecording] = useState<LastRecording | null>(null);

  useEffect(() => {
    try {
      const rawLocal = localStorage.getItem('skor-swara:lastRecording');
      const rawSession = !rawLocal ? sessionStorage.getItem('skor-swara:lastRecording') : null;
      const raw = rawLocal || rawSession;
      if (raw) {
        const parsed = JSON.parse(raw) as LastRecording;
        setLastRecording(parsed);
      }
    } catch (_) {
      // ignore parse/storage errors
    }
  }, []);

  const performanceMetrics = [
    { 
      name: 'Kelancaran & Pengucapan', 
      score: '4 / 5', 
      progress: 80,
      description: 'Pengucapan jelas dengan minimal jeda, tetapi masih ada ruang untuk belajar lagi.',
      icon: '🎯'
    },
    { 
      name: 'Kontak Mata & Ekspresi', 
      score: '3 / 5', 
      progress: 60,
      description: 'Perlu peningkatan dalam kontak mata yang konsisten.',
      icon: '😊'
    },
    { 
      name: 'Penggunaan Bahasa', 
      score: '5 / 5', 
      progress: 100,
      description: 'Sempurna! Bahasa efektif tanpa kata pengisi.',
      icon: '💬'
    }
  ];

  return (
    <>
      <SkorSwaraHeader />
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Score Header */}
        <div className="bg-orange-500 rounded-t-2xl p-8 text-center text-white mb-6">
          <h1 className="text-2xl font-bold mb-4">Hasil Latihanmu</h1>
          <div className="text-6xl font-bold mb-2">+12</div>
          <div className="text-lg mb-4">poin</div>
          <div className="flex justify-center gap-1">
            <span className="text-2xl">⭐</span>
            <span className="text-2xl">⭐</span>
            <span className="text-2xl opacity-30">⭐</span>
          </div>
        </div>

      {/* Video Result Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Hasil Rekaman Latihan</h2>
        {lastRecording?.src ? (
          <div className="space-y-4">
            <div className="relative">
              <video
                src={lastRecording.src}
                controls
                className="w-full rounded-lg shadow-md"
              />
              {typeof lastRecording.durationSeconds === 'number' && (
                <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-mono">
                  {Math.floor(lastRecording.durationSeconds / 60)
                    .toString()
                    .padStart(2, '0')}
                  :
                  {(lastRecording.durationSeconds % 60)
                    .toString()
                    .padStart(2, '0')}
                </div>
              )}
            </div>
            {(lastRecording.topic || lastRecording.text) && (
              <div className="text-sm text-gray-700">
                {lastRecording.topic && (
                  <p className="mb-1"><strong>Topik:</strong> {lastRecording.topic}</p>
                )}
                {lastRecording.text && (
                  <p className="whitespace-pre-line"><strong>Teks:</strong> {lastRecording.text}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">Belum ada hasil rekaman dari sesi latihan. Silakan mulai latihan terlebih dahulu.</div>
        )}
      </div>

      {/* Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{metric.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{metric.name}</h3>
                  <div className="text-lg font-bold text-gray-900">{metric.score}</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metric.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Improvement Suggestions */}

        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-orange-500">Saran Perbaikan</h2>
        </div>
          {/* Kontak Mata & Ekspresi Section */}
          <div className="bg-yellow-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-orange-600">Kontak Mata & Ekspresi</h3>
              <span className="text-orange-600 text-sm font-medium">Cukup</span>
            </div>
            <p className="text-gray-700 text-sm">
              Kontak mata Kamu masih perlu ditingkatkan. Terdeteksi bahwa pandangan cenderung bergerak ke bawah atau ke samping sekitar 40% dari waktu berbicara. Ekspresi wajah cukup baik namun kadang terlihat terlalu serius.
            </p>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Saran Perbaikan:</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">▶</span>
                <span>Sesekali tersenyum atau ubah ekspresi sesuai dengan emosi yang ingin disampaikan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">▶</span>
                <span>Latih kontak mata dengan teknik "segitiga" - bayangkan segitiga di wajah lawan bicara dan gerakkan pandangan di area tersebut</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5">▶</span>
                <span>Berlatih di depan cermin untuk mengamati dan memperbaiki bahasa tubuh Kamu</span>
              </li>
            </ul>
          </div>

          {/* Supporting Video Recommendations */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Rekomendasi Video Pendukung</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Video 1 */}
              <div className="relative bg-gray-200 rounded-lg aspect-video overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-gray-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-mono">
                  18:42
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-sm font-medium">Membangun Kepercayaan Diri Saat Berbicara</p>
                </div>
              </div>

              {/* Video 2 */}
              <div className="relative bg-orange-200 rounded-lg aspect-video overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-orange-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-mono">
                  11:24
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-sm font-medium">Teknik Kontak Mata Efektif dalam Public Speaking</p>
                </div>
              </div>

              {/* Video 3 */}
              <div className="relative bg-gray-200 rounded-lg aspect-video overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-gray-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-sm font-medium">Cara Membaca Audience dengan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between cursor-pointer">
            <h3 className="text-lg font-semibold text-green-600">Kelancaran & Pengucapan</h3>
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}