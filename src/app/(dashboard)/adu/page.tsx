"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AduSwaraIntroModal from "@/app/components/adu-swara/AduSwaraIntroModal";
import { createPortal } from "react-dom";
import { Users, Swords, Trophy, Target } from "lucide-react";

// Mock opponent data
const MOCK_OPPONENTS = [
  {
    name: "Alex Rahman",
    avatar: "https://i.pravatar.cc/150?img=12",
    level: 2,
    winRate: 67,
    avgScore: 285,
  },
  {
    name: "Sarah Putri",
    avatar: "https://i.pravatar.cc/150?img=47",
    level: 3,
    winRate: 72,
    avgScore: 310,
  },
  {
    name: "Budi Santoso",
    avatar: "https://i.pravatar.cc/150?img=33",
    level: 2,
    winRate: 58,
    avgScore: 270,
  },
  {
    name: "Diana Kusuma",
    avatar: "https://i.pravatar.cc/150?img=44",
    level: 2,
    winRate: 63,
    avgScore: 295,
  },
];

type MatchmakingState = "idle" | "searching" | "found" | "countdown";

export default function Adu() {
  const router = useRouter();
  const [isOpenMatch, setIsOpenMatch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Matchmaking states
  const [matchmakingState, setMatchmakingState] =
    useState<MatchmakingState>("idle");
  const [opponent, setOpponent] = useState<(typeof MOCK_OPPONENTS)[0] | null>(
    null
  );
  const [countdown, setCountdown] = useState(15);
  const [searchDots, setSearchDots] = useState("");

  useEffect(() => {
    setMounted(true);
    const hidden =
      typeof window !== "undefined" &&
      localStorage.getItem("aduIntroHide") === "1";
    setShowModal(!hidden);
  }, []);

  // Animate searching dots
  useEffect(() => {
    if (matchmakingState === "searching") {
      const interval = setInterval(() => {
        setSearchDots((prev) => (prev.length >= 3 ? "" : prev + "."));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [matchmakingState]);

  // Matchmaking logic
  useEffect(() => {
    if (matchmakingState === "searching") {
      // Simulate finding opponent after 3 seconds
      const timer = setTimeout(() => {
        const randomOpponent =
          MOCK_OPPONENTS[Math.floor(Math.random() * MOCK_OPPONENTS.length)];
        setOpponent(randomOpponent);
        setMatchmakingState("found");

        // After showing opponent, start countdown
        setTimeout(() => {
          setMatchmakingState("countdown");
        }, 2000);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [matchmakingState]);

  // Countdown logic
  useEffect(() => {
    if (matchmakingState === "countdown" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (matchmakingState === "countdown" && countdown === 0) {
      // Redirect to battle
      router.push("/adu/slug");
    }
  }, [matchmakingState, countdown, router]);

  const startMatchmaking = () => {
    setIsOpenMatch(true);
    setMatchmakingState("searching");
    setCountdown(15);
    setOpponent(null);
  };

  const cancelMatchmaking = () => {
    setIsOpenMatch(false);
    setMatchmakingState("idle");
    setCountdown(15);
    setOpponent(null);
  };

  const renderMatchmakingModal = () => {
    if (matchmakingState === "searching") {
      return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 shadow-2xl w-[500px] text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">
                Mencari Lawan{searchDots}
              </h2>
              <p className="text-gray-600">
                Mencocokkan dengan pemain level yang sama
              </p>
            </div>

            {/* Animated searching indicators */}
            <div className="flex justify-center gap-2 mb-8">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>

            {/* Searching animation circles */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-orange-200 rounded-full animate-ping" />
              <div className="absolute inset-4 border-4 border-orange-300 rounded-full animate-ping animation-delay-200" />
              <div className="absolute inset-8 border-4 border-orange-400 rounded-full animate-ping animation-delay-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Target className="w-16 h-16 text-orange-500 animate-spin" />
              </div>
            </div>

            <button
              onClick={cancelMatchmaking}
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      );
    }

    if (matchmakingState === "found" && opponent) {
      return (
        <div className="fixed inset-0 bg-gradient-to-br from-orange-500/20 via-pink-500/20 to-purple-500/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 shadow-2xl w-[600px]">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-bold text-sm">Lawan Ditemukan!</span>
              </div>
            </div>

            {/* VS Display */}
            <div className="flex items-center justify-between mb-8">
              {/* You */}
              <div className="flex-1 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center border-4 border-white shadow-xl">
                  <img
                    src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg"
                    alt="You"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <p className="font-black text-gray-900 mb-1">Kamu</p>
                <p className="text-xs text-gray-600">Level 2</p>
              </div>

              {/* VS Badge */}
              <div className="flex-shrink-0 mx-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center transform rotate-12 animate-pulse shadow-lg">
                  <Swords className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Opponent */}
              <div className="flex-1 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full mx-auto mb-3 flex items-center justify-center border-4 border-white shadow-xl">
                  <img
                    src={opponent.avatar}
                    alt={opponent.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <p className="font-black text-gray-900 mb-1">{opponent.name}</p>
                <p className="text-xs text-gray-600">Level {opponent.level}</p>
              </div>
            </div>

            {/* Opponent Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-4 text-center border-2 border-orange-200">
                <Trophy className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-black text-gray-900">
                  {opponent.winRate}%
                </p>
                <p className="text-xs text-gray-600">Win Rate</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 text-center border-2 border-blue-200">
                <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-black text-gray-900">
                  {opponent.avgScore}
                </p>
                <p className="text-xs text-gray-600">Avg Score</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Memulai dalam beberapa saat...
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (matchmakingState === "countdown" && opponent) {
      return (
        <div className="fixed inset-0 bg-gradient-to-br from-orange-500/30 via-pink-500/30 to-purple-500/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 shadow-2xl w-[500px] text-center relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-pink-100/50 animate-pulse" />

            <div className="relative z-10">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-gray-900 mb-2">
                  Bersiap-siap!
                </h2>
                <p className="text-gray-600 mb-4">
                  Battle akan dimulai dalam...
                </p>
              </div>

              {/* Countdown Circle */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg
                  className="transform -rotate-90 w-48 h-48"
                  viewBox="0 0 200 200"
                >
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    stroke="#fee2e2"
                    strokeWidth="12"
                    fill="none"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 85}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 85 * (1 - countdown / 15)
                    }`}
                    className="transition-all duration-1000 ease-linear"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Countdown number */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p
                      className={`text-7xl font-black transition-all duration-300 ${
                        countdown <= 5
                          ? "text-red-500 animate-pulse"
                          : "text-orange-500"
                      }`}
                    >
                      {countdown}
                    </p>
                    <p className="text-sm text-gray-600 font-semibold mt-2">
                      detik
                    </p>
                  </div>
                </div>
              </div>

              {/* Topic */}
              <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-4 mb-6 border-2 border-orange-200">
                <p className="text-xs text-gray-600 mb-1">Topik Battle:</p>
                <p className="text-sm font-bold text-orange-600">
                  Merancang Masa Depan: Membangun Karier di Era Digital
                </p>
              </div>

              {/* Quick tips */}
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                <p className="text-xs text-blue-800 font-semibold mb-1">
                  💡 Tips Cepat:
                </p>
                <p className="text-xs text-blue-700">
                  Berbicaralah dengan percaya diri dan jelas. Jangan lupa
                  tersenyum!
                </p>
              </div>

              {/* Skip button */}
              <button
                onClick={() => router.push("/adu/slug")}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                Mulai Sekarang! →
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="font-lexend h-full z-[9999999] relative flex flex-col pb-5">
      <AduSwaraIntroModal
        open={showModal}
        onClose={(dontShowAgain) => {
          if (dontShowAgain) localStorage.setItem("aduIntroHide", "1");
          setShowModal(false);
        }}
      />
      <div className="flex flex-1 overflow-hidden">
        <aside className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="bg-white rounded-2xl mb-6 p-10 flex items-center">
            <div>
              <img
                src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg"
                alt="profile"
                className="w-[280px] rounded-full mb-6"
              />
              <h2 className="text-center text-[#39363D] text-3xl font-semibold">
                Kimberly
              </h2>
            </div>
            <div className="flex-1 ml-12">
              <div className="flex items-center mb-6">
                <p className="font-bold text-2xl border border-[#30303040] w-max py-3 px-3 rounded-3xl mr-5">
                  🥇
                </p>
                <p className="text-[#39363D] py-3 px-8 border border-[#30303040] rounded-3xl text-lg font-medium w-full flex justify-between">
                  Win rate &nbsp;&nbsp;: <span>53%</span>
                </p>
              </div>
              <div className="flex items-center mb-6">
                <p className="font-bold text-2xl border border-[#30303040] w-max py-3 px-3 rounded-3xl mr-5">
                  💯
                </p>
                <p className="text-[#39363D] py-3 px-8 border border-[#30303040] rounded-3xl text-lg font-medium w-full flex justify-between">
                  Latest Score &nbsp;&nbsp;: <span>320</span>
                </p>
              </div>
              <div className="flex items-center mb-6">
                <p className="font-bold text-2xl border border-[#30303040] w-max py-3 px-3 rounded-3xl mr-5">
                  🥇
                </p>
                <p className="text-[#39363D] py-3 px-8 border border-[#30303040] rounded-3xl text-lg font-medium w-full flex justify-between">
                  Weekly Rank &nbsp;&nbsp;: <span>44th</span>
                </p>
              </div>
              <div className="flex items-center mb-6">
                <p className="font-bold text-2xl border border-[#30303040] w-max py-3 px-3 rounded-3xl mr-5">
                  📊
                </p>
                <p className="text-[#39363D] py-3 px-8 border border-[#30303040] rounded-3xl text-lg font-medium w-full flex justify-between">
                  Average Score &nbsp;&nbsp;: <span>280</span>
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white grid grid-cols-2 rounded-2xl p-7 gap-6 mb-7">
            <div className="bg-[#F0712220] border border-[#F07122] rounded-2xl p-6">
              <span className="flex items-center mb-4">
                <p className="text-2xl bg-[#F0712220] p-2 rounded-xl">🎯</p>
                <p className="text-[#39363D] ml-4">Kelancaran & Pengucapan</p>
              </span>
              <p className="text-sm text-[#39363D] mb-3">Poin: 0-5</p>
              <p className="text-sm text-[#39363D]">
                Swara akan menilai kelancaran penyampaianmu, termasuk mendeteksi
                jeda yang terlalu lama. Pastikan setiap kata diucapkan dengan
                jelas.
              </p>
            </div>
            <div className="bg-[#F0712220] border border-[#F07122] rounded-2xl p-6">
              <span className="flex items-center mb-4">
                <p className="text-2xl bg-[#F0712220] p-2 rounded-xl">📝</p>
                <p className="text-[#39363D] ml-4">Isi</p>
              </span>
              <p className="text-sm text-[#39363D] mb-3">Poin: 0-5</p>
              <p className="text-sm text-[#39363D]">
                Swara akan menilai kelancaran penyampaianmu, termasuk mendeteksi
                jeda yang terlalu lama. Pastikan setiap kata diucapkan dengan
                jelas.
              </p>
            </div>
            <div className="bg-[#F0712220] border border-[#F07122] rounded-2xl p-6">
              <span className="flex items-center mb-4">
                <p className="text-2xl bg-[#F0712220] p-2 rounded-xl">🏗️</p>
                <p className="text-[#39363D] ml-4">Organisasi & Struktur</p>
              </span>
              <p className="text-sm text-[#39363D] mb-3">Poin: 0-5</p>
              <p className="text-sm text-[#39363D]">
                Swara akan menilai kelancaran penyampaianmu, termasuk mendeteksi
                jeda yang terlalu lama. Pastikan setiap kata diucapkan dengan
                jelas.
              </p>
            </div>
            <div className="bg-[#F0712220] border border-[#F07122] rounded-2xl p-6">
              <span className="flex items-center mb-4">
                <p className="text-2xl bg-[#F0712220] p-2 rounded-xl">💬</p>
                <p className="text-[#39363D] ml-4">Penggunaan Bahasa</p>
              </span>
              <p className="text-sm text-[#39363D] mb-3">Poin: 0-5</p>
              <p className="text-sm text-[#39363D]">
                Swara akan menilai kelancaran penyampaianmu, termasuk mendeteksi
                jeda yang terlalu lama. Pastikan setiap kata diucapkan dengan
                jelas.
              </p>
            </div>
          </div>
          <button
            onClick={startMatchmaking}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-2xl py-5 w-full rounded-2xl font-bold mb-7 hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <Swords className="w-8 h-8" />
            Mulai Battle
            <Swords className="w-8 h-8" />
          </button>
          <div className="bg-white rounded-2xl p-7">
            <h1 className="text-xl text-[#39363D] font-bold mb-5">Riwayat</h1>
            <div className="flex space-x-5 overflow-x-auto scrollbar-custom pb-2">
              <div className="flex-shrink-0 bg-white rounded-2xl border border-[#B3C8CF] shadow-md text-center py-5 px-4">
                <img
                  src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg"
                  className="w-[130px] h-[130px] rounded-full mb-2"
                  alt=""
                />
                <p className="font-bold text-[#39363D] mb-3">Tokoyaki22</p>
                <span className="block w-full bg-[#509F7F] text-white text-sm rounded-full py-2 font-semibold mb-2">
                  MENANG!
                </span>
                <span className="block w-full bg-[#7EC492] text-white text-sm rounded-full py-2 font-semibold">
                  25
                </span>
              </div>
              <div className="flex-shrink-0 bg-white rounded-2xl border border-[#B3C8CF] shadow-md text-center py-5 px-4">
                <img
                  src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg"
                  className="w-[130px] h-[130px] rounded-full mb-2"
                  alt=""
                />
                <p className="font-bold text-[#39363D] mb-3">Tokoyaki22</p>
                <span className="block w-full bg-[#509F7F] text-white text-sm rounded-full py-2 font-semibold mb-2">
                  MENANG!
                </span>
                <span className="block w-full bg-[#7EC492] text-white text-sm rounded-full py-2 font-semibold">
                  25
                </span>
              </div>
            </div>
          </div>
        </aside>

        <aside className="w-96 sticky top-0 h-full ml-4 flex flex-col justify-between">
          <div className="bg-white rounded-2xl h-full overflow-hidden">
            <div className="bg-[#F07122] text-white flex items-center py-4 px-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 16C5 15.7348 5.10536 15.4804 5.29289 15.2929C5.48043 15.1054 5.73478 15 6 15H14C14.2652 15 14.5196 15.1054 14.7071 15.2929C14.8946 15.4804 15 15.7348 15 16C15 16.2652 14.8946 16.5196 14.7071 16.7071C14.5196 16.8946 14.2652 17 14 17H6C5.73478 17 5.48043 16.8946 5.29289 16.7071C5.10536 16.5196 5 16.2652 5 16ZM18 11C18.2652 11 18.5196 11.1054 18.7071 11.2929C18.8946 11.4804 19 11.7348 19 12C19 12.2652 18.8946 12.5196 18.7071 12.7071C18.5196 12.8946 18.2652 13 18 13H10C9.73478 13 9.48043 12.8946 9.29289 12.7071C9.10536 12.5196 9 12.2652 9 12C9 11.7348 9.10536 11.4804 9.29289 11.2929C9.48043 11.1054 9.73478 11 10 11H18ZM16 16C16 15.7348 16.1054 15.4804 16.2929 15.2929C16.4804 15.1054 16.7348 15 17 15H18C18.2652 15 18.5196 15.1054 18.7071 15.2929C18.8946 15.4804 19 15.7348 19 16C19 16.2652 18.8946 16.5196 18.7071 16.7071C18.5196 16.8946 18.2652 17 18 17H17C16.7348 17 16.4804 16.8946 16.2929 16.7071C16.1054 16.5196 16 16.2652 16 16ZM7 11C7.26522 11 7.51957 11.1054 7.70711 11.2929C7.89464 11.4804 8 11.7348 8 12C8 12.2652 7.89464 12.5196 7.70711 12.7071C7.51957 12.8946 7.26522 13 7 13H6C5.73478 13 5.48043 12.8946 5.29289 12.7071C5.10536 12.5196 5 12.2652 5 12C5 11.7348 5.10536 11.4804 5.29289 11.2929C5.48043 11.1054 5.73478 11 6 11H7Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 3C3.20435 3 2.44129 3.31607 1.87868 3.87868C1.31607 4.44129 1 5.20435 1 6V18C1 18.7956 1.31607 19.5587 1.87868 20.1213C2.44129 20.6839 3.20435 21 4 21H20C20.7956 21 21.5587 20.6839 22.1213 20.1213C22.6839 19.5587 23 18.7956 23 18V6C23 5.20435 22.6839 4.44129 22.1213 3.87868C21.5587 3.31607 20.7956 3 20 3H4ZM20 5H4C3.73478 5 3.48043 5.10536 3.29289 5.29289C3.10536 5.48043 3 5.73478 3 6V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H20C20.2652 19 20.5196 18.8946 20.7071 18.7071C20.8946 18.5196 21 18.2652 21 18V6C21 5.73478 20.8946 5.48043 20.7071 5.29289C20.5196 5.10536 20.2652 5 20 5Z"
                  fill="white"
                />
              </svg>
              <p className="font-semibold ml-3">Tingkatkan Kemampuanmu!</p>
            </div>
            <div className="overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden h-full pb-14 p-4">
              <Link
                href={`/inspira/slug`}
                className="flex flex-col justify-end relative h-[185px] rounded-2xl overflow-hidden mb-5 bg-[url('https://static.honestdocs.id/780x300/webp/system/blog_articles/images/000/008/579/original/mengatasi_suara_serak.jpg')] bg-cover bg-center"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b to-[#434343] from-[#D9D9D910]"></div>
                <div className="mx-auto cursor-pointer absolute top-0 bottom-0 right-0 left-0 m-auto w-max h-max">
                  <svg
                    width="38"
                    height="38"
                    viewBox="0 0 38 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="19" cy="19" r="19" fill="white" />
                    <path
                      d="M26.2664 20.516C26.4979 20.3369 26.6853 20.1071 26.8142 19.8443C26.9431 19.5815 27.0101 19.2927 27.0101 19C27.0101 18.7073 26.9431 18.4185 26.8142 18.1557C26.6853 17.8929 26.4979 17.6631 26.2664 17.484C23.2686 15.1652 19.9216 13.3371 16.3504 12.068L15.6974 11.836C14.4494 11.393 13.1304 12.237 12.9614 13.526C12.4894 17.1601 12.4894 20.8399 12.9614 24.474C13.1314 25.763 14.4494 26.607 15.6974 26.164L16.3504 25.932C19.9216 24.6629 23.2686 22.8348 26.2664 20.516Z"
                      fill="#F07122"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-white ml-4 mb-5 z-10 text-sm">
                  Rahasia Public Speaking Tanpa Grogi
                </h4>
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {mounted && createPortal(renderMatchmakingModal(), document.body)}

      <style jsx global>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}
