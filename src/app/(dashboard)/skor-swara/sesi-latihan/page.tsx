"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Square,
  Type as TypeIcon,
  Droplets,
  Image as ImageIcon,
  Edit3,
  Wind,
  Heart,
  Smile,
  Tag,
} from "lucide-react";
import SkorSwaraHeader from "@/app/components/skor-swara/SkorSwaraHeader";
import type { TrainingTopic } from "../config/levels";

// Web Speech API typing
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
  }
}

// Instruksi relaksasi
const RELAXATION_STEPS = [
  {
    icon: Wind,
    text: "Tarik napas dalam-dalam...",
    subtext: "Hirup udara melalui hidung, tahan sebentar",
  },
  {
    icon: Heart,
    text: "Hembuskan perlahan...",
    subtext: "Keluarkan napas melalui mulut, rasakan relaks",
  },
  {
    icon: Smile,
    text: "Tersenyum dan percaya diri!",
    subtext: "Kamu siap untuk tampil maksimal",
  },
];

type TrainingMode = "full-text" | "topic-image" | "custom-topic";

// ✅ Extended interface untuk topic-image
interface ExtendedTrainingTopic extends TrainingTopic {
  // Mode topic-image
  image_url?: string;
  image_topic?: string;
  image_keyword?: string;
  skor_swara_image_id?: number;
  image_id?: number;
  
  // Mode full-text
  text?: string;
  
  // Mode custom
  customDescription?: string;
}

function normalizeTrainingMode(raw: unknown): TrainingMode | null {
  if (!raw) return null;
  let v = String(raw);

  try {
    const parsed = JSON.parse(v);
    if (typeof parsed === "string") v = parsed;
    else if (typeof parsed?.mode === "string") v = parsed.mode;
    else if (typeof parsed?.value === "string") v = parsed.value;
    else if (typeof parsed?.mode_type === "string") v = parsed.mode_type;
    else if (typeof parsed?.mode_id === "number") {
      if (parsed.mode_id === 1) return "full-text";
      if (parsed.mode_id === 2) return "topic-image";
      if (parsed.mode_id === 3) return "custom-topic";
    }
  } catch {
    // bukan JSON
  }

  v = v.toLowerCase().replace(/[_\s]+/g, "-");

  if (
    ["full-text", "teks-lengkap", "text-lengkap", "fulltext", "text", "teks", "script"].includes(
      v
    )
  )
    return "full-text";

  if (
    ["topic-image", "topik-gambar", "topic+image", "topik+gambar", "image", "gambar"].includes(v)
  )
    return "topic-image";

  if (["custom-topic", "topik-kustom", "kustom", "custom"].includes(v))
    return "custom-topic";

  return null;
}

