"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Trophy,
  Target,
  Users,
  BookOpen,
  Lightbulb,
  Presentation,
  Search,
  Filter,
  TrendingUp,
  Award,
  Mic,
  Video,
  ChevronRight,
  ChevronDown,
  Download,
  Share2,
  BarChart3,
  Star,
} from "lucide-react";

// Types
type ActivityType =
  | "skor-swara"
  | "adu-swara"
  | "podium-swara"
  | "inspira-swara"
  | "latih-swara";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  score?: number;
  maxScore?: number;
  result?: "win" | "lose" | "draw";
  opponent?: string;
  duration?: number;
  date: Date;
  level?: number;
  badges?: string[];
  isCompleted: boolean;
}

// Mock data - replace with actual data from API/localStorage
const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "1",
    type: "skor-swara",
    title: "Latihan Public Speaking",
    description: "Merancang Masa Depan: Membangun Karier di Era Digital",
    score: 85,
    maxScore: 100,
    duration: 58,
    date: new Date("2025-08-12T10:30:00"),
    level: 2,
    badges: ["Perfect Timing", "Clear Voice"],
    isCompleted: true,
  },
  {
    id: "2",
    type: "adu-swara",
    title: "Duel Public Speaking",
    description: "Pentingnya Literasi Digital di Era Modern",
    score: 78,
    maxScore: 100,
    result: "win",
    opponent: "Alex Rahman",
    duration: 60,
    date: new Date("2025-08-11T14:20:00"),
    level: 2,
    isCompleted: true,
  },
  {
    id: "3",
    type: "inspira-swara",
    title: "Artikel Dibaca",
    description: "10 Tips Meningkatkan Kepercayaan Diri Berbicara",
    date: new Date("2025-08-10T09:15:00"),
    isCompleted: true,
  },
  {
    id: "4",
    type: "podium-swara",
    title: "Simulasi Pidato",
    description: "Pembukaan Acara Seminar Nasional",
    score: 92,
    maxScore: 100,
    duration: 60,
    date: new Date("2025-08-09T16:45:00"),
    level: 3,
    badges: ["Audience Magnet", "Strong Opening"],
    isCompleted: true,
  },
  {
    id: "5",
    type: "latih-swara",
    title: "Kursus Completed",
    description: "Dasar-dasar Public Speaking - Module 3",
    date: new Date("2025-08-08T11:00:00"),
    isCompleted: true,
  },
  {
    id: "6",
    type: "skor-swara",
    title: "Latihan Improvisasi",
    description: "Berbicara tentang Teknologi AI",
    score: 72,
    maxScore: 100,
    duration: 55,
    date: new Date("2025-08-05T13:30:00"),
    level: 1,
    isCompleted: true,
  },
];

