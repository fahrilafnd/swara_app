"use client";

import React, { useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  ChevronUp,
  ChevronDown,
  Play,
  Upload,
  X,
  Video as VideoIcon,
  Clock,
  Calendar,
  Tag,
  BarChart3,
  SortAsc,
} from "lucide-react";

type TEntry = {
  id: string;
  mm: string; // "00"
  ss: string; // "12"
  t: number; // detik -> mm*60+ss
  text: string;
};
const pad2 = (n: number) => String(n).padStart(2, "0");
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const parseLine = (line: string): TEntry | null => {
  // Format: [mm:ss] isi kalimat...
  const m = line.match(/^\s*\[(\d{2}):(\d{2})]\s*(.+)\s*$/);
  if (!m) return null;
  const mm = clamp(parseInt(m[1], 10), 0, 99);
  const ss = clamp(parseInt(m[2], 10), 0, 59);
  const text = m[3].trim();
  return {
    id: crypto.randomUUID(),
    mm: pad2(mm),
    ss: pad2(ss),
    t: mm * 60 + ss,
    text,
  };
};

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  category: string;
  level: "Pemula" | "Menengah" | "Lanjutan";
  duration: string;
  addedDate: string;
  views: number;
  videoUrl: string;
  description: string;
}

type SortField = "title" | "category" | "level" | "duration" | "addedDate";
type SortOrder = "asc" | "desc";

