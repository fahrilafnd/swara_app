// app/(dashboard)/skor-swara/hasil-skor/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import SkorSwaraHeader from "@/app/components/skor-swara/SkorSwaraHeader";
import {
  Download,
  Play,
  Pause,
  RotateCcw,
  Calendar,
  Clock,
  FileVideo,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Award,
  Target,
  MessageCircle,
  Smile,
  RefreshCw,
} from "lucide-react";

type ScoreData = {
  tempo: number;
  artikulasi: number;
  kontak_mata: number;
  kesesuaian_topik: number;
  struktur: number;
  jeda: number;
  first_impression: number;
  ekspresi: number;
  gestur: number;
  kata_pengisi: number;
  kata_tidak_senonoh: number;
};

// ✅ Suggestion types from result_ai field (database)
type SuggestionItem = {
  status: "baik" | "perlu_perbaikan" | "cukup";
  feedback: string;
  saran: string[];
};

type Suggestions = {
  tempo?: SuggestionItem;
  artikulasi?: SuggestionItem;
  kontak_mata?: SuggestionItem;
  kesesuaian_topik?: SuggestionItem;
  struktur?: SuggestionItem;
  jeda?: SuggestionItem;
  first_impression?: SuggestionItem;
  ekspresi?: SuggestionItem;
  gestur?: SuggestionItem;
  kata_pengisi?: SuggestionItem;
  kata_tidak_senonoh?: SuggestionItem;
  kesimpulan_umum?: string;
  prioritas_perbaikan?: string[];
  apresiasi?: string[];
  tips_latihan?: string[];
};

type ResultData = {
  skor_swara_id: number;
  point_earned: number;
  
  // ✅ Audio Analysis Results
  tempo: number;
  artikulasi: number;
  struktur: number;
  kata_pengisi: number;
  kata_tidak_senonoh: number;
  
  // ✅ Video Analysis Results  
  kontak_mata: number;
  ekspresi: number;
  gestur: number;
  first_impression: number;
  
  // Additional fields
  kesesuaian_topik: number;
  jeda: number;
  video_result: string;
  topic?: string;
  mode?: string;
  status?: string;
  created_at: string;
  
  // ✅ NEW: Suggestions from AI (parsed from result_ai)
  suggestions?: Suggestions;
  
  // ✅ NEW: Raw result_ai field from database
  result_ai?: string;
  
  // ✅ NEW: Raw analysis data
  audio_analysis?: {
    transcript?: string;
    tempo?: any;
    articulation?: any;
    structure?: any;
    profanity?: any;
    overall_score?: number;
  };
  video_analysis?: {
    analysis_results: any;
    eye_contact?: any;
    facial_expression?: any;
    gesture?: any;
    overall?: any;
  };
};

type LastRecording = {
  src: string;
  durationSeconds: number;
  createdAt: number;
  topic?: string;
  text?: string;
  mimeType?: string;
  mode?: string;
  fileName?: string;
  fileSize?: number;
};

