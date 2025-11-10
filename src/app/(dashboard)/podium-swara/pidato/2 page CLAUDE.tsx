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
} from "lucide-react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

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
      <div className="w-[88px] h-[88px] flex items-center justify-center opacity-20">
        <div className="text-gray-400 text-xs">Keluar</div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      {getReactionIcon()}
      <img
        src={`/podium/people ${(index % 5) + 1}.png`}
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
  const router = useRouter();

  // Select random speech on mount
  const [selectedSpeech] = useState<SpeechData>(
    () => SPEECH_DATA[Math.floor(Math.random() * SPEECH_DATA.length)]
  );

  const words = useMemo(() => selectedSpeech.content.split(" "), [selectedSpeech]);

  // State
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(60);
  const [timeUp, setTimeUp] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");

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

  const AUDIENCE_COUNT = 30; // 5 columns x 6 rows

  useEffect(() => setMounted(true), []);

  // Timer
  useEffect(() => {
    if (!isPaused && time > 0 && isRecording) {
      const timer = setInterval(() => setTime((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isPaused, time, isRecording]);

  // Time up handler
  useEffect(() => {
    if (time === 0 && !timeUp) {
      setIsPaused(true);
      setTimeUp(true);
      stopRecording();
    }
  }, [time, timeUp]);

  // Camera setup
  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Tidak dapat mengakses kamera:", err);
      }
    };
    enableCamera();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((tr) => tr.stop());
    };
  }, []);

  // ============ SPEECH RECOGNITION ============
  const normalizeWord = (word: string): string => {
    return word.toLowerCase().replace(/[.,!?;:'"()]/g, "").trim();
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

  const initializeSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

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

      if (currentTranscript && currentTranscript !== lastProcessedTranscriptRef.current) {
        processRecognizedWords(currentTranscript);
        if (finalTranscript) {
          lastProcessedTranscriptRef.current = currentTranscript;
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      if (isRecordingRef.current) {
        try {
          setTimeout(() => {
            if (recognitionRef.current && isRecordingRef.current) {
              recognitionRef.current.start();
            }
          }, 100);
        } catch (e) {}
      }
    };

    return recognition;
  };

  const processRecognizedWords = (transcript: string) => {
    const normalizedTranscript = normalizeWord(transcript);
    const spokenWordsList = normalizedTranscript.split(" ").filter(Boolean);
    const trainingWordsNormalized = words.map((w) => normalizeWord(w));

    let furthestMatchIndex = Math.max(-1, ...Array.from(completedIndicesRef.current));
    let foundMatch = false;

    // Sequential matching
    for (const spokenWord of spokenWordsList) {
      for (let i = furthestMatchIndex + 1; i < trainingWordsNormalized.length; i++) {
        if (completedIndicesRef.current.has(i)) continue;

        const targetWord = trainingWordsNormalized[i];
        const similarity = calculateSimilarity(spokenWord, targetWord);

        if (similarity > 0.65) {
          const wordData: WordData = {
            word: words[i],
            index: i,
            timestamp: Date.now(),
            isCorrect: similarity > 0.8,
          };

          completedIndicesRef.current.add(i);
          setCompletedWordIndices(new Set(completedIndicesRef.current));

          if (!spokenWordsRef.current.find((w) => w.index === i)) {
            spokenWordsRef.current = [...spokenWordsRef.current, wordData];
            setSpokenWords(spokenWordsRef.current);
          }

          setCurrentHighlightIndex(i);
          furthestMatchIndex = i;
          foundMatch = true;

          // Trigger positive reaction
          if (similarity > 0.85 && Math.random() > 0.7) {
            triggerAudienceReaction("applause");
            consecutiveErrorsRef.current = 0;
          }

          break;
        }
      }
    }

    // Detect errors (wrong words)
    if (!foundMatch && spokenWordsList.length > 0) {
      errorCountRef.current += 1;
      consecutiveErrorsRef.current += 1;
      setErrorCount(errorCountRef.current);

      // Trigger negative reactions on errors
      if (consecutiveErrorsRef.current >= 2) {
        triggerAudienceReaction("thumbsDown");
      } else if (Math.random() > 0.5) {
        triggerAudienceReaction("confused");
      }

      // Make some audience leave after many errors
      if (errorCountRef.current > 5 && Math.random() > 0.7) {
        makeAudienceLeave();
      }
    }
  };

  const triggerAudienceReaction = (reaction: ReactionType) => {
    const availableAudience = Array.from({ length: AUDIENCE_COUNT }, (_, i) => i).filter(
      (i) => !audienceLeft.has(i)
    );

    if (availableAudience.length === 0) return;

    const randomIndex = availableAudience[Math.floor(Math.random() * availableAudience.length)];

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
    const availableAudience = Array.from({ length: AUDIENCE_COUNT }, (_, i) => i).filter(
      (i) => !audienceLeft.has(i)
    );

    if (availableAudience.length === 0) return;

    const randomIndex = availableAudience[Math.floor(Math.random() * availableAudience.length)];

    setAudienceLeft((prev) => new Set(prev).add(randomIndex));
  };

  const startRecording = () => {
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

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
  };

  const handleFinish = () => {
    stopRecording();
    router.push("/podium-swara/selesai");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="relative bg-[url(/podium/tirai.png)] bg-cover bg-top min-h-screen p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <Link
                href="/podium-swara"
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
                <span className="font-semibold text-gray-700">Kembali</span>
              </Link>

              <div className="bg-white rounded-2xl px-6 py-3 shadow-lg">
                <p className="text-orange-500 font-bold text-lg">Mode: Pidato</p>
              </div>
            </div>

            {/* Speech Title */}
            <div className="bg-white rounded-2xl px-6 py-3 shadow-lg mb-6 max-w-2xl">
              <p className="text-gray-800 font-bold text-lg">{selectedSpeech.title}</p>
            </div>

            {/* Speech Text */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl mb-8 max-w-4xl">
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
                  <span className="text-sm font-bold text-gray-700">Progress</span>
                  <span className="text-sm font-bold text-green-600">
                    {completedWordIndices.size} / {words.length} kata
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
                    style={{ width: `${(completedWordIndices.size / words.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Camera */}
            <div className="flex justify-center mb-8">
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl ring-4 ring-orange-300">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-[480px] h-[360px] object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
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

            {/* Audience */}
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

            {/* Controls */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex items-center justify-center gap-4">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all transform hover:scale-105"
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
                      {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                      {isPaused ? "Resume" : "Pause"}
                    </button>

                    <div className="bg-gradient-to-br from-orange-50 to-pink-50 border-4 border-orange-300 px-8 py-4 rounded-2xl shadow-xl">
                      <p className="text-xs text-gray-600 mb-1 text-center font-semibold">Waktu</p>
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
              {isRecording && (
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Kata Benar</p>
                    <p className="text-2xl font-black text-green-600">{completedWordIndices.size}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Kesalahan</p>
                    <p className="text-2xl font-black text-red-600">{errorCount}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Audiens Keluar</p>
                    <p className="text-2xl font-black text-orange-600">{audienceLeft.size}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TIME UP MODAL */}
      {mounted &&
        timeUp &&
        createPortal(
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="relative bg-white max-w-lg w-full rounded-3xl shadow-2xl p-10 text-center animate-fadeIn">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-xl">
                <AlarmClock className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3">Waktu Habis!</h3>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Sesi pidato dihentikan otomatis karena mencapai batas{" "}
                <strong className="text-orange-600">60 detik</strong>.
              </p>

              <div className="bg-blue-50 rounded-2xl p-4 mb-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Kata Benar</p>
                    <p className="text-2xl font-black text-green-600">{completedWordIndices.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kesalahan</p>
                    <p className="text-2xl font-black text-red-600">{errorCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Progress</p>
                    <p className="text-2xl font-black text-blue-600">
                      {Math.round((completedWordIndices.size / words.length) * 100)}%
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