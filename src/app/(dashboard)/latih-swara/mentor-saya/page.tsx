"use client";

import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import React from "react";

interface MentorSession {
  id: string;
  mentorName: string;
  mentorTitle: string;
  mentorDescription: string;
  mentorImage: string;
  rating: number;
  totalRatings: number;
  sessionDate: string;
  sessionTime: string;
}

export default function MentorSaya() {
  const mentorSessions: MentorSession[] = [
    {
      id: "1",
      mentorName: "Udin Syarifudin",
      mentorTitle: "Head of Marketing InnovateTech",
      mentorDescription:
        "Halo, disini aku bantu kamu untuk skill up public speakingmu!",
      mentorImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      rating: 4.0,
      totalRatings: 20,
      sessionDate: "17-09-2025",
      sessionTime: "14.00 WIB",
    },
    // Add more sessions if needed
  ];

  return (
    <div className="pr-8 pb-8">
      <div className="flex bg-white px-6 py-4 rounded-xl items-center gap-2 mb-4">
        <Link
          href="/latih-swara"
          className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-orange-500" />
        </Link>
        <h1 className="text-orange-500 font-semibold text-xl">
          Latih Swara - Mentoring
        </h1>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-xl h-screen">
        <div className="space-y-4">
          {mentorSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Left Section - Mentor Info */}
                <div className="flex flex-col md:flex-row items-start gap-4 flex-1">
                  {/* Profile Picture */}
                  <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-orange-100">
                    <img
                      src={session.mentorImage}
                      alt={session.mentorName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Mentor Details */}
                  <div className="flex-1">
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-900">
                        {session.rating.toFixed(2)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({session.totalRatings}+ Rating)
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {session.mentorName}
                    </h3>

                    {/* Title */}
                    <p className="text-gray-700 font-semibold mb-2">
                      {session.mentorTitle}
                    </p>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {session.mentorDescription}
                    </p>
                  </div>
                </div>

                {/* Right Section - Date, Time & Action */}
                <div className="flex flex-col md:items-end items-start gap-4 min-w-[180px]">
                  {/* Date & Time */}
                  <div className="text-right">
                    <p className="text-gray-900 font-bold text-lg">
                      {session.sessionDate}
                    </p>
                    <p className="text-gray-700 font-semibold">
                      {session.sessionTime}
                    </p>
                  </div>

                  {/* Start Mentoring Button */}
                  <Link href={"/latih-swara/mentor-saya/mulai"} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                    Mulai Mentoring
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State (if no sessions) */}
      {mentorSessions.length === 0 && (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Belum Ada Mentoring Terjadwal
            </h3>
            <p className="text-gray-600 mb-6">
              Kamu belum memiliki sesi mentoring yang terjadwal. Yuk mulai
              jadwalkan mentoring dengan mentor pilihan kamu!
            </p>
            <Link
              href="/latih-swara/mentor"
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              Cari Mentor
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