export default function SesiLatihanPage() {
  const router = useRouter();

  // ===== CONFIG =====
  const MAX_SECONDS = 60;
  const PREPARATION_TIME = 15;

  // ===== STATE =====
  const [trainingMode, setTrainingMode] = useState<TrainingMode>("full-text");
  const [selectedTopic, setSelectedTopic] = useState<ExtendedTrainingTopic | null>(null);
  const [isPreparation, setIsPreparation] = useState(false);
  const [preparationTimer, setPreparationTimer] = useState(PREPARATION_TIME);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showTele, setShowTele] = useState(false);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [fontPx, setFontPx] = useState<number>(22);
  const [bgOpacity, setBgOpacity] = useState<number>(0.6);
  const [speechReady, setSpeechReady] = useState<boolean>(false);
  const [fallback, setFallback] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // ===== REFS =====
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const preparationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const endedRef = useRef(false);
  const teleContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const fallbackTickerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // ✅ FIXED: Load data from sessionStorage with better parsing
  useEffect(() => {
    console.log("🔍 Loading session data...");
    
    // Load mode
    const modeKeys = [
      "skor-swara:selectedMode",
      "skor-swara:mode",
      "latihan:mode",
      "selectedMode",
    ];

    let normalized: TrainingMode | null = null;
    for (const k of modeKeys) {
      const v = sessionStorage.getItem(k);
      normalized = normalizeTrainingMode(v);
      if (normalized) {
        console.log(`✅ Mode found from key "${k}":`, v, "→", normalized);
        break;
      }
    }

    if (normalized) {
      setTrainingMode(normalized);
    } else {
      console.warn("⚠️ No valid mode found, using default: full-text");
    }

    // ✅ Load topic with proper structure
    const topicStr =
      sessionStorage.getItem("skor-swara:selectedTopic") ??
      sessionStorage.getItem("selectedTopic");
      
    if (topicStr) {
      try {
        const parsed = JSON.parse(topicStr);
        console.log("📦 Raw topic data:", parsed);
        
        // ✅ Handle different response structures
        let topicData: ExtendedTrainingTopic;
        
        if (normalized === "topic-image") {
          // Mode topic-image bisa punya struktur berbeda
          topicData = {
            title: parsed.image_topic || parsed.topic || "Topik Pembahasan",
            topic: parsed.image_topic || parsed.topic,
            image_url: parsed.image_url,
            image_topic: parsed.image_topic,
            image_keyword: parsed.image_keyword,
            skor_swara_image_id: parsed.skor_swara_image_id || parsed.image_id,
            image_id: parsed.image_id,
          };
          
          console.log("🖼️ Topic-image data:", topicData);
        } else if (normalized === "full-text") {
          // Mode full-text
          topicData = {
            title: parsed.topic || parsed.title,
            topic: parsed.topic,
            text: parsed.text,
            skor_swara_topic_id: parsed.skor_swara_topic_id,
          };
          
          console.log("📝 Full-text data:", topicData);
        } else {
          // Mode custom-topic
          topicData = {
            title: parsed.topic || parsed.title || "Topik Kustom",
            topic: parsed.topic,
            customDescription: parsed.customDescription,
          };
          
          console.log("✨ Custom-topic data:", topicData);
        }
        
        setSelectedTopic(topicData);
        console.log("✅ Topic loaded successfully");
      } catch (e) {
        console.error("❌ Failed to parse topic:", e);
      }
    } else {
      console.warn("⚠️ No topic found in sessionStorage");
    }
  }, []);

  const topik =
    selectedTopic?.title ||
    selectedTopic?.topic ||
    selectedTopic?.image_topic ||
    "Merancang Masa Depan: Membangun Karier di Era Digital";

  const latihanText = useMemo(() => {
    if (selectedTopic) {
      if (selectedTopic.text) return selectedTopic.text;
      if (selectedTopic.customDescription) return selectedTopic.customDescription;
    }
    return `Keterampilan komunikasi yang kuat dan kemampuan beradaptasi adalah dua hal yang saya anggap sangat penting di dunia kerja. Dengan komunikasi yang efektif, saya dapat menyampaikan ide dengan jelas dan berkolaborasi dengan tim.

Dalam era digital ini, perubahan terjadi sangat cepat, sehingga kemampuan untuk belajar hal baru dan beradaptasi dengan teknologi menjadi kunci kesuksesan.`;
  }, [selectedTopic]);

  const teleWords = useMemo(() => {
    if (trainingMode !== "full-text") return [];
    const words: string[] = [];
    const lines = latihanText.split("\n");
    lines.forEach((line: string, lineIdx: number) => {
      if (lineIdx > 0) words.push("\n");
      const lineWords = line.trim().split(/\s+/).filter(Boolean);
      words.push(...lineWords);
    });
    return words;
  }, [latihanText, trainingMode]);

  const teleWordsNormalized = useMemo(() => {
    return teleWords.map((w) => (w === "\n" ? "" : normalize(w)));
  }, [teleWords]);

  function normalize(text: string): string {
    return text.toLowerCase().replace(/[^\w\s]/g, "").trim();
  }

  const currentRelaxationStep = useMemo(() => {
    const elapsed = PREPARATION_TIME - preparationTimer;
    if (elapsed < 5) return 0;
    if (elapsed < 10) return 1;
    return 2;
  }, [preparationTimer]);

  // ===== CAMERA =====
  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e) {
        console.error("Camera error:", e);
      }
    })();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      }
    };
  }, []);

  // SR support
  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    setSpeechReady(Boolean(SR));
  }, []);

  // auto-scroll
  useEffect(() => {
    if (trainingMode === "topic-image") return;
    const box = teleContainerRef.current;
    if (!box) return;
    const el = box.querySelector<HTMLSpanElement>(
      `[data-word-idx="${currentWordIdx}"]`
    );
    if (!el) return;
    const targetTop = el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2;
    box.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });
  }, [currentWordIdx, trainingMode]);

  // ===== PREPARATION =====
  const startPreparation = () => {
    setIsPreparation(true);
    setPreparationTimer(PREPARATION_TIME);

    preparationIntervalRef.current = setInterval(() => {
      setPreparationTimer((prev) => {
        if (prev <= 1) {
          if (preparationIntervalRef.current) {
            clearInterval(preparationIntervalRef.current);
            preparationIntervalRef.current = null;
          }
          setIsPreparation(false);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelPreparation = () => {
    if (preparationIntervalRef.current) {
      clearInterval(preparationIntervalRef.current);
      preparationIntervalRef.current = null;
    }
    setIsPreparation(false);
    setPreparationTimer(PREPARATION_TIME);
  };

  // ===== START RECORDING =====
  const startRecording = async () => {
    setIsRecording(true);
    setShowTele(true);
    setTimer(0);
    setCurrentWordIdx(0);
    endedRef.current = false;
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => setTimer((p) => p + 1), 1000);

    try {
      const stream = videoRef.current?.srcObject as MediaStream | undefined;
      if (stream) {
        const preferred = "video/webm;codecs=vp8,opus";
        const opts = MediaRecorder.isTypeSupported?.(preferred)
          ? { mimeType: preferred }
          : (undefined as unknown as MediaRecorderOptions);
        const mr = new MediaRecorder(stream, opts);
        mediaRecorderRef.current = mr;
        recordedChunksRef.current = [];
        
        mr.ondataavailable = (e: BlobEvent) => {
          if (e.data?.size) recordedChunksRef.current.push(e.data);
        };
        
        mr.onstop = async () => {
          await handleVideoUpload();
        };
        
        mr.start();
      }
    } catch (e) {
      console.error("Recording error:", e);
    }

    if (trainingMode === "full-text") {
      startSR();
    } else {
      fallbackTickerRef.current = setInterval(() => {
        setCurrentWordIdx((i) => Math.min(i + 1, teleWords.length - 1));
      }, 650);
    }
  };

  // ===== VIDEO UPLOAD =====
  const handleVideoUpload = async () => {
    if (recordedChunksRef.current.length === 0) {
      alert("Tidak ada video direkam");
      return;
    }

    setIsUploading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token tidak ditemukan. Login dulu.");

      const trainingMode: TrainingMode = sessionStorage.getItem("skor-swara:mode") as TrainingMode || "full-text";
      const modeIdStr = sessionStorage.getItem("skor-swara:modeId") || "1";
      const modeId = parseInt(modeIdStr, 10);

      let userId = 19;
      try {
        const u = localStorage.getItem("user");
        if (u) {
          const parsed = JSON.parse(u);
          if (parsed?.user_id) userId = parsed.user_id;
        }
      } catch {}

      let selectedTopic: any = null;
      try {
        const t = sessionStorage.getItem("skor-swara:selectedTopic");
        if (t) selectedTopic = JSON.parse(t);
      } catch {}

      const customTopicText = sessionStorage.getItem("skor-swara:customTopic") || "";

      if (trainingMode === "full-text" && !selectedTopic?.skor_swara_topic_id) {
        throw new Error("ID topik tidak ditemukan untuk mode full-text.");
      }
      if (trainingMode === "topic-image" && !selectedTopic?.skor_swara_image_id && !selectedTopic?.image_id) {
        throw new Error("ID image tidak ditemukan untuk mode topic-image.");
      }
      if (trainingMode === "custom-topic" && !customTopicText.trim()) {
        throw new Error("Topik kustom kosong.");
      }

      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });

      const formData = new FormData();
      formData.append("video", blob, `session-${Date.now()}.webm`);
      formData.append("user_id", String(userId));
      formData.append("mode_id", String(modeId));

      if (trainingMode === "full-text") {
        formData.append("skor_swara_topic_id", String(selectedTopic.skor_swara_topic_id));
      } else if (trainingMode === "topic-image") {
        const imageId = selectedTopic.skor_swara_image_id || selectedTopic.image_id;
        formData.append("image_id", String(imageId));
      } else if (trainingMode === "custom-topic") {
        formData.append("custom_topic", customTopicText.trim());
        formData.append("custom_keyword", "");
      }

      console.log("📤 Upload FormData (mode:", trainingMode, ")");
      for (const [k, v] of formData.entries()) {
        if (v instanceof Blob) {
          console.log(`  ${k}: Blob(${v.size} bytes)`);
        } else {
          console.log(`  ${k}: ${v}`);
        }
      }

      const submitUrl = "https://swara-backend.onrender.com/api/swara/skor-swara/submit";
      const res = await fetch(submitUrl, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const raw = await res.text();
      let json: any = {};
      try { json = JSON.parse(raw); } catch {
        throw new Error("Response bukan JSON valid");
      }

      if (!res.ok) {
        console.error("❌ Upload failed:", json);
        throw new Error(json.message || json.error || `HTTP ${res.status}`);
      }

      console.log("📦 Full backend response:", json);
      console.log("📦 Response keys:", Object.keys(json));
      if (json.data) console.log("📦 json.data keys:", Object.keys(json.data));

      // ✅ Extract updatedData and suggestions from response
      const result = json.data?.updatedData || json.data || {};
      console.log("📦 result keys:", Object.keys(result));
      const suggestions = json.data?.suggestions || null;
      
      console.log("📊 Score data (updatedData):", result);
      console.log("💡 Suggestions data:", suggestions);
      
      // ✅ Adaptasi struktur baru: metrics ada di result.details
      const details = (result.details && typeof result.details === 'object') ? result.details : result;
      if (result.details) console.log("📦 details keys:", Object.keys(result.details));
      
      // ✅ Get skor_swara_id from response or fallback to sessionStorage
      let skorSwaraId = result.skor_swara_id || json.data?.skor_swara_id;
      if (!skorSwaraId) {
        const existingId = sessionStorage.getItem("skor-swara:sessionId");
        if (existingId) {
          skorSwaraId = parseInt(existingId, 10);
          console.log("⚠️ Using sessionId as fallback:", skorSwaraId);
        }
      }

      // ✅ Ambil video_result dari berbagai kemungkinan lokasi
      let videoResultUrl = result.video_result || json.data?.video_result || details.video_result || 
                           result.video_url || json.data?.video_url || details.video_url ||
                           result.cloudUrl || json.data?.cloudUrl || details.cloudUrl ||
                           result.videoUrl || json.data?.videoUrl || details.videoUrl ||
                           result.video || json.data?.video || details.video ||
                           result.url || json.data?.url || details.url || null;
      
      console.log("🎬 Video result URL:", videoResultUrl);
      console.log("🔍 Checking all possible video fields:", {
        'result.video_result': result.video_result,
        'json.data.video_result': json.data?.video_result,
        'details.video_result': details.video_result,
        'result.video_url': result.video_url,
        'result.videoUrl': result.videoUrl,
        'result.url': result.url,
        'json.data.url': json.data?.url
      });

      // Ambil meta dari suggestions jika ada
      let metaFromSuggestions: Record<string, any> = {};
      if (suggestions && typeof suggestions === 'object') {
        const metaKeys = ["kesimpulan_umum","prioritas_perbaikan","apresiasi","tips_latihan"] as const;
        for (const k of metaKeys) {
          if (suggestions[k] !== undefined) metaFromSuggestions[k] = suggestions[k];
        }
      }
      
      const resultData = {
        skor_swara_id: skorSwaraId,
        point_earned: details.point_earned ?? result.point_earned ?? 0,
        tempo: details.tempo ?? 0,
        artikulasi: details.artikulasi ?? 0,
        kontak_mata: details.kontak_mata ?? 0,
        kesesuaian_topik: details.kesesuaian_topik ?? 0,
        struktur: details.struktur ?? 0,
        jeda: details.jeda ?? 0,
        first_impression: details.first_impression ?? 0,
        ekspresi: details.ekspresi ?? 0,
        gestur: details.gestur ?? 0,
        kata_pengisi: details.kata_pengisi ?? 0,
        kata_tidak_senonoh: details.kata_tidak_senonoh ?? 0,
        video_result: videoResultUrl,
        status: result.status || "complete",
        created_at: result.created_at || new Date().toISOString(),
        mode: trainingMode,
        topic: result.topic || null,
        // ✅ Store suggestions from backend
        suggestions: suggestions,
        // Simpan meta tambahan
        ...metaFromSuggestions,
      };

      console.log("💾 Storing to sessionStorage:", resultData);
      sessionStorage.setItem("skor-swara:lastResult", JSON.stringify(resultData));
      
      // ✅ Update lastRecording dengan URL video dari backend
      if (videoResultUrl) {
        const metaStr = sessionStorage.getItem("skor-swara:lastRecording");
        if (metaStr) {
          try {
            const meta = JSON.parse(metaStr);
            meta.cloudUrl = videoResultUrl;
            meta.src = videoResultUrl;
            sessionStorage.setItem("skor-swara:lastRecording", JSON.stringify(meta));
            console.log("✅ Updated lastRecording with video URL:", videoResultUrl);
          } catch (e) {
            console.error("❌ Failed to update lastRecording:", e);
          }
        } else {
          // Buat metadata baru jika belum ada
          const newMeta = {
            cloudUrl: videoResultUrl,
            src: videoResultUrl,
            timestamp: Date.now(),
          };
          sessionStorage.setItem("skor-swara:lastRecording", JSON.stringify(newMeta));
          console.log("✅ Created new lastRecording with video URL:", videoResultUrl);
        }
      } else {
        console.warn("⚠️ No video_result URL found in response");
      }

      console.log("✅ Upload sukses:", resultData);
      router.push("/skor-swara/hasil-skor");
    } catch (e: any) {
      console.error("❌ Upload error:", e);
      alert(`Gagal upload: ${e.message || e}`);
      setIsUploading(false);
    }
  };

  // ===== FINISH TRAINING =====
  const handleStartTraining = () => {
    startPreparation();
  };

  const handleFinishTraining = () => {
    if (endedRef.current) return;
    endedRef.current = true;

    setIsRecording(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    stopSR();

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        mediaRecorderRef.current.requestData?.();
      } catch (e) {
        console.error("Failed to request data:", e);
      }
      mediaRecorderRef.current.stop();
    } else {
      router.push("/skor-swara/hasil-skor");
    }
  };

  // ===== SR LOGIC =====
  const startSR = () => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) {
      setFallback(true);
      fallbackTickerRef.current = setInterval(() => {
        setCurrentWordIdx((i) => Math.min(i + 1, teleWords.length - 1));
      }, 650);
      return;
    }

    const rec: SpeechRecognition = new SR();
    rec.lang = "id-ID";
    rec.continuous = true;
    rec.interimResults = true;
    recognitionRef.current = rec;

    let lastLen = 0;

    rec.onresult = (ev: SpeechRecognitionEvent) => {
      let t = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        t += ev.results[i][0].transcript + " ";
      }
      t = normalize(t);
      if (t.length === lastLen) return;
      lastLen = t.length;

      const heard = t.split(" ").filter(Boolean).slice(-6);
      setCurrentWordIdx((cur) => {
        let idx = cur;
        for (const hw of heard) {
          while (teleWordsNormalized[idx] === "") idx++;
          const next = teleWordsNormalized[idx] || "";
          const ok = hw === next || hw.includes(next) || next.includes(hw);
          if (ok) idx = Math.min(idx + 1, teleWordsNormalized.length - 1);
        }
        return idx;
      });
    };

    rec.onerror = () => {};
    rec.onend = () => {
      if (isRecording) {
        try {
          rec.start();
        } catch (e) {
          console.error("Failed to restart recognition:", e);
        }
      }
    };

    try {
      rec.start();
    } catch (e) {
      console.error("Failed to start recognition:", e);
      setFallback(true);
      fallbackTickerRef.current = setInterval(() => {
        setCurrentWordIdx((i) => Math.min(i + 1, teleWords.length - 1));
      }, 650);
    }
  };

  const stopSR = () => {
    try {
      recognitionRef.current?.stop();
    } catch (e) {
      console.error("Failed to stop recognition:", e);
    }
    recognitionRef.current = null;
    if (fallbackTickerRef.current) {
      clearInterval(fallbackTickerRef.current);
      fallbackTickerRef.current = null;
    }
    setFallback(false);
  };

  // ===== AUTO-FINISH =====
  useEffect(() => {
    if (!isRecording || endedRef.current) return;
    const reachedTime = timer >= MAX_SECONDS;
    const reachedEnd =
      trainingMode === "full-text" && currentWordIdx >= teleWords.length - 1;
    if (reachedTime || reachedEnd) {
      handleFinishTraining();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, timer, currentWordIdx, teleWords.length, trainingMode]);

  // ===== CLEANUP =====
  useEffect(() => {
    return () => {
      if (preparationIntervalRef.current) {
        clearInterval(preparationIntervalRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (fallbackTickerRef.current) {
        clearInterval(fallbackTickerRef.current);
      }
    };
  }, []);

  // ===== RENDER =====
  const currentStep = RELAXATION_STEPS[currentRelaxationStep];
  const StepIcon = currentStep.icon;

  function formatTime(timer: number): React.ReactNode {
    const m = Math.floor(timer / 60).toString().padStart(2, "0");
    const s = (timer % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <>
      <SkorSwaraHeader />
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Topic Header */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-6">
          <div className="flex items-start gap-3">
            <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
              Topik Latihan:
            </div>
            <h2 className="text-orange-600 font-semibold text-lg flex-1">
              {topik}
            </h2>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-600">Mode:</span>
            <span className="text-xs font-bold text-gray-900 bg-white px-2 py-1 rounded">
              {trainingMode === "full-text" && "📝 Teks Lengkap"}
              {trainingMode === "topic-image" && "🖼️ Topik + Gambar"}
              {trainingMode === "custom-topic" && "✨ Topik Kustom"}
            </span>
          </div>
        </div>

        {/* VIDEO + OVERLAY */}
        <div className="p-6">
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video">
            {/* Upload Progress Overlay */}
            {isUploading && (
              <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Menganalisis Video...
                  </h3>
                  <p className="text-white/70 text-sm">
                    Mohon tunggu, video sedang diupload ke server
                  </p>
                </div>
              </div>
            )}

            {/* Preparation Phase Overlay */}
            {isPreparation && (
              <div className="absolute inset-0 z-50 bg-gradient-to-br from-blue-500/95 via-blue-600/95 to-purple-600/95 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center px-8 w-full max-w-2xl">
                  <div className="relative w-40 h-40 mx-auto mb-8">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="72"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="72"
                        stroke="white"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 72}`}
                        strokeDashoffset={`${
                          2 *
                          Math.PI *
                          72 *
                          (1 - preparationTimer / PREPARATION_TIME)
                        }`}
                        className="transition-all duration-1000 ease-linear"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl font-black text-white">
                          {preparationTimer}
                        </div>
                        <div className="text-xs text-white/70 font-medium mt-1">
                          detik
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-center mb-3">
                      <div className="bg-white/20 p-3 rounded-full">
                        <StepIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {currentStep.text}
                    </h3>
                    <p className="text-sm text-white/80">
                      {currentStep.subtext}
                    </p>
                  </div>

                  <div className="mt-6 space-y-2">
                    <p className="text-white/70 text-xs">
                      💡 Bersiaplah dengan tenang
                    </p>
                    <p className="text-white/60 text-xs">
                      Recording akan dimulai otomatis
                    </p>
                  </div>

                  <button
                    onClick={cancelPreparation}
                    className="mt-4 px-5 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg font-medium transition-all border border-white/20"
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            )}

            {isRecording && (
              <div className="absolute bottom-4 left-4 z-30 flex items-center gap-3">
                <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  RECORDING
                </div>
                <div className="bg-black/60 text-white px-4 py-1.5 rounded-full text-sm font-mono shadow">
                  {formatTime(timer)}
                </div>
              </div>
            )}

            {/* ✅ FIXED: Topic+Image Mode Display */}
            {trainingMode === "topic-image" && isRecording && selectedTopic && (
              <div className="absolute top-20 left-4 z-30 bg-white/95 backdrop-blur-lg rounded-2xl p-6 w-[440px] shadow-2xl">
                {/* Display Image if available */}
                {selectedTopic.image_url && (
                  <div className="relative w-full h-48 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl mb-4 overflow-hidden shadow-lg">
                    <img
                      src={selectedTopic.image_url}
                      alt={selectedTopic.image_topic || selectedTopic.topic || "Topic Image"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        console.error("❌ Image load failed:", selectedTopic.image_url);
                        target.style.display = "none";
                      }}
                      onLoad={() => {
                        console.log("✅ Image loaded:", selectedTopic.image_url);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                )}

                {/* Display Topic */}
                {(selectedTopic.image_topic || selectedTopic.topic) && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2 font-semibold flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-orange-500" />
                      Topik Pembahasan:
                    </p>
                    <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-4 border-2 border-orange-300 shadow-sm">
                      <p className="text-lg font-black text-gray-900 text-center leading-tight">
                        {selectedTopic.image_topic || selectedTopic.topic}
                      </p>
                    </div>
                  </div>
                )}

                {/* Display Keywords */}
                {selectedTopic.image_keyword && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2 font-semibold flex items-center gap-2">
                      <Tag className="w-3 h-3 text-blue-500" />
                      Keyword Hints:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTopic.image_keyword.split(',').map((keyword: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold"
                        >
                          {keyword.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Font & Opacity Controls */}
            {showTele && trainingMode === "full-text" && (
              <div className="absolute z-40 bottom-4 right-4 flex items-center gap-2 bg-white/80 backdrop-blur px-2 py-1 rounded-lg shadow">
                <TypeIcon className="w-4 h-4 text-gray-700" />
                <button
                  onClick={() => setFontPx((v) => Math.max(14, v - 2))}
                  className="px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  A-
                </button>
                <span className="text-sm w-10 text-center">{fontPx}px</span>
                <button
                  onClick={() => setFontPx((v) => Math.min(48, v + 2))}
                  className="px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  A+
                </button>

                <Droplets className="w-4 h-4 text-gray-700 ml-2" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={bgOpacity}
                  onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
                  className="w-24"
                />
              </div>
            )}

            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full [transform:scaleX(-1)] object-cover"
            />

            {/* Teleprompter */}
            {showTele && trainingMode === "full-text" && (
              <div
                ref={teleContainerRef}
                className="absolute z-20 left-4 right-4 top-4 max-h-[55%] rounded-xl border border-gray-200 shadow overflow-auto resize p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{
                  backgroundColor: `rgba(255,255,255,${bgOpacity})`,
                  fontSize: `${fontPx}px`,
                  lineHeight: 1.6,
                }}
              >
                <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-9 rounded bg-orange-50/60" />
                {teleWords.map((w, index) => {
                  if (w === "\n") return <br key={`br-${index}`} />;
                  const spoken = index < currentWordIdx;
                  const current = index === currentWordIdx;
                  return (
                    <span
                      key={index}
                      data-word-idx={index}
                      className={[
                        "mx-[2px] whitespace-pre-wrap transition-colors duration-150 relative",
                        spoken
                          ? "text-gray-400"
                          : current
                          ? "bg-yellow-200 px-1 rounded"
                          : "text-gray-900",
                      ].join(" ")}
                    >
                      {w}
                      {index < teleWords.length - 1 ? " " : ""}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Custom Topic Mode */}
            {showTele && trainingMode === "custom-topic" && (
              <div className="absolute top-20 left-4 z-30 bg-white/95 backdrop-blur-lg rounded-2xl p-6 w-[440px] shadow-2xl">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
                    <Edit3 className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    {topik}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Berbicara bebas tentang topik ini dengan gayamu sendiri
                  </p>
                </div>
              </div>
            )}

            {!isRecording && !isPreparation && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                <div className="text-white text-center">
                  <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">
                    Siap untuk memulai latihan?
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleStartTraining}
              disabled={isRecording || isPreparation || isUploading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                isRecording || isPreparation || isUploading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5"
              }`}
            >
              <Play className="w-5 h-5" />
              {isPreparation ? "Bersiap..." : "Mulai Berlatih"}
            </button>

            <button
              onClick={handleFinishTraining}
              disabled={!isRecording || isUploading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                !isRecording || isUploading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5"
              }`}
            >
              <Square className="w-5 h-5" />
              Selesai Latihan
            </button>
          </div>

          {/* Info */}
          {!isRecording && !isPreparation && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🧘‍♀️</div>
                <div>
                  <p className="text-sm text-blue-900 font-semibold mb-1">
                    Tahap Persiapan Mental
                  </p>
                  <p className="text-xs text-blue-800">
                    Setelah klik "Mulai Berlatih", kamu akan mendapat waktu{" "}
                    <span className="font-bold">15 detik</span> untuk relaksasi
                    sebelum recording dimulai.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Fallback speed */}
          {!speechReady && isRecording && trainingMode === "full-text" && (
            <div className="mt-4 text-sm text-gray-700 flex items-center gap-3">
              Teleprompter: auto-scroll (fallback)
              <button
                onClick={() => {
                  if (!fallbackTickerRef.current) return;
                  clearInterval(fallbackTickerRef.current);
                  fallbackTickerRef.current = setInterval(() => {
                    setCurrentWordIdx((i) =>
                      Math.min(i + 1, teleWords.length - 1)
                    );
                  }, 480);
                }}
                className="px-3 py-1 rounded bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
              >
                Lebih cepat
              </button>
              <button
                onClick={() => {
                  if (!fallbackTickerRef.current) return;
                  clearInterval(fallbackTickerRef.current);
                  fallbackTickerRef.current = setInterval(() => {
                    setCurrentWordIdx((i) =>
                      Math.min(i + 1, teleWords.length - 1)
                    );
                  }, 800);
                }}
                className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              >
                Lebih lambat
              </button>
            </div>
          )}

          {/* Mode Tips */}
          {trainingMode === "topic-image" && !isPreparation && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900 font-semibold mb-2">
                💡 Tips Mode Topik + Gambar:
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Gunakan keyword hints sebagai panduan</li>
                <li>• Berbicara bebas dengan bahasa sendiri</li>
                <li>• Tidak perlu mengikuti teks tertentu</li>
                <li>• Fokus pada penyampaian ide yang jelas</li>
              </ul>
            </div>
          )}

          {trainingMode === "custom-topic" && !isPreparation && (
            <div className="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm text-purple-900 font-semibold mb-2">
                ✨ Tips Mode Topik Kustom:
              </p>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Ikuti outline yang sudah kamu buat</li>
                <li>• Sampaikan dengan percaya diri</li>
                <li>• Jangan terlalu kaku, tapi tetap terstruktur</li>
                <li>• Ini kesempatan berkreasi sepenuhnya!</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}