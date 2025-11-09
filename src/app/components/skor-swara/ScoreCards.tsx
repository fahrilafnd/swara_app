"use client";

import React from "react";

interface ScoreCard {
  title: string;
  icon: React.ReactNode; // fleksibel: emoji, teks, atau JSX
  description: string;
}

interface ScoreCardsProps {
  scoreCards: ScoreCard[];
}

export default function ScoreCards({ scoreCards }: ScoreCardsProps) {
  // 3 item pertama → baris 1 (3 kolom), sisanya → baris 2 (2 kolom)
  const firstRow = scoreCards.slice(0, Math.min(3, scoreCards.length));
  const secondRow = scoreCards.slice(firstRow.length);

  return (
    <div className="space-y-8">
      {/* Row 1 → 3 Kolom */}
      {firstRow.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {firstRow.map((card, idx) => (
            <CardItem key={`row1-${idx}`} card={card} />
          ))}
        </div>
      )}

      {/* Row 2 → 2 Kolom */}
      {secondRow.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {secondRow.map((card, idx) => (
            <CardItem key={`row2-${idx}`} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}

function CardItem({ card }: { card: ScoreCard }) {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-4 border-transparent hover:border-orange-100 cursor-pointer">
      <h3 className="text-gray-800 text-lg font-semibold mb-5">{card.title}</h3>
      <div className="text-6xl md:text-7xl h-20 flex items-center justify-center my-6">
        {card.icon}
      </div>
      <p className="text-gray-600 text-sm font-medium mb-4">Skor: 0-5</p>
      <p className="text-gray-600 text-sm leading-relaxed">
        {card.description}
      </p>
    </div>
  );
}
