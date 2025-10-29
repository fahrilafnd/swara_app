"use client";

import React from 'react';

interface LevelAlertProps {
  level: number;
  nextLevelXp: number;
}

export default function LevelAlert({ level, nextLevelXp }: LevelAlertProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-indigo-300 rounded-xl md:rounded-2xl p-3 sm:p-4 text-white mb-3 md:mb-4 shadow-lg w-full">
      <div className="flex items-start gap-2 sm:gap-3">
        <span className="text-2xl sm:text-3xl flex-shrink-0">📚</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Orator Pemula - Level {level}</h3>
          <p className="text-white text-sm sm:text-base leading-relaxed">Kamu sudah mulai menguasai dasar-dasar public speaking! Teruskan latihan untuk mencapai level berikutnya.</p>
          <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-white">➡️ Level selanjutnya: Pembicara Percaya Diri (Level {level + 1}) - Butuh {nextLevelXp} XP lagi!</p>
        </div>
      </div>
    </div>
  );
}
