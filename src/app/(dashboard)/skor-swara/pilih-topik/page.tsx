// app/skor-swara/pilih-topik/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Sparkles,
  Clock,
  TrendingUp,
  Filter,
  BookOpen,
  X,
  Image as ImageIcon,
  FileText,
  Edit3,
  Plus,
  PenLine,
} from "lucide-react";

type TrainingMode = "full-text" | "topic-image" | "custom-topic";

interface TrainingTopic {
  // Untuk mode full-text
  skor_swara_topic_id?: number;
  topic: string;
  text?: string;
  level?: number;
  category?: string;
  difficulty?: string;
  
  // Untuk mode topic-image
  image_id?: number;
  skor_swara_image_id?: number;
  image_url?: string;
  image_topic?: string;
  image_keyword?: string;
  
  // Untuk tracking session
  skor_swara_id?: number;
  session_id?: number;
  
  // Untuk custom topic
  isCustom?: boolean;
}

const API_BASE = "https://swara-backend.onrender.com/api/swara";

export default function PilihTopikPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") as TrainingMode) || "full-text";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<number | "all">("all");
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [randomTopic, setRandomTopic] = useState<TrainingTopic | null>(null);

  // State for API data
  const [topics, setTopics] = useState<TrainingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionCreated, setSessionCreated] = useState(false);
  
  // ✅ State untuk form custom topic (inline)
  const [customTopicInput, setCustomTopicInput] = useState("");
  const [customKeywordInput, setCustomKeywordInput] = useState("");

  // ✅ FIXED: Fetch topics berdasarkan mode
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔄 Loading mode:", mode);

        const token = localStorage.getItem("accessToken");
        let response;
        let sessionId = null;
        
        // ✅ Mode 1: Full Text - GET topicsbylevel
        if (mode === "full-text") {
          console.log("📖 Mode Full Text - menggunakan GET /topicsbylevel");
          
          response = await fetch(
            `${API_BASE}/skor-swara/topicsbylevel`,
            {
              method: "GET",
              headers: {
                Authorization: token ? `Bearer ${token}` : "",
              },
            }
          );
        } 
        // ✅ Mode 2: Topic-Image - POST /start
        else if (mode === "topic-image") {
          console.log("🖼️ Mode Topic-Image - menggunakan POST /start");
          
          const userStr = localStorage.getItem("user");
          let userId = 19;
          if (userStr) {
            try {
              const user = JSON.parse(userStr);
              userId = user.user_id || 19;
            } catch (e) {
              console.warn("Failed to parse user");
            }
          }
          
          response = await fetch(
            `${API_BASE}/skor-swara/start`,
            {
              method: "POST",
              headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: userId,
                mode_id: 2,
              }),
            }
          );
        }
        // ✅ Mode 3: Custom-Topic - GET topicsbylevel (same as mode 1)
        else if (mode === "custom-topic") {
          console.log("✨ Mode Custom-Topic - load topics + allow custom");
          
          response = await fetch(
            `${API_BASE}/skor-swara/topicsbylevel`,
            {
              method: "GET",
              headers: {
                Authorization: token ? `Bearer ${token}` : "",
              },
            }
          );
        }

        if (!response) {
          throw new Error("No response from server");
        }

        console.log("📥 Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Data fetched:", data);

        // ✅ Handle response structure
        if (data.success && data.data) {
          // Untuk mode full-text & custom-topic, data berisi array topics
          if (mode === "full-text" || mode === "custom-topic") {
            const topicsData = Array.isArray(data.data) ? data.data : [data.data];
            setTopics(topicsData);
            console.log("✅ Loaded topics:", topicsData.length);
          } 
          // Untuk mode topic-image, data berisi topic + image + session_id
          else if (mode === "topic-image") {
            // Simpan session ID yang dibuat
            sessionId = data.data.skor_swara_id || data.data.id;
            sessionStorage.setItem("skor-swara:sessionId", sessionId.toString());
            setSessionCreated(true);
            
            // Extract topic data
            const topicData = data.data.topic || data.data;
            const imageData = data.data.image || {};
            
            const combinedData = {
              ...topicData,
              ...imageData,
              session_id: sessionId,
              skor_swara_id: sessionId,
            };
            
            setTopics([combinedData]);
            console.log("✅ Loaded topic-image:", combinedData);
          }
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("❌ Error fetching topics:", err);
        setError(err instanceof Error ? err.message : "Failed to load topics");
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [mode, router]);

  // Get unique categories
  const categories = [
    "all",
    ...new Set(topics.map((t) => t.category).filter(Boolean)),
  ];

  // Get unique levels
  const levels = [
    "all",
    ...new Set(topics.map((t) => t.level).filter(Boolean)).values(),
  ].sort();

  // Filter topics
  const filteredTopics = topics.filter((topic) => {
    const matchSearch =
      topic.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.image_topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;

    const matchCategory =
      selectedCategory === "all" || topic.category === selectedCategory;

    const matchDifficulty =
      selectedDifficulty === "all" || topic.difficulty === selectedDifficulty;

    const matchLevel =
      selectedLevel === "all" || topic.level === selectedLevel;

    return matchSearch && matchCategory && matchDifficulty && matchLevel;
  });

  // Auto random untuk topic-image mode
  useEffect(() => {
    if (mode === "topic-image" && filteredTopics.length > 0 && !showCountdown) {
      const randomIndex = Math.floor(Math.random() * filteredTopics.length);
      setRandomTopic(filteredTopics[randomIndex]);
      setShowCountdown(true);
    }
  }, [mode, filteredTopics.length]);

  // Countdown timer
  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdown === 0 && randomTopic) {
      handleSelectTopic(randomTopic);
    }
  }, [showCountdown, countdown, randomTopic]);

  const handleRandomTopic = () => {
    if (filteredTopics.length === 0) {
      alert("Tidak ada topik yang tersedia");
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredTopics.length);
    const selected = filteredTopics[randomIndex];
    setRandomTopic(selected);
    setShowCountdown(true);
  };

  // ✅ NEW: Handle create custom topic
  const handleCreateCustomTopic = async () => {
    if (!customTopicInput.trim()) {
      alert("Topik tidak boleh kosong!");
      return;
    }

    console.log("✨ Creating custom topic:", customTopicInput);

    try {
      const userStr = localStorage.getItem("user");
      let userId = 19;
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userId = user.user_id || 19;
        } catch (e) {
          console.warn("Failed to parse user");
        }
      }

      const token = localStorage.getItem("accessToken");

      // Save custom topic to sessionStorage
      const customTopic = {
        topic: customTopicInput.trim(),
        custom_keyword: customKeywordInput.trim(),
        isCustom: true,
      };

      sessionStorage.setItem("skor-swara:selectedTopic", JSON.stringify(customTopic));
      sessionStorage.setItem("skor-swara:customTopic", customTopicInput.trim());
      sessionStorage.setItem("skor-swara:modeId", "3"); // ✅ Set mode_id = 3 untuk custom topic
      if (customKeywordInput.trim()) {
        sessionStorage.setItem("skor-swara:customKeyword", customKeywordInput.trim());
      }

      console.log("💾 Custom topic saved:", customTopic);

      // ✅ Panggil /start untuk membuat session
      const sessionPayload = {
        user_id: userId,
        mode_id: 3,
        custom_topic: customTopicInput.trim(),
        custom_keyword: customKeywordInput.trim() || "",
      };

      console.log("📤 Creating session with payload:", sessionPayload);

      const response = await fetch(`${API_BASE}/skor-swara/start`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionPayload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to create session");
      }

      const sessionId = data.data?.skor_swara_id || data.data?.id;
      
      if (!sessionId) {
        throw new Error("Session ID not found in response");
      }

      console.log("✅ Session created with ID:", sessionId);
      sessionStorage.setItem("skor-swara:sessionId", sessionId.toString());

      // Redirect to sesi-latihan
      router.push("/skor-swara/sesi-latihan");
    } catch (error) {
      console.error("❌ Error creating custom topic session:", error);
      alert(`Gagal membuat sesi: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleSelectTopic = async (topic: TrainingTopic) => {
    console.log("✅ Topic selected:", topic);
    
    try {
      // Save topic data
      sessionStorage.setItem("skor-swara:selectedTopic", JSON.stringify(topic));
      
      // ✅ Untuk mode full-text - panggil /start dengan topic_id
      if (mode === "full-text") {
        const userStr = localStorage.getItem("user");
        let userId = 19;
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            userId = user.user_id || 19;
          } catch (e) {
            console.warn("Failed to parse user");
          }
        }

        const token = localStorage.getItem("accessToken");

        console.log(`🚀 Creating session for ${mode} mode...`);

        const modeId = 1;
        
        // ✅ Save modeId to sessionStorage
        sessionStorage.setItem("skor-swara:modeId", modeId.toString());

        const sessionPayload = {
          user_id: userId,
          mode_id: modeId,
          skor_swara_topic_id: topic.skor_swara_topic_id,
        };

        console.log("📤 Session payload:", sessionPayload);

        const response = await fetch(`${API_BASE}/skor-swara/start`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sessionPayload),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || data.error || "Failed to create session");
        }

        const sessionId = data.data?.skor_swara_id || data.data?.id;
        
        if (!sessionId) {
          throw new Error("Session ID not found in response");
        }

        console.log("✅ Session created with ID:", sessionId);
        sessionStorage.setItem("skor-swara:sessionId", sessionId.toString());
      } 
      // ✅ Untuk mode custom-topic (pilih dari list) - simpan sebagai custom topic
      else if (mode === "custom-topic" && !topic.isCustom) {
        console.log("✨ Custom-topic from list - creating session with custom_topic");
        
        const userStr = localStorage.getItem("user");
        let userId = 19;
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            userId = user.user_id || 19;
          } catch (e) {
            console.warn("Failed to parse user");
          }
        }

        const token = localStorage.getItem("accessToken");
        
        // Set mode_id to 3
        sessionStorage.setItem("skor-swara:modeId", "3");
        
        // Save topic text as custom topic
        sessionStorage.setItem("skor-swara:customTopic", topic.topic);
        
        // ✅ Panggil /start dengan custom_topic
        const sessionPayload = {
          user_id: userId,
          mode_id: 3,
          custom_topic: topic.topic,
          custom_keyword: "", // bisa diisi dari topic.category atau kosong
        };

        console.log("📤 Session payload:", sessionPayload);

        const response = await fetch(`${API_BASE}/skor-swara/start`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sessionPayload),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || data.error || "Failed to create session");
        }

        const sessionId = data.data?.skor_swara_id || data.data?.id;
        
        if (!sessionId) {
          throw new Error("Session ID not found in response");
        }

        console.log("✅ Session created with ID:", sessionId);
        sessionStorage.setItem("skor-swara:sessionId", sessionId.toString());
      }
      // ✅ Untuk mode topic-image, session sudah dibuat saat fetch
      else if (mode === "topic-image") {
        const sessionId = topic.session_id || topic.skor_swara_id;
        
        if (!sessionId) {
          throw new Error("Session ID not found for topic-image mode");
        }
        
        console.log("✅ Using existing session ID:", sessionId);
        sessionStorage.setItem("skor-swara:sessionId", sessionId.toString());
      }

      // Navigate to sesi latihan
      console.log("➡️ Redirecting to sesi-latihan...");
      router.push("/skor-swara/sesi-latihan");

    } catch (error) {
      console.error("❌ Error:", error);
      alert(`Gagal membuat sesi: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleCancelCountdown = () => {
    setShowCountdown(false);
    setCountdown(10);
    setRandomTopic(null);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getModeInfo = () => {
    switch (mode) {
      case "full-text":
        return {
          icon: <FileText className="w-6 h-6" />,
          title: "Mode: Latihan dengan Teks Lengkap",
          description: "Pilih topik dengan teks lengkap untuk latihan membaca",
        };
      case "topic-image":
        return {
          icon: <ImageIcon className="w-6 h-6" />,
          title: "Mode: Topik + Gambar Visual",
          description: "Berbicara bebas berdasarkan topik dan gambar pendukung",
        };
      case "custom-topic":
        return {
          icon: <Sparkles className="w-6 h-6" />,
          title: "Mode: Topik Kustom Sendiri",
          description: "Pilih topik dari list atau buat topik sendiri",
        };
    }
  };

  const modeInfo = getModeInfo();

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Memuat topik latihan...</p>
            <p className="text-sm text-gray-500 mt-2">Mode: {mode}</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="bg-red-100 text-red-700 p-6 rounded-lg max-w-md mx-auto">
              <h3 className="font-bold text-xl mb-2">Gagal Memuat Topik</h3>
              <p className="mb-4">{error}</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                >
                  Coba Lagi
                </button>
                <button
                  onClick={() => router.push("/skor-swara/pilih-mode")}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/skor-swara/pilih-mode")}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            ← Kembali ke Pilih Mode
          </button>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                {modeInfo.icon}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {modeInfo.title}
                </h1>
                <p className="text-gray-600">{modeInfo.description}</p>
              </div>
              
              {/* Tombol modal dihapus; form ditampilkan inline di bawah untuk mode custom-topic */}
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Pilih Topik Latihan
          </h2>
          <p className="text-gray-600">
            {mode === "full-text" && "Pilih topik yang ingin kamu baca dan presentasikan"}
            {mode === "topic-image" && "Topik dengan gambar visual akan dipilih untukmu"}
            {mode === "custom-topic" && "Pilih dari daftar atau buat topik sendiri"}
          </p>
        </div>

        {/* Search & Filters - untuk mode full-text & custom-topic */}
        {(mode === "full-text" || mode === "custom-topic") && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari topik..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "Semua Kategori" : cat}
                  </option>
                ))}
              </select>

              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) =>
                  setSelectedLevel(
                    e.target.value === "all" ? "all" : Number(e.target.value)
                  )
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl === "all" ? "Semua Level" : `Level ${lvl}`}
                  </option>
                ))}
              </select>

              {/* Random Button */}
              <button
                onClick={handleRandomTopic}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Random
              </button>
            </div>
          </div>
        )}

        {/* ✅ Inline Form: Buat Topik Sendiri (hanya untuk mode custom-topic) */}
        {mode === "custom-topic" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 border-2 border-purple-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                <PenLine className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-900 mb-1">Buat Topik Kustom</h3>
                <p className="text-gray-600">Tulis topik presentasimu dan (opsional) keyword sebagai panduan.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Topik Presentasi <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  placeholder="Contoh: Dampak AI terhadap Pendidikan"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">{customTopicInput.length}/100 karakter</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kata Kunci (Opsional)</label>
                <input
                  type="text"
                  value={customKeywordInput}
                  onChange={(e) => setCustomKeywordInput(e.target.value)}
                  placeholder="Contoh: AI, pendidikan, teknologi, inovasi"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Pisahkan dengan koma</p>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleCreateCustomTopic}
                disabled={!customTopicInput.trim()}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  customTopicInput.trim()
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg"
                    : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white cursor-not-allowed"
                }`}
              >
                Mulai Latihan
              </button>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mt-4">
              <p className="text-sm text-blue-900 font-bold mb-2">💡 Tips Membuat Topik:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Pilih topik yang kamu kuasai</li>
                <li>• Buat judul yang jelas dan spesifik</li>
                <li>• Siapkan poin-poin utama sebelum mulai</li>
                <li>• Durasi ideal: 30-60 detik</li>
              </ul>
            </div>
          </div>
        )}

        {/* Topics Grid */}
        {filteredTopics.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Tidak ada topik yang ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic, index) => (
              <div
                key={topic.skor_swara_topic_id || topic.image_id || index}
                onClick={() => handleSelectTopic(topic)}
                className="group cursor-pointer bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-orange-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image for topic-image mode */}
                {mode === "topic-image" && topic.image_url && (
                  <div className="mb-4 rounded-xl overflow-hidden">
                    <img 
                      src={topic.image_url} 
                      alt={topic.image_topic || topic.topic}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                {/* Header with ID */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {topic.image_topic || topic.topic}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-white bg-orange-500 px-2 py-1 rounded-full flex-shrink-0">
                    #{topic.skor_swara_topic_id || topic.image_id || index}
                  </span>
                </div>

                {/* Text Preview */}
                {topic.text && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {topic.text.substring(0, 150)}...
                  </p>
                )}

                {/* Keywords for topic-image mode */}
                {mode === "topic-image" && topic.image_keyword && (
                  <p className="text-sm text-gray-600 mb-4">
                    <span className="font-semibold">Keyword:</span> {topic.image_keyword}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex flex-wrap gap-2">
                  {topic.category && (
                    <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                      {topic.category}
                    </span>
                  )}
                  {topic.level && (
                    <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      Level {topic.level}
                    </span>
                  )}
                  {topic.difficulty && (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${getDifficultyColor(
                        topic.difficulty
                      )}`}
                    >
                      {topic.difficulty === "beginner" && "Pemula"}
                      {topic.difficulty === "intermediate" && "Menengah"}
                      {topic.difficulty === "advanced" && "Lanjutan"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}


        {/* Countdown Modal */}
        {showCountdown && randomTopic && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative animate-scale-in">
              <button
                onClick={handleCancelCountdown}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <Sparkles className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {mode === "topic-image" ? "Topik dengan Gambar Dipilih!" : "Topik Random Dipilih!"}
              </h2>
              
              {randomTopic.image_url && (
                <div className="mb-4 rounded-xl overflow-hidden">
                  <img 
                    src={randomTopic.image_url} 
                    alt={randomTopic.topic}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              <div className="bg-orange-50 rounded-xl p-6 mb-6">
                <p className="text-lg font-bold text-orange-600 mb-2">
                  {randomTopic.image_topic || randomTopic.topic}
                </p>
                {randomTopic.text && (
                  <p className="text-sm text-gray-600">
                    {randomTopic.text.substring(0, 100)}...
                  </p>
                )}
                {randomTopic.image_keyword && (
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-semibold">Keyword:</span> {randomTopic.image_keyword}
                  </p>
                )}
              </div>

              <div className="text-6xl font-bold text-orange-500 mb-4">
                {countdown}
              </div>
              <p className="text-gray-600">Memulai dalam {countdown} detik...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}