export default function HasilSkorPage() {
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [lastRecording, setLastRecording] = useState<LastRecording | null>(
    null
  );
  const [openAccordion, setOpenAccordion] = useState<string | null>("tempo");
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  // ✅ Error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ✅ NEW: Polling state
  const [isPolling, setIsPolling] = useState(false);
  const [pollingStatus, setPollingStatus] = useState<
    "idle" | "analyzing" | "complete"
  >("idle");
  const [pollingCount, setPollingCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // ✅ NEW: Fetch latest result from API
  const fetchLatestResult = async (skorSwaraId: number) => {
    try {
      // ✅ Validate skorSwaraId
      if (!skorSwaraId || skorSwaraId === undefined || skorSwaraId === null) {
        console.error("❌ Invalid skor_swara_id:", skorSwaraId);
        return;
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.warn("⚠️ No token, skipping fetch");
        return;
      }

      console.log(`🔄 Polling attempt #${pollingCount + 1} - Fetching result for ID:`, skorSwaraId);

      // ✅ Use submit endpoint to get full analysis data
      const response = await fetch(
        `https://swara-backend.onrender.com/api/swara/skor-swara/submit?skor_swara_id=${skorSwaraId}`,
        {
           method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📥 Fetch response status:", response.status);

      if (!response.ok) {
        console.error("❌ Fetch failed:", response.statusText);
        return;
      }

      const data = await response.json();
      console.log("📦 Fetched data:", data);
      console.log("📦 Full JSON Response:", JSON.stringify(data, null, 2));

      // ✅ Explicit failure handling from backend
      if (!data.success) {
        console.error("❌ Backend returned failure payload:", data);
        setErrorMessage(
          data.message || data.error || "Analisis gagal diproses oleh backend"
        );
        setPollingStatus("complete");
        setIsPolling(false);
        return; // Stop further processing
      }

      if (data.success && data.data) {
        console.log("🔍 Response structure:", { hasUpdatedData: !!data.data.updatedData, hasSuggestions: !!data.data.suggestions, hasResultAi: !!data.data.result_ai });
        
        // ✅ Get data from submit endpoint structure
        const scoreData = data.data.updatedData || data.data;
        let suggestions = data.data.suggestions;
        
        // ✅ Parse result_ai if suggestions is not available
        if (!suggestions && scoreData.result_ai) {
          try {
            suggestions = typeof scoreData.result_ai === 'string' 
              ? JSON.parse(scoreData.result_ai)
              : scoreData.result_ai;
            console.log("✅ Parsed suggestions from result_ai:", suggestions);
          } catch (e) {
            console.error("❌ Failed to parse result_ai:", e);
          }
        }
        
        console.log("📊 Score data:", scoreData);
        console.log("💡 Suggestions data:", suggestions);

        // ✅ Parse audio analysis (if exists in old format)
        let audioAnalysis = null;
        if (scoreData.audio_analysis_result) {
          try {
            audioAnalysis = typeof scoreData.audio_analysis_result === 'string' 
              ? JSON.parse(scoreData.audio_analysis_result)
              : scoreData.audio_analysis_result;
            console.log("🎤 Audio analysis parsed:", audioAnalysis);
          } catch (e) {
            console.error("❌ Failed to parse audio_analysis:", e);
          }
        }

        // ✅ Parse video analysis (if exists in old format)
        let videoAnalysis = null;
        if (scoreData.video_analysis_result) {
          try {
            videoAnalysis = typeof scoreData.video_analysis_result === 'string'
              ? JSON.parse(scoreData.video_analysis_result)
              : scoreData.video_analysis_result;
            console.log("🎥 Video analysis parsed:", videoAnalysis);
          } catch (e) {
            console.error("❌ Failed to parse video_analysis:", e);
          }
        }

        // Ambil meta dari suggestions jika ada
        let metaFromSuggestions: Record<string, any> = {};
        if (suggestions && typeof suggestions === 'object') {
          const metaKeys = ["kesimpulan_umum","prioritas_perbaikan","apresiasi","tips_latihan"] as const;
          for (const k of metaKeys) {
            if (suggestions[k] !== undefined) metaFromSuggestions[k] = suggestions[k];
          }
        }

        const updatedResult: ResultData = {
          skor_swara_id: scoreData.skor_swara_id || skorSwaraId,
          point_earned: scoreData.point_earned || 0,
          
          // ✅ Direct scores from submit endpoint
          tempo: scoreData.tempo || 0,
          artikulasi: scoreData.artikulasi || 0,
          struktur: scoreData.struktur || 0,
          kata_pengisi: scoreData.kata_pengisi || 0,
          kata_tidak_senonoh: scoreData.kata_tidak_senonoh || 0,
          kontak_mata: scoreData.kontak_mata || 0,
          ekspresi: scoreData.ekspresi || 0,
          gestur: scoreData.gestur || 0,
          first_impression: scoreData.first_impression || 0,
          kesesuaian_topik: scoreData.kesesuaian_topik || 0,
          jeda: scoreData.jeda || 0,
          
          video_result: scoreData.video_result || resultData?.video_result || "",
          created_at: scoreData.created_at || new Date().toISOString(),
          topic: scoreData.topic || resultData?.topic,
          mode: scoreData.mode || resultData?.mode,
          status: scoreData.status,
          
          // ✅ Store raw result_ai field
          result_ai: scoreData.result_ai,
          
          // ✅ Store parsed suggestions from result_ai or suggestions field
          suggestions: suggestions,
          
          // ✅ Store raw analysis for detailed view (if available)
          audio_analysis: audioAnalysis?.result,
          video_analysis: videoAnalysis?.result,
          // Simpan meta dari suggestions
          ...metaFromSuggestions,
        };

        setResultData(updatedResult);
        setLastUpdate(new Date());

        // Update sessionStorage
        sessionStorage.setItem("skor-swara:lastResult", JSON.stringify(updatedResult));

        console.log("✅ Result updated from API");
        console.log("📊 Scores:", {
          tempo: updatedResult.tempo,
          artikulasi: updatedResult.artikulasi,
          kontak_mata: updatedResult.kontak_mata,
          ekspresi: updatedResult.ekspresi,
          gestur: updatedResult.gestur,
        });
        console.log("💡 Has suggestions:", !!updatedResult.suggestions);

        // Check if analysis is complete (has scores AND suggestions)
        const hasValidScores =
          updatedResult.tempo > 0 ||
          updatedResult.artikulasi > 0 ||
          updatedResult.kontak_mata > 0;
        
        const hasSuggestions = !!updatedResult.suggestions;

        // ✅ Only stop polling when we have both scores AND suggestions
        if (hasValidScores && hasSuggestions) {
          setPollingStatus("complete");
          setIsPolling(false);
          console.log("✅ Complete data received (scores + suggestions), stopped polling");
        } else {
          setPollingStatus("analyzing");
          console.log("🔄 Waiting for complete data...", { hasValidScores, hasSuggestions });
        }

        setPollingCount((prev) => prev + 1);
        return updatedResult;
      }
    } catch (error) {
      console.error("❌ Failed to fetch latest result:", error);
    }
  };

  // ✅ NEW: Polling effect
  useEffect(() => {
    if (isPolling && resultData?.skor_swara_id) {
      console.log("🔄 Starting polling interval...");

      const interval = setInterval(() => {
        fetchLatestResult(resultData.skor_swara_id);
      }, 5000); // Poll every 5 seconds

      // Stop polling after 2 minutes (24 attempts)
      if (pollingCount >= 24) {
        console.log("⏱️ Polling timeout reached, stopping...");
        setIsPolling(false);
        setPollingStatus("complete");
      }

      return () => {
        console.log("🛑 Clearing polling interval");
        clearInterval(interval);
      };
    }
  }, [isPolling, resultData?.skor_swara_id, pollingCount]);

  // Initial load
  useEffect(() => {
    try {
      // Load result from sessionStorage
      const resultStr = sessionStorage.getItem("skor-swara:lastResult");
      if (resultStr) {
        const parsed = JSON.parse(resultStr) as ResultData;
        
        // ✅ Parse result_ai if it's a string and suggestions is not set
        if (!parsed.suggestions && parsed.result_ai && typeof parsed.result_ai === 'string') {
          try {
            parsed.suggestions = JSON.parse(parsed.result_ai);
            console.log("✅ Parsed suggestions from result_ai in sessionStorage");
          } catch (e) {
            console.error("❌ Failed to parse result_ai from sessionStorage:", e);
          }
        }
        
        setResultData(parsed);
        console.log("✅ Result data loaded:", parsed);
        console.log("🔍 Checking data completeness:", {
          hasValidScores: parsed.tempo > 0 || parsed.artikulasi > 0 || parsed.kontak_mata > 0,
          hasSuggestions: !!parsed.suggestions,
          skor_swara_id: parsed.skor_swara_id
        });

        // ✅ Check if we need to fetch suggestions from API
        const hasValidScores =
          parsed.tempo > 0 ||
          parsed.artikulasi > 0 ||
          parsed.kontak_mata > 0;
        
        const hasSuggestions = !!parsed.suggestions;

        // ✅ Always fetch if no suggestions, even if scores exist
        if (!hasValidScores || !hasSuggestions) {
          console.log("🔄 Missing data detected, fetching from API...");
          console.log(`   - Has valid scores: ${hasValidScores}`);
          console.log(`   - Has suggestions: ${hasSuggestions}`);
          console.log(`   - Skor swara ID: ${parsed.skor_swara_id}`);
          
          // ✅ Only start polling if we have a valid ID
          if (parsed.skor_swara_id) {
            setIsPolling(true);
            setPollingStatus("analyzing");

            // Fetch immediately
            setTimeout(() => {
              fetchLatestResult(parsed.skor_swara_id);
            }, 1000);
          } else {
            console.error("❌ Cannot fetch: skor_swara_id is missing from sessionStorage");
            setErrorMessage("Data sesi tidak lengkap. Silakan coba latihan lagi.");
          }
        } else {
          console.log("✅ Complete data found (scores + suggestions), no fetch needed");
          setPollingStatus("complete");
        }
      }

      // Load recording metadata
      const recordingStr = sessionStorage.getItem("skor-swara:lastRecording");
      if (recordingStr) {
        const parsed = JSON.parse(recordingStr) as LastRecording;
        setLastRecording(parsed);
      }
    } catch (e) {
      console.error("❌ Failed to load result:", e);
    }
  }, []);

  const handleDownload = async () => {
    // ✅ Use video_result from API instead of local blob
    const videoUrl = resultData?.video_result;
    if (!videoUrl) {
      alert("Video tidak tersedia");
      return;
    }

    setDownloading(true);
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `skor-swara-${new Date(
        resultData?.created_at || Date.now()
      )
        .toISOString()
        .slice(0, 10)}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log("✅ Video downloaded from Cloudinary");
    } catch (error) {
      console.error("❌ Download failed:", error);
      alert("Gagal mengunduh video");
    } finally {
      setDownloading(false);
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return "N/A";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (timestamp: number | string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ✅ Calculate detailed metrics from API scores (scale 0-10)
  const performanceMetrics = resultData
    ? [
        {
          id: "tempo",
          name: "Tempo Bicara",
          score: resultData.tempo,
          displayScore: `${resultData.tempo} / 10`,
          progress: resultData.tempo * 10,
          description: getScoreDescription(resultData.tempo, "tempo", resultData),
          icon: "⏱",
        },
        {
          id: "artikulasi",
          name: "Artikulasi",
          score: resultData.artikulasi,
          displayScore: `${resultData.artikulasi} / 10`,
          progress: resultData.artikulasi * 10,
          description: getScoreDescription(resultData.artikulasi, "artikulasi", resultData),
          icon: "🗣",
        },
        {
          id: "kontak_mata",
          name: "Kontak Mata",
          score: resultData.kontak_mata,
          displayScore: `${resultData.kontak_mata} / 10`,
          progress: resultData.kontak_mata * 10,
          description: getScoreDescription(resultData.kontak_mata, "kontak_mata", resultData),
          icon: "👁",
        },
        {
          id: "struktur",
          name: "Struktur Presentasi",
          score: resultData.struktur,
          displayScore: `${resultData.struktur} / 10`,
          progress: resultData.struktur * 10,
          description: getScoreDescription(resultData.struktur, "struktur", resultData),
          icon: "📊",
        },
        {
          id: "ekspresi",
          name: "Ekspresi Wajah",
          score: resultData.ekspresi,
          displayScore: `${resultData.ekspresi} / 10`,
          progress: resultData.ekspresi * 10,
          description: getScoreDescription(resultData.ekspresi, "ekspresi", resultData),
          icon: "🎭",
        },
        {
          id: "first_impression",
          name: "First Impression",
          score: resultData.first_impression,
          displayScore: `${resultData.first_impression} / 10`,
          progress: resultData.first_impression * 10,
          description: getScoreDescription(resultData.first_impression, "first_impression", resultData),
          icon: "✨",
        },
      ]
    : [];

  function getScoreDescription(score: number, aspect: string, detailedData?: any): string {
    const level =
      score >= 8
        ? "excellent"
        : score >= 6
        ? "good"
        : score >= 4
        ? "fair"
        : "needs_improvement";

    // ✅ Use detailed analysis if available
    if (detailedData) {
      switch (aspect) {
        case "tempo":
          if (detailedData.audio_analysis?.tempo) {
            const tempo = detailedData.audio_analysis.tempo;
            return `${tempo.category || "Perlu Ditingkatkan"}. ${tempo.reason || ""}. 
                    Durasi: ${tempo.total_duration_sec?.toFixed(1)}s, 
                    Kata per menit: ${tempo.words_per_minute?.toFixed(1)}, 
                    ${tempo.has_long_pause ? "Terdapat jeda panjang." : "Tidak ada jeda panjang."}`;
          }
          break;
        
        case "artikulasi":
          if (detailedData.audio_analysis?.articulation) {
            const art = detailedData.audio_analysis.articulation;
            return `${art.category || "Kurang"}. ${art.reason || ""}. 
                    PER: ${art.details?.per?.toFixed(1)}%, 
                    Clarity: ${art.clarity_metrics?.avg_confidence?.toFixed(2)}, 
                    Kata pengisi: ${art.filler_count} (${art.filler_words?.join(", ") || "tidak ada"})`;
          }
          break;
        
        case "kontak_mata":
          if (detailedData.video_analysis?.analysis_results?.eye_contact) {
            const eye = detailedData.video_analysis.analysis_results.eye_contact;
            return `${eye.rating || "Baik"}. Pandangan ke tengah: ${eye.summary?.center_percentage?.toFixed(1)}%, 
                    Pandangan menjauh: ${eye.summary?.gaze_away_percentage?.toFixed(1)}%, 
                    Kedipan per menit: ${eye.summary?.blinks_per_minute || 0}`;
          }
          break;
        
        case "ekspresi":
          if (detailedData.video_analysis?.analysis_results?.facial_expression) {
            const expr = detailedData.video_analysis.analysis_results.facial_expression;
            return `Ekspresi dominan: ${expr.dominant_expression}. 
                    Ekspresi positif: ${expr.overall_summary?.happy_percentage?.toFixed(1)}%, 
                    Netral: ${expr.overall_summary?.neutral_percentage?.toFixed(1)}%, 
                    Negatif: ${expr.overall_summary?.negative_percentage?.toFixed(1)}%`;
          }
          break;
        
        case "gestur":
          if (detailedData.video_analysis?.analysis_results?.gesture) {
            const gest = detailedData.video_analysis.analysis_results.gesture;
            return `Kategori gerakan: ${gest.movement_category}. 
                    Aktivitas tangan: ${gest.summary?.hand_activity_percentage?.toFixed(1)}%, 
                    Stabilitas tubuh: ${gest.summary?.body_stability_score}/10. 
                    ${gest.details?.nervous_gestures_detected ? "Terdeteksi gerakan gugup." : ""}`;
          }
          break;
        
        case "first_impression":
          if (detailedData.video_analysis?.analysis_results?.facial_expression?.first_impression) {
            const fi = detailedData.video_analysis.analysis_results.facial_expression.first_impression;
            return `${fi.rating || "Buruk"}. ${fi.description || ""}. 
                    Ekspresi: ${fi.expression} (${(fi.confidence * 100).toFixed(1)}% confidence), 
                    Persentase: ${fi.percentage?.toFixed(1)}%`;
          }
          break;
      }
    }

    // Fallback to generic descriptions
    const descriptions: Record<string, Record<string, string>> = {
      tempo: {
        excellent: "Tempo bicara sangat baik dan konsisten sepanjang presentasi.",
        good: "Tempo bicara sudah cukup baik, namun masih ada beberapa bagian yang terlalu cepat.",
        fair: "Tempo bicara perlu ditingkatkan. Beberapa bagian terlalu cepat atau terlalu lambat.",
        needs_improvement: "Tempo bicara tidak konsisten. Perlu latihan lebih untuk mengatur kecepatan berbicara.",
      },
      artikulasi: {
        excellent: "Pengucapan sangat jelas dan mudah dipahami.",
        good: "Artikulasi cukup baik, sebagian besar kata terdengar jelas.",
        fair: "Beberapa kata kurang jelas. Perlu latihan pengucapan lebih lanjut.",
        needs_improvement: "Artikulasi perlu ditingkatkan signifikan. Banyak kata yang tidak jelas.",
      },
      kontak_mata: {
        excellent: "Kontak mata sangat baik dan natural sepanjang presentasi.",
        good: "Kontak mata cukup baik, namun kadang masih melihat ke bawah atau samping.",
        fair: "Kontak mata perlu ditingkatkan. Sering melihat ke arah lain.",
        needs_improvement: "Kontak mata sangat kurang. Perlu latihan intensif.",
      },
      struktur: {
        excellent: "Struktur presentasi sangat terorganisir dan mudah diikuti.",
        good: "Struktur presentasi cukup baik dengan alur yang jelas.",
        fair: "Struktur presentasi kurang terorganisir. Perlu perbaikan dalam penyusunan materi.",
        needs_improvement: "Struktur presentasi sangat perlu diperbaiki. Tidak ada alur yang jelas.",
      },
      ekspresi: {
        excellent: "Ekspresi wajah sangat variatif dan sesuai dengan konteks.",
        good: "Ekspresi wajah cukup baik, namun bisa lebih ekspresif.",
        fair: "Ekspresi wajah terlalu datar. Perlu lebih banyak variasi.",
        needs_improvement: "Ekspresi wajah sangat minim. Perlu latihan lebih banyak.",
      },
      gestur: {
        excellent: "Gestur sangat natural dan mendukung komunikasi.",
        good: "Gestur cukup baik, namun bisa lebih dinamis.",
        fair: "Gestur terlalu banyak atau terlalu sedikit. Perlu keseimbangan.",
        needs_improvement: "Gestur tidak efektif. Perlu latihan lebih banyak.",
      },
      first_impression: {
        excellent: "Kesan pertama sangat positif dan profesional.",
        good: "Kesan pertama cukup baik dan meyakinkan.",
        fair: "Kesan pertama perlu ditingkatkan untuk lebih meyakinkan.",
        needs_improvement: "Kesan pertama kurang meyakinkan. Perlu perbaikan signifikan.",
      },
    };

    return descriptions[aspect]?.[level] || "Tidak ada deskripsi tersedia.";
  }

  const accordionSections = resultData
    ? [
        {
          id: "tempo",
          title: "Tempo Bicara",
          levelLabel: resultData.tempo >= 7 ? "Baik" : "Cukup",
          score: resultData.tempo,
          body: (
            <>
              <p className="text-gray-700 text-sm">
                {getScoreDescription(resultData.tempo, "tempo")}
              </p>
              <ul className="mt-3 space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold mt-0.5">▶</span>
                  <span>
                    Latih jeda di akhir kalimat penting agar pesanmu lebih mudah
                    dicerna.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold mt-0.5">▶</span>
                  <span>
                    Gunakan pola naik–turun tempo: sedikit cepat di bagian
                    cerita, lebih pelan di poin penting.
                  </span>
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "artikulasi",
          title: "Artikulasi",
          levelLabel: resultData.artikulasi >= 7 ? "Baik" : "Cukup",
          score: resultData.artikulasi,
          body: (
            <>
              <p className="text-gray-700 text-sm">
                {getScoreDescription(resultData.artikulasi, "artikulasi")}
              </p>
              <ul className="mt-3 space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold mt-0.5">▶</span>
                  <span>
                    Latih membaca teks keras-keras dengan fokus pada kejelasan
                    setiap suku kata.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold mt-0.5">▶</span>
                  <span>
                    Kurangi kebiasaan "menelan" kata di akhir kalimat, pastikan
                    akhir kalimat terdengar jelas.
                  </span>
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "kontak_mata",
          title: "Kontak Mata & Ekspresi",
          levelLabel: resultData.kontak_mata >= 7 ? "Baik" : "Cukup",
          score: resultData.kontak_mata,
          body: (
            <>
              <p className="text-gray-700 text-sm">
                {getScoreDescription(resultData.kontak_mata, "kontak_mata")}
              </p>
              <ul className="mt-3 space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold mt-0.5">▶</span>
                  <span>
                    Sesekali tersenyum atau ubah ekspresi sesuai emosi yang
                    ingin disampaikan.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold mt-0.5">▶</span>
                  <span>
                    Latih kontak mata dengan teknik segitiga: bayangkan segitiga
                    di wajah lawan bicara dan gerakkan pandangan di area
                    tersebut.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold mt-0.5">▶</span>
                  <span>
                    Berlatih di depan cermin untuk mengamati dan memperbaiki
                    bahasa tubuh Kamu.
                  </span>
                </li>
              </ul>
            </>
          ),
        },
      ]
    : [];

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  // Find lowest scoring aspect for main suggestion
  const lowestScoreAspect = resultData
    ? Object.entries({
        tempo: resultData.tempo,
        artikulasi: resultData.artikulasi,
        kontak_mata: resultData.kontak_mata,
        struktur: resultData.struktur,
        ekspresi: resultData.ekspresi,
        first_impression: resultData.first_impression,
      }).reduce((lowest, [key, value]) => {
        if (!lowest || (value as number) < lowest.score) {
          return { aspect: key, score: value as number };
        }
        return lowest;
      }, null as { aspect: string; score: number } | null)
    : null;

  return (
    <div className="mb-8">
      <SkorSwaraHeader />

      {/* ✅ Error Banner */}
      {errorMessage && (
        <div className="bg-red-500/90 backdrop-blur-sm text-white p-5 rounded-2xl mb-6 shadow-lg border border-red-600">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Analisis Gagal</h3>
              <p className="text-sm leading-relaxed">{errorMessage}</p>
              <p className="text-xs mt-2 text-red-100">Halaman tidak akan melakukan polling lagi. Anda bisa coba ulang latihan jika masalah berlanjut.</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-white/70 hover:text-white text-sm font-semibold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* ✅ NEW: Processing Status Banner */}
      {pollingStatus === "analyzing" && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 mb-6 text-white shadow-xl animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                Sedang Menganalisis Video...
              </h3>
              <p className="text-blue-100">
                AI kami sedang memproses video Anda. Halaman akan otomatis update
                setiap 5 detik.
              </p>
              <p className="text-blue-200 text-sm mt-2">
                Polling: {pollingCount} kali
                {lastUpdate &&
                  ` • Update terakhir: ${lastUpdate.toLocaleTimeString("id-ID")}`}
              </p>
            </div>
            <button
              onClick={() => {
                setIsPolling(false);
                setPollingStatus("complete");
              }}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              Hentikan
            </button>
          </div>
        </div>
      )}

      {/* ✅ NEW: Manual Refresh Button */}
      {pollingStatus === "complete" && resultData?.skor_swara_id && (
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg border-2 border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <p className="font-bold text-gray-900">Analisis Selesai</p>
                <p className="text-sm text-gray-600">
                  {lastUpdate &&
                    `Update terakhir: ${lastUpdate.toLocaleTimeString("id-ID")}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsPolling(true);
                setPollingStatus("analyzing");
                setPollingCount(0);
                fetchLatestResult(resultData.skor_swara_id);
              }}
              disabled={isPolling}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isPolling ? "animate-spin" : ""}`} />
              <span>Refresh Hasil</span>
            </button>
          </div>
        </div>
      )}

      {/* Score Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-t-2xl p-8 text-center text-white mb-6 shadow-xl">
        <h1 className="text-3xl font-black mb-4 flex items-center justify-center gap-3">
          <CheckCircle className="w-8 h-8" />
          Hasil Latihanmu
        </h1>
        <div className="text-7xl font-black mb-2 animate-pulse">
          +{resultData?.point_earned || 0}
        </div>
        <div className="text-xl mb-4 font-semibold">poin</div>

        {resultData && (
          <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4 inline-block">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6" />
              <div className="text-left">
                <p className="text-sm text-white/80">Total Skor Rata-rata</p>
                <p className="text-2xl font-bold">
                  {(
                    (resultData.tempo +
                      resultData.artikulasi +
                      resultData.kontak_mata +
                      resultData.struktur +
                      resultData.ekspresi +
                      resultData.first_impression) /
                    6
                  ).toFixed(1)}{" "}
                  / 10
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Result Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <FileVideo className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Hasil Rekaman Latihan</h2>
                <p className="text-blue-100 text-sm">
                  {resultData?.video_result
                    ? "Video berhasil disimpan di cloud"
                    : "Belum ada rekaman"}
                </p>
              </div>
            </div>
            {resultData?.video_result && (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all disabled:opacity-50 shadow-lg"
              >
                {downloading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span>Mengunduh...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Unduh Video</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {resultData?.video_result ? (
            <div className="space-y-4">
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                <video
                  ref={videoRef}
                  src={resultData.video_result}
                  className="w-full rounded-2xl"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  controls
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-600">
                      Durasi
                    </span>
                  </div>
                  <p className="text-2xl font-black text-blue-600">
                    {lastRecording?.durationSeconds
                      ? formatDuration(lastRecording.durationSeconds)
                      : "N/A"}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-gray-600">
                      Tanggal
                    </span>
                  </div>
                  <p className="text-sm font-bold text-green-600">
                    {formatDate(resultData.created_at).split(",")[0]}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FileVideo className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold text-gray-600">
                      Format
                    </span>
                  </div>
                  <p className="text-lg font-bold text-purple-600">MP4</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-semibold text-gray-600">
                      Mode
                    </span>
                  </div>
                  <p className="text-sm font-bold text-orange-600">
                    {lastRecording?.mode === "full-text" && "📝 Teks Lengkap"}
                    {lastRecording?.mode === "topic-image" &&
                      "🖼 Topik+Gambar"}
                    {lastRecording?.mode === "custom-topic" &&
                      "✨ Topik Kustom"}
                    {!lastRecording?.mode && "N/A"}
                  </p>
                </div>
              </div>

              {(lastRecording?.topic || lastRecording?.text) && (
                <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6 border-2 border-orange-200">
                  {lastRecording.topic && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                        <span className="text-orange-500">📌</span>
                        Topik Latihan:
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {lastRecording.topic}
                      </p>
                    </div>
                  )}
                  {lastRecording.text && (
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                        <span className="text-orange-500">📄</span>
                        Teks yang Digunakan:
                      </p>
                      <div className="bg-white rounded-xl p-4 max-h-48 overflow-y-auto border border-orange-200">
                        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                          {lastRecording.text}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg"
                >
                  {downloading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Mengunduh...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Unduh Video</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (
                      confirm(
                        "Apakah Anda yakin ingin melatih ulang? Video ini akan tetap tersimpan."
                      )
                    ) {
                      window.location.href = "/skor-swara/pilih-mode";
                    }
                  }}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Latihan Lagi</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Belum Ada Rekaman
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Belum ada hasil rekaman dari sesi latihan. Silakan mulai latihan
                terlebih dahulu.
              </p>
              <a
                href="/skor-swara/pilih-mode"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg"
              >
                <Play className="w-5 h-5" />
                Mulai Latihan
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Performance Cards - Detailed Metrics (0-10 scale) */}
      {resultData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {performanceMetrics.slice(0, 6).map((metric) => (
            <div
              key={metric.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{metric.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    {metric.name}
                  </h3>
                  <div className="text-2xl font-black text-gray-900">
                    {metric.score}
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-orange-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${metric.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* AI Suggestions Section */}
      {resultData?.suggestions && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Saran AI Personalisasi
            </h2>
            <p className="text-purple-100 text-sm mt-2">Analisis mendalam dan rekomendasi dari AI untuk meningkatkan kemampuan presentasi Anda</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Kesimpulan Umum */}
            {resultData.suggestions.kesimpulan_umum && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Kesimpulan Umum
                </h3>
                <p className="text-gray-700 leading-relaxed text-base">{resultData.suggestions.kesimpulan_umum}</p>
              </div>
            )}

            {/* Metric Suggestions Grid */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Analisis Per Aspek</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(resultData.suggestions).map(([key, value]) => {
                  // Skip non-metric fields
                  if (['kesimpulan_umum', 'prioritas_perbaikan', 'apresiasi', 'tips_latihan'].includes(key)) return null;
                  
                  const suggestion = value as SuggestionItem;
                  const metricName = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                  
                  // Status colors
                  const statusColors = {
                    baik: 'bg-green-50 border-green-300',
                    perlu_perbaikan: 'bg-red-50 border-red-300',
                    cukup: 'bg-yellow-50 border-yellow-300'
                  };
                  
                  const statusBadgeColors = {
                    baik: 'bg-green-500 text-white',
                    perlu_perbaikan: 'bg-red-500 text-white',
                    cukup: 'bg-yellow-500 text-white'
                  };

                  const statusLabels = {
                    baik: 'Baik',
                    perlu_perbaikan: 'Perlu Perbaikan',
                    cukup: 'Cukup'
                  };

                  return (
                    <div
                      key={key}
                      className={`rounded-xl p-5 border-2 transition-all hover:shadow-md ${statusColors[suggestion.status as keyof typeof statusColors] || 'bg-gray-50 border-gray-300'}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-gray-900 text-base">{metricName}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadgeColors[suggestion.status as keyof typeof statusBadgeColors] || 'bg-gray-500 text-white'}`}>
                          {statusLabels[suggestion.status as keyof typeof statusLabels] || suggestion.status}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed mb-3">{suggestion.feedback}</p>
                      {suggestion.saran && suggestion.saran.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-2">Saran:</p>
                          <ul className="space-y-1.5">
                            {suggestion.saran.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-purple-500 font-bold mt-0.5">•</span>
                                <span className="leading-snug">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prioritas Perbaikan */}
            {resultData.suggestions.prioritas_perbaikan && resultData.suggestions.prioritas_perbaikan.length > 0 && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200">
                <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6" />
                  Prioritas Perbaikan
                </h3>
                <ol className="space-y-3">
                  {resultData.suggestions.prioritas_perbaikan.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
                      <span className="bg-red-500 text-white font-bold text-sm rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Apresiasi */}
            {resultData.suggestions.apresiasi && resultData.suggestions.apresiasi.length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Yang Sudah Baik
                </h3>
                <ul className="space-y-2">
                  {resultData.suggestions.apresiasi.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips Latihan */}
            {resultData.suggestions.tips_latihan && resultData.suggestions.tips_latihan.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Tips Latihan
                </h3>
                <ul className="space-y-3">
                  {resultData.suggestions.tips_latihan.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
                      <span className="bg-indigo-500 text-white font-bold text-sm rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Saran Perbaikan */}
      {lowestScoreAspect && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <AlertTriangle className="w-7 h-7" />
              Saran Perbaikan Utama
            </h2>
          </div>

          <div className="p-6">
            <div className="bg-yellow-50 rounded-2xl p-6 mb-6 border-2 border-yellow-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-orange-600">
                  {lowestScoreAspect.aspect === "kontak_mata"
                    ? "Kontak Mata"
                    : lowestScoreAspect.aspect.charAt(0).toUpperCase() +
                      lowestScoreAspect.aspect.slice(1).replace("_", " ")}
                </h3>
                <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                  Skor: {lowestScoreAspect.score}/10
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {getScoreDescription(
                  lowestScoreAspect.score,
                  lowestScoreAspect.aspect
                )}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-gray-900 mb-4 text-lg">
                Tips Perbaikan:
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3 bg-orange-50 rounded-xl p-4">
                  <span className="text-orange-500 font-black text-xl mt-0.5">
                    1
                  </span>
                  <span className="leading-relaxed">
                    Fokuskan latihan pada aspek ini dalam sesi berikutnya
                  </span>
                </li>
                <li className="flex items-start gap-3 bg-orange-50 rounded-xl p-4">
                  <span className="text-orange-500 font-black text-xl mt-0.5">
                    2
                  </span>
                  <span className="leading-relaxed">
                    Rekam diri sendiri dan review untuk melihat area yang perlu
                    diperbaiki
                  </span>
                </li>
                <li className="flex items-start gap-3 bg-orange-50 rounded-xl p-4">
                  <span className="text-orange-500 font-black text-xl mt-0.5">
                    3
                  </span>
                  <span className="leading-relaxed">
                    Latih secara konsisten setiap hari minimal 10-15 menit
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Accordion Details */}
      {resultData && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
            <h2 className="text-2xl font-black">Detail Analisis Lengkap</h2>
          </div>
          <div className="p-6 space-y-3">
            {accordionSections.map((section) => (
              <div
                key={section.id}
                className="border-2 border-gray-100 rounded-xl overflow-hidden transition-all hover:border-green-300"
              >
                <div
                  className="flex items-center justify-between cursor-pointer p-4 hover:bg-green-50 transition-colors"
                  onClick={() => toggleAccordion(section.id)}
                >
                  <h3 className="text-lg font-bold text-green-600">
                    {section.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                      {section.score}/10 - {section.levelLabel}
                    </span>
                    <svg
                      className={
                        "w-6 h-6 text-green-600 transition-transform " +
                        (openAccordion === section.id ? "rotate-180" : "")
                      }
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {openAccordion === section.id && (
                  <div className="border-t-2 border-gray-100 p-6 bg-gray-50">
                    {section.body}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}