export default function RiwayatPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<ActivityType | "all">(
    "all"
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<"all" | "week" | "month">("all");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  React.useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        // Attempt to get user_id for more precise filtering if backend supports it
        let userId: number | null = null;
        try {
          const uStr = localStorage.getItem("user");
          if (uStr) {
            const u = JSON.parse(uStr);
            if (u?.user_id) userId = u.user_id;
          }
        } catch {}
        const baseUrl = "https://swara-backend.onrender.com/api/swara/users/riwayat-latihan";
        const url = userId ? `${baseUrl}?user_id=${userId}` : baseUrl;
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }

        const data = await response.json();
        console.log("📜 [Riwayat Page] Raw response:", data);
        
        if (data.success && data.data) {
          // Transform API data to Activity format
          const transformedActivities: Activity[] = (Array.isArray(data.data) ? data.data : []).map((item: any) => ({
            id: String(item.skor_swara_id),
            type: "skor-swara" as ActivityType,
            title: "Latihan Public Speaking",
            description: item.topic || item.custom_topic || "Latihan public speaking",
            score: item.point_earned || 0,
            maxScore: 100,
            duration: 60, // Default duration
            date: new Date(item.created_at),
            level: item.user?.level || 1,
            badges: [], // Will be populated if badges data available
            isCompleted: item.status === "complete",
          }));
          
          setActivities(transformedActivities);
          // Fallback if empty: use lastResult from sessionStorage
          if (transformedActivities.length === 0) {
            const lastResultStr = sessionStorage.getItem("skor-swara:lastResult");
            if (lastResultStr) {
              try {
                const last = JSON.parse(lastResultStr);
                setActivities([
                  {
                    id: String(last.skor_swara_id || Date.now()),
                    type: "skor-swara",
                    title: "Latihan Public Speaking (Terbaru)",
                    description: last.custom_topic || last.topic || "Sesi terbaru",
                    score: last.point_earned || 0,
                    maxScore: 100,
                    duration: 60,
                    date: new Date(last.created_at || new Date()),
                    level: 1,
                    badges: [],
                    isCompleted: last.status === "complete",
                  },
                ]);
                console.log("🟠 Fallback applied on riwayat page with lastResult");
              } catch {}
            }
          }
        }
      } catch (error) {
        console.error("❌ Error fetching activities:", error);
        // Use mock data as fallback
        setActivities(MOCK_ACTIVITIES);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Activity type config
  const activityConfig = {
    "skor-swara": {
      icon: Target,
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-700",
      label: "Skor Swara",
    },
    "adu-swara": {
      icon: Users,
      color: "bg-yellow-500",
      lightColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      label: "Adu Swara",
    },
    "podium-swara": {
      icon: Presentation,
      color: "bg-orange-500",
      lightColor: "bg-orange-50",
      textColor: "text-orange-700",
      label: "Podium Swara",
    },
    "inspira-swara": {
      icon: Lightbulb,
      color: "bg-pink-500",
      lightColor: "bg-pink-50",
      textColor: "text-pink-700",
      label: "Inspira Swara",
    },
    "latih-swara": {
      icon: BookOpen,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-700",
      label: "Latih Swara",
    },
  };

  // Filter and search activities
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Filter by type
    if (selectedFilter !== "all") {
      filtered = filtered.filter((a) => a.type === selectedFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by date range
    if (dateRange !== "all") {
      const now = new Date();
      const cutoff = new Date();
      if (dateRange === "week") {
        cutoff.setDate(now.getDate() - 7);
      } else if (dateRange === "month") {
        cutoff.setMonth(now.getMonth() - 1);
      }
      filtered = filtered.filter((a) => a.date >= cutoff);
    }

    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [searchQuery, selectedFilter, dateRange, activities]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalActivities = activities.length;
    const totalScore = activities.filter((a) => a.score).reduce(
      (sum, a) => sum + (a.score || 0),
      0
    );
    const scoredActivities = activities.filter((a) => a.score).length;
    const avgScore =
      scoredActivities > 0 ? Math.round(totalScore / scoredActivities) : 0;
    const wins = activities.filter((a) => a.result === "win").length;
    const badges = activities.flatMap((a) => a.badges || []).length;

    return { totalActivities, avgScore, wins, badges };
  }, [activities]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Hari ini";
    if (days === 1) return "Kemarin";
    if (days < 7) return `${days} hari yang lalu`;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-orange-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 75) return "bg-blue-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-orange-100";
  };

  return (
    <div className="min-h-screen bg-white px-6  rounded-xl mb-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900">
              Riwayat Aktivitas
            </h1>
          </div>
          <p className="text-gray-600 ml-[52px]">
            Pantau perkembangan dan pencapaianmu
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-blue-500" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">
              {stats.totalActivities}
            </p>
            <p className="text-sm text-gray-600">Total Aktivitas</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 text-green-500" />
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                AVG
              </span>
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">
              {stats.avgScore}
            </p>
            <p className="text-sm text-gray-600">Rata-rata Skor</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-yellow-500" />
              <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                WIN
              </span>
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">
              {stats.wins}
            </p>
            <p className="text-sm text-gray-600">Kemenangan</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-orange-500" />
              <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                NEW
              </span>
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">
              {stats.badges}
            </p>
            <p className="text-sm text-gray-900">Badge Diraih</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari aktivitas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Date Range Filter */}
            <select
              value={dateRange}
              onChange={(e) =>
                setDateRange(e.target.value as "all" | "week" | "month")
              }
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
            >
              <option value="all">Semua Waktu</option>
              <option value="week">7 Hari Terakhir</option>
              <option value="month">30 Hari Terakhir</option>
            </select>

            {/* Activity Type Filter */}
            <div className="flex w-96 items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                  selectedFilter === "all"
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Filter className="w-4 h-4 inline mr-1" />
                Semua
              </button>
              {Object.entries(activityConfig).map(([type, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedFilter(type as ActivityType)}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                      selectedFilter === type
                        ? `${config.color} text-white shadow-lg`
                        : `${config.lightColor} ${config.textColor} hover:opacity-80`
                    }`}
                  >
                    <Icon className="w-4 h-4 inline mr-1" />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="space-y-4">
          {loading ? (
            // Loading skeleton
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="w-20 h-16 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Tidak Ada Aktivitas
              </h3>
              <p className="text-gray-600 mb-6">
                Coba ubah filter atau pencarian Anda
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFilter("all");
                  setDateRange("all");
                }}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            filteredActivities.map((activity) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;
              const isExpanded = expandedId === activity.id;

              return (
                <div
                  key={activity.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border-2 border-transparent hover:border-orange-200"
                >
                  {/* Activity Header */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : activity.id)
                    }
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`w-14 h-14 ${config.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-xs font-bold ${config.textColor} ${config.lightColor} px-3 py-1 rounded-full`}
                              >
                                {config.label}
                              </span>
                              {activity.level && (
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  Level {activity.level}
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-black text-gray-900 mb-1">
                              {activity.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {activity.description}
                            </p>
                          </div>

                          {/* Score Badge */}
                          {activity.score !== undefined && (
                            <div
                              className={`ml-4 px-4 py-2 ${getScoreBg(
                                activity.score
                              )} rounded-xl text-center flex-shrink-0`}
                            >
                              <p
                                className={`text-2xl font-black ${getScoreColor(
                                  activity.score
                                )}`}
                              >
                                {activity.score}
                              </p>
                              <p className="text-xs text-gray-600">
                                / {activity.maxScore}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(activity.date)}</span>
                          </div>
                          {activity.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{activity.duration} detik</span>
                            </div>
                          )}
                          {activity.result && (
                            <div className="flex items-center gap-1">
                              {activity.result === "win" ? (
                                <span className="text-green-600 font-bold bg-green-100 px-3 py-1 rounded-full text-xs">
                                  🏆 Menang
                                </span>
                              ) : activity.result === "lose" ? (
                                <span className="text-red-600 font-bold bg-red-100 px-3 py-1 rounded-full text-xs">
                                  Kalah
                                </span>
                              ) : (
                                <span className="text-gray-600 font-bold bg-gray-100 px-3 py-1 rounded-full text-xs">
                                  Seri
                                </span>
                              )}
                            </div>
                          )}
                          <button className="ml-auto">
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t-2 border-gray-100 pt-6">
                      {/* Badges */}
                      {activity.badges && activity.badges.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-bold text-gray-700 mb-2">
                            🏅 Badge yang Diraih:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {activity.badges.map((badge, idx) => (
                              <span
                                key={idx}
                                className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border-2 border-yellow-300"
                              >
                                ⭐ {badge}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Opponent */}
                      {activity.opponent && (
                        <div className="mb-4">
                          <p className="text-sm font-bold text-gray-700 mb-2">
                            👤 Lawan:
                          </p>
                          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-gray-600" />
                            </div>
                            <span className="font-semibold text-gray-900">
                              {activity.opponent}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        <button 
                          onClick={() => router.push(`/skor-swara/detail/${activity.id}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                        >
                          <Video className="w-4 h-4" />
                          Lihat Detail
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                          <Share2 className="w-4 h-4" />
                          Bagikan
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                          <Download className="w-4 h-4" />
                          Unduh
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Load More */}
        {filteredActivities.length > 0 && (
          <div className="mt-8 text-center">
            <button className="px-8 py-4 bg-white text-gray-700 rounded-xl font-bold hover:shadow-lg transition-all border-2 border-gray-200 hover:border-orange-300">
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
