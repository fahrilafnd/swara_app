"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Pause, Play, Check, Image as ImageIcon, X } from "lucide-react";
import Link from "next/link";

// Import MediaPipe dengan cara yang benar
declare global {
  interface Window {
    SelfieSegmentation: any;
  }
}

type CameraFeedProps = {
  className?: string;
  mirrored?: boolean;
  constraints?: MediaStreamConstraints;
  label?: string;
  enableVirtualBackground?: boolean;
};

function CameraFeed({
  className = "",
  mirrored = true,
  label,
  constraints,
  enableVirtualBackground = false,
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string>("none");
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const selfieSegmentationRef = useRef<any>(null);
  const animationFrameRef = useRef<number>();
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);

  const backgrounds = [
    { id: "none", name: "Tanpa Background", image: null, color: null },
    { id: "blur", name: "Blur Background", image: null, color: null },
    {
      id: "office1",
      name: "Office Modern",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      color: null,
    },
    {
      id: "office2",
      name: "Meeting Room",
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
      color: null,
    },
    {
      id: "library",
      name: "Library Professional",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
      color: null,
    },
    { id: "minimal", name: "Minimal White", image: null, color: "#f5f5f5" },
    { id: "blue", name: "Professional Blue", image: null, color: "#1e40af" },
    {
      id: "gradient1",
      name: "Gradient Purple",
      image: null,
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
  ];

  const stableConstraints = useMemo<MediaStreamConstraints>(
    () =>
      constraints ?? {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      },
    [constraints]
  );

  // Load MediaPipe scripts dynamically
  useEffect(() => {
    if (!enableVirtualBackground) return;

    const loadMediaPipe = async () => {
      try {
        // Load MediaPipe scripts
        const scripts = [
          "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
          "https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js",
          "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
          "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js",
        ];

        for (const src of scripts) {
          const existingScript = document.querySelector(`script[src="${src}"]`);
          if (!existingScript) {
            await new Promise((resolve, reject) => {
              const script = document.createElement("script");
              script.src = src;
              script.crossOrigin = "anonymous";
              script.onload = resolve;
              script.onerror = reject;
              document.head.appendChild(script);
            });
          }
        }

        // Wait for SelfieSegmentation to be available
        await new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            if (window.SelfieSegmentation) {
              clearInterval(checkInterval);
              resolve(true);
            }
          }, 100);
        });

        // Initialize SelfieSegmentation
        const selfieSegmentation = new window.SelfieSegmentation({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
          },
        });

        selfieSegmentation.setOptions({
          modelSelection: 1,
          selfieMode: true,
        });

        selfieSegmentation.onResults(onResults);
        selfieSegmentationRef.current = selfieSegmentation;
        setIsModelLoaded(true);
      } catch (err) {
        console.error("Failed to load MediaPipe:", err);
        setError("Gagal memuat model AI. Coba refresh halaman.");
      }
    };

    loadMediaPipe();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enableVirtualBackground]);

  // Load background image when selected
  useEffect(() => {
    const bg = backgrounds.find((b) => b.id === selectedBackground);
    if (bg?.image) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = bg.image;
      img.onload = () => {
        backgroundImageRef.current = img;
      };
      img.onerror = () => {
        console.error("Failed to load background image");
        backgroundImageRef.current = null;
      };
    } else {
      backgroundImageRef.current = null;
    }
  }, [selectedBackground]);

  // Process segmentation results
  const onResults = useCallback(
    (results: any) => {
      if (!canvasRef.current || !outputCanvasRef.current) return;

      const canvas = outputCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = results.image.width;
      canvas.height = results.image.height;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mirrored) {
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
      }

      if (selectedBackground === "none") {
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      } else {
        // Draw background
        if (selectedBackground === "blur") {
          ctx.filter = "blur(20px)";
          ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
          ctx.filter = "none";
        } else {
          const bg = backgrounds.find((b) => b.id === selectedBackground);

          if (backgroundImageRef.current) {
            ctx.drawImage(
              backgroundImageRef.current,
              0,
              0,
              canvas.width,
              canvas.height
            );
          } else if (bg?.color) {
            if (bg.color.startsWith("linear-gradient")) {
              const gradient = ctx.createLinearGradient(
                0,
                0,
                canvas.width,
                canvas.height
              );
              gradient.addColorStop(0, "#667eea");
              gradient.addColorStop(1, "#764ba2");
              ctx.fillStyle = gradient;
            } else {
              ctx.fillStyle = bg.color;
            }
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }

        // Apply segmentation mask
        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(
          results.segmentationMask,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // Draw person
        ctx.globalCompositeOperation = "source-over";
        if (selectedBackground !== "blur") {
          ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = "destination-in";
          ctx.drawImage(
            results.segmentationMask,
            0,
            0,
            canvas.width,
            canvas.height
          );
        }
      }

      ctx.restore();
    },
    [selectedBackground, mirrored, backgrounds]
  );

  // Start camera and processing
  useEffect(() => {
    let stream: MediaStream | null = null;
    let stopped = false;

    (async () => {
      try {
        setError(null);
        if (!navigator.mediaDevices?.getUserMedia) {
          setError("Browser tidak mendukung getUserMedia.");
          return;
        }

        stream = await navigator.mediaDevices.getUserMedia(stableConstraints);
        if (!stopped && videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          await videoRef.current.play();

          if (enableVirtualBackground && isModelLoaded) {
            processVideo();
          }
        }
      } catch (e) {
        const msg =
          e instanceof Error
            ? e.message
            : "Gagal mengakses kamera. Pastikan izin kamera diizinkan.";
        setError(msg);
      }
    })();

    async function processVideo() {
      if (
        !videoRef.current ||
        !selfieSegmentationRef.current ||
        stopped ||
        !enableVirtualBackground ||
        !isModelLoaded
      ) {
        return;
      }

      setIsProcessing(true);
      const video = videoRef.current;

      if (video.readyState >= 2) {
        await selfieSegmentationRef.current.send({ image: video });
      }

      animationFrameRef.current = requestAnimationFrame(processVideo);
    }

    return () => {
      stopped = true;
      setIsProcessing(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [
    stableConstraints,
    enableVirtualBackground,
    isModelLoaded,
    selectedBackground,
  ]);

  return (
    <div className={`relative bg-gray-900 ${className}`}>
      {label && (
        <span className="absolute left-3 bottom-3 z-10 text-xs bg-black/60 text-white px-2 py-1 rounded">
          {label}
        </span>
      )}

      {/* Loading indicator */}
      {enableVirtualBackground && !isModelLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-30">
          <div className="text-center text-white">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm">Loading AI Model...</p>
          </div>
        </div>
      )}

      {/* Virtual Background Controls */}
      {enableVirtualBackground && isModelLoaded && (
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={() => setShowBackgroundSelector(!showBackgroundSelector)}
            className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-colors backdrop-blur-sm"
            title="Ubah Background"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {showBackgroundSelector && (
            <div className="absolute top-12 right-0 bg-white rounded-xl shadow-2xl p-4 w-96 max-h-[32rem] overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">Virtual Background</h3>
                <button
                  onClick={() => setShowBackgroundSelector(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {backgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      setSelectedBackground(bg.id);
                      setShowBackgroundSelector(false);
                    }}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                      selectedBackground === bg.id
                        ? "border-orange-500 ring-2 ring-orange-200"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    {bg.image ? (
                      <img
                        src={bg.image}
                        alt={bg.name}
                        className="w-full h-24 object-cover"
                      />
                    ) : bg.id === "none" ? (
                      <div className="w-full h-24 bg-gray-900 flex items-center justify-center">
                        <span className="text-2xl">🚫</span>
                      </div>
                    ) : bg.id === "blur" ? (
                      <div className="w-full h-24 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 backdrop-blur-3xl bg-white/30"></div>
                        <span className="text-3xl relative z-10">🌀</span>
                      </div>
                    ) : bg.color?.startsWith("linear") ? (
                      <div className="w-full h-24 bg-gradient-to-br from-purple-400 to-pink-500" />
                    ) : (
                      <div
                        className="w-full h-24"
                        style={{ backgroundColor: bg.color || "#e5e7eb" }}
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors">
                      <span className="text-white text-xs font-semibold text-center px-2 drop-shadow-lg">
                        {bg.name}
                      </span>
                    </div>
                    {selectedBackground === bg.id && (
                      <div className="absolute top-1 right-1 bg-orange-500 rounded-full p-1">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-4 text-xs text-gray-500 text-center bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="font-semibold text-blue-900 mb-1">
                  💡 Powered by MediaPipe AI
                </p>
                <p className="text-blue-700">
                  Background virtual menggunakan AI segmentation
                </p>
              </div>

              {isProcessing && (
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Processing...
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Hidden video element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={
          enableVirtualBackground
            ? "hidden"
            : `w-full h-full object-cover ${
                mirrored ? " [transform:scaleX(-1)]" : ""
              }`
        }
      />

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Output canvas with background replacement */}
      {enableVirtualBackground && (
        <canvas ref={outputCanvasRef} className="w-full h-full object-cover" />
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-sm p-4 text-center rounded-xl z-30">
          {error}
        </div>
      )}
    </div>
  );
}

export default function Pidato() {
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(292);

  useEffect(() => {
    if (!isPaused && time > 0) {
      const timer = setInterval(() => setTime((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isPaused, time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="pr-8">
      <div className="bg-white p-4 rounded-xl">
        <section className="relative min-h-screen w-full bg-[url(/podium/tirai.png)] bg-no-repeat bg-cover bg-top rounded-xl">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div className="bg-white rounded-2xl px-6 py-2 shadow-sm">
                <p className="text-orange-500 font-bold text-lg">
                  Mode : Wawancara
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-end gap-10 w-full">
            {/* User Camera with AI Virtual Background */}
            <CameraFeed
              className="w-[35rem] h-80 rounded-xl overflow-hidden ring-4 ring-orange-200 shadow-2xl"
              label="Anda"
              mirrored
              enableVirtualBackground={true}
            />

            <div className="flex items-center flex-col justify-center gap-10">
              {/* Question Bubble */}
              <div className="relative w-fit max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl shadow-md px-8 py-4 text-center text-orange-500 font-medium text-lg relative">
                  <p>
                    Ceritakan pengalaman Anda bekerja dalam sebuah tim
                    <br />
                    dan bagaimana peran Anda di dalamnya?
                  </p>
                  <div className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-0 h-0 border-l-[16px] border-r-[16px] border-t-[16px] border-transparent border-t-white"></div>
                </div>
              </div>

              {/* Interviewer Video */}
              <div className="relative bg-white w-[35rem] h-80 rounded-xl overflow-hidden ring-4 ring-orange-400 shadow-2xl">
                <img
                  src="/podium/virtual.png"
                  alt="Bu Hilda PT Foodie"
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3 bottom-3 z-10 text-xs bg-black/60 text-white px-2 py-1 rounded">
                  Bu Hilda PT Foodie
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center mt-10">
            <div className="bg-white flex items-center justify-center w-[90%] h-40 rounded-2xl shadow-md">
              <div className="flex items-center gap-4 z-40">
                <button
                  onClick={() => setIsPaused((v) => !v)}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {isPaused ? (
                    <Play className="w-5 h-5" />
                  ) : (
                    <Pause className="w-5 h-5" />
                  )}
                  {isPaused ? "Resume" : "Pause"}
                </button>

                <div className="bg-white border-3 border-orange-300 px-8 py-4 rounded-2xl shadow-xl">
                  <p className="text-3xl font-bold text-gray-800 tabular-nums">
                    {formatTime(time)}
                  </p>
                </div>

                <Link
                  href="/podium-swara/selesai"
                  className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Check className="w-5 h-5" />
                  Selesai
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
