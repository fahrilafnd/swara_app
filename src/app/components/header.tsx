"use client"

import React from 'react';

interface HeaderProps {
  onUserClick?: () => void;
}

export default function Header({ onUserClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">SWARA</h1>
        <button 
          onClick={onUserClick}
          className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold"
        >
          F
        </button>
      </div>
    </header>
  );
}
