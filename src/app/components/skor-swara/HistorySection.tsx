"use client";

import React from 'react';

interface HistoryItem {
  id: number;
  title: string;
  date: string;
  score: string;
  status: string;
}

interface HistorySectionProps {
  historyItems: HistoryItem[];
}

export default function HistorySection({ historyItems }: HistorySectionProps) {
  return (
    <div className="bg-white rounded-3xl p-3 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-800 text-xl font-bold">Riwayat Adu Swara</h2>
        <span className="text-gray-500 text-sm cursor-pointer hover:text-gray-700">Lihat semua</span>
      </div>
    
      <div className="space-y-4">
        {historyItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">{item.score}</span>
              <span className="text-sm text-gray-600">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
