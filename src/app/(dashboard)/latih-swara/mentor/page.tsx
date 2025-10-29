"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Star } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  imageUrl: string;
}

export default function Mentor() {
  const activities: Activity[] = [
    {
      id: "1",
      title: "PUBLIC SPEAKING 1",
      category: "Presentasi",
      date: "7 Bulan lalu",
      description:
        "Sebuah pengalaman yang menakjubkan dimana saya bisa menjadi pemberi shariah pada event besar, dimana saya banyak...",
      imageUrl:
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop",
    },
    {
      id: "2",
      title: "PUBLIC SPEAKING 1",
      category: "Presentasi",
      date: "7 Bulan lalu",
      description:
        "Sebuah pengalaman yang menakjubkan dimana saya bisa menjadi pemberi shariah pada event besar, dimana saya banyak...",
      imageUrl:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop",
    },
    {
      id: "3",
      title: "PUBLIC SPEAKING 1",
      category: "Presentasi",
      date: "7 Bulan lalu",
      description:
        "Sebuah pengalaman yang menakjubkan dimana saya bisa menjadi pemberi shariah pada event besar, dimana saya banyak...",
      imageUrl:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop",
    },
    {
      id: "4",
      title: "PUBLIC SPEAKING 1",
      category: "Presentasi",
      date: "7 Bulan lalu",
      description:
        "Sebuah pengalaman yang menakjubkan dimana saya bisa menjadi pemberi shariah pada event besar, dimana saya banyak...",
      imageUrl:
        "https://images.unsplash.com/photo-1560439514-4e9645039924?w=400&h=300&fit=crop",
    },
  ];

  return (
    <div className="pr-8 pb-8">
      <div className="flex bg-white px-6 py-4 rounded-xl items-center gap-2 mb-4">
        <Link
          href="/latih-swara"
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-orange-500" />
        </Link>{" "}
        <h1 className="text-orange-500 font-semibold text-lg">Latih Swara</h1>
      </div>
      <div className="bg-white rounded-xl overflow-hidden mb-8">
        {/* Banner with Profile */}
        <div className="relative h-52">
          {/* Banner Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&h=400&fit=crop"
              alt="Microphone"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          </div>

          {/* Profile Picture */}
          <div className="absolute bottom-0 right-12 transform translate-y-1/2">
            <div className="w-40 h-40 rounded-full border-8 border-white shadow-xl overflow-hidden bg-white">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
                alt="Daffa Arif Setyawan"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-12 pt-8 pb-10">
          {/* Name and Badges */}
          <div className="flex flex-col md:flex-row items-start mt-14 md:mt-0 md:items-center gap-4 mb-2">
            <h1 className="text-4xl font-bold text-gray-900">
              Daffa Arif Setyawan
            </h1>
            <span className="bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-semibold">
              Presentasi
            </span>
            <span className="bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-semibold">
              Wawancara Kerja
            </span>
          </div>

          {/* Subtitle */}
          <p className="text-gray-600 text-xl mb-3 font-medium">
            CEO Merah Putih
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <span className="text-xl font-bold text-gray-900">4.78</span>
            <span className="text-gray-500 text-base">(40+ Rating)</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-5xl">
            Saya sudah mentoring 400+ orang dari berbagai background - dari
            fresh graduate sampai senior manager. Satu hal yang saya selalu
            lihat, transformation dalam public speaking adalah transformation
            dalam career. Mau tau rahasianya? Saya buka slot mentoring terbatas
            bulan ini. Bukan cuma teori, tapi real practice dengan feedback
            langsung dari seorang CEO.
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
            <div className="flex flex-col items-start justify-between md:items-center mb-3">
              <span className="text-gray-700 font-semibold">
                Biaya Mentoring (1 Sesi)
              </span>
              <span className="text-2xl font-bold text-orange-600">
                Rp 150.000
              </span>
            </div>
            
          </div>
          <Link
            href={"/latih-swara/mentor/jadwal"}
            className="w-fit bg-gradient-to-r mt-4 from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-2 z-50"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                stroke="white"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.6947 13.7H15.7037M15.6947 16.7H15.7037M11.9955 13.7H12.0045M11.9955 16.7H12.0045M8.29431 13.7H8.30329M8.29431 16.7H8.30329"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Jadwalkan Mentoring
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Aktivitas</h2>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              {/* Header */}
              <div className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    Daffa Arif Setyawan
                  </p>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{activity.date}</span>
                  </div>
                </div>
              </div>

              {/* Category Badge */}
              <div className="px-4 mb-2">
                <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold">
                  [ {activity.category} ]
                </span>
              </div>

              {/* Description */}
              <div className="px-4 mb-3">
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                  {activity.description}
                </p>
                <button className="text-orange-500 text-sm font-medium hover:text-orange-600 mt-1">
                  selengkapnya
                </button>
              </div>

              {/* Image */}
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={activity.imageUrl}
                  alt={activity.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
