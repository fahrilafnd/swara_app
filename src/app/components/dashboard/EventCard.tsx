"use client";

import React from 'react';

export default function EventCard() {
  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-gray-800 text-base sm:text-lg font-semibold mb-4">Event terdekat</h2>
      <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
        <div className="relative h-48 sm:h-56 lg:h-64">
          {/* Auditorium Background */}
          <div className="w-full h-full bg-gradient-to-br from-red-200 via-red-300 to-red-400 relative overflow-hidden">
            {/* Auditorium with audience - more realistic representation */}
            <div className="absolute inset-0">
              {/* Background pattern for auditorium */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200"></div>

              {/* Audience rows - creating the tiered seating effect */}
              <div className="absolute inset-0 flex flex-col justify-end pb-8 px-2">
                {/* Back rows - smaller and more distant */}
                <div className="flex justify-center gap-0.5 mb-1 opacity-50">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div
                      key={`back-${i}`}
                      className="w-1.5 h-4 bg-gradient-to-b from-red-600 to-red-700 rounded-t-sm"
                      style={{
                        height: `${Math.random() * 6 + 12}px`,
                        opacity: Math.random() * 0.4 + 0.3
                      }}
                    ></div>
                  ))}
                </div>

                {/* Middle rows */}
                <div className="flex justify-center gap-0.5 mb-1 opacity-70">
                  {Array.from({ length: 45 }).map((_, i) => (
                    <div
                      key={`mid-${i}`}
                      className="w-2 h-5 bg-gradient-to-b from-red-500 to-red-600 rounded-t-sm"
                      style={{
                        height: `${Math.random() * 8 + 16}px`,
                        opacity: Math.random() * 0.4 + 0.5
                      }}
                    ></div>
                  ))}
                </div>

                {/* Front rows - larger and more prominent */}
                <div className="flex justify-center gap-0.5 mb-1 opacity-90">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div
                      key={`front-${i}`}
                      className="w-2.5 h-6 bg-gradient-to-b from-red-400 to-red-500 rounded-t-sm shadow-sm"
                      style={{
                        height: `${Math.random() * 10 + 20}px`,
                        opacity: Math.random() * 0.3 + 0.7
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Speaker area on the right side */}
              <div className="absolute bottom-4 right-8 w-8 h-12 bg-gradient-to-b from-gray-600 to-gray-700 rounded-t-lg opacity-80"></div>
            </div>

            {/* Orange gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/20 to-orange-600/80"></div>
          </div>

          {/* Navigation arrows */}
          <button className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Terampil Bicara Button - Top Right */}
          <div className="absolute top-3 right-3">
            <button className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg transition-colors">
              Terampil Bicara
            </button>
          </div>

          {/* Event details - Horizontal layout */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-orange-600/80 to-transparent">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
              <div className="flex-1">
                <h3 className="text-white text-sm sm:text-lg font-bold mb-1 sm:mb-2">Webinar Public Speaking #1: Let's Learn</h3>
                <p className="text-white/90 text-xs sm:text-sm font-medium">12:20 WIB | 25 Maret 2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
