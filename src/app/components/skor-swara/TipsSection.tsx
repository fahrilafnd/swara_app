"use client";

import React from 'react';

interface TipsSectionProps {
  tips: string[];
}

export default function TipsSection({ tips }: TipsSectionProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 md:p-8 shadow-lg border border-blue-200 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">💡</span>
        <h2 className="text-blue-600 text-xl font-bold">Tips Skor Swara</h2>
      </div>
      <ul className="space-y-4">
        {tips.map((tip, index) => (
          <li
            key={index}
            className="text-gray-700 text-sm md:text-base leading-relaxed pl-8 relative"
          >
            <span className="absolute left-0 top-1 text-blue-600 font-bold text-lg">
              ✓
            </span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
