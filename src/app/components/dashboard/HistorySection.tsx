"use client";

import React from 'react';
import Link from 'next/link';

interface HistoryItem {
  id: number;
  title: string;
  date: string;
  description: string;
  points: number;
}

interface HistorySectionProps {
  historyItems: HistoryItem[];
}

export default function HistorySection({ historyItems }: HistorySectionProps) {
  return (
    <div className='bg-white rounded-3xl shadow-md p-4 sm:p-5'>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-gray-800 text-base sm:text-lg font-semibold">Riwayat latihanmu</h2>
        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {historyItems.map((item) => (
        <div key={item.id} className="bg-gray-50 rounded-xl p-2.5 mb-2 hover:shadow-md transition-shadow border border-gray-100">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-gray-900 text-sm font-bold">{item.title}</h4>
            <div className="bg-orange-500 text-white px-2.5 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap">
              {item.date}
            </div>
          </div>
          <p className="text-gray-400 text-[11px] mb-1">
            {item.description} <span className="text-gray-600 font-medium">+{item.points}</span>
          </p>
          <Link href="/skor-swara" className="text-orange-500 text-[11px] font-semibold hover:text-orange-600 inline-flex items-center gap-0.5">
            Info selengkapnya
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      ))}
    </div>
  );
}
