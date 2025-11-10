// app/(dashboard)/latihan-dasar/tempo/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Trophy,
  ArrowRight,
  Volume2,
  Award,
  Clock,
  Target,
  Zap,
  Activity,
  BarChart3,
  Play,
  ArrowLeft,
  Gauge,
  Pause,
} from "lucide-react";
import Link from "next/link";

// ============ TYPES ============
interface WordData {
  word: string;
  index: number;
  timestamp: number;
  duration: number;
}

interface AudioData {
  timestamp: number;
  pitch: number;
  volume: number;
}

interface SessionResult {
  sessionNumber: number;
  avgTempo: number;
  targetTempo: { min: number; max: number };
  tempoScore: number;
  clarityScore: number;
  volumeConsistency: number;
  overallScore: number;
  isSuccess: boolean;
  duration: number;
  wordsSpoken: number;
  totalWords: number;
}

interface LevelResult {
  completedSessions: number;
  avgScore: number;
  isLevelComplete: boolean;
  sessionResults: SessionResult[];
}

// ============ LEVEL CONFIGURATION ============
interface SessionConfig {
  text: string;
  targetWPM: { min: number; max: number };
  description: string;
}

interface LevelConfig {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  sessions: SessionConfig[];
  minScore: number;
  instructions: string[];
  tips: string[];
}

