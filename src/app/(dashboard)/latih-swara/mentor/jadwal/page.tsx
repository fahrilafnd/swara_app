"use client";

import PayButton from "@/app/components/PayButton";
import { ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function Jadwal() {
  const [selectedDate, setSelectedDate] = useState<number>(26);
  const [selectedTime, setSelectedTime] = useState<string>("00:00");
  const [tujuan, setTujuan] = useState<string>("");
  const [metode, setMetode] = useState<string>("Zoom/Google Meeting");

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Calendar dates for the month
  const calendarDates = [
    // Previous month
    { date: 27, isCurrentMonth: false },
    { date: 28, isCurrentMonth: false },
    { date: 29, isCurrentMonth: false },
    { date: 30, isCurrentMonth: false },
    { date: 31, isCurrentMonth: false },
    // Current month
    { date: 1, isCurrentMonth: true },
    { date: 2, isCurrentMonth: true },
    { date: 3, isCurrentMonth: true },
    { date: 4, isCurrentMonth: true },
    { date: 5, isCurrentMonth: true },
    { date: 6, isCurrentMonth: true },
    { date: 7, isCurrentMonth: true },
    { date: 8, isCurrentMonth: true },
    { date: 9, isCurrentMonth: true },
    { date: 10, isCurrentMonth: true },
    { date: 11, isCurrentMonth: true },
    { date: 12, isCurrentMonth: true },
    { date: 13, isCurrentMonth: true },
    { date: 14, isCurrentMonth: true },
    { date: 15, isCurrentMonth: true },
    { date: 16, isCurrentMonth: true },
    { date: 17, isCurrentMonth: true },
    { date: 18, isCurrentMonth: true },
    { date: 19, isCurrentMonth: true },
    { date: 20, isCurrentMonth: true },
    { date: 21, isCurrentMonth: true },
    { date: 22, isCurrentMonth: true },
    { date: 23, isCurrentMonth: true },
    { date: 24, isCurrentMonth: true },
    { date: 25, isCurrentMonth: true },
    { date: 26, isCurrentMonth: true },
    { date: 27, isCurrentMonth: true },
    { date: 28, isCurrentMonth: true },
    { date: 29, isCurrentMonth: true },
    { date: 30, isCurrentMonth: true },
    // Next month
    { date: 31, isCurrentMonth: false },
    { date: 1, isCurrentMonth: false },
    { date: 2, isCurrentMonth: false },
    { date: 3, isCurrentMonth: false },
    { date: 4, isCurrentMonth: false },
    { date: 5, isCurrentMonth: false },
    { date: 6, isCurrentMonth: false },
  ];

  const handleSchedule = () => {
    // Handle scheduling logic
    console.log({
      date: selectedDate,
      time: selectedTime,
      tujuan,
      metode,
    });
  };

  return (
    <div className="pr-8 mb-10">
      <div className="flex bg-white px-6 py-4 rounded-xl items-center gap-2 mb-4">
        <Link
          href="/latih-swara/mentor"
          className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-orange-500" />
        </Link>
        <h1 className="text-orange-500 font-semibold text-xl">
          Jadwalkan Mentoring
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Calendar */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Pilih Tanggal (Oktober)
            </h2>

            {/* Calendar */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Days Header */}
              <div className="grid grid-cols-7 bg-gradient-to-r from-orange-500 to-orange-600">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="text-center py-3 text-white font-semibold text-sm"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Dates */}
              <div className="grid grid-cols-7">
                {calendarDates.map((dateObj, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      dateObj.isCurrentMonth && setSelectedDate(dateObj.date)
                    }
                    disabled={!dateObj.isCurrentMonth}
                    className={`
                      aspect-square p-3 text-center text-sm font-medium
                      transition-all duration-200
                      ${
                        !dateObj.isCurrentMonth
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-700 hover:bg-orange-50 cursor-pointer"
                      }
                      ${
                        selectedDate === dateObj.date && dateObj.isCurrentMonth
                          ? "bg-blue-500 text-white rounded-full hover:bg-blue-600"
                          : ""
                      }
                    `}
                  >
                    {dateObj.date}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            {/* Time Picker */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Waktu</h2>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700 font-medium"
              />
            </div>

            {/* Purpose */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Tujuan Mentoring
              </h2>
              <textarea
                value={tujuan}
                onChange={(e) => setTujuan(e.target.value)}
                placeholder="Tulis tujuan mentoring kamu..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-700"
              />
            </div>

            {/* Learning Method */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Metode Pembelajaran
              </h2>
              <p>Metode pembelajaran akan berlangsung melalui Zoom Meeting.</p>
            </div>
            {/* Payment Info */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Pembayaran
              </h2>
              <div className="bg-orange-50 border w-full border-orange-200 rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-700 font-semibold">
                    Biaya Mentoring (1 Sesi)
                  </span>
                  <span className="text-2xl font-bold text-orange-600">
                    Rp 50.000
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Pembayaran akan dilakukan melalui QRIS / metode pembayaran
                  lain setelah kamu klik tombol jadwalkan.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <PayButton />
          {/* <button
            onClick={handleSchedule}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            Jadwalkan
          </button> */}
        </div>
      </div>
    </div>
  );
}
