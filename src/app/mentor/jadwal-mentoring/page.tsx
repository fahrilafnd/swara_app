"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  MapPin,
  User,
} from "lucide-react";

interface TimeSlot {
  start: string;
  end: string;
}

interface Availability {
  date: string;
  slots: TimeSlot[];
}

interface Session {
  id: number;
  date: string;
  time: string;
  menteeName: string;
  menteeImage: string;
  topic: string;
  platform: string;
  status: "confirmed" | "pending";
}

export default function JadwalMentoring() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 23)); // Oktober 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(2025, 9, 23)
  );
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [availabilities, setAvailabilities] = useState<Availability[]>([
    {
      date: "2025-10-06",
      slots: [
        { start: "09:00", end: "12:00" },
        { start: "14:00", end: "17:00" },
      ],
    },
    {
      date: "2025-10-10",
      slots: [{ start: "10:00", end: "16:00" }],
    },
    {
      date: "2025-10-11",
      slots: [{ start: "09:00", end: "15:00" }],
    },
    {
      date: "2025-10-15",
      slots: [{ start: "13:00", end: "17:00" }],
    },
    {
      date: "2025-10-21",
      slots: [{ start: "09:00", end: "12:00" }],
    },
    {
      date: "2025-10-30",
      slots: [{ start: "10:00", end: "14:00" }],
    },
  ]);

  const [tempSlots, setTempSlots] = useState<TimeSlot[]>([]);

  const sessions: Session[] = [
    {
      id: 1,
      date: "2025-10-23",
      time: "14:00 - 15:00",
      menteeName: "Ahmad Rizki Pramono",
      menteeImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      topic: "Public Speaking Dasar",
      platform: "Zoom Meeting",
      status: "confirmed",
    },
    {
      id: 2,
      date: "2025-10-23",
      time: "15:30 - 16:30",
      menteeName: "Sarah Johnson",
      menteeImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      topic: "Presentasi Bisnis",
      platform: "Google Meet",
      status: "confirmed",
    },
  ];

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({ date: prevMonthDay, isCurrentMonth: false });
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    // Add remaining days to complete the week
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          date: new Date(year, month + 1, i),
          isCurrentMonth: false,
        });
      }
    }

    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const hasAvailability = (date: Date) => {
    return availabilities.some((avail) => avail.date === formatDate(date));
  };

  const hasSession = (date: Date) => {
    return sessions.some((session) => session.date === formatDate(date));
  };

  const getDateStatus = (date: Date) => {
    if (hasSession(date)) return "session";
    if (hasAvailability(date)) return "available";
    return "none";
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowAvailabilityModal(true);
    const existing = availabilities.find((a) => a.date === formatDate(date));
    setTempSlots(existing ? [...existing.slots] : []);
  };

  const addTimeSlot = () => {
    setTempSlots([...tempSlots, { start: "09:00", end: "17:00" }]);
  };

  const removeTimeSlot = (index: number) => {
    setTempSlots(tempSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    const updated = [...tempSlots];
    updated[index][field] = value;
    setTempSlots(updated);
  };

  const saveAvailability = () => {
    if (!selectedDate) return;

    const dateStr = formatDate(selectedDate);
    const filtered = availabilities.filter((a) => a.date !== dateStr);

    if (tempSlots.length > 0) {
      setAvailabilities([...filtered, { date: dateStr, slots: tempSlots }]);
    } else {
      setAvailabilities(filtered);
    }

    setShowAvailabilityModal(false);
    alert("Jadwal availability berhasil disimpan!");
  };

  const deleteAvailability = () => {
    if (!selectedDate) return;
    if (confirm("Hapus semua availability untuk tanggal ini?")) {
      const dateStr = formatDate(selectedDate);
      setAvailabilities(availabilities.filter((a) => a.date !== dateStr));
      setShowAvailabilityModal(false);
      alert("Availability berhasil dihapus!");
    }
  };

  const getSelectedDateSessions = () => {
    if (!selectedDate) return [];
    return sessions.filter((s) => s.date === formatDate(selectedDate));
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="pr-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Jadwal Mentoring
      </h1>

      {/* Calendar Card */}
      <div className="bg-white rounded-3xl shadow-md p-8 mb-8">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={goToToday}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
            >
              Hari Ini
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4">
          {/* Day Headers */}
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-600 pb-4"
            >
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {days.map((day, index) => {
            const status = day.isCurrentMonth
              ? getDateStatus(day.date)
              : "none";
            const today = isToday(day.date);

            return (
              <div
                key={index}
                onClick={() => day.isCurrentMonth && handleDateClick(day.date)}
                className={`aspect-square rounded-2xl flex items-center justify-center text-lg font-semibold cursor-pointer transition-all ${
                  !day.isCurrentMonth
                    ? "text-gray-300 cursor-default"
                    : status === "session"
                    ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md"
                    : status === "available"
                    ? "bg-orange-200 text-orange-700 hover:bg-orange-300"
                    : "text-gray-700 hover:bg-gray-100"
                } ${today ? "ring-2 ring-orange-500 ring-offset-2" : ""}`}
              >
                {day.date.getDate()}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-8 mt-8 pt-6 border-t">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm text-gray-600">Ada Sesi Terjadwal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-200 rounded"></div>
            <span className="text-sm text-gray-600">Availability Set</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-orange-500 rounded"></div>
            <span className="text-sm text-gray-600">Hari Ini</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm mb-1">Sesi Bulan Ini</p>
              <p className="text-4xl font-bold">
                {sessions.filter((s) => s.date.startsWith("2025-10")).length}
              </p>
            </div>
            <CalendarIcon className="w-12 h-12 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Availability Set</p>
              <p className="text-4xl font-bold">{availabilities.length}</p>
            </div>
            <Clock className="w-12 h-12 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Sesi Hari Ini</p>
              <p className="text-4xl font-bold">
                {getSelectedDateSessions().length}
              </p>
            </div>
            <User className="w-12 h-12 opacity-50" />
          </div>
        </div>
      </div>

      {/* Today's Sessions */}
      <div className="bg-white rounded-3xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Sesi Mentoring{" "}
          {selectedDate
            ? formatDate(selectedDate) === formatDate(new Date())
              ? "Hari Ini"
              : selectedDate.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
            : "Hari Ini"}
        </h2>

        {getSelectedDateSessions().length > 0 ? (
          <div className="space-y-4">
            {getSelectedDateSessions().map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between bg-gray-50 p-6 rounded-2xl hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-200">
                    <img
                      src={session.menteeImage}
                      alt={session.menteeName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {session.menteeName}
                    </h3>
                    <p className="text-gray-600">{session.topic}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {session.time}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {session.platform}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      session.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {session.status === "confirmed"
                      ? "Terkonfirmasi"
                      : "Pending"}
                  </span>
                  <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors">
                    Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Tidak ada sesi terjadwal untuk hari ini
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Klik tanggal di kalender untuk mengatur availability
            </p>
          </div>
        )}
      </div>

      {/* Modal Set Availability */}
      {showAvailabilityModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Set Availability
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedDate.toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAvailabilityModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  <strong>Tips:</strong> Set jam availability Anda untuk tanggal
                  ini. Mentee dapat booking sesi pada waktu yang Anda tentukan.
                </p>
              </div>

              {/* Time Slots */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Jam Tersedia</h3>
                  <button
                    onClick={addTimeSlot}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Jam
                  </button>
                </div>

                <div className="space-y-3">
                  {tempSlots.length > 0 ? (
                    tempSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl"
                      >
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Mulai
                            </label>
                            <input
                              type="time"
                              value={slot.start}
                              onChange={(e) =>
                                updateTimeSlot(index, "start", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Selesai
                            </label>
                            <input
                              type="time"
                              value={slot.end}
                              onChange={(e) =>
                                updateTimeSlot(index, "end", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removeTimeSlot(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">Belum ada jam tersedia</p>
                      <p className="text-sm text-gray-400">
                        Klik {"Tambah Jam"} untuk menambahkan
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                {availabilities.some(
                  (a) => a.date === formatDate(selectedDate)
                ) && (
                  <button
                    onClick={deleteAvailability}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus Semua
                  </button>
                )}
                <button
                  onClick={() => setShowAvailabilityModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={saveAvailability}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
