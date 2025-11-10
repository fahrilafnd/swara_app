"use client";

import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";

import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  Video,
  MapPin,
  Search,
  ChevronUp,
  ChevronDown,
  Eye,
  TrendingUp,
  UserCheck,
  CalendarClock,
} from "lucide-react";

interface MentoringSession {
  id: number;
  mentee: {
    name: string;
    avatar: string;
  };
  mentor: {
    name: string;
    avatar: string;
  };
  topic: string;
  date: string;
  time: string;
  method: "Zoom" | "Google Meet" | "Offline";
  location?: string;
  status: "terjadwal" | "berlangsung" | "selesai" | "dibatalkan";
  bookedDate: string;
}

type SortField = "mentee" | "mentor" | "topic" | "date" | "status";
type SortOrder = "asc" | "desc";

export default function MonitoringMentoring() {
  const [sessions, setSessions] = useState<MentoringSession[]>([
    {
      id: 1,
      mentee: {
        name: "Farhan Abdullah",
        avatar:
          "https://ui-avatars.com/api/?name=Farhan+Abdullah&background=f97316&color=fff",
      },
      mentor: {
        name: "Linda Permata",
        avatar:
          "https://ui-avatars.com/api/?name=Linda+Permata&background=3b82f6&color=fff",
      },
      topic: "Leadership Communication",
      date: "2025-01-20",
      time: "13:00 - 14:00 WIB",
      method: "Zoom",
      status: "terjadwal",
      bookedDate: "2025-01-18",
    },
    {
      id: 2,
      mentee: {
        name: "Sarah Johnson",
        avatar:
          "https://ui-avatars.com/api/?name=Sarah+Johnson&background=f97316&color=fff",
      },
      mentor: {
        name: "Daffa Arif Setyawan",
        avatar:
          "https://ui-avatars.com/api/?name=Daffa+Arif&background=3b82f6&color=fff",
      },
      topic: "Public Speaking Dasar",
      date: "2025-01-27",
      time: "10:00 - 11:30 WIB",
      method: "Google Meet",
      status: "terjadwal",
      bookedDate: "2025-01-15",
    },
    {
      id: 3,
      mentee: {
        name: "Ahmad Rizki",
        avatar:
          "https://ui-avatars.com/api/?name=Ahmad+Rizki&background=f97316&color=fff",
      },
      mentor: {
        name: "Bambang Wijaya",
        avatar:
          "https://ui-avatars.com/api/?name=Bambang+Wijaya&background=3b82f6&color=fff",
      },
      topic: "Presentasi Bisnis",
      date: "2025-01-27",
      time: "14:00 - 15:00 WIB",
      method: "Zoom",
      status: "berlangsung",
      bookedDate: "2025-01-20",
    },
    {
      id: 4,
      mentee: {
        name: "Dewi Sartika",
        avatar:
          "https://ui-avatars.com/api/?name=Dewi+Sartika&background=f97316&color=fff",
      },
      mentor: {
        name: "Eko Prasetyo",
        avatar:
          "https://ui-avatars.com/api/?name=Eko+Prasetyo&background=3b82f6&color=fff",
      },
      topic: "MC & Event Hosting",
      date: "2025-01-15",
      time: "09:00 - 10:30 WIB",
      method: "Offline",
      location: "Coworking Space Jakarta",
      status: "selesai",
      bookedDate: "2025-01-10",
    },
    {
      id: 5,
      mentee: {
        name: "Budi Santoso",
        avatar:
          "https://ui-avatars.com/api/?name=Budi+Santoso&background=f97316&color=fff",
      },
      mentor: {
        name: "Citra Dewi",
        avatar:
          "https://ui-avatars.com/api/?name=Citra+Dewi&background=3b82f6&color=fff",
      },
      topic: "Storytelling Advanced",
      date: "2025-01-12",
      time: "15:00 - 16:00 WIB",
      method: "Zoom",
      status: "selesai",
      bookedDate: "2025-01-08",
    },
    {
      id: 6,
      mentee: {
        name: "Rina Marlina",
        avatar:
          "https://ui-avatars.com/api/?name=Rina+Marlina&background=f97316&color=fff",
      },
      mentor: {
        name: "Agus Wijaya",
        avatar:
          "https://ui-avatars.com/api/?name=Agus+Wijaya&background=3b82f6&color=fff",
      },
      topic: "Interview Preparation",
      date: "2025-01-18",
      time: "11:00 - 12:00 WIB",
      method: "Google Meet",
      status: "dibatalkan",
      bookedDate: "2025-01-15",
    },
  ]);

  const [activeTab, setActiveTab] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSession, setSelectedSession] =
    useState<MentoringSession | null>(null);

  const stats = {
    totalSessions: 342,
    newThisMonth: 28,
    scheduledSessions: 45,
    todaySessions: 8,
    completedSessions: 278,
    completedIncrease: 3,
    totalMentors: 892,
    activeMentors: 45,
  };

  const tabs = [
    { id: "semua", label: "Semua" },
    { id: "terjadwal", label: "Terjadwal" },
    { id: "berlangsung", label: "Berlangsung" },
    { id: "selesai", label: "Selesai" },
    { id: "dibatalkan", label: "Dibatalkan" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "terjadwal":
        return {
          label: "Terjadwal",
          className: "bg-blue-100 text-blue-700 border border-blue-300",
          icon: <Calendar className="w-4 h-4" />,
        };
      case "berlangsung":
        return {
          label: "Berlangsung",
          className: "bg-yellow-100 text-yellow-700 border border-yellow-300",
          icon: <Clock className="w-4 h-4" />,
        };
      case "selesai":
        return {
          label: "Selesai",
          className: "bg-green-100 text-green-700 border border-green-300",
          icon: <CheckCircle className="w-4 h-4" />,
        };
      case "dibatalkan":
        return {
          label: "Dibatalkan",
          className: "bg-red-100 text-red-700 border border-red-300",
          icon: <Clock className="w-4 h-4" />,
        };
      default:
        return {
          label: status,
          className: "bg-gray-100 text-gray-700",
          icon: <Clock className="w-4 h-4" />,
        };
    }
  };

  const filteredAndSortedSessions = useMemo(() => {
    let filtered = sessions.filter((session) => {
      const matchesTab = activeTab === "semua" || session.status === activeTab;
      const matchesSearch =
        session.mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.topic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });

    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "mentee":
          aValue = a.mentee.name.toLowerCase();
          bValue = b.mentee.name.toLowerCase();
          break;
        case "mentor":
          aValue = a.mentor.name.toLowerCase();
          bValue = b.mentor.name.toLowerCase();
          break;
        case "topic":
          aValue = a.topic.toLowerCase();
          bValue = b.topic.toLowerCase();
          break;
        case "date":
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [sessions, activeTab, searchQuery, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedSessions.length / itemsPerPage);
  const paginatedSessions = filteredAndSortedSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const openDetailModal = (session: MentoringSession) => {
    setSelectedSession(session);
    setShowDetailModal(true);
  };
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <div className="pr-8 pb-8">
      {/* Header */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Monitoring Mentoring & Jadwal
        </h1>
        <p className="text-gray-600">
          Pantau sesi mentoring antara mentor dan mentee di platform SWARA
          (Read-Only)
        </p>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 mt-4 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                +{stats.newThisMonth} bulan ini
              </span>
              <CalendarClock className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-5xl font-bold text-gray-900 mb-2">
              {stats.totalSessions}
            </p>
            <p className="text-gray-600 font-semibold">Total Sesi Mentoring</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                Hari ini: {stats.todaySessions}
              </span>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-5xl font-bold text-gray-900 mb-2">
              {stats.scheduledSessions}
            </p>
            <p className="text-gray-600 font-semibold">Sesi Terjadwal</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                +{stats.completedIncrease}
              </span>
              <CheckCircle className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-5xl font-bold text-gray-900 mb-2">
              {stats.completedSessions}
            </p>
            <p className="text-gray-600 font-semibold">Sesi Selesai</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                {stats.activeMentors} mentor
              </span>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-5xl font-bold text-gray-900 mb-2">
              {stats.totalMentors}
            </p>
            <p className="text-gray-600 font-semibold">Total Mentor</p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        {/* Section Title */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pengguna</h2>
          
          {/* Desktop - Horizontal Tabs */}
          <div className="hidden md:flex bg-gray-100 flex-wrap gap-3 p-4 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-primary shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile - Dropdown */}
          <div className="md:hidden">
            <div className="relative">
              <select
                value={activeTab}
                onChange={(e) => {
                  setActiveTab(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl appearance-none text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari mentee, mentor, atau topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* DataTable */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("mentee")}
                >
                  <div className="flex items-center gap-2">
                    MENTEE & MENTOR
                    {sortField === "mentee" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("topic")}
                >
                  <div className="flex items-center gap-2">
                    TUJUAN
                    {sortField === "topic" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center gap-2">
                    TANGGAL & WAKTU
                    {sortField === "date" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  METODE
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-2">
                    STATUS
                    {sortField === "status" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  AKSI
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedSessions.map((session) => {
                const statusInfo = getStatusBadge(session.status);
                return (
                  <tr
                    key={session.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="space-y-3">
                        {/* Mentee */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            <img
                              src={session.mentee.avatar}
                              alt={session.mentee.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {session.mentee.name}
                            </p>
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">
                              Mentee
                            </span>
                          </div>
                        </div>
                        {/* Mentor */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            <img
                              src={session.mentor.avatar}
                              alt={session.mentor.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {session.mentor.name}
                            </p>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                              Mentor
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {session.topic}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {new Date(session.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-600">{session.time}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {session.method === "Offline" ? (
                          <MapPin className="w-4 h-4 text-gray-600" />
                        ) : (
                          <Video className="w-4 h-4 text-gray-600" />
                        )}
                        <span className="font-medium text-gray-900">
                          {session.method}
                        </span>
                      </div>
                      {session.location && (
                        <p className="text-xs text-gray-500 mt-1">
                          {session.location}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold w-fit ${statusInfo.className}`}
                      >
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(session.bookedDate).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openDetailModal(session)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-5 h-5 text-blue-600" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {paginatedSessions.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Tidak ada sesi ditemukan</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredAndSortedSessions.length
                )}{" "}
                dari {filteredAndSortedSessions.length} sesi
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-semibold ${
                        currentPage === pageNum
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Detail Session */}
      {mounted && showDetailModal && selectedSession
        ? createPortal(
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
              <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Detail Sesi Mentoring
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedSession(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronDown className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-center">
                    {(() => {
                      const statusInfo = getStatusBadge(selectedSession.status);
                      return (
                        <span
                          className={`flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold ${statusInfo.className}`}
                        >
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Mentee & Mentor Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                      <p className="text-sm text-orange-700 font-semibold mb-3">
                        Mentee
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src={selectedSession.mentee.avatar}
                            alt={selectedSession.mentee.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {selectedSession.mentee.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <p className="text-sm text-blue-700 font-semibold mb-3">
                        Mentor
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src={selectedSession.mentor.avatar}
                            alt={selectedSession.mentor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {selectedSession.mentor.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="space-y-3">
                    <p className="font-bold text-gray-900">Detail Sesi</p>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Topik</span>
                        <span className="font-semibold text-gray-900">
                          {selectedSession.topic}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tanggal</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(selectedSession.date).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Waktu</span>
                        <span className="font-semibold text-gray-900">
                          {selectedSession.time}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Metode</span>
                        <span className="font-semibold text-gray-900">
                          {selectedSession.method}
                        </span>
                      </div>
                      {selectedSession.location && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lokasi</span>
                          <span className="font-semibold text-gray-900">
                            {selectedSession.location}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between pt-3 border-t">
                        <span className="text-gray-600">Dibuat pada</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(
                            selectedSession.bookedDate
                          ).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedSession(null);
                    }}
                    className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}