const LEVEL_CONFIGS: Record<number, LevelConfig> = {
  1: {
    id: 1,
    title: "Tempo Lambat & Jelas",
    description:
      "Berbicara dengan tempo sangat pelan dan artikulasi ekstra jelas",
    icon: <Gauge className="w-8 h-8" />,
    color: "text-green-600",
    bgGradient: "from-green-500 to-emerald-600",
    minScore: 70,
    sessions: [
      {
        text: "Jeda adalah alat yang kuat. Gunakan jeda sebentar, untuk memberikan penekanan. Ini membuat pesan lebih berkesan.",
        targetWPM: { min: 60, max: 80 },
        description: "Fokus pada jeda dan penekanan",
      },
      {
        text: "Terburu-buru saat berbicara, dapat membuat audiens bingung. Ambil napas dalam-dalam. Sampaikan setiap poin dengan tenang.",
        targetWPM: { min: 60, max: 80 },
        description: "Latih tempo lambat dan tenang",
      },
    ],
    instructions: [
      "Ucapkan setiap kata dengan sangat jelas",
      "Beri jeda 1-2 detik antar kalimat",
      "Target tempo: 60-80 WPM (sangat lambat)",
      "Selesaikan 2 sesi dengan skor minimal 70%",
    ],
    tips: [
      "Bayangkan sedang menjelaskan ke anak kecil",
      "Gunakan jeda untuk penekanan",
      "Ambil napas dalam sebelum mulai",
      "Fokus pada artikulasi, bukan kecepatan",
    ],
  },
  2: {
    id: 2,
    title: "Tempo Sedang & Berirama",
    description: "Berbicara dengan kecepatan nyaman, alami, dan berirama",
    icon: <Activity className="w-8 h-8" />,
    color: "text-blue-600",
    bgGradient: "from-blue-500 to-indigo-600",
    minScore: 70,
    sessions: [
      {
        text: "Tempo sedang membuat pidato terasa alami dan nyaman didengar. Audiens tidak merasa tertekan, mereka dapat mengikuti alur pikiran kita dengan lebih mudah. Ini membangun koneksi yang baik.",
        targetWPM: { min: 90, max: 110 },
        description: "Tempo alami dan nyaman",
      },
      {
        text: "Saat menyampaikan banyak informasi, keseimbangan tempo sangat penting. Berikan waktu kepada audiens untuk memproses. Jangan terlalu cepat, agar setiap detail terserap dengan baik.",
        targetWPM: { min: 90, max: 110 },
        description: "Balance antara info dan pemahaman",
      },
    ],
    instructions: [
      "Berbicara dengan tempo yang natural",
      "Jeda natural antar frasa",
      "Target tempo: 90-110 WPM (sedang)",
      "Pertahankan ritme yang konsisten",
    ],
    tips: [
      "Tempo seperti berbicara normal sehari-hari",
      "Jangan terburu-buru, tapi jangan terlalu lambat",
      "Beri audiens waktu untuk proses informasi",
      "Konsistensi lebih penting dari kecepatan",
    ],
  },
  3: {
    id: 3,
    title: "Variasi Tempo",
    description: "Ubah tempo untuk menekankan poin kunci",
    icon: <BarChart3 className="w-8 h-8" />,
    color: "text-indigo-600",
    bgGradient: "from-indigo-500 to-blue-600",
    minScore: 70,
    sessions: [
      {
        text: "Mengatur napas adalah kunci kontrol tempo. Ambil napas saat jeda yang alam, bukan di tengah kalimat. Ini akan membantu Anda berbicara lebih lancar dan percaya diri tanpa terengah-engah.",
        targetWPM: { min: 80, max: 120 },
        description: "Kontrol napas dan tempo",
      },
      {
        text: "Perhatikan reaksi audiens. Jika mereka tampak bingung, perlambat tempo Anda. Jika mereka antusias, Anda bisa sedikit meningkatkan kecepatan. Fleksibilitas itu penting.",
        targetWPM: { min: 80, max: 120 },
        description: "Adaptasi tempo sesuai audiens",
      },
    ],
    instructions: [
      "Variasikan kecepatan bicara",
      "Lambat untuk penekanan, cepat untuk transisi",
      "Target tempo: 80-120 WPM (bervariasi)",
      "Adaptasi dengan flow konten",
    ],
    tips: [
      "Poin penting → tempo lambat",
      "Transisi → tempo cepat",
      "Perhatikan reaksi audiens",
      "Variasi = dinamika yang menarik",
    ],
  },
  4: {
    id: 4,
    title: "Tempo Cepat & Lincah",
    description: "Berbicara cepat namun tetap jelas",
    icon: <Zap className="w-8 h-8" />,
    color: "text-orange-600",
    bgGradient: "from-orange-500 to-red-600",
    minScore: 70,
    sessions: [
      {
        text: "Beberapa topik, seperti inovasi teknologi atau berita terbaru, cocok dibawakan dengan tempo yang lebih cepat untuk menunjukkan urgensi. Kemampuan beradaptasi ini sangat berharga. Berlatih mengubah kecepatan bicara Anda sesuai materi akan membuat Anda menjadi pembicara yang lebih fleksibel dan menarik perhatian audiens.",
        targetWPM: { min: 120, max: 150 },
        description: "Tempo cepat dengan kejelasan",
      },
    ],
    instructions: [
      "Berbicara cepat namun tetap jelas",
      "Artikulasi harus tetap tajam",
      "Target tempo: 120-150 WPM (cepat)",
      "Jangan mengorbankan kejelasan untuk kecepatan",
    ],
    tips: [
      "Latih pengucapan cepat dengan jelas",
      "Napas pendek tapi sering",
      "Cocok untuk topik yang urgent/exciting",
      "Tetap perhatikan artikulasi",
    ],
  },
  5: {
    id: 5,
    title: "Kontrol Tempo & Penekanan",
    description: "Menguasai kontrol penuh atas tempo",
    icon: <Trophy className="w-8 h-8" />,
    color: "text-red-600",
    bgGradient: "from-red-500 to-pink-600",
    minScore: 75,
    sessions: [
      {
        text: "Membangun koneksi dengan audiens membutuhkan lebih dari sekedar kata-kata. Itu juga tentang cara kita menyampaikannya, termasuk penggunaan tempo. Saat ingin berbagi cerita pribadi, perlambat tempo agar audiens merasa dekat. Saat menginspirasi tindakan, percepat tempo untuk membangun semangat. Tempo adalah jembatan emosi antara Anda dan pendengar.",
        targetWPM: { min: 70, max: 140 },
        description: "Master kontrol tempo emosional",
      },
      {
        text: "Seorang pembicara profesional tidak hanya menyampaikan informasi, tetapi juga mengorkestrasi pengalaman audiens. Ini berarti kemampuan untuk mengubah tempo secara mulus, menyesuaikan diri dengan suasana, atau menarik perhatian pada momen krusial. Fleksibilitas ini adalah kunci untuk menjaga audiens tetap terlibat, membuat pesan Anda tidak hanya didengar, tetapi juga diingat dalam jangka panjang. Kuasai tempo, kuasai panggung.",
        targetWPM: { min: 70, max: 140 },
        description: "Orkestrasi pengalaman audiens",
      },
    ],
    instructions: [
      "Kuasai semua rentang tempo (lambat-cepat)",
      "Transisi smooth antar tempo",
      "Target tempo: 70-140 WPM (full range)",
      "Gunakan tempo untuk mengatur emosi",
    ],
    tips: [
      "Cerita pribadi → lambat & intim",
      "Call to action → cepat & energik",
      "Poin penting → pause dramatis",
      "Master level: kuasai semua teknik",
    ],
  },
};

