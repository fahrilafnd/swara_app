"use client";

import { useState, useEffect } from "react";
import { Pause, Play, Check } from "lucide-react";

export default function Pidato() {
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(292); // 4:52 in seconds
  const [reactions, setReactions] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  // Timer countdown
  useEffect(() => {
    if (!isPaused && time > 0) {
      const timer = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPaused, time]);

  // Random emoji reactions
  useEffect(() => {
    const interval = setInterval(() => {
      const newReaction = {
        id: Date.now(),
        x: Math.random() * 80 + 10, // 10% to 90%
        y: Math.random() * 20 + 60, // 60% to 80%
      };
      setReactions((prev) => [...prev, newReaction]);

      // Remove after animation
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
      }, 2000);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const speechText =
    "Keterampilan komunikasi yang kuat dan kemampuan beradaptasi adalah dua hal yang saya anggap sangat penting di dunia kerja. Dengan komunikasi yang efektif, saya dapat menyampaikan";

  return (
    <div className="pr-8  ">
      <div className="bg-white p-4 rounded-xl">
        <div className="min-h-screen bg-[url(/podium/tirai.png)] bg-no-repeat w-full relative overflow-hidden">
          <div className="container mx-auto px-4 py-8 relative z-20">
            {/* Top Section */}
            <div className="flex justify-between items-start mb-6">
              {/* Title Card */}
              <div className="bg-white rounded-3xl px-6 py-3 shadow-sm max-w-xl">
                <p className="text-orange-500 font-medium text-sm">
                  Merancang Masa Depan: Membangun Karier di Era Digital
                </p>
              </div>

              {/* Mode Badge */}
              <div className="bg-white rounded-2xl px-6 py-2 shadow-sm">
                <p className="text-orange-500 font-bold text-lg">
                  Mode : Pidato
                </p>
              </div>
            </div>

            {/* Speech Bubble */}
            <div className="bg-white rounded-3xl p-6 shadow-sm mb-8 max-w-3xl animate-fade-in">
              <p className="text-gray-700 text-base leading-relaxed">
                {speechText.split("Dengan").map((part, index) => (
                  <span key={index}>
                    {part}
                    {index < speechText.split("Dengan").length - 1 && (
                      <span className="bg-green-400 text-white px-2 py-1 rounded-md font-medium animate-pulse">
                        Dengan
                      </span>
                    )}
                  </span>
                ))}
              </p>
            </div>

            {/* Main Stage */}
            <div className="relative">
              {/* Speaker Avatar */}
              <div className="flex justify-center mb-8 relative z-30">
                <div className="relative animate-float">
                  <div className="w-80 h-96 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-3xl shadow-2xl overflow-hidden">
                    {/* 3D Character Placeholder - Replace with actual 3D model or image */}
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-orange-300 rounded-full mx-auto mb-4 animate-pulse"></div>
                        <div className="w-24 h-32 bg-green-400 rounded-t-full mx-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              
              <div className="relative h-64 overflow-hidden">
                {/* Left Audience Group */}
                <div className="absolute left-0 bottom-0 w-1/2 animate-slide-in-left">
                  <svg viewBox="0 0 600 300" className="w-full h-auto">
                    {/* Generate multiple audience members */}
                    {[...Array(40)].map((_, i) => {
                      const row = Math.floor(i / 10);
                      const col = i % 10;
                      const x = col * 60 + (row % 2) * 30;
                      const y = 150 + row * 40;
                      const colors = [
                        "#4A5568",
                        "#2D3748",
                        "#1A202C",
                        "#718096",
                      ];
                      const skinTones = [
                        "#F4D3B5",
                        "#E8B89A",
                        "#D4A574",
                        "#C08B5C",
                      ];

                      return (
                        <g
                          key={`left-${i}`}
                          transform={`translate(${x}, ${y})`}
                          className="animate-bounce-random"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        >
                          {/* Head */}
                          <circle
                            cx="0"
                            cy="-20"
                            r="15"
                            fill={skinTones[i % 4]}
                          />
                          {/* Hair */}
                          <ellipse
                            cx="0"
                            cy="-28"
                            rx="16"
                            ry="12"
                            fill={colors[i % 4]}
                          />
                          {/* Body */}
                          <rect
                            x="-12"
                            y="-5"
                            width="24"
                            height="30"
                            rx="3"
                            fill={
                              ["#3182CE", "#805AD5", "#D69E2E", "#38B2AC"][
                                i % 4
                              ]
                            }
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Right Audience Group */}
                <div className="absolute right-0 bottom-0 w-1/2 animate-slide-in-right">
                  <svg viewBox="0 0 600 300" className="w-full h-auto">
                    {[...Array(40)].map((_, i) => {
                      const row = Math.floor(i / 10);
                      const col = i % 10;
                      const x = col * 60 + (row % 2) * 30;
                      const y = 150 + row * 40;
                      const colors = [
                        "#4A5568",
                        "#2D3748",
                        "#1A202C",
                        "#718096",
                      ];
                      const skinTones = [
                        "#F4D3B5",
                        "#E8B89A",
                        "#D4A574",
                        "#C08B5C",
                      ];

                      return (
                        <g
                          key={`right-${i}`}
                          transform={`translate(${x}, ${y})`}
                          className="animate-bounce-random"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        >
                          {/* Head */}
                          <circle
                            cx="0"
                            cy="-20"
                            r="15"
                            fill={skinTones[i % 4]}
                          />
                          {/* Hair */}
                          <ellipse
                            cx="0"
                            cy="-28"
                            rx="16"
                            ry="12"
                            fill={colors[i % 4]}
                          />
                          {/* Body */}
                          <rect
                            x="-12"
                            y="-5"
                            width="24"
                            height="30"
                            rx="3"
                            fill={
                              ["#3182CE", "#805AD5", "#D69E2E", "#38B2AC"][
                                i % 4
                              ]
                            }
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {reactions.map((reaction) => (
                <div
                  key={reaction.id}
                  className="absolute text-4xl animate-float-up pointer-events-none"
                  style={{
                    left: `${reaction.x}%`,
                    bottom: `${reaction.y}%`,
                  }}
                >
                  👏
                </div>
              ))}
            </div>

            {/* Control Bar */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-40">
              {/* Pause Button */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {isPaused ? (
                  <Play className="w-5 h-5" />
                ) : (
                  <Pause className="w-5 h-5" />
                )}
                {isPaused ? "Resume" : "Pause"}
              </button>

              {/* Timer */}
              <div className="bg-white border-3 border-orange-300 px-8 py-4 rounded-2xl shadow-xl">
                <p className="text-3xl font-bold text-gray-800 tabular-nums">
                  {formatTime(time)}
                </p>
              </div>

              {/* Selesai Button */}
              <button className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-xl transition-all duration-300 transform hover:scale-105">
                <Check className="w-5 h-5" />
                Selesai
              </button>
            </div>
          </div>

          {/* Custom CSS for animations */}
          <style jsx>{`
            @keyframes float {
              0%,
              100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-10px);
              }
            }

            @keyframes float-up {
              0% {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
              100% {
                opacity: 0;
                transform: translateY(-100px) scale(1.5);
              }
            }

            @keyframes slide-in-left {
              from {
                transform: translateX(-50%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }

            @keyframes slide-in-right {
              from {
                transform: translateX(50%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }

            @keyframes fade-in {
              from {
                opacity: 0;
                transform: translateY(-20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes bounce-random {
              0%,
              100% {
                transform: translateY(0) scale(1);
              }
              50% {
                transform: translateY(-5px) scale(1.05);
              }
            }

            .animate-float {
              animation: float 3s ease-in-out infinite;
            }

            .animate-float-up {
              animation: float-up 2s ease-out forwards;
            }

            .animate-slide-in-left {
              animation: slide-in-left 1s ease-out;
            }

            .animate-slide-in-right {
              animation: slide-in-right 1s ease-out;
            }

            .animate-fade-in {
              animation: fade-in 0.8s ease-out;
            }

            .animate-bounce-random {
              animation: bounce-random 2s ease-in-out infinite;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
