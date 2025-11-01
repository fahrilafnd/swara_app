"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Trophy,
  ArrowRight,
  Home,
  Volume2,
  Award,
  Clock,
  Target,
  Zap,
  TrendingUp,
  Activity,
  BarChart3,
  Play,
} from "lucide-react";

interface WordData {
  word: string;
  timestamp: number;
  duration: number;
}

interface AudioData {
  timestamp: number;
  pitch: number;
  volume: number;
}

interface SessionResult {
  avgTempo: number;
  targetTempo: number;
  tempoScore: number;
  pitchVariation: number;
  volumeConsistency: number;
  clarityScore: number;
  overallScore: number;
  isSuccess: boolean;
  duration: number;
  attempts: number;
  wordsSpoken: number;
}

export default function Tempo() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [spokenWords, setSpokenWords] = useState<WordData[]>([]);
  const [audioData, setAudioData] = useState<AudioData[]>([]);
  const [currentPitch, setCurrentPitch] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(0);
  const [currentTempo, setCurrentTempo] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(
    null
  );
  const [attempts, setAttempts] = useState(0);
  const [timer, setTimer] = useState(0);
  const [feedback, setFeedback] = useState(
    "Klik 'Mulai Latihan' untuk memulai"
  );
  const [recognizedText, setRecognizedText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const lastWordTimeRef = useRef<number>(0);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRecordingRef = useRef(false);
  const audioDataRef = useRef<AudioData[]>([]);
  const spokenWordsRef = useRef<WordData[]>([]);

  // Training text
  const trainingText =
    "Berbicara dengan tempo yang lambat dan jelas akan membantu audiens memahami pesan Anda dengan lebih baik";
  const words = trainingText.split(" ");

  const TARGET_WPM = 90;
  const MIN_WPM = 70;
  const MAX_WPM = 110;
  const SILENCE_THRESHOLD = 3000;
  const MIN_AUDIO_DATA = 10; // Minimum data points needed

  // Initialize Speech Recognition
  const initializeSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech Recognition tidak didukung di browser ini. Gunakan Chrome/Edge terbaru."
      );
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "id-ID";
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      console.log("Speech recognition started");
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

      if (finalTranscript) {
        processRecognizedWords(finalTranscript.trim());
      }

      // Reset silence timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      silenceTimeoutRef.current = setTimeout(() => {
        if (
          isRecordingRef.current &&
          spokenWordsRef.current.length >= words.length * 0.8
        ) {
          console.log("Auto-stopping due to completion");
          stopRecording();
        }
      }, SILENCE_THRESHOLD);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "no-speech") {
        setFeedback("Tidak ada suara terdeteksi. Mulai berbicara...");
      } else if (event.error === "aborted") {
        console.log("Recognition aborted");
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

  // Process recognized words
  const processRecognizedWords = (transcript: string) => {
    const spokenWordsList = transcript
      .toLowerCase()
      .replace(/[.,!?]/g, "")
      .split(" ")
      .filter(Boolean);
    const trainingWords = words.map((w) =>
      w.toLowerCase().replace(/[.,!?]/g, "")
    );

    let matchIndex = currentWordIndex;

    for (const spokenWord of spokenWordsList) {
      for (let i = matchIndex + 1; i < trainingWords.length; i++) {
        const similarity = calculateSimilarity(spokenWord, trainingWords[i]);

        if (similarity > 0.7) {
          const now = Date.now();
          const duration = lastWordTimeRef.current
            ? now - lastWordTimeRef.current
            : 0;

          const wordData: WordData = {
            word: words[i],
            timestamp: now - startTimeRef.current,
            duration,
          };

          spokenWordsRef.current = [...spokenWordsRef.current, wordData];
          setSpokenWords(spokenWordsRef.current);
          setCurrentWordIndex(i);
          matchIndex = i;
          lastWordTimeRef.current = now;

          calculateTempo(spokenWordsRef.current);
          break;
        }
      }
    }
  };

  // Better similarity calculation
  const calculateSimilarity = (str1: string, str2: string): number => {
    if (str1 === str2) return 1;
    if (str1.includes(str2) || str2.includes(str1)) return 0.9;

    const distance = levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - distance / maxLength;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

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

  // Calculate tempo
  const calculateTempo = (wordsData: WordData[]) => {
    if (wordsData.length < 2) return;

    const totalTime = (Date.now() - startTimeRef.current) / 1000 / 60;
    const wpm = Math.round(wordsData.length / totalTime);
    setCurrentTempo(wpm);

    if (wpm > MAX_WPM) {
      setFeedback("⚠️ Terlalu cepat! Perlambat tempo bicara Anda.");
    } else if (wpm < MIN_WPM && wpm > 0) {
      setFeedback("⏱️ Terlalu lambat. Sedikit percepat tempo.");
    } else if (wpm >= MIN_WPM && wpm <= MAX_WPM) {
      setFeedback("✅ Sempurna! Tempo sudah tepat. Pertahankan!");
    }
  };

  // Start recording
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

      // Audio context
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current =
        audioContextRef.current.createMediaStreamSource(stream);

      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 4096; // Increased for better pitch detection
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

      setIsRecording(true);
      setCurrentWordIndex(-1);
      setSpokenWords([]);
      setAudioData([]);
      setTimer(0);
      setRecognizedText("");
      setCurrentPitch(0);
      setCurrentVolume(0);
      setCurrentTempo(0);
      setAttempts((prev) => prev + 1);
      startTimeRef.current = Date.now();
      lastWordTimeRef.current = Date.now();

      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);

      // Start speech recognition
      try {
        recognition.start();
      } catch (e) {
        console.log("Recognition start error:", e);
      }

      // Start audio analysis
      analyzeAudio();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert(
        "Tidak dapat mengakses mikrofon. Pastikan izin mikrofon telah diberikan."
      );
    }
  };

  // Improved audio analysis with better pitch detection
  const analyzeAudio = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const timeDomainArray = new Float32Array(bufferLength);

    const analyze = () => {
      if (!analyserRef.current || !isRecordingRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      analyserRef.current.getFloatTimeDomainData(timeDomainArray);

      // Calculate volume (RMS)
      let sum = 0;
      for (let i = 0; i < timeDomainArray.length; i++) {
        sum += timeDomainArray[i] * timeDomainArray[i];
      }
      const rms = Math.sqrt(sum / timeDomainArray.length);
      const volume = Math.min(100, Math.max(0, rms * 1000));

      // Improved pitch detection using autocorrelation
      const pitch = detectPitch(
        timeDomainArray,
        audioContextRef.current!.sampleRate
      );

      setCurrentPitch(Math.round(pitch));
      setCurrentVolume(Math.round(volume));

      // Record data only if there's sound
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

  // Autocorrelation for better pitch detection
  const detectPitch = (buffer: Float32Array, sampleRate: number): number => {
    const SIZE = buffer.length;
    const MAX_SAMPLES = Math.floor(SIZE / 2);
    let best_offset = -1;
    let best_correlation = 0;
    let rms = 0;

    // Calculate RMS
    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);

    // Not enough signal
    if (rms < 0.01) return 0;

    // Autocorrelation
    let lastCorrelation = 1;
    for (let offset = 1; offset < MAX_SAMPLES; offset++) {
      let correlation = 0;

      for (let i = 0; i < MAX_SAMPLES; i++) {
        correlation += Math.abs(buffer[i] - buffer[i + offset]);
      }

      correlation = 1 - correlation / MAX_SAMPLES;

      if (correlation > 0.9 && correlation > lastCorrelation) {
        const foundGoodCorrelation = correlation > best_correlation;
        if (foundGoodCorrelation) {
          best_correlation = correlation;
          best_offset = offset;
        }
      }

      lastCorrelation = correlation;
    }

    if (best_offset === -1) return 0;

    const fundamentalFreq = sampleRate / best_offset;

    // Normalize to 0-100 scale for visualization
    // Human voice typically: 85-255 Hz (male) and 165-255 Hz (female)
    const normalizedPitch = Math.min(100, ((fundamentalFreq - 80) / 200) * 100);

    return Math.max(0, normalizedPitch);
  };

  // Stop camera helper
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  // Stop recording
  const stopRecording = () => {
    console.log("Stopping recording...");
    console.log("Audio data length:", audioDataRef.current.length);
    console.log("Spoken words length:", spokenWordsRef.current.length);

    isRecordingRef.current = false;

    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log("Recognition stop error:", e);
      }
      recognitionRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
    }

    stopCamera();

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setIsRecording(false);
    setIsListening(false);

    // Calculate results with delay to ensure data is captured
    setTimeout(() => {
      calculateResults();
    }, 500);
  };

  // Calculate results
  const calculateResults = () => {
    console.log("Calculating results...");
    console.log("Final audio data:", audioDataRef.current.length);
    console.log("Final spoken words:", spokenWordsRef.current.length);

    // Check minimum requirements
    if (spokenWordsRef.current.length === 0) {
      alert(
        "Tidak ada kata yang terdeteksi. Pastikan Anda berbicara dengan jelas dan coba lagi!"
      );
      resetSession();
      return;
    }

    if (audioDataRef.current.length < MIN_AUDIO_DATA) {
      alert(
        `Data audio tidak cukup (${audioDataRef.current.length} dari min ${MIN_AUDIO_DATA}). Coba berbicara lebih lama dan dengan volume yang cukup!`
      );
      resetSession();
      return;
    }

    // Calculate metrics
    const totalMinutes = timer / 60;
    const avgTempo = Math.round(spokenWordsRef.current.length / totalMinutes);

    const tempoDeviation = Math.abs(avgTempo - TARGET_WPM);
    const tempoScore = Math.max(0, 100 - tempoDeviation * 2);

    const pitches = audioDataRef.current
      .map((d) => d.pitch)
      .filter((p) => p > 0);
    const avgPitch =
      pitches.length > 0
        ? pitches.reduce((a, b) => a + b, 0) / pitches.length
        : 0;
    const pitchVariance =
      pitches.length > 0
        ? pitches.reduce((sum, p) => sum + Math.pow(p - avgPitch, 2), 0) /
          pitches.length
        : 0;
    const pitchVariation = Math.min(100, Math.sqrt(pitchVariance));

    const volumes = audioDataRef.current
      .map((d) => d.volume)
      .filter((v) => v > 0);
    const avgVolume =
      volumes.length > 0
        ? volumes.reduce((a, b) => a + b, 0) / volumes.length
        : 0;
    const volumeVariance =
      volumes.length > 0
        ? volumes.reduce((sum, v) => sum + Math.pow(v - avgVolume, 2), 0) /
          volumes.length
        : 0;
    const volumeConsistency = Math.max(0, 100 - Math.sqrt(volumeVariance));

    const clarityScore = Math.round(
      (spokenWordsRef.current.length / words.length) * 100
    );

    const overallScore = Math.round(
      tempoScore * 0.4 + volumeConsistency * 0.2 + clarityScore * 0.4
    );

    const isSuccess =
      overallScore >= 75 && tempoScore >= 70 && clarityScore >= 60;

    const result: SessionResult = {
      avgTempo,
      targetTempo: TARGET_WPM,
      tempoScore: Math.round(tempoScore),
      pitchVariation: Math.round(pitchVariation),
      volumeConsistency: Math.round(volumeConsistency),
      clarityScore,
      overallScore,
      isSuccess,
      duration: timer,
      attempts,
      wordsSpoken: spokenWordsRef.current.length,
    };

    setSessionResult(result);
    setShowResult(true);

    console.log("Session Result:", result);
  };

  // Reset session
  const resetSession = () => {
    isRecordingRef.current = false;
    audioDataRef.current = [];
    spokenWordsRef.current = [];

    setShowResult(false);
    setSessionResult(null);
    setAudioData([]);
    setCurrentWordIndex(-1);
    setSpokenWords([]);
    setRecognizedText("");
    setTimer(0);
    setCurrentPitch(0);
    setCurrentVolume(0);
    setCurrentTempo(0);
    setFeedback("Klik 'Mulai Latihan' untuk memulai");
  };

  // Complete level
  const completeLevel = () => {
    alert("Level 1 Selesai! +10 Poin. Menuju Level 2...");
    window.history.back();
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  // Visualize pitch bars
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
    if (tempo >= MIN_WPM && tempo <= MAX_WPM) return "text-green-600";
    if (tempo > MAX_WPM) return "text-red-600";
    if (tempo > 0) return "text-yellow-600";
    return "text-gray-600";
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "from-green-500 to-emerald-600";
    if (score >= 70) return "from-yellow-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:shadow-lg transition-all"
            >
              <Home className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                Level 1: Tempo Lambat
              </h1>
              <p className="text-gray-600 font-medium">
                Latihan Dasar Tempo - Auto Speech Recognition
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-2xl px-6 py-3 shadow-lg">
              <p className="text-sm text-gray-600 mb-1">Percobaan</p>
              <p className="text-2xl font-black text-green-600">{attempts}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Text Display */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Volume2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Teks Latihan</h2>
                      <p className="text-green-100 text-sm">
                        {isListening
                          ? "🎤 Mendengarkan..."
                          : "Ucapkan dengan tempo lambat"}
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
              </div>

              {/* Text Content */}
              <div className="p-8">
                <div className="bg-gray-50 rounded-3xl p-8 min-h-[200px] flex items-center justify-center">
                  <div className="text-2xl leading-relaxed text-center">
                    {words.map((word, index) => (
                      <span
                        key={index}
                        className={`inline-block mx-2 my-1 px-3 py-2 rounded-xl transition-all font-semibold ${
                          index === currentWordIndex
                            ? "bg-green-500 text-white scale-110 shadow-lg animate-pulse"
                            : index < currentWordIndex
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
                      Progress
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {spokenWords.length} / {words.length} kata
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-indigo-600 transition-all duration-300"
                      style={{
                        width: `${(spokenWords.length / words.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Visualization */}
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Visualisasi Audio Real-time
              </h3>

              {/* Pitch Bars */}
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

              {/* Volume Bar */}
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

              {/* Tempo Display */}
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
                    Target: {MIN_WPM}-{MAX_WPM} WPM (Words Per Minute)
                  </p>
                </div>
              </div>

              {/* Debug Info */}
              {isRecording && (
                <div className="mt-4 bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-600">
                    Data Audio: {audioData.length} points | Kata:{" "}
                    {spokenWords.length}/{words.length}
                  </p>
                </div>
              )}
            </div>

            {/* Feedback Banner */}
            {isRecording && (
              <div className="bg-gradient-to-r from-green-500 to-indigo-600 rounded-3xl p-6 text-white shadow-2xl animate-fadeIn">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6" />
                  <p className="font-bold text-lg">{feedback}</p>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Mulai Latihan (Otomatis)
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
                  ? "Sistem akan otomatis mendeteksi kata yang Anda ucapkan"
                  : "Pastikan mikrofon berfungsi dan lingkungan tenang"}
              </p>
            </div>
          </div>

          {/* Info Panel - Same as before */}
          <div className="space-y-6">
            {/* Target Info */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Target</h3>
                  <p className="text-gray-600 text-sm">Level 1</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Target Tempo</span>
                  <span className="font-bold text-gray-900">
                    {MIN_WPM}-{MAX_WPM} WPM
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Jumlah Kata</span>
                  <span className="font-bold text-green-600">
                    {words.length} kata
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Min. Kejelasan</span>
                  <span className="font-bold text-orange-600">60%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Poin Reward</span>
                  <span className="font-bold text-green-600">+10</span>
                </div>
              </div>
            </div>

            {/* Current Stats */}
            {isRecording && (
              <div className="bg-white rounded-3xl shadow-lg p-6 animate-fadeIn">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Statistik Real-time
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Pitch</span>
                      <span className="font-bold text-green-600">
                        {currentPitch}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-indigo-600 transition-all"
                        style={{ width: `${currentPitch}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Volume</span>
                      <span className="font-bold text-blue-600">
                        {currentVolume}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                        style={{ width: `${currentVolume}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Tempo</span>
                      <span
                        className={`font-bold ${getTempoColor(currentTempo)}`}
                      >
                        {currentTempo || 0} WPM
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r transition-all ${
                          currentTempo >= MIN_WPM && currentTempo <= MAX_WPM
                            ? "from-green-500 to-emerald-600"
                            : "from-red-500 to-pink-600"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            (currentTempo / MAX_WPM) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Kata Terdeteksi
                      </span>
                      <span className="font-bold text-green-600">
                        {spokenWords.length}/{words.length}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all"
                        style={{
                          width: `${
                            (spokenWords.length / words.length) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-6">
              <div className="flex gap-3">
                <Clock className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-green-900 mb-2 text-lg">
                    Cara Latihan:
                  </h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">1.</span>
                      <span>Klik "Mulai Latihan"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">2.</span>
                      <span>Ucapkan teks dengan tempo lambat</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">3.</span>
                      <span>Sistem otomatis mendeteksi kata Anda</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">4.</span>
                      <span>Lihat highlight otomatis mengikuti suara</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">5.</span>
                      <span>Klik Stop untuk melihat hasil</span>
                    </li>
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
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Ucapkan dengan jelas dan tidak terburu-buru</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Pastikan lingkungan tenang</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Jaga jarak mikrofon 15-20cm dari mulut</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Ikuti tempo target (70-110 WPM)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal - Same as before but with updated clarity threshold */}
      {showResult && sessionResult && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div
              className={`bg-gradient-to-r ${
                sessionResult.isSuccess
                  ? "from-green-500 to-emerald-600"
                  : "from-green-500 to-indigo-600"
              } p-8 text-center text-white rounded-t-3xl`}
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                {sessionResult.isSuccess ? (
                  <Award className="w-12 h-12" />
                ) : (
                  <Clock className="w-12 h-12" />
                )}
              </div>
              <h2 className="text-3xl font-black mb-2">
                {sessionResult.isSuccess ? "Berhasil! 🎉" : "Coba Lagi! 💪"}
              </h2>
              <p className="text-white/90 text-lg">
                {sessionResult.isSuccess
                  ? "Tempo bicara Anda sudah sangat baik!"
                  : "Terus berlatih untuk hasil yang lebih baik"}
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-green-50 rounded-2xl p-4 text-center">
                  <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Avg Tempo</p>
                  <p className="text-2xl font-black text-green-600">
                    {sessionResult.avgTempo} WPM
                  </p>
                </div>
                <div className="bg-green-50 rounded-2xl p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Kejelasan</p>
                  <p className="text-2xl font-black text-green-600">
                    {sessionResult.clarityScore}%
                  </p>
                </div>
                <div className="bg-orange-50 rounded-2xl p-4 text-center">
                  <Trophy className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Skor Total</p>
                  <p className="text-2xl font-black text-orange-600">
                    {sessionResult.overallScore}%
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">
                      Tempo Score
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {sessionResult.tempoScore}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getScoreColor(
                        sessionResult.tempoScore
                      )} transition-all`}
                      style={{ width: `${sessionResult.tempoScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Target: {sessionResult.targetTempo} WPM | Actual:{" "}
                    {sessionResult.avgTempo} WPM
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">
                      Clarity Score
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {sessionResult.clarityScore}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getScoreColor(
                        sessionResult.clarityScore
                      )} transition-all`}
                      style={{ width: `${sessionResult.clarityScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {sessionResult.wordsSpoken} dari {words.length} kata
                    terdeteksi
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">
                      Volume Consistency
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {sessionResult.volumeConsistency}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getScoreColor(
                        sessionResult.volumeConsistency
                      )} transition-all`}
                      style={{ width: `${sessionResult.volumeConsistency}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">
                      Pitch Variation
                    </span>
                    <span className="text-sm font-bold text-indigo-600">
                      {sessionResult.pitchVariation}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-green-600 transition-all"
                      style={{ width: `${sessionResult.pitchVariation}%` }}
                    />
                  </div>
                </div>
              </div>

              <div
                className={`rounded-2xl p-6 mb-8 ${
                  sessionResult.isSuccess
                    ? "bg-green-50 border-2 border-green-200"
                    : "bg-green-50 border-2 border-green-200"
                }`}
              >
                <h4
                  className={`font-bold mb-2 flex items-center gap-2 ${
                    sessionResult.isSuccess
                      ? "text-green-900"
                      : "text-green-900"
                  }`}
                >
                  {sessionResult.isSuccess ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  Feedback AI Detection
                </h4>
                <p
                  className={`leading-relaxed ${
                    sessionResult.isSuccess
                      ? "text-green-800"
                      : "text-green-800"
                  }`}
                >
                  {sessionResult.isSuccess
                    ? "Luar biasa! Sistem AI mendeteksi tempo bicara Anda sudah sangat baik dan konsisten. Kejelasan ucapan juga excellent. Anda berhasil berbicara dengan tempo lambat yang jelas dan mudah dipahami. Siap melanjutkan ke level berikutnya!"
                    : sessionResult.clarityScore < 60
                    ? "Sistem kesulitan mendeteksi beberapa kata. Cobalah berbicara lebih jelas dengan artikulasi yang lebih baik. Pastikan lingkungan tenang dan mikrofon berfungsi dengan baik."
                    : sessionResult.tempoScore < 70
                    ? "Tempo Anda masih terlalu cepat atau tidak konsisten. Fokuslah pada pengucapan yang lebih lambat dan jangan terburu-buru. Perhatikan target WPM saat latihan."
                    : "Bagus! Hampir mencapai target. Tingkatkan konsistensi tempo dan kejelasan ucapan untuk hasil yang lebih sempurna!"}
                </p>
              </div>

              <div className="mb-8">
                <h4 className="font-bold text-gray-900 mb-4">
                  Detail Statistik:
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                    <span className="text-gray-600">Total Percobaan</span>
                    <span className="font-bold text-gray-900">
                      {sessionResult.attempts}x
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                    <span className="text-gray-600">Durasi Total</span>
                    <span className="font-bold text-gray-900">
                      {sessionResult.duration}s
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                    <span className="text-gray-600">Data Points</span>
                    <span className="font-bold text-gray-900">
                      {audioData.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                    <span className="text-gray-600">Kata Terdeteksi</span>
                    <span className="font-bold text-gray-900">
                      {sessionResult.wordsSpoken} / {words.length}
                    </span>
                  </div>
                  {sessionResult.isSuccess && (
                    <div className="flex items-center justify-between bg-green-50 rounded-2xl p-4">
                      <span className="text-gray-600">Poin Didapat</span>
                      <span className="font-bold text-green-600">+10</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={resetSession}
                  className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Ulangi Latihan
                </button>
                {sessionResult.isSuccess && (
                  <button
                    onClick={completeLevel}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Selesai & Lanjut
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
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
