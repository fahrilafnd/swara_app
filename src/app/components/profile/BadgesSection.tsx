"use client";

import React from 'react';
import { Award } from 'lucide-react';

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface BadgesSectionProps {
  badges: Badge[];
}

export default function BadgesSection({ badges }: BadgesSectionProps) {
  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Award className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Pencapaian & Badge</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`flex flex-col items-center p-3 sm:p-4 rounded-xl md:rounded-2xl text-center transition-all min-h-[120px] sm:min-h-[140px] ${
              badge.unlocked
                ? 'bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-300 hover:scale-105'
                : 'bg-gray-100 opacity-60'
            }`}
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{badge.icon}</div>
            <h3 className="font-bold text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm leading-tight">{badge.name}</h3>
            <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">{badge.description}</p>
            {!badge.unlocked && (
              <div className="mt-auto pt-1 sm:pt-2 text-[10px] sm:text-xs text-gray-500 italic">Belum terbuka</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
