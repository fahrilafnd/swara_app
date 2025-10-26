"use client";

import React, { useState } from "react";
import {
  Search,
  MapPin,
  Star,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import Link from "next/link";

export default function PesertaBimbingan() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filters = ["Semua", "Terjadwal", "Selesai", "Dibatalkan"];

  const students = [
    {
      id: 1,
      name: "Ahmad Rizki Pramono",
      role: "Mahasiswa",
      date: "23 Agustus 2025",
      time: "14:00 - 15:00",
      totalHours: "20.24 W1B",
      platform: "Zoom/Google Meeting",
      rating: null,
      status: "Terjadwal",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Jessica Wang",
      role: "Pelajar SMA",
      date: "22 Agustus 2025",
      time: "10:00 - 11:00",
      platform: "Zoom/Google Meeting",
      rating: 4.95,
      totalRatings: "120+",
      status: "Selesai",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      role: "Mahasiswa",
      date: "22 Agustus 2025",
      time: "15:00 - 16:00",
      platform: "Zoom/Google Meeting",
      rating: 4.6,
      totalRatings: "80+",
      status: "Selesai",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    {
      id: 4,
      name: "Bambang Wijaya",
      role: "Mahasiswa",
      date: "21 Agustus 2025",
      time: "11:00 - 12:00",
      platform: "Zoom/Google Meeting",
      rating: 4.85,
      totalRatings: "90+",
      status: "Selesai",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
    {
      id: 5,
      name: "Budi Santoso",
      role: "Pelajar SMP",
      date: "20 Agustus 2025",
      time: "13:00 - 14:00",
      platform: "Zoom/Google Meeting",
      rating: 4.65,
      totalRatings: "50+",
      status: "Selesai",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    },
    {
      id: 6,
      name: "Elena Martinez",
      role: "Pelajar SMA",
      date: "24 Agustus 2025",
      time: "09:00 - 10:00",
      platform: "Zoom/Google Meeting",
      rating: 4.92,
      totalRatings: "110+",
      status: "Terjadwal",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    },
    {
      id: 7,
      name: "Michael Chen",
      role: "Mahasiswa",
      date: "19 Agustus 2025",
      time: "14:00 - 15:00",
      platform: "Zoom/Google Meeting",
      rating: null,
      status: "Dibatalkan",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
  ];

  // Filter students based on active filter and search
  const filteredStudents = students.filter((student) => {
    const matchesFilter =
      activeFilter === "Semua" || student.status === activeFilter;
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  // Stats
  const totalStudents = students.length;
  const scheduledToday = students.filter(
    (s) => s.status === "Terjadwal"
  ).length;
  const completedSessions = students.filter(
    (s) => s.status === "Selesai"
  ).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Terjadwal":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "Selesai":
        return "bg-green-100 text-green-700 border border-green-300";
      case "Dibatalkan":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="pr-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Peserta Bimbingan
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm mb-1">Total Peserta</p>
              <p className="text-4xl font-bold">{totalStudents}</p>
            </div>
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Sesi Terjadwal</p>
              <p className="text-4xl font-bold">{scheduledToday}</p>
            </div>
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Calendar className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Sesi Selesai</p>
              <p className="text-4xl font-bold">{completedSessions}</p>
            </div>
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Clock className="w-7 h-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari nama peserta atau role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setCurrentPage(1);
              }}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                activeFilter === filter
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="space-y-4 mb-6">
          {currentStudents.length > 0 ? (
            currentStudents.map((student) => (
                
              <Link href={"/mentor/peserta-bimbingan/detail"}
                key={student.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-orange-200">
                    <img
                      src={student.image}
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Student Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {student.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          student.status
                        )}`}
                      >
                        {student.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{student.role}</p>

                    {/* Date and Time or Rating */}
                    <div className="flex items-center gap-4">
                      {student.status === "Terjadwal" ? (
                        <p className="text-orange-600 text-sm font-semibold">
                          {student.date} | {student.totalHours}
                        </p>
                      ) : student.rating ? (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                          <span className="text-orange-600 font-bold text-sm">
                            {student.rating}
                          </span>
                          <span className="text-gray-500 text-sm">
                            ({student.totalRatings} Rating)
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Platform and Time */}
                <div className="flex items-center gap-6">
                  {student.status !== "Dibatalkan" && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span className="text-sm">{student.platform}</span>
                    </div>
                  )}

                  {/* Time Badge */}
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold min-w-[140px] text-center">
                    {student.time}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <div className="text-gray-400 mb-4">
                <User className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg font-semibold">
                  Tidak ada peserta ditemukan
                </p>
                <p className="text-sm">
                  Coba ubah filter atau kata kunci pencarian
                </p>
              </div>
            </div>
          )}
        </div>

        {filteredStudents.length > itemsPerPage && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">
                Menampilkan {startIndex + 1} -{" "}
                {Math.min(endIndex, filteredStudents.length)} dari{" "}
                {filteredStudents.length} peserta
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  } transition-colors`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                          currentPage === page
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  } transition-colors`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
