"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Square } from 'lucide-react';

export default function SesiLatihanPage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showText, setShowText] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const topik = "Merancang Masa Depan: Membangun Karier di Era Digital";
  const latihanText = `Keterampilan komunikasi yang kuat dan kemampuan beradaptasi adalah dua hal yang saya anggap sangat penting di dunia kerja. Dengan komunikasi yang efektif, saya dapat menyampaikan ide dengan jelas dan berkolaborasi dengan tim.

Dalam era saat ini, ketepatan bicara, cara menyampaikan informasi dengan jelas juga menjadi harga mahal yang memang sangat berguna di era Industri 5.0 di mana banyak persaingan dalam berbagai bidang.`;

  // Format timer to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();

    return () => {
      // Cleanup camera
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleStartTraining = async () => {
    setIsRecording(true);
    setShowText(true);
    setTimer(0);

    // Start timer
    intervalRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    // Start recording
    try {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        
        mediaRecorder.start();
      }
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const handleFinishTraining = () => {
    setIsRecording(false);
    setShowText(false);

    // Stop timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Stop recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    // Navigate to results
    router.push('/skor-swara/hasil-skor');
  };

  return (
    <>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Topic Header */}
          <div className="bg-orange-50 border-l-4 border-orange-500 p-6">
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                Topik Latihan:
              </div>
              <h2 className="text-orange-600 font-semibold text-lg flex-1">
                {topik}
              </h2>
            </div>
          </div>

          {/* Text Display Area */}
          <div className="p-6 bg-gray-50 border-b border-gray-200 min-h-[150px]">
            {showText ? (
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {latihanText}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-12">
                Teks akan muncul di sini saat kamu memulai latihan
              </div>
            )}
          </div>

          {/* Video Recording Area */}
          <div className="p-6">
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video">
              {/* Recording Badge */}
              {isRecording && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  RECORDING
                </div>
              )}

              {/* Timer */}
              {isRecording && (
                <div className="absolute top-4 right-4 z-10 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-mono font-medium">
                  {formatTime(timer)}
                </div>
              )}

              {/* Video Feed */}
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Overlay when not recording */}
              {!isRecording && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Siap untuk memulai latihan?</p>
                  </div>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleStartTraining}
                disabled={isRecording}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                  isRecording
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                <Play className="w-5 h-5" />
                Mulai Berlatih
              </button>

              <button
                onClick={handleFinishTraining}
                disabled={!isRecording}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                  !isRecording
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                <Square className="w-5 h-5" />
                Selesai Latihan
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-blue-900 font-semibold mb-3 flex items-center gap-2">
            <span className="text-xl">💡</span>
            Tips Saat Berlatih
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Bacalah teks dengan jelas dan lantang</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Jaga kontak mata dengan kamera</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Perhatikan intonasi dan kecepatan bicara Anda</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Tunjukkan ekspresi wajah yang natural dan percaya diri</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}