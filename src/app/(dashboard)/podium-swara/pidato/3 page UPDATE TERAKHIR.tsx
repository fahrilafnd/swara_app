"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Pause,
  Play,
  Check,
  AlarmClock,
  RotateCcw,
  ArrowLeft,
  Mic,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Lightbulb,
  Heart,
} from "lucide-react";
import { createPortal } from "react-dom";

// ============ TYPES ============
interface WordData {
  word: string;
  index: number;
  timestamp: number;
  isCorrect: boolean;
}

interface SpeechData {
  id: number;
  title: string;
  content: string;
}

type ReactionType = "applause" | "thumbsDown" | "confused" | "leave";

interface AudienceReaction {
  audienceIndex: number;
  reaction: ReactionType;
  timestamp: number;
}

type SpeechState = "not-started" | "preparation" | "in-progress" | "finished";

// ============ CONSTANTS ============
const PREPARATION_TIME = 15;
const SIMILARITY_THRESHOLD = 0.65;

// ============ SPEECH DATA ============
const SPEECH_DATA: SpeechData[] = [
  {
    id: 1,
    title: "Generasi Anti Korupsi",
    content:
      "Selamat pagi dan salam sejahtera untuk kita semua. Korupsi masih menjadi tantangan besar bagi bangsa kita. Pemberantasan korupsi bukan hanya tugas aparat hukum, tapi tanggung jawab setiap warga negara. Generasi muda harus tumbuh dengan nilai kejujuran, disiplin, dan tanggung jawab. Integritas harus dimulai dari hal kecil, seperti tidak mencontek dan tidak menyalahgunakan kepercayaan. Mari jadikan kejujuran sebagai kebiasaan, bukan sekadar slogan. Karena masa depan Indonesia bersih dimulai dari diri kita. Terima kasih.",
  },
  {
    id: 2,
    title: "Kemandirian Ekonomi Generasi Muda",
    content:
      "Selamat siang, hadirin sekalian. Generasi muda kini tidak hanya dituntut untuk berpendidikan, tetapi juga mandiri secara ekonomi. Perkembangan digital membuka banyak peluang: dari bisnis online, konten kreatif, hingga ekonomi hijau. Namun, kemandirian juga berarti tangguh menghadapi kegagalan dan bijak mengelola keuangan. Jiwa wirausaha harus tumbuh sejak dini agar kita tak hanya mencari pekerjaan, tapi menciptakannya. Mari bangun mental mandiri dan inovatif agar generasi muda Indonesia menjadi motor ekonomi masa depan. Terima kasih.",
  },
  {
    id: 3,
    title: "Ekonomi Kreatif dan Anak Muda",
    content:
      "Selamat pagi semuanya. Indonesia kini tengah berkembang sebagai salah satu pusat ekonomi kreatif di Asia. Dari fashion, kuliner, hingga konten digital, ide-ide anak muda membawa nilai ekonomi tinggi sekaligus memperkenalkan budaya lokal. Namun, kreativitas harus diimbangi dengan konsistensi dan etika agar mampu bersaing global. Mari terus berkarya dan berinovasi, karena masa depan ekonomi bangsa ada di tangan generasi kreatif seperti kita. Terima kasih.",
  },
  {
    id: 4,
    title: "Kesehatan Remaja di Tengah Gaya Hidup Modern",
    content:
      "Selamat pagi, hadirin yang saya hormati. Remaja masa kini hidup di tengah arus cepat teknologi dan tren yang silih berganti. Sayangnya, banyak yang lupa menjaga pola makan, tidur, dan kesehatan mental. Padahal, produktivitas berawal dari tubuh dan pikiran yang sehat. Kesadaran untuk hidup seimbang perlu ditanamkan sejak dini, bukan setelah sakit datang. Mari jaga diri kita, karena masa depan yang kuat hanya bisa dibangun oleh generasi yang sehat. Terima kasih.",
  },
  {
    id: 5,
    title: "Krisis Air dan Kesadaran Lingkungan",
    content:
      "Selamat pagi, hadirin sekalian. Di tengah kemajuan zaman, ada satu hal yang sering kita lupakan: air bersih. Beberapa daerah di Indonesia sudah mengalami krisis air akibat perubahan iklim dan eksploitasi sumber daya alam. Padahal, air adalah sumber kehidupan. Mulai dari menghemat air di rumah hingga menjaga sungai tetap bersih, semua bisa berkontribusi menyelamatkan bumi. Mari kita ubah kepedulian menjadi tindakan, karena setetes air hari ini bisa menentukan masa depan generasi esok. Terima kasih.",
  },
];

