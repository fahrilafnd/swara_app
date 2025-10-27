"use client";

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Circular Progress Component
type CircularProgressProps = {
  percentage: number;
  color: 'blue' | 'green' | 'yellow' | 'pink';
  label?: string;
};

function CircularProgress({ percentage, color, label }: CircularProgressProps) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    blue: { stroke: '#60A5FA', bg: '#DBEAFE', text: '#60A5FA' },
    green: { stroke: '#4ADE80', bg: '#D1FAE5', text: '#4ADE80' },
    yellow: { stroke: '#FBBF24', bg: '#FEF3C7', text: '#FBBF24' },
    pink: { stroke: '#F472B6', bg: '#FCE7F3', text: '#F472B6' }
  };
  
  const colors = colorMap[color];
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={colors.bg}
            strokeWidth="20"
            fill="none"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={colors.stroke}
            strokeWidth="20"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold" style={{ color: colors.text }}>
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function HasilAnalisis() {
  const [activeTab, setActiveTab] = useState('intonasi');
  const router = useRouter();
  
  const metrics = {
    intonasi: {
      percentage: 37,
      color: 'blue' as const,
      label: 'Intonasi',
      buttonColor: 'bg-blue-400',
      evaluasi: 'Anda perlu cukup dinamis, tetapi hindari terlalu monoton pada sesi akhir kuliner.',
      saran: 'Latih intonasi dengan membaca teks pendek dengan perubahan nada.'
    },
    pengucapan: {
      percentage: 87,
      color: 'green' as const,
      label: 'Pengucapan',
      buttonColor: 'bg-green-500',
      evaluasi: 'Pengucapan anda sangat baik.',
      saran: 'Lakukan eksplorasi kosa kata atau artikulasi yang sering muncul di dunia profesional.'
    },
    kecepatan: {
      percentage: 35,
      color: 'yellow' as const,
      label: 'Kecepatan Berbicara',
      buttonColor: 'bg-yellow-400',
      evaluasi: 'Anda terkesan terburu-buru sehingga pendengar mungkin kesulitan memahami beberapa bagian pembicaraan Anda.',
      saran: 'Ikuti kecepatan membaca teks dengan perlakuan warna pada saat berbicara.'
    },
    ekspresi: {
      percentage: 25,
      color: 'pink' as const,
      label: 'Ekspresi Wajah',
      buttonColor: 'bg-pink-400',
      evaluasi: 'Ekspresi wajah Anda terlihat agak datar, sebaiknya tersenyum lebih sering.',
      saran: 'Ciptakan kenyamanan sehingga untuk memanusiakan rasa antusiasme.'
    }
  };
  
  const currentMetric = metrics[activeTab as keyof typeof metrics];
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Kembali</span>
        </button>
      </div>

      {/* Success Banner */}
      <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl p-6 mb-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Kamu sudah mencoba sangat baik!</h2>
        <p className="text-blue-50">
          Kamu sudah mulai menguasai dasar-dasar public speaking! Teruskan latihan untuk mencapai level berikutnya.
        </p>
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* All 4 Metrics */}
        {Object.entries(metrics).map(([key, metric]) => (
          <div key={key} className="flex flex-col items-center">
            {/* Metric Label */}
            <div className={`px-4 py-2 rounded-full font-bold text-black mb-4 ${
              metric.color === 'blue' ? 'bg-blue-400' :
              metric.color === 'green' ? 'bg-green-500' :
              metric.color === 'yellow' ? 'bg-yellow-400' :
              'bg-pink-400'
            }`}>
              {metric.label}
            </div>
            
            <CircularProgress
              percentage={metric.percentage}
              color={metric.color}
              label={metric.label}
            />
            
            <div className="mt-6 bg-white rounded-xl p-5 w-full shadow-sm">
              {/* Evaluasi Section */}
              <div className="-mt-5 -mx-5">
                <div className={`px-5 py-3 ${
                  metric.color === 'blue' ? 'bg-blue-50' :
                  metric.color === 'green' ? 'bg-green-50' :
                  metric.color === 'yellow' ? 'bg-yellow-50' :
                  'bg-pink-50'
                }`}>
                  <h4 className="font-bold text-gray-800 text-center">Evaluasi</h4>
                </div>
                <div className="px-5 py-4 bg-white">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {metric.evaluasi}
                  </p>
                </div>
              </div>
              
              {/* Saran Perbaikan Section */}
              <div className="mt-4 -mx-5">
                <div className={`px-5 py-3 ${
                  metric.color === 'blue' ? 'bg-blue-50' :
                  metric.color === 'green' ? 'bg-green-50' :
                  metric.color === 'yellow' ? 'bg-yellow-50' :
                  'bg-pink-50'
                }`}>
                  <h4 className="font-bold text-gray-800 text-center">Saran Perbaikan</h4>
                </div>
                <div className="px-5 py-4 bg-white">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {metric.saran}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}