export default function ManajemenInspira() {
  // Transkrip
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [entries, setEntries] = useState<TEntry[]>([
    // contoh baris awal kosong (boleh dihapus)
    { id: crypto.randomUUID(), mm: "00", ss: "00", t: 0, text: "" },
  ]);

  const onTimeChange = (id: string, part: "mm" | "ss", val: string) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        // hanya angka & max 2 digit
        const clean = val.replace(/\D/g, "").slice(0, 2);
        const num = clamp(
          parseInt(clean || "0", 10),
          0,
          part === "mm" ? 99 : 59
        );
        const mm = part === "mm" ? pad2(num) : e.mm;
        const ss = part === "ss" ? pad2(num) : e.ss;
        return { ...e, mm, ss, t: parseInt(mm) * 60 + parseInt(ss) };
      })
    );
  };

  const onTextChange = (id: string, val: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, text: val } : e))
    );
  };

  const addRow = () => {
    const last = entries.at(-1);
    const nextT = last ? clamp(last.t + 5, 0, 99 * 60 + 59) : 0; // default +5 detik
    const mm = pad2(Math.floor(nextT / 60));
    const ss = pad2(nextT % 60);
    setEntries((p) => [
      ...p,
      { id: crypto.randomUUID(), mm, ss, t: nextT, text: "" },
    ]);
  };

  const removeRow = (id: string) =>
    setEntries((p) => p.filter((e) => e.id !== id));

  const sortByTime = () => setEntries((p) => [...p].sort((a, b) => a.t - b.t));

  // Import .txt berformat [mm:ss] kalimat...
  const handleUpload = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    if (!/\.txt$/i.test(file.name)) {
      alert(
        "Format yang didukung untuk import cepat: .txt dengan format [mm:ss] kalimat…"
      );
      ev.target.value = "";
      return;
    }
    const text = await file.text();
    const lines = text.split(/\r?\n/);
    const parsed: TEntry[] = [];
    for (const line of lines) {
      const e = parseLine(line);
      if (e) parsed.push(e);
    }
    if (parsed.length === 0) {
      alert("Tidak ada baris valid. Gunakan format [mm:ss] kalimat…");
    } else {
      setEntries(parsed);
    }
    ev.target.value = "";
  };

  // Nilai final yang akan dikirim ke backend (array of {t, text})
  const payload = useMemo(
    () =>
      entries
        .filter((e) => e.text.trim().length > 0)
        .map((e) => ({ t: e.t, text: e.text.trim() })),
    [entries]
  );

  // End Transkrip
  const [videos, setVideos] = useState<Video[]>([
    {
      id: 1,
      title: "5 Teknik Dasar Public Speaking untuk Pemula",
      thumbnail:
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop",
      category: "Pendidikan",
      level: "Pemula",
      duration: "20:30",
      addedDate: "2025-01-18",
      views: 1245,
      videoUrl: "https://example.com/video1.mp4",
      description:
        "Pelajari teknik dasar public speaking yang efektif untuk pemula",
    },
    {
      id: 2,
      title: "Cara Mengatasi Nervous Saat Presentasi",
      thumbnail:
        "https://images.unsplash.com/photo-1560439514-4e9645039924?w=400&h=300&fit=crop",
      category: "Motivasi",
      level: "Pemula",
      duration: "15:45",
      addedDate: "2025-01-15",
      views: 892,
      videoUrl: "https://example.com/video2.mp4",
      description:
        "Tips praktis mengatasi nervous dan grogi saat berbicara di depan umum",
    },
    {
      id: 3,
      title: "Leadership Skills untuk Public Speaker",
      thumbnail:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
      category: "Leadership",
      level: "Lanjutan",
      duration: "25:15",
      addedDate: "2025-01-12",
      views: 2134,
      videoUrl: "https://example.com/video3.mp4",
      description: "Tingkatkan kemampuan leadership melalui public speaking",
    },
    {
      id: 4,
      title: "Strategi Bisnis melalui Komunikasi Efektif",
      thumbnail:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop",
      category: "Bisnis",
      level: "Menengah",
      duration: "18:20",
      addedDate: "2025-01-10",
      views: 1567,
      videoUrl: "https://example.com/video4.mp4",
      description: "Pelajari strategi komunikasi efektif dalam dunia bisnis",
    },
  ]);

  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("addedDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Motivasi",
    level: "Pemula" as "Pemula" | "Menengah" | "Lanjutan",
    duration: "",
    description: "",
    notes: "",
    thumbnail: null as File | null,
    videoFile: null as File | null,
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const categories = [
    "Semua",
    "Motivasi",
    "Bisnis",
    "Pendidikan",
    "Leadership",
    "Umum",
  ];

  const stats = {
    totalVideos: videos.length,
    newThisMonth: 15,
    totalTopics: 102,
    activeTopics: 85,
  };

  // Filtering and sorting
  const filteredAndSortedVideos = useMemo(() => {
    const filtered = videos.filter((video) => {
      const matchesCategory =
        activeCategory === "Semua" || video.category === activeCategory;
      const matchesSearch =
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];

      let aVal: number | string =
        typeof aValue === "number" || typeof aValue === "string" ? aValue : "";
      let bVal: number | string =
        typeof bValue === "number" || typeof bValue === "string" ? bValue : "";

      if (sortField === "addedDate") {
        aVal = new Date(aValue as string).getTime();
        bVal = new Date(bValue as string).getTime();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [videos, activeCategory, searchQuery, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedVideos.length / itemsPerPage);
  const paginatedVideos = filteredAndSortedVideos.slice(
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

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case "Pemula":
        return "bg-green-100 text-green-700 border border-green-300";
      case "Menengah":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "Lanjutan":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, thumbnail: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "Motivasi",
      level: "Pemula",
      duration: "",
      description: "",
      notes: "",
      thumbnail: null,
      videoFile: null,
    });
    setThumbnailPreview(null);
  };

  const handleAddVideo = () => {
    if (!formData.title || !formData.duration) {
      alert("Mohon lengkapi semua field!");
      return;
    }

    const newVideo: Video = {
      id: videos.length + 1,
      title: formData.title,
      thumbnail:
        thumbnailPreview ||
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop",
      category: formData.category,
      level: formData.level,
      duration: formData.duration,
      addedDate: new Date().toISOString().split("T")[0],
      views: 0,
      videoUrl: "https://example.com/video.mp4",
      description: formData.description,
    };

    setVideos([newVideo, ...videos]);
    resetForm();
    setShowAddModal(false);
    alert("Video berhasil ditambahkan!");
  };

  const handleEditVideo = () => {
    if (!selectedVideo) return;

    const updated = videos.map((vid) =>
      vid.id === selectedVideo.id
        ? {
            ...vid,
            title: formData.title,
            category: formData.category,
            level: formData.level,
            duration: formData.duration,
            description: formData.description,
            thumbnail: thumbnailPreview || vid.thumbnail,
          }
        : vid
    );

    setVideos(updated);
    resetForm();
    setShowEditModal(false);
    setSelectedVideo(null);
    alert("Video berhasil diperbarui!");
  };

  const handleDeleteVideo = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus video ini?")) {
      setVideos(videos.filter((vid) => vid.id !== id));
      alert("Video berhasil dihapus!");
    }
  };

  const openEditModal = (video: Video) => {
    setSelectedVideo(video);
    setFormData({
      title: video.title,
      category: video.category,
      level: video.level,
      duration: video.duration,
      description: video.description,
      notes: "",
      thumbnail: null,
      videoFile: null,
    });
    setThumbnailPreview(video.thumbnail);
    setShowEditModal(true);
  };

  const openDetailModal = (video: Video) => {
    setSelectedVideo(video);
    setShowDetailModal(true);
  };
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="pr-8 pb-8">
      {/* Header */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Manajemen Inspira Swara
        </h1>
        <p className="text-gray-600">
          Kelola perpustakaan digital video inspiratif dari para public speaker
          terbaik dunia
        </p>
        <div className="grid mt-4 grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                +{stats.newThisMonth} bulan ini
              </span>
            </div>
            <p className="text-5xl font-bold text-gray-900 mb-2">
              {stats.totalVideos}
            </p>
            <p className="text-gray-600 font-semibold">Total Video</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                {stats.activeTopics} topik aktif
              </span>
            </div>
            <p className="text-5xl font-bold text-gray-900 mb-2">
              {stats.totalTopics}
            </p>
            <p className="text-gray-600 font-semibold">Total Topik</p>
          </div>
        </div>
      </div>
      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-md">
        {/* Category Tabs */}
        <div className="flex items-center justify-between border-b p-6">
          <div className="flex bg-gray-100 rounded-xl p-4 flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setCurrentPage(1);
                }}
                className={`px-6 py-2.5 rounded-xl transition-all ${
                  activeCategory === category
                    ? "bg-white text-primary shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Tambah Video
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari video atau kategori..."
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
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center gap-2">
                    VIDEO
                    {sortField === "title" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center gap-2">
                    KATEGORI
                    {sortField === "category" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("level")}
                >
                  <div className="flex items-center gap-2">
                    LEVEL
                    {sortField === "level" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("duration")}
                >
                  <div className="flex items-center gap-2">
                    DURASI
                    {sortField === "duration" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("addedDate")}
                >
                  <div className="flex items-center gap-2">
                    DITAMBAHKAN
                    {sortField === "addedDate" &&
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
              {paginatedVideos.map((video) => (
                <tr
                  key={video.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 group">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="max-w-md">
                        <p className="font-semibold text-gray-900 line-clamp-2">
                          {video.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {video.views.toLocaleString()} views
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 font-medium">
                      {video.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold ${getLevelBadgeClass(
                        video.level
                      )}`}
                    >
                      {video.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{video.duration}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">
                      {new Date(video.addedDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openDetailModal(video)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => openEditModal(video)}
                        className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5 text-orange-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedVideos.length === 0 && (
            <div className="text-center py-12">
              <VideoIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Tidak ada video ditemukan</p>
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
                  filteredAndSortedVideos.length
                )}{" "}
                dari {filteredAndSortedVideos.length} video
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-semibold ${
                        currentPage === page
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
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

      {/* Modal Add Video */}
      {mounted && showAddModal
        ? createPortal(
            <div className="fixed inset-0 text-black bg-black/50 flex items-center justify-center z-[1000] p-4">
              <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Tambah Video Inspira
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Upload Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Video Upload */}
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">
                        Video
                      </label>
                      <label
                        htmlFor="video-upload"
                        className="block rounded-xl border-2 border-dashed border-[#F07122] bg-white p-8 text-center cursor-pointer hover:bg-orange-50 transition"
                      >
                        <input
                          id="video-upload"
                          type="file"
                          accept="video/mp4,video/quicktime,video/x-msvideo"
                          className="hidden"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              videoFile: e.target.files?.[0] ?? null,
                            })
                          }
                        />
                        <VideoIcon className="w-10 h-10 mx-auto mb-3 text-gray-600" />
                        <p className="font-medium text-gray-800">
                          Klik untuk upload atau drag & drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          MP4, MOV, AVI (Maks. 500 MB)
                        </p>
                      </label>
                    </div>

                    {/* Thumbnail Upload */}
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">
                        Thumbnail Video <span className="text-red-500">*</span>
                      </label>
                      <label
                        htmlFor="thumbnail-add"
                        className="block rounded-xl border-2 border-dashed border-[#F07122] bg-white p-8 text-center cursor-pointer hover:bg-orange-50 transition"
                      >
                        <input
                          id="thumbnail-add"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleThumbnailUpload}
                        />
                        {thumbnailPreview ? (
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail"
                            className="w-full h-40 object-cover rounded-lg"
                          />
                        ) : (
                          <>
                            <Upload className="w-10 h-10 mx-auto mb-3 text-gray-600" />
                            <p className="font-medium text-gray-800">
                              Upload thumbnail
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              JPG, PNG (Rekomendasi 1280×720)
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Main Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-900 font-semibold mb-2">
                          Judul <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          placeholder="Contoh: Tips Public Speaking Anti Malu"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-900 font-semibold mb-2">
                          Durasi Video <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.duration}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              duration: e.target.value,
                            })
                          }
                          placeholder="00:00 (format menit:detik)"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-900 font-semibold mb-2">
                          Level <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.level}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              level: e.target.value as
                                | "Pemula"
                                | "Menengah"
                                | "Lanjutan",
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="Pemula">Pemula</option>
                          <option value="Menengah">Menengah</option>
                          <option value="Lanjutan">Lanjutan</option>
                        </select>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-900 font-semibold mb-2">
                          Speaker/Pembicara{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Nama Pembicara"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-900 font-semibold mb-2">
                          Kategori <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          {categories
                            .filter((c) => c !== "Semua")
                            .map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-900 font-semibold mb-2">
                          Tags/Keyword <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ketik dan tekan enter..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Deskripsi - TEXTAREA BARU */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">
                      Deskripsi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      placeholder="Tuliskan deskripsi singkat tentang video ini..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>

                  {/* Teknik Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">
                        Teknik Pembuka <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ketik dan tekan enter..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">
                        Gaya Penyampaian <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ketik dan tekan enter..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">
                        Struktur <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ketik dan tekan enter..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Transcript Upload */}
                  <div>
                    {/* Area Upload (tetap sesuai gaya kamu) */}
                    <label htmlFor="">
                      Transkrip <span className="text-red-500">*</span>
                    </label>
                    {/* Kontrol aksi */}
                    <div className="flex items-center justify-between mt-4">
                      <button
                        type="button"
                        onClick={addRow}
                        className="inline-flex items-center gap-2 bg-[#F07122] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                      >
                        <Plus className="w-4 h-4" />
                        Tambah Baris
                      </button>
                      <button
                        type="button"
                        onClick={sortByTime}
                        className="inline-flex items-center gap-2 border border-[#F07122] text-[#F07122] px-4 py-2 rounded-lg hover:bg-orange-50 transition"
                        title="Urutkan berdasarkan waktu"
                      >
                        <SortAsc className="w-4 h-4" />
                        Urutkan (mm:ss)
                      </button>
                    </div>

                    {/* Daftar baris transkrip */}
                    <div className="mt-4 space-y-3">
                      {entries.map((e, idx) => (
                        <div
                          key={e.id}
                          className="grid grid-cols-[90px_1fr_40px] items-start gap-3"
                        >
                          {/* Input waktu mm:ss */}
                          <div className="flex items-center justify-center gap-1">
                            <input
                              value={e.mm}
                              onChange={(v) =>
                                onTimeChange(e.id, "mm", v.target.value)
                              }
                              className="w-12 text-center border border-[#B3C8CF] rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-[#F07122]"
                              placeholder="mm"
                              inputMode="numeric"
                            />
                            <span className="text-gray-500">:</span>
                            <input
                              value={e.ss}
                              onChange={(v) =>
                                onTimeChange(e.id, "ss", v.target.value)
                              }
                              className="w-12 text-center border border-[#B3C8CF] rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-[#F07122]"
                              placeholder="ss"
                              inputMode="numeric"
                            />
                          </div>

                          {/* Teks transkrip */}
                          <textarea
                            value={e.text}
                            onChange={(v) => onTextChange(e.id, v.target.value)}
                            rows={2}
                            className="w-full border border-[#B3C8CF] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F07122]"
                            placeholder={`Kalimat pada [${e.mm}:${e.ss}]…`}
                          />

                          {/* Hapus */}
                          <button
                            type="button"
                            onClick={() => removeRow(e.id)}
                            className="h-10 w-10 flex items-center justify-center rounded-lg border border-red-300 text-red-500 hover:bg-red-50"
                            title="Hapus baris"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Hidden field untuk dikirim ke API */}
                    <input
                      type="hidden"
                      name="transcript_json"
                      value={JSON.stringify(payload)}
                      readOnly
                    />

                    {/* Hint kecil */}
                    <p className="text-xs text-gray-500 mt-3">
                      * Simpan akan mengirim <code>transcript_json</code> berupa
                      array <code>[{"{ t, text }"}]</code>, misal:{" "}
                      <code>[{'{ t:12, text:"…" }'}]</code>. Kolom kosong
                      otomatis di-skip.
                    </p>
                  </div>

                  {/* Catatan - TEXTAREA BARU */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">
                      Catatan
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notes: e.target.value,
                        })
                      }
                      rows={4}
                      placeholder="Tambahkan catatan tambahan jika diperlukan..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleAddVideo}
                    className="w-full px-6 py-3 bg-[#F07122] hover:bg-[#e36317] text-white rounded-xl font-semibold"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      {mounted && showEditModal && selectedVideo
        ? createPortal(
            <div className="fixed inset-0 text-black bg-black/50 flex items-center justify-center z-[1000] p-4">
              <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Edit Video Inspira
                  </h2>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedVideo(null);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Upload row (Video & Thumbnail) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Video */}
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">
                        Video
                      </label>
                      <label
                        htmlFor="video-edit"
                        className="block rounded-xl border-2 border-dashed border-[#F07122] bg-white p-8 text-center cursor-pointer hover:bg-orange-50 transition"
                      >
                        <input
                          id="video-edit"
                          type="file"
                          accept="video/mp4,video/quicktime,video/x-msvideo"
                          className="hidden"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              videoFile: e.target.files?.[0] ?? null,
                            })
                          }
                        />
                        <VideoIcon className="w-10 h-10 mx-auto mb-3 text-gray-600" />
                        <p className="font-medium text-gray-800">
                          Klik untuk upload atau drag &amp; drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          MP4, MOV, AVI (Maks. 500 MB)
                        </p>
                      </label>
                    </div>

                    {/* Thumbnail */}
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">
                        Thumbnail Video <span className="text-red-500">*</span>
                      </label>
                      <label
                        htmlFor="thumbnail-edit"
                        className="block rounded-xl border-2 border-dashed border-[#F07122] bg-white p-8 text-center cursor-pointer hover:bg-orange-50 transition"
                      >
                        <input
                          id="thumbnail-edit"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleThumbnailUpload}
                        />
                        {thumbnailPreview ? (
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail"
                            className="w-full h-40 object-cover rounded-lg"
                          />
                        ) : (
                          <>
                            <Upload className="w-10 h-10 mx-auto mb-3 text-gray-600" />
                            <p className="font-medium text-gray-800">
                              Upload thumbnail
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              JPG, PNG (Rekomendasi 1280×720)
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Form row (match add modal) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-900 font-semibold mb-2">
                          Judul <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          placeholder="Contoh: Tips Public Speaking Anti Malu"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-900 font-semibold mb-2">
                          Durasi Video <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.duration}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              duration: e.target.value,
                            })
                          }
                          placeholder="00:00 (format menit:detik)"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-900 font-semibold mb-2">
                          Level <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.level}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              level: e.target.value as
                                | "Pemula"
                                | "Menengah"
                                | "Lanjutan",
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="Pemula">Pemula</option>
                          <option value="Menengah">Menengah</option>
                          <option value="Lanjutan">Lanjutan</option>
                        </select>
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-900 font-semibold mb-2">
                          Speaker/Pembicara{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Nama Pembicara"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-900 font-semibold mb-2">
                          Kategori <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          {categories
                            .filter((c) => c !== "Semua")
                            .map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-900 font-semibold mb-2">
                          Tags/Keyword <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ketik dan tekan enter..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Deskripsi - TEXTAREA BARU */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">
                      Deskripsi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      placeholder="Tuliskan deskripsi singkat tentang video ini..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>

                  {/* Teknik rows */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">
                        Teknik Pembuka <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ketik dan tekan enter..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">
                        Gaya Penyampaian <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ketik dan tekan enter..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">
                        Struktur <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ketik dan tekan enter..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  {/* Transcript upload */}
                  <div>
                    {/* Area Upload (tetap sesuai gaya kamu) */}
                    <label htmlFor="">
                      Transkrip <span className="text-red-500">*</span>
                    </label>
                    {/* Kontrol aksi */}
                    <div className="flex items-center justify-between mt-4">
                      <button
                        type="button"
                        onClick={addRow}
                        className="inline-flex items-center gap-2 bg-[#F07122] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                      >
                        <Plus className="w-4 h-4" />
                        Tambah Baris
                      </button>
                      <button
                        type="button"
                        onClick={sortByTime}
                        className="inline-flex items-center gap-2 border border-[#F07122] text-[#F07122] px-4 py-2 rounded-lg hover:bg-orange-50 transition"
                        title="Urutkan berdasarkan waktu"
                      >
                        <SortAsc className="w-4 h-4" />
                        Urutkan (mm:ss)
                      </button>
                    </div>

                    {/* Daftar baris transkrip */}
                    <div className="mt-4 space-y-3">
                      {entries.map((e, idx) => (
                        <div
                          key={e.id}
                          className="grid grid-cols-[90px_1fr_40px] items-start gap-3"
                        >
                          {/* Input waktu mm:ss */}
                          <div className="flex items-center justify-center gap-1">
                            <input
                              value={e.mm}
                              onChange={(v) =>
                                onTimeChange(e.id, "mm", v.target.value)
                              }
                              className="w-12 text-center border border-[#B3C8CF] rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-[#F07122]"
                              placeholder="mm"
                              inputMode="numeric"
                            />
                            <span className="text-gray-500">:</span>
                            <input
                              value={e.ss}
                              onChange={(v) =>
                                onTimeChange(e.id, "ss", v.target.value)
                              }
                              className="w-12 text-center border border-[#B3C8CF] rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-[#F07122]"
                              placeholder="ss"
                              inputMode="numeric"
                            />
                          </div>

                          {/* Teks transkrip */}
                          <textarea
                            value={e.text}
                            onChange={(v) => onTextChange(e.id, v.target.value)}
                            rows={2}
                            className="w-full border border-[#B3C8CF] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F07122]"
                            placeholder={`Kalimat pada [${e.mm}:${e.ss}]…`}
                          />

                          {/* Hapus */}
                          <button
                            type="button"
                            onClick={() => removeRow(e.id)}
                            className="h-10 w-10 flex items-center justify-center rounded-lg border border-red-300 text-red-500 hover:bg-red-50"
                            title="Hapus baris"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Hidden field untuk dikirim ke API */}
                    <input
                      type="hidden"
                      name="transcript_json"
                      value={JSON.stringify(payload)}
                      readOnly
                    />

                    {/* Hint kecil */}
                    <p className="text-xs text-gray-500 mt-3">
                      * Simpan akan mengirim <code>transcript_json</code> berupa
                      array <code>[{"{ t, text }"}]</code>, misal:{" "}
                      <code>[{'{ t:12, text:"…" }'}]</code>. Kolom kosong
                      otomatis di-skip.
                    </p>
                  </div>

                  {/* Catatan - TEXTAREA BARU */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">
                      Catatan
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notes: e.target.value,
                        })
                      }
                      rows={4}
                      placeholder="Tambahkan catatan tambahan jika diperlukan..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleEditVideo}
                    className="w-full px-6 py-3 bg-[#F07122] hover:bg-[#e36317] text-white rounded-xl font-semibold"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      {mounted && showDetailModal && selectedVideo
        ? createPortal(
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
              <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Detail Video Inspira
                  </h2>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedVideo(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Preview */}
                  <div className="relative h-72 rounded-xl overflow-hidden">
                    <img
                      src={selectedVideo.thumbnail}
                      alt={selectedVideo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-orange-500" />
                      </div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedVideo.title}
                    </h3>
                    <p className="text-gray-800">{selectedVideo.description}</p>
                  </div>

                  {/* Meta info - match visual with add/edit */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Tag className="w-4 h-4" />
                        <span className="text-sm font-semibold">Kategori</span>
                      </div>
                      <p className="font-bold text-gray-900">
                        {selectedVideo.category}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-sm font-semibold">Level</span>
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getLevelBadgeClass(
                          selectedVideo.level
                        )}`}
                      >
                        {selectedVideo.level}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-semibold">Durasi</span>
                      </div>
                      <p className="font-bold text-gray-900">
                        {selectedVideo.duration}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-semibold">
                          Ditambahkan
                        </span>
                      </div>
                      <p className="font-bold text-gray-900">
                        {new Date(selectedVideo.addedDate).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Statistik */}
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-5 h-5 text-orange-600" />
                      <span className="font-bold text-orange-900">
                        Statistik
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">
                      {selectedVideo.views.toLocaleString()} views
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedVideo(null);
                    }}
                    className="w-full px-6 py-3 bg-[#F07122] hover:bg-[#e36317] text-white rounded-xl font-semibold"
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
