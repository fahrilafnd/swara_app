"use client";

import React from 'react';

type ModalType = 'skor-swara' | 'adu-swara' | 'inspira-swara' | 'podium-swara' | 'latih-swara';

interface SkillCardsProps {
  onModalOpen: (modalType: ModalType) => void;
}

export default function SkillCards({ onModalOpen }: SkillCardsProps) {
  const skillCards = [
    {
      id: 'skor-swara' as ModalType,
      title: 'Skor Swara',
      bgColor: 'bg-customTeal'
    },
    {
      id: 'adu-swara' as ModalType,
      title: 'Adu Swara',
      bgColor: 'bg-goldenYellow'
    },
    {
      id: 'inspira-swara' as ModalType,
      title: 'Inspira Swara',
      bgColor: 'bg-customPink'
    },
    {
      id: 'podium-swara' as ModalType,
      title: 'Podium Swara',
      bgColor: 'bg-purple'
    },
    {
      id: 'latih-swara' as ModalType,
      title: 'Latih Swara',
      bgColor: 'bg-customBlue'
    }
  ];

  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-gray-800 text-base sm:text-lg font-semibold mb-4">Petunjuk Penggunaan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-4">
        {skillCards.map((card) => (
          <div key={card.id} className={`${card.bgColor} rounded-3xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer`}>
            <div className="p-4 sm:p-5 text-center flex flex-col justify-between h-[180px] sm:h-[220px]">
              <div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-black rounded-full mx-auto mb-2 sm:mb-3 overflow-hidden border-4 border-white/30 shadow-lg">
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl text-white">👤</div>
                  </div>
                </div>
                <h3 className="text-white text-xs sm:text-sm font-semibold whitespace-nowrap">{card.title}</h3>
              </div>
              <button 
                onClick={() => onModalOpen(card.id)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium transition-colors w-full mt-2 inline-flex items-center justify-center gap-1"
              >
                Petunjuk
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}