// ============ AUDIENCE COMPONENT ============
interface AudiencePersonProps {
  index: number;
  reaction: ReactionType | null;
  hasLeft: boolean;
}

function AudiencePerson({ index, reaction, hasLeft }: AudiencePersonProps) {
  const getReactionIcon = () => {
    if (hasLeft) return null;

    switch (reaction) {
      case "applause":
        return (
          <img
            src="/podium/plause.png"
            alt="applause"
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-16 animate-bounce"
          />
        );
      case "thumbsDown":
        return (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white p-2 rounded-full animate-bounce">
            <ThumbsDown className="w-6 h-6" />
          </div>
        );
      case "confused":
        return (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-yellow-500 text-white p-2 rounded-full animate-bounce">
            <HelpCircle className="w-6 h-6" />
          </div>
        );
      default:
        return null;
    }
  };

  if (hasLeft) {
    return (
      <div className="w-[88px] h-[88px] flex items-center justify-center ">
        <div className="text-red-500 text-xs">Keluar</div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      {getReactionIcon()}
      <img
        src={`/podium/people/${index % 30}.png`}
        alt={`audience ${index + 1}`}
        className={`w-[88px] h-auto transition-all duration-300 ${
          reaction === "applause" ? "scale-110" : ""
        }`}
        draggable={false}
      />
    </div>
  );
}

// ============ MAIN COMPONENT ============
export default function Pidato() {
  const [selectedSpeech] = useState<SpeechData>(
    () => SPEECH_DATA[Math.floor(Math.random() * SPEECH_DATA.length)]
  );

  const PREPARATION_STEPS = useMemo(
    () => [
      {
        text: "Tarik Napas Dalam",
        subtext:
          "Ambil napas panjang, tahan sebentar, lalu hembuskan perlahan. Bersantai.",
        icon: Heart,
      },
      {
        text: "Fokus pada Topik",
        subtext: `Pahami pesan kunci pidato Anda: '${selectedSpeech.title}'. Cari kata-kata sulit.`,
        icon: Lightbulb,
      },
      {
        text: "Visualisasi Sukses",
        subtext:
          "Bayangkan Anda menyampaikan pidato dengan lancar, suara jelas, dan audiens bertepuk tangan.",
        icon: ThumbsUp,
      },
    ],
    [selectedSpeech.title]
  );

  const words = useMemo(
    () => selectedSpeech.content.split(" "),
    [selectedSpeech]
  );

  // State
  const [speechState, setSpeechState] = useState<SpeechState>("not-started");
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(60);
  const [timeUp, setTimeUp] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [preparationTimer, setPreparationTimer] = useState(PREPARATION_TIME);
  const [currentPrepStep, setCurrentPrepStep] = useState(0);
  const [videoStatus, setVideoStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [sequentialWarning, setSequentialWarning] = useState("");
  const [cameraError, setCameraError] = useState<string>("");

  // Speech tracking
  const [completedWordIndices, setCompletedWordIndices] = useState<Set<number>>(new Set());
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(-1);
  const [spokenWords, setSpokenWords] = useState<WordData[]>([]);
  const [errorCount, setErrorCount] = useState(0);

  // Audience reactions
  const [audienceReactions, setAudienceReactions] = useState<Map<number, ReactionType>>(new Map());
  const [audienceLeft, setAudienceLeft] = useState<Set<number>>(new Set());

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef(false);
  const completedIndicesRef = useRef<Set<number>>(new Set());
  const spokenWordsRef = useRef<WordData[]>([]);
  const lastProcessedTranscriptRef = useRef<string>("");
  const errorCountRef = useRef(0);
  const consecutiveErrorsRef = useRef(0);

  const AUDIENCE_COUNT = 30;

  useEffect(() => setMounted(true), []);

  // Timer Utama
  useEffect(() => {
    if (speechState === "in-progress" && !isPaused && time > 0) {
      const timer = setInterval(() => setTime((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isPaused, time, speechState]);

  // Timer Persiapan
  useEffect(() => {
    if (speechState === "preparation" && preparationTimer > 0) {
      const prepTimer = setInterval(() => {
        setPreparationTimer((t) => t - 1);
      }, 1000);
      return () => clearInterval(prepTimer);
    } else if (speechState === "preparation" && preparationTimer === 0) {
      startRecordingLogic();
      setSpeechState("in-progress");
    }
  }, [speechState, preparationTimer]);

  // Langkah Persiapan Dinamis
  useEffect(() => {
    if (speechState === "preparation") {
      const stepDuration = PREPARATION_TIME / PREPARATION_STEPS.length;
      const elapsed = PREPARATION_TIME - preparationTimer;
      const stepIndex = Math.floor(elapsed / stepDuration);
      setCurrentPrepStep(Math.min(stepIndex, PREPARATION_STEPS.length - 1));
    }
  }, [speechState, preparationTimer, PREPARATION_STEPS.length]);

  // Time up handler
  useEffect(() => {
    if (time === 0 && !timeUp && speechState === "in-progress") {
      setIsPaused(true);
      setTimeUp(true);
      setSpeechState("finished");
      stopRecording();
    }
  }, [time, timeUp, speechState]);

  // Camera setup - Diperbaiki dengan retry mechanism
  useEffect(() => {
    let stream: MediaStream | null = null;
    let retryCount = 0;
    const MAX_RETRIES = 3;

    const enableCamera = async () => {
      try {
        setVideoStatus("loading");
        setCameraError("");

        // Cek API support
        if (!navigator.mediaDevices?.getUserMedia) {
          setVideoStatus("failed");
          setCameraError("Browser Anda tidak mendukung akses kamera.");
          return;
        }

        // Request camera dengan fallback settings
        try {
          // Try HD first
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user",
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: true,
          });
        } catch (err) {
          console.log("HD failed, trying standard resolution...");
          // Fallback to standard resolution
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: true,
          });
        }

        const vid = videoRef.current;
        if (!vid) {
          setVideoStatus("failed");
          setCameraError("Video element not ready");
          stream?.getTracks().forEach((t) => t.stop());
          return;
        }

        vid.srcObject = stream;
        vid.muted = true;

        // Wait for metadata and play
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error("Timeout")), 5000);
          
          vid.onloadedmetadata = async () => {
            clearTimeout(timeout);
            try {
              await vid.play();
              resolve();
            } catch (playErr) {
              reject(playErr);
            }
          };

          if (vid.readyState >= 2) {
            clearTimeout(timeout);
            vid.play().then(resolve).catch(reject);
          }
        });

        setVideoStatus("ready");
        console.log("✅ Camera ready");
      } catch (err: any) {
        console.error("Camera error:", err);
        
        // Retry logic
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(`Retrying camera... (${retryCount}/${MAX_RETRIES})`);
          setTimeout(enableCamera, 1000);
          return;
        }

        setVideoStatus("failed");
        const name = err?.name || "";
        
        if (name === "NotAllowedError") {
          setCameraError(
            "❌ Izin kamera ditolak. Klik ikon kamera di address bar dan izinkan akses."
          );
        } else if (name === "NotFoundError") {
          setCameraError(
            "❌ Kamera tidak ditemukan. Pastikan kamera terpasang dan tidak digunakan aplikasi lain."
          );
        } else if (name === "NotReadableError") {
          setCameraError(
            "❌ Kamera sedang digunakan aplikasi lain. Tutup aplikasi tersebut dan muat ulang halaman."
          );
        } else if (name === "OverconstrainedError") {
          setCameraError(
            "❌ Kamera tidak mendukung resolusi yang diminta."
          );
        } else {
          setCameraError(
            `❌ Gagal mengakses kamera: ${err.message || "Unknown error"}`
          );
        }
      }
    };

    const timer = setTimeout(enableCamera, 100);

    return () => {
      clearTimeout(timer);
      const s = (videoRef.current?.srcObject as MediaStream) || stream;
      s?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // ============ SPEECH RECOGNITION ============
  const normalizeWord = (word: string): string => {
    return word
      .toLowerCase()
      .replace(/[.,!?;:'"()]/g, "")
      .trim();
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    if (str1 === str2) return 1;
    if (str1.length === 0 || str2.length === 0) return 0;

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

  const initializeSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition tidak didukung. Gunakan Chrome/Edge.");
      alert("⚠️ Browser Anda tidak mendukung Speech Recognition. Gunakan Chrome atau Edge.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "id-ID";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("✅ Speech recognition started");
      setIsRecording(true);
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

      // Process immediately for real-time feedback
      if (currentTranscript) {
        processRecognizedWords(currentTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "no-speech") {
        console.log("No speech detected, continuing...");
      } else if (event.error === "audio-capture") {
        alert("⚠️ Mikrofon tidak terdeteksi. Pastikan mikrofon terpasang dan diizinkan.");
      } else if (event.error === "not-allowed") {
        alert("⚠️ Izin mikrofon ditolak. Izinkan akses mikrofon di pengaturan browser.");
      }
    };

    recognition.onend = () => {
      console.log("Recognition ended, restarting...");
      if (isRecordingRef.current) {
        try {
          setTimeout(() => {
            if (recognitionRef.current && isRecordingRef.current) {
              recognitionRef.current.start();
            }
          }, 100);
        } catch (e) {
          console.error("Recognition restart error:", e);
        }
      }
    };

    return recognition;
  };

  /**
   * MEMPROSES KATA-KATA YANG DIKENALI DENGAN LOGIKA SEQUENTIAL MATCHING KETAT.
   * Hanya kata yang urut yang akan dihitung. DIPERBAIKI untuk akurasi real-time.
   */
  const processRecognizedWords = (transcript: string) => {
    // Clear previous warning
    setSequentialWarning("");

    const normalizedTranscript = normalizeWord(transcript);
    const spokenWordsList = normalizedTranscript.split(" ").filter(Boolean);
    const trainingWordsNormalized = words.map((w) => normalizeWord(w));

    // Find next expected word index
    let lastCompletedIndex = Math.max(
      -1,
      ...Array.from(completedIndicesRef.current)
    );
    let expectedIndex = lastCompletedIndex + 1;

    // Check if already completed
    if (expectedIndex >= trainingWordsNormalized.length) return;

    // Get the expected word
    const expectedWord = trainingWordsNormalized[expectedIndex];
    const originalExpectedWord = words[expectedIndex];

    // Try to match with the LAST spoken word (most recent)
    // This provides better real-time feedback
    if (spokenWordsList.length > 0) {
      const lastSpokenWord = spokenWordsList[spokenWordsList.length - 1];
      const similarity = calculateSimilarity(lastSpokenWord, expectedWord);

      console.log(`🎤 Spoken: "${lastSpokenWord}" | Expected: "${expectedWord}" | Similarity: ${similarity.toFixed(2)}`);

      if (similarity >= SIMILARITY_THRESHOLD) {
        // ✅ MATCH FOUND
        const wordData: WordData = {
          word: originalExpectedWord,
          index: expectedIndex,
          timestamp: Date.now(),
          isCorrect: similarity > 0.8,
        };

        // Update state
        completedIndicesRef.current.add(expectedIndex);
        setCompletedWordIndices(new Set(completedIndicesRef.current));

        if (!spokenWordsRef.current.find((w) => w.index === expectedIndex)) {
          spokenWordsRef.current = [...spokenWordsRef.current, wordData];
          setSpokenWords(spokenWordsRef.current);
        }

        // Highlight current word
        setCurrentHighlightIndex(expectedIndex);
        
        // Reset error counter on success
        consecutiveErrorsRef.current = 0;

        // Positive feedback
        if (similarity > 0.85 && Math.random() > 0.6) {
          triggerAudienceReaction("applause");
        }

        console.log(`✅ Word matched: ${originalExpectedWord}`);
      } else {
        // ❌ WORD DOESN'T MATCH - Show clear warning
        errorCountRef.current += 1;
        consecutiveErrorsRef.current += 1;
        setErrorCount(errorCountRef.current);

        // Show specific warning
        setSequentialWarning(
          `⚠️ Kata tidak sesuai! Ucapkan: "${originalExpectedWord}"`
        );

        console.log(`❌ Mismatch! Expected: "${expectedWord}", Got: "${lastSpokenWord}"`);

        // Trigger negative reactions
        if (consecutiveErrorsRef.current >= 2) {
          triggerAudienceReaction("thumbsDown");
        } else if (Math.random() > 0.5) {
          triggerAudienceReaction("confused");
        }

        // Make audience leave after many errors
        if (errorCountRef.current > 5 && Math.random() > 0.7) {
          makeAudienceLeave();
        }
      }
    }
  };

  const triggerAudienceReaction = (reaction: ReactionType) => {
    const availableAudience = Array.from(
      { length: AUDIENCE_COUNT },
      (_, i) => i
    ).filter((i) => !audienceLeft.has(i));

    if (availableAudience.length === 0) return;

    const randomIndex =
      availableAudience[Math.floor(Math.random() * availableAudience.length)];

    setAudienceReactions((prev) => {
      const newMap = new Map(prev);
      newMap.set(randomIndex, reaction);
      return newMap;
    });

    setTimeout(() => {
      setAudienceReactions((prev) => {
        const newMap = new Map(prev);
        newMap.delete(randomIndex);
        return newMap;
      });
    }, 2000);
  };

  const makeAudienceLeave = () => {
    const availableAudience = Array.from(
      { length: AUDIENCE_COUNT },
      (_, i) => i
    ).filter((i) => !audienceLeft.has(i));

    if (availableAudience.length === 0) return;

    const randomIndex =
      availableAudience[Math.floor(Math.random() * availableAudience.length)];

    setAudienceLeft((prev) => new Set(prev).add(randomIndex));
  };

  const startRecordingLogic = () => {
    const recognition = initializeSpeechRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    isRecordingRef.current = true;
    setIsRecording(true);

    try {
      recognition.start();
    } catch (e) {
      console.log("Recognition start error:", e);
    }
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    setIsRecording(false);
    setSequentialWarning("");

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
  };

  const handleStartPidato = () => {
    setPreparationTimer(PREPARATION_TIME);
    setCurrentPrepStep(0);
    setSpeechState("not-started");
    setTimeout(() => setSpeechState("preparation"), 10);
  };

  const handleCancelPreparation = () => {
    setSpeechState("not-started");
    setPreparationTimer(PREPARATION_TIME);
  };

  const handleFinish = () => {
    stopRecording();
    setSpeechState("finished");
    window.location.href = "/podium-swara/selesai";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const currentStep = PREPARATION_STEPS[currentPrepStep];
  const StepIcon = currentStep.icon;

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  // ============ RENDER ============
  return (
    <div className="bg-white rounded-xl">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="relative bg-[url(/podium/tirai.png)] bg-cover bg-top min-h-screen p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <a
              href="/podium-swara"
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
              <span className="font-semibold text-gray-700">Kembali</span>
            </a>

            <div className="bg-white rounded-2xl px-6 py-3 shadow-lg">
              <p className="text-orange-500 font-bold text-lg">Mode: Pidato</p>
            </div>
          </div>

          {/* Speech Title */}
          <div className="bg-white rounded-2xl px-6 py-3 shadow-lg mb-6 max-w-2xl">
            <p className="text-gray-800 font-bold text-lg">
              {selectedSpeech.title}
            </p>
          </div>

          <div className="flex items-start justify-between">
            {/* Speech Text */}
            <div
              className={`bg-white rounded-3xl p-6 shadow-2xl mb-8 ${
                speechState === "in-progress"
                  ? "max-w-[calc(100%-500px)]"
                  : "max-w-full"
              }`}
            >
              <div className="text-gray-700 text-lg leading-relaxed">
                {words.map((word, index) => (
                  <span
                    key={index}
                    className={`inline-block mx-1 my-0.5 px-2 py-1 rounded-lg transition-all font-medium ${
                      index === currentHighlightIndex
                        ? "bg-green-500 text-white scale-110 shadow-lg"
                        : completedWordIndices.has(index)
                        ? spokenWords.find((w) => w.index === index)?.isCorrect
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                        : "text-gray-400"
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-700">
                    Progress
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    {completedWordIndices.size} / {words.length} kata
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
                    style={{
                      width: `${
                        (completedWordIndices.size / words.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Camera */}
            {speechState === "in-progress" && (
              <div className="flex justify-center ml-4">
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl ring-4 ring-orange-300">
                  {/* Video Element dengan border dan styling lebih baik */}
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-[480px] h-[360px] object-cover bg-gray-900 ${
                      videoStatus !== "ready" ? "hidden" : ""
                    }`}
                    style={{ transform: "scaleX(-1)" }}
                    onLoadedMetadata={() => {
                      console.log("Video metadata loaded");
                      setVideoStatus("ready");
                    }}
                    onError={(e) => {
                      console.error("Video error:", e);
                      setVideoStatus("failed");
                      setCameraError("Video playback error");
                    }}
                  />

                  {/* Fallback/Status UI */}
                  {videoStatus !== "ready" && (
                    <div className="w-[480px] h-[360px] flex flex-col items-center justify-center bg-gray-100 text-gray-700 p-4">
                      {videoStatus === "loading" && (
                        <>
                          <div className="relative">
                            <Volume2 className="w-16 h-16 mb-4 text-orange-500 animate-pulse" />
                            <div className="absolute inset-0 animate-ping">
                              <Volume2 className="w-16 h-16 text-orange-300" />
                            </div>
                          </div>
                          <p className="font-bold text-xl mb-2">
                            Mengaktifkan Kamera...
                          </p>
                          <p className="text-center text-sm text-gray-500 mb-2">
                            Mohon izinkan akses kamera dan mikrofon
                          </p>
                          <div className="flex gap-2 mt-4">
                            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                          </div>
                        </>
                      )}
                      {videoStatus === "failed" && (
                        <>
                          <div className="bg-red-100 p-4 rounded-full mb-4">
                            <Volume2 className="w-12 h-12 text-red-600" />
                          </div>
                          <p className="font-bold text-xl mb-3 text-red-700">
                            Kamera Tidak Aktif
                          </p>
                          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 max-w-sm">
                            <p className="text-sm text-gray-700 mb-3">
                              {cameraError ||
                                "Gagal mengakses kamera. Pastikan:"}
                            </p>
                            <ul className="text-xs text-gray-600 space-y-1 text-left">
                              <li>• Browser mengizinkan akses kamera</li>
                              <li>• Kamera tidak digunakan aplikasi lain</li>
                              <li>• Gunakan Chrome/Edge di HTTPS</li>
                            </ul>
                          </div>
                          <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                          >
                            Muat Ulang Halaman
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {isRecording && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 animate-pulse">
                      <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                      RECORDING
                    </div>
                  )}
                  {recognizedText && (
                    <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm">
                      <p className="font-semibold mb-1">Yang Anda ucapkan:</p>
                      <p className="italic">&ldquo;{recognizedText}&rdquo;</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sequential Warning Bar - Diperbaiki dengan styling yang lebih mencolok */}
          {speechState === "in-progress" && sequentialWarning && (
            <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50">
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-8 rounded-full shadow-2xl animate-bounce">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-white rounded-full animate-ping" />
                  <p className="font-black text-xl">{sequentialWarning}</p>
                  <div className="w-4 h-4 bg-white rounded-full animate-ping" />
                </div>
              </div>
            </div>
          )}

          {/* Audience */}
          {speechState === "in-progress" && (
            <div className="mb-8">
              <div className="grid grid-cols-10 gap-2 max-w-5xl mx-auto">
                {Array.from({ length: AUDIENCE_COUNT }).map((_, i) => (
                  <AudiencePerson
                    key={i}
                    index={i}
                    reaction={audienceReactions.get(i) || null}
                    hasLeft={audienceLeft.has(i)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="flex items-center justify-center gap-4">
              {speechState !== "in-progress" ? (
                <button
                  onClick={handleStartPidato}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all transform hover:scale-105"
                  disabled={speechState === "preparation"}
                >
                  <Mic className="w-5 h-5" />
                  Mulai Pidato
                </button>
              ) : (
                <>
                  <button
                    onClick={() => !timeUp && setIsPaused(!isPaused)}
                    disabled={timeUp}
                    className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all transform hover:scale-105 ${
                      timeUp
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white"
                    }`}
                  >
                    {isPaused ? (
                      <Play className="w-5 h-5" />
                    ) : (
                      <Pause className="w-5 h-5" />
                    )}
                    {isPaused ? "Lanjutkan" : "Jeda"}
                  </button>

                  <div className="bg-gradient-to-br from-orange-50 to-pink-50 border-4 border-orange-300 px-8 py-4 rounded-2xl shadow-xl">
                    <p className="text-xs text-gray-600 mb-1 text-center font-semibold">
                      Waktu Tersisa
                    </p>
                    <p className="text-4xl font-black text-gray-800 tabular-nums">
                      {formatTime(time)}
                    </p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-all"
                        style={{ width: `${(time / 60) * 100}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleFinish}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all transform hover:scale-105"
                  >
                    <Check className="w-5 h-5" />
                    Selesai
                  </button>
                </>
              )}
            </div>

            {/* Stats */}
            {speechState === "in-progress" && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Kata Benar</p>
                  <p className="text-2xl font-black text-green-600">
                    {completedWordIndices.size}
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Kesalahan</p>
                  <p className="text-2xl font-black text-red-600">
                    {errorCount}
                  </p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Audiens Keluar</p>
                  <p className="text-2xl font-black text-orange-600">
                    {audienceLeft.size}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {/* 1. START PIDATO MODAL */}
      {mounted &&
        speechState === "not-started" &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full mx-8 animate-fadeIn">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Mic className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-4xl font-black text-gray-900 mb-3">
                  Siap untuk Pidato?
                </h3>
                <p className="text-gray-600 text-lg mb-8">
                  Anda akan mendapatkan waktu{" "}
                  <strong className="text-orange-600">
                    {PREPARATION_TIME} detik
                  </strong>{" "}
                  untuk relaksasi dan bersiap-siap sebelum pidato dimulai
                  otomatis.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border-2 border-green-200">
                <p className="text-base text-green-900 font-bold mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" /> Tips Pidato:
                </p>
                <ul className="text-sm text-green-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>
                      Pastikan mikrofon Anda berfungsi (izinkan akses
                      kamera/mikrofon).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>
                      Berbicara dengan kecepatan yang stabil, tidak terlalu
                      cepat.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>
                      Jaga kontak mata (lihat kamera) untuk interaksi audiens
                      yang lebih baik.
                    </span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleStartPidato}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Play className="w-6 h-6" />
                Mulai Persiapan
              </button>
            </div>
          </div>,
          document.body
        )}

      {/* 2. PREPARATION PHASE MODAL */}
      {mounted &&
        speechState === "preparation" &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="relative w-full max-w-4xl">
              <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-12 animate-fadeIn">
                <div className="text-center">
                  {/* Large Countdown Circle */}
                  <div className="relative w-64 h-64 mx-auto mb-12">
                    <svg className="w-64 h-64 transform -rotate-90">
                      <circle
                        cx="128"
                        cy="128"
                        r="110"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="128"
                        cy="128"
                        r="110"
                        stroke="white"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 110}`}
                        strokeDashoffset={`${
                          2 *
                          Math.PI *
                          110 *
                          (1 - preparationTimer / PREPARATION_TIME)
                        }`}
                        className="transition-all duration-1000 ease-linear"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-9xl font-black text-white mb-3 animate-pulse">
                          {preparationTimer}
                        </div>
                        <div className="text-2xl text-white/90 font-bold">
                          detik
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Relaxation Card */}
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border-2 border-white/30 max-w-3xl mx-auto">
                    <div className="flex items-center justify-center mb-6">
                      <div className="bg-white/20 p-6 rounded-3xl">
                        <StepIcon className="w-16 h-16 text-white" />
                      </div>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-4">
                      {currentStep.text}
                    </h3>
                    <p className="text-xl text-white/90">
                      {currentStep.subtext}
                    </p>
                  </div>

                  {/* Bottom Info */}
                  <div className="mt-12 space-y-4">
                    <p className="text-white/90 text-lg font-semibold">
                      💡 Bersiaplah untuk Pidato: Topik Anda adalah "
                      {selectedSpeech.title}"
                    </p>
                    <p className="text-white/70 text-base">
                      Pidato akan dimulai otomatis setelah hitungan mundur
                      selesai.
                    </p>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={handleCancelPreparation}
                    className="mt-10 px-10 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-lg transition-all border-2 border-white/30"
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* 3. TIME UP MODAL */}
      {mounted &&
        timeUp &&
        createPortal(
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="relative bg-white max-w-lg w-full rounded-3xl shadow-2xl p-10 text-center animate-fadeIn">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-xl">
                <AlarmClock className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3">
                Waktu Habis!
              </h3>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Sesi pidato dihentikan otomatis karena mencapai batas{" "}
                <strong className="text-orange-600">60 detik</strong>.
              </p>

              <div className="bg-blue-50 rounded-2xl p-4 mb-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Kata Benar</p>
                    <p className="text-2xl font-black text-green-600">
                      {completedWordIndices.size}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kesalahan</p>
                    <p className="text-2xl font-black text-red-600">
                      {errorCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Progress</p>
                    <p className="text-2xl font-black text-blue-600">
                      {Math.round(
                        (completedWordIndices.size / words.length) * 100
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={handleFinish}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl transition-all transform hover:scale-105"
                >
                  Akhiri & Lihat Hasil
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  Ulangi dari Awal
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      <style>{`
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