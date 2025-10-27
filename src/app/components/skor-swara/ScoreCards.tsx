"use client";

import React from 'react';

interface ScoreCard {
  title: string;
  icon: string;
  description: string;
}

interface ScoreCardsProps {
  scoreCards: ScoreCard[];
}

export default function ScoreCards({ scoreCards }: ScoreCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {scoreCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-4 border-transparent hover:border-orange-100 cursor-pointer"
        >
          <h3 className="text-gray-800 text-lg font-semibold mb-5">
            {card.title}
          </h3>
          <div className="text-6xl md:text-7xl h-20 flex items-center justify-center my-6">
            {card.icon}
          </div>
          <p className="text-gray-600 text-sm font-medium mb-4">
            Poin: 0-5
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
}