// ============ MAIN COMPONENT ============
export default function TempoLatihan() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get level from query param
  const levelParam = searchParams.get("level");
  const currentLevel = levelParam ? parseInt(levelParam) : 1;

  if (!LEVEL_CONFIGS[currentLevel]) {
    router.push("/latihan-dasar/tempo?level=1");
    return null;
  }

  const levelConfig = LEVEL_CONFIGS[currentLevel];

  // ============ STATE ============
  const [mounted, setMounted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);

  // Session data
  const [completedWordIndices, setCompletedWordIndices] = useState<Set<number>>(
    new Set()
  );
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(-1);
  const [spokenWords, setSpokenWords] = useState<WordData[]>([]);
  const [audioData, setAudioData] = useState<AudioData[]>([]);
  const [recognizedText, setRecognizedText] = useState("");

  // Metrics
  const [currentPitch, setCurrentPitch] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(0);
  const [currentTempo, setCurrentTempo] = useState(0);
  const [timer, setTimer] = useState(0);
  const [feedback, setFeedback] = useState("Klik 'Mulai Sesi' untuk memulai");

  // Results
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const [showSessionResult, setShowSessionResult] = useState(false);
  const [showLevelResult, setShowLevelResult] = useState(false);

  // Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Data refs
  const startTimeRef = useRef<number>(0);
  const lastWordTimeRef = useRef<number>(0);
  const isRecordingRef = useRef(false);
  const audioDataRef = useRef<AudioData[]>([]);
  const spokenWordsRef = useRef<WordData[]>([]);
  const completedIndicesRef = useRef<Set<number>>(new Set());
  const lastProcessedTranscriptRef = useRef<string>("");

  // Current session config
  const currentSessionConfig = levelConfig.sessions[currentSession - 1];
  const words = currentSessionConfig.text.split(" ");
  const targetWPM = currentSessionConfig.targetWPM;

  useEffect(() => {
    setMounted(true);
  }, []);

  // ============ HELPER FUNCTIONS ============
  const normalizeWord = (word: string): string => {
    return word
      .toLowerCase()
      .replace(/[.,!?;:'"()]/g, "")
      .trim();
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    if (str1 === str2) return 1;
    if (str1.length === 0 || str2.length === 0) return 0;
    if (str1.includes(str2) || str2.includes(str1)) return 0.95;
    if (str1.startsWith(str2) || str2.startsWith(str1)) return 0.9;

    const distance = levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - distance / maxLength;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];
    for (let i = 0; i <= str2.length; i++) matrix[i] = [i];
    for (let j = 0; j <= str1.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  // ============ SPEECH RECOGNITION ============
  const initializeSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition tidak didukung. Gunakan Chrome/Edge.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "id-ID";
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      console.log("✅ Speech recognition started");
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      if (!isRecordingRef.current) return;

      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      const currentTranscript = (finalTranscript + interimTranscript).trim();
      setRecognizedText(currentTranscript);

      if (
        currentTranscript &&
        currentTranscript !== lastProcessedTranscriptRef.current
      ) {
        processRecognizedWords(currentTranscript);
        if (finalTranscript) {
          lastProcessedTranscriptRef.current = currentTranscript;
        }
      }

      // Reset silence timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      silenceTimeoutRef.current = setTimeout(() => {
        if (
          isRecordingRef.current &&
          completedIndicesRef.current.size >= words.length * 0.8
        ) {
          console.log("Auto-stopping due to completion");
          stopRecording();
        }
      }, 3000);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "no-speech") {
        setFeedback("⚠️ Tidak ada suara terdeteksi. Mulai berbicara...");
      }
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      setIsListening(false);
      if (isRecordingRef.current) {
        try {
          setTimeout(() => {
            if (recognitionRef.current && isRecordingRef.current) {
              recognitionRef.current.start();
            }
          }, 100);
        } catch (e) {
          console.log("Recognition restart failed", e);
        }
      }
    };

    return recognition;
  };

  const processRecognizedWords = (transcript: string) => {
    const normalizedTranscript = normalizeWord(transcript);
    const spokenWordsList = normalizedTranscript.split(" ").filter(Boolean);
    const trainingWordsNormalized = words.map((w) => normalizeWord(w));

    let furthestMatchIndex = Math.max(
      -1,
      ...Array.from(completedIndicesRef.current)
    );

    // Sequential matching
    for (const spokenWord of spokenWordsList) {
      for (
        let i = furthestMatchIndex + 1;
        i < trainingWordsNormalized.length;
        i++
      ) {
        if (completedIndicesRef.current.has(i)) continue;

        const targetWord = trainingWordsNormalized[i];
        const similarity = calculateSimilarity(spokenWord, targetWord);

        if (similarity > 0.65) {
          const now = Date.now();
          const duration = lastWordTimeRef.current
            ? now - lastWordTimeRef.current
            : 0;

          const wordData: WordData = {
            word: words[i],
            index: i,
            timestamp: now - startTimeRef.current,
            duration,
          };

          completedIndicesRef.current.add(i);
          setCompletedWordIndices(new Set(completedIndicesRef.current));

          if (!spokenWordsRef.current.find((w) => w.index === i)) {
            spokenWordsRef.current = [...spokenWordsRef.current, wordData];
            setSpokenWords(spokenWordsRef.current);
          }

          setCurrentHighlightIndex(i);
          furthestMatchIndex = i;
          lastWordTimeRef.current = now;

          calculateTempo(spokenWordsRef.current);
          break;
        }
      }
    }

    // Out-of-order matching
    for (const spokenWord of spokenWordsList) {
      for (let i = 0; i < trainingWordsNormalized.length; i++) {
        if (completedIndicesRef.current.has(i)) continue;

        const targetWord = trainingWordsNormalized[i];
        const similarity = calculateSimilarity(spokenWord, targetWord);

        if (similarity > 0.75) {
          const now = Date.now();
          const duration = lastWordTimeRef.current
            ? now - lastWordTimeRef.current
            : 0;

          const wordData: WordData = {
            word: words[i],
            index: i,
            timestamp: now - startTimeRef.current,
            duration,
          };

          completedIndicesRef.current.add(i);
          setCompletedWordIndices(new Set(completedIndicesRef.current));

          if (!spokenWordsRef.current.find((w) => w.index === i)) {
            spokenWordsRef.current = [...spokenWordsRef.current, wordData];
            setSpokenWords(spokenWordsRef.current);
          }

          setCurrentHighlightIndex(i);
          lastWordTimeRef.current = now;
          calculateTempo(spokenWordsRef.current);
          break;
        }
      }
    }
  };

  const calculateTempo = (wordsData: WordData[]) => {
    if (wordsData.length < 2) return;

    const totalTime = (Date.now() - startTimeRef.current) / 1000 / 60;
    const wpm = Math.round(wordsData.length / totalTime);
    setCurrentTempo(wpm);

    // Feedback based on current level target
    if (wpm > targetWPM.max) {
      setFeedback(
        `⚠️ Terlalu cepat! Target: ${targetWPM.min}-${targetWPM.max} WPM`
      );
    } else if (wpm < targetWPM.min && wpm > 0) {
      setFeedback(
        `⏱️ Terlalu lambat! Target: ${targetWPM.min}-${targetWPM.max} WPM`
      );
    } else if (wpm >= targetWPM.min && wpm <= targetWPM.max) {
      setFeedback("✅ Sempurna! Tempo sudah tepat. Pertahankan!");
    }
  };

  // ============ AUDIO ANALYSIS ============
  const detectPitch = (buffer: Float32Array, sampleRate: number): number => {
    const SIZE = buffer.length;
    const MAX_SAMPLES = Math.floor(SIZE / 2);
    let best_offset = -1;
    let best_correlation = 0;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return 0;

    let lastCorrelation = 1;
    for (let offset = 1; offset < MAX_SAMPLES; offset++) {
      let correlation = 0;
      for (let i = 0; i < MAX_SAMPLES; i++) {
        correlation += Math.abs(buffer[i] - buffer[i + offset]);
      }
      correlation = 1 - correlation / MAX_SAMPLES;

      if (correlation > 0.9 && correlation > lastCorrelation) {
        if (correlation > best_correlation) {
          best_correlation = correlation;
          best_offset = offset;
        }
      }
      lastCorrelation = correlation;
    }

    if (best_offset === -1) return 0;
    const fundamentalFreq = sampleRate / best_offset;
    const normalizedPitch = Math.min(100, ((fundamentalFreq - 80) / 200) * 100);
    return Math.max(0, normalizedPitch);
  };

  const analyzeAudio = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const timeDomainArray = new Float32Array(bufferLength);

    const analyze = () => {
      if (!analyserRef.current || !isRecordingRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      analyserRef.current.getFloatTimeDomainData(timeDomainArray);

      let sum = 0;
      for (let i = 0; i < timeDomainArray.length; i++) {
        sum += timeDomainArray[i] * timeDomainArray[i];
      }
      const rms = Math.sqrt(sum / timeDomainArray.length);
      const volume = Math.min(100, Math.max(0, rms * 1000));

      const pitch = detectPitch(
        timeDomainArray,
        audioContextRef.current!.sampleRate
      );

      setCurrentPitch(Math.round(pitch));
      setCurrentVolume(Math.round(volume));

      if (volume > 3) {
        const dataPoint: AudioData = {
          timestamp: Date.now(),
          pitch: Math.round(pitch),
          volume: Math.round(volume),
        };
        audioDataRef.current = [...audioDataRef.current, dataPoint];
        setAudioData(audioDataRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(analyze);
    };

    analyze();
  };

  // ============ SESSION CONTROL ============
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current =
        audioContextRef.current.createMediaStreamSource(stream);

      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 4096;
      analyserRef.current.smoothingTimeConstant = 0.8;

      const recognition = initializeSpeechRecognition();
      if (!recognition) {
        stopCamera();
        return;
      }

      recognitionRef.current = recognition;

      // Reset state
      isRecordingRef.current = true;
      audioDataRef.current = [];
      spokenWordsRef.current = [];
      completedIndicesRef.current = new Set();
      lastProcessedTranscriptRef.current = "";

      setIsRecording(true);
      setCurrentHighlightIndex(-1);
      setCompletedWordIndices(new Set());
      setSpokenWords([]);
      setAudioData([]);
      setTimer(0);
      setRecognizedText("");
      setCurrentPitch(0);
      setCurrentVolume(0);
      setCurrentTempo(0);
      startTimeRef.current = Date.now();
      lastWordTimeRef.current = Date.now();

      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);

      try {
        recognition.start();
      } catch (e) {
        console.log("Recognition start error:", e);
      }

      analyzeAudio();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Tidak dapat mengakses mikrofon.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const stopRecording = () => {
    console.log("Stopping recording...");
    isRecordingRef.current = false;

    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (microphoneRef.current) microphoneRef.current.disconnect();
    stopCamera();
    if (audioContextRef.current) audioContextRef.current.close();

    setIsRecording(false);
    setIsListening(false);

    setTimeout(() => {
      calculateResults();
    }, 500);
  };

  const calculateResults = () => {
    console.log("Calculating results...");

    if (spokenWordsRef.current.length === 0) {
      alert("Tidak ada kata terdeteksi. Coba lagi!");
      resetSession();
      return;
    }

    if (audioDataRef.current.length < 10) {
      alert("Data audio tidak cukup. Berbicara lebih lama!");
      resetSession();
      return;
    }

    const totalMinutes = timer / 60;
    const avgTempo = Math.round(spokenWordsRef.current.length / totalMinutes);

    // Tempo score based on target range
    const tempoDeviation =
      avgTempo < targetWPM.min
        ? targetWPM.min - avgTempo
        : avgTempo > targetWPM.max
        ? avgTempo - targetWPM.max
        : 0;
    const tempoScore = Math.max(0, 100 - tempoDeviation * 2);

    // Volume consistency
    const volumes = audioDataRef.current
      .map((d) => d.volume)
      .filter((v) => v > 0);
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const volumeVariance =
      volumes.reduce((sum, v) => sum + Math.pow(v - avgVolume, 2), 0) /
      volumes.length;
    const volumeConsistency = Math.max(0, 100 - Math.sqrt(volumeVariance));

    // Clarity score
    const clarityScore = Math.round(
      (completedIndicesRef.current.size / words.length) * 100
    );

    // Overall score
    const overallScore = Math.round(
      tempoScore * 0.5 + volumeConsistency * 0.2 + clarityScore * 0.3
    );

    const isSuccess =
      overallScore >= levelConfig.minScore && clarityScore >= 60;

    const result: SessionResult = {
      sessionNumber: currentSession,
      avgTempo,
      targetTempo: targetWPM,
      tempoScore: Math.round(tempoScore),
      clarityScore,
      volumeConsistency: Math.round(volumeConsistency),
      overallScore,
      isSuccess,
      duration: timer,
      wordsSpoken: completedIndicesRef.current.size,
      totalWords: words.length,
    };

    setSessionResults((prev) => [...prev, result]);
    setShowSessionResult(true);
    console.log("Session Result:", result);
  };

  const resetSession = () => {
    isRecordingRef.current = false;
    audioDataRef.current = [];
    spokenWordsRef.current = [];
    completedIndicesRef.current = new Set();
    lastProcessedTranscriptRef.current = "";

    setAudioData([]);
    setCurrentHighlightIndex(-1);
    setCompletedWordIndices(new Set());
    setSpokenWords([]);
    setRecognizedText("");
    setTimer(0);
    setCurrentPitch(0);
    setCurrentVolume(0);
    setCurrentTempo(0);
    setFeedback("Klik 'Mulai Sesi' untuk memulai");
  };

  const nextSession = () => {
    if (currentSession < levelConfig.sessions.length) {
      setCurrentSession((prev) => prev + 1);
      setShowSessionResult(false);
      resetSession();
    } else {
      setShowLevelResult(true);
    }
  };

  const retrySession = () => {
    setShowSessionResult(false);
    setSessionResults((prev) => prev.slice(0, -1));
    resetSession();
  };

  const resetLevel = () => {
    setCurrentSession(1);
    setSessionResults([]);
    setShowSessionResult(false);
    setShowLevelResult(false);
    resetSession();
  };

  const goToNextLevel = () => {
    if (currentLevel < 5) {
      router.push(`/latihan-dasar/tempo?level=${currentLevel + 1}`);
    } else {
      router.push("/latihan-dasar");
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      isRecordingRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      stopCamera();
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    };
  }, []);

  // ============ HELPER UI ============
  const generatePitchBars = () => {
    const bars = [];
    const barCount = 50;
    const activeBars = Math.floor((currentPitch / 100) * barCount);

    for (let i = 0; i < barCount; i++) {
      const isActive = i <= activeBars;
      const heightPercent =
        isActive && isRecording ? 60 + Math.random() * 30 : 15;
      const color = isActive
        ? currentPitch > 70
          ? "#f59e0b"
          : currentPitch > 40
          ? "#10b981"
          : "#3b82f6"
        : "#e5e7eb";

      bars.push(
        <div
          key={i}
          className="transition-all duration-200"
          style={{
            height: `${heightPercent}%`,
            width: "3px",
            backgroundColor: color,
            borderRadius: "2px",
          }}
        />
      );
    }
    return bars;
  };

  const getTempoColor = (tempo: number) => {
    if (tempo >= targetWPM.min && tempo <= targetWPM.max)
      return "text-green-600";
    if (tempo > targetWPM.max) return "text-red-600";
    if (tempo > 0) return "text-yellow-600";
    return "text-gray-600";
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "from-green-500 to-emerald-600";
    if (score >= 70) return "from-yellow-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  const levelProgress =
    (sessionResults.length / levelConfig.sessions.length) * 100;
  const levelAvgScore =
    sessionResults.length > 0
      ? Math.round(
          sessionResults.reduce((a, b) => a + b.overallScore, 0) /
            sessionResults.length
        )
      : 0;

  // ============ RENDER ============
  return (
    <div>
      <div className="min-h-screen bg-white p-8 rounded-xl shadow-md mb-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/latihan-dasar"
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:shadow-lg transition-all border-2 border-gray-200"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  Level {currentLevel}/5
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                  Tempo
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                  Sesi {currentSession}/{levelConfig.sessions.length}
                </span>
              </div>
              <h1 className="text-3xl font-black text-gray-900">
                {levelConfig.title}
              </h1>
              <p className="text-gray-600 font-medium">
                {currentSessionConfig.description}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl px-6 py-3 shadow-lg border-2 border-green-200">
            <p className="text-sm text-gray-600 mb-1">Progress Level</p>
            <p className="text-2xl font-black text-green-600">
              {Math.round(levelProgress)}%
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Text Display */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100">
              <div
                className={`bg-gradient-to-r ${levelConfig.bgGradient} p-6 text-white`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      {levelConfig.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        Sesi {currentSession}:{" "}
                        {currentSessionConfig.description}
                      </h2>
                      <p className="text-white/80 text-sm">
                        {isListening
                          ? "🎤 Mendengarkan..."
                          : `Target: ${targetWPM.min}-${targetWPM.max} WPM`}
                      </p>
                    </div>
                  </div>
                  {isRecording && (
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span className="font-bold text-lg">{timer}s</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Session Progress Dots */}
                <div className="flex items-center gap-2 mt-4">
                  {Array.from({ length: levelConfig.sessions.length }).map(
                    (_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-2 rounded-full transition-all ${
                          i < sessionResults.length
                            ? "bg-white"
                            : i === currentSession - 1
                            ? "bg-white/50 animate-pulse"
                            : "bg-white/20"
                        }`}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Text Content */}
              <div className="p-8">
                <div className="bg-gray-50 rounded-3xl p-8 min-h-[200px] flex items-center justify-center">
                  <div className="text-2xl leading-relaxed text-center">
                    {words.map((word, index) => (
                      <span
                        key={index}
                        className={`inline-block mx-2 my-1 px-3 py-2 rounded-xl transition-all font-semibold ${
                          index === currentHighlightIndex
                            ? "bg-green-500 text-white scale-110 shadow-lg animate-pulse"
                            : completedWordIndices.has(index)
                            ? "bg-green-100 text-green-700"
                            : "bg-white text-gray-400"
                        }`}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recognized Text */}
                {isRecording && recognizedText && (
                  <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                    <p className="text-sm text-blue-700 font-semibold mb-1">
                      Yang Anda ucapkan:
                    </p>
                    <p className="text-blue-900 italic">
                      &ldquo;{recognizedText}&rdquo;
                    </p>
                  </div>
                )}

                {/* Progress */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">
                      Progress Sesi
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {completedWordIndices.size} / {words.length} kata
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${levelConfig.bgGradient} transition-all duration-300`}
                      style={{
                        width: `${
                          (completedWordIndices.size / words.length) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="mt-6">
                  <div className="flex items-center gap-4">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className={`flex-1 px-6 py-4 bg-gradient-to-r ${levelConfig.bgGradient} text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2`}
                      >
                        <Play className="w-5 h-5" />
                        Mulai Sesi {currentSession}
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <MicOff className="w-5 h-5" />
                        Stop & Lihat Hasil
                      </button>
                    )}
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-3">
                    {isRecording
                      ? "Sistem otomatis mendeteksi setiap kata yang Anda ucapkan"
                      : "Pastikan mikrofon berfungsi dan lingkungan tenang"}
                  </p>
                </div>
              </div>
            </div>

            {/* Audio Visualization */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Visualisasi Audio Real-time
              </h3>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Pitch Level</span>
                  <span className="font-bold text-green-600">
                    {currentPitch}%
                  </span>
                </div>
                <div className="h-24 bg-gray-50 rounded-2xl flex items-center justify-center gap-[2px] px-4">
                  {generatePitchBars()}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Volume</span>
                  <span className="font-bold text-blue-600">
                    {currentVolume}%
                  </span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-150"
                    style={{ width: `${currentVolume}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Tempo Real-time</span>
                  <span
                    className={`font-bold text-2xl ${getTempoColor(
                      currentTempo
                    )}`}
                  >
                    {currentTempo > 0 ? `${currentTempo} WPM` : "- WPM"}
                  </span>
                </div>
                <div className="bg-green-50 rounded-2xl p-4">
                  <p className="text-sm text-green-800">
                    Target Sesi Ini: {targetWPM.min}-{targetWPM.max} WPM
                  </p>
                </div>
              </div>
            </div>

            {/* Feedback */}
            {isRecording && (
              <div
                className={`bg-gradient-to-r ${levelConfig.bgGradient} rounded-3xl p-6 text-white shadow-2xl animate-fadeIn`}
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6" />
                  <p className="font-bold text-lg">{feedback}</p>
                </div>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Session Results */}
            {sessionResults.length > 0 && (
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-green-600" />
                  Hasil Sesi
                </h3>
                <div className="space-y-2">
                  {sessionResults.map((result) => (
                    <div
                      key={result.sessionNumber}
                      className={`flex items-center justify-between p-3 rounded-xl ${
                        result.isSuccess
                          ? "bg-green-50 border-2 border-green-200"
                          : "bg-red-50 border-2 border-red-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {result.isSuccess ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                        <div>
                          <span className="font-bold text-gray-900">
                            Sesi {result.sessionNumber}
                          </span>
                          <p className="text-xs text-gray-600">
                            {result.avgTempo} WPM
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-black text-lg ${
                          result.isSuccess ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {result.overallScore}%
                      </span>
                    </div>
                  ))}
                </div>

                {sessionResults.length === levelConfig.sessions.length && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-semibold">
                        Rata-rata Level
                      </span>
                      <span className="text-2xl font-black text-green-600">
                        {levelAvgScore}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-6">
              <div className="flex gap-3">
                <Clock className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-green-900 mb-2 text-lg">
                    Instruksi Level {currentLevel}:
                  </h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    {levelConfig.instructions.map((instruction, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">{i + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Tips:
              </h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                {levelConfig.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Level Navigation */}
            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      router.push(`/latihan-dasar/tempo?level=${level}`)
                    }
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${
                      level === currentLevel
                        ? "bg-green-600 text-white scale-110"
                        : level < currentLevel
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 font-medium mt-2 text-center">
                Level Tempo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Session Result Modal */}
      {mounted &&
        showSessionResult &&
        !showLevelResult &&
        sessionResults.length > 0 &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-fadeIn">
              <div
                className={`bg-gradient-to-r ${
                  sessionResults[sessionResults.length - 1].isSuccess
                    ? "from-green-500 to-emerald-600"
                    : levelConfig.bgGradient
                } p-8 text-center text-white rounded-t-3xl`}
              >
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  {sessionResults[sessionResults.length - 1].isSuccess ? (
                    <CheckCircle className="w-10 h-10" />
                  ) : (
                    <AlertCircle className="w-10 h-10" />
                  )}
                </div>
                <h2 className="text-2xl font-black mb-2">
                  Sesi {currentSession}{" "}
                  {sessionResults[sessionResults.length - 1].isSuccess
                    ? "Berhasil! 🎉"
                    : "Selesai"}
                </h2>
                <p className="text-white/90">
                  {sessionResults[sessionResults.length - 1].isSuccess
                    ? "Tempo Anda sudah sesuai target!"
                    : "Perlu latihan lebih untuk mencapai target"}
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Avg Tempo</p>
                    <p className="text-2xl font-black text-green-600">
                      {sessionResults[sessionResults.length - 1].avgTempo} WPM
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Skor</p>
                    <p className="text-2xl font-black text-blue-600">
                      {sessionResults[sessionResults.length - 1].overallScore}%
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Kejelasan</span>
                    <span className="font-bold">
                      {sessionResults[sessionResults.length - 1].clarityScore}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Kata Terdeteksi</span>
                    <span className="font-bold">
                      {sessionResults[sessionResults.length - 1].wordsSpoken}/
                      {sessionResults[sessionResults.length - 1].totalWords}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {!sessionResults[sessionResults.length - 1].isSuccess && (
                    <button
                      onClick={retrySession}
                      className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Ulangi
                    </button>
                  )}
                  {currentSession < levelConfig.sessions.length ? (
                    <button
                      onClick={nextSession}
                      className={`flex-1 px-4 py-3 bg-gradient-to-r ${levelConfig.bgGradient} text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2`}
                    >
                      Sesi {currentSession + 1}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowSessionResult(false);
                        setShowLevelResult(true);
                      }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      Lihat Hasil Level
                      <Trophy className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Level Result Modal */}
      {mounted &&
        showLevelResult &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
              <div
                className={`bg-gradient-to-r ${levelConfig.bgGradient} p-8 text-center text-white rounded-t-3xl`}
              >
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black mb-2">
                  Level {currentLevel} Selesai! 🎉
                </h2>
                <p className="text-white/90 text-lg">
                  Anda telah menyelesaikan {levelConfig.title}
                </p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-green-50 rounded-2xl p-4 text-center border-2 border-green-200">
                    <Trophy className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      Rata-rata Level
                    </p>
                    <p className="text-3xl font-black text-green-600">
                      {levelAvgScore}%
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-4 text-center border-2 border-blue-200">
                    <CheckCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Sesi Selesai</p>
                    <p className="text-3xl font-black text-blue-600">
                      {sessionResults.filter((r) => r.isSuccess).length}/
                      {levelConfig.sessions.length}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">
                    Detail Hasil Sesi:
                  </h3>
                  <div className="space-y-3">
                    {sessionResults.map((result, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-2xl ${
                          result.isSuccess
                            ? "bg-green-50 border-2 border-green-200"
                            : "bg-red-50 border-2 border-red-200"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              result.isSuccess ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            <span className="text-white font-black text-lg">
                              {result.sessionNumber}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              Sesi {result.sessionNumber}
                            </p>
                            <p className="text-sm text-gray-600">
                              {result.avgTempo} WPM
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-2xl font-black ${
                              result.isSuccess
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {result.overallScore}%
                          </p>
                          <p className="text-xs text-gray-500">
                            Clarity: {result.clarityScore}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Feedback
                  </h4>
                  <p className="text-blue-800 leading-relaxed">
                    {levelAvgScore >= 85
                      ? `Luar biasa! Anda telah menguasai ${
                          levelConfig.title
                        } dengan sempurna. ${
                          currentLevel < 5
                            ? "Siap ke level berikutnya!"
                            : "Anda master tempo!"
                        }`
                      : levelAvgScore >= levelConfig.minScore
                      ? `Bagus! Tempo Anda sudah sesuai target. ${
                          currentLevel < 5
                            ? "Lanjutkan ke level berikutnya!"
                            : "Pertahankan latihan!"
                        }`
                      : "Terus berlatih untuk meningkatkan kontrol tempo Anda."}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={resetLevel}
                    className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Ulangi Level
                  </button>
                  {currentLevel < 5 ? (
                    <button
                      onClick={goToNextLevel}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      Level {currentLevel + 1}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <Link
                      href="/latihan-dasar"
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      Selesai
                      <CheckCircle className="w-5 h-5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
