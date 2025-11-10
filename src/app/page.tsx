"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mic,
  Trophy,
  Users,
  Video,
  BookOpen,
  GraduationCap,
  Sparkles,
  Target,
  Heart,
  Zap,
  Eye,
  Ear,
  ArrowRight,
  CheckCircle,
  Star,
  Play,
  Menu,
  X,
} from "lucide-react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Skor Swara",
      description:
        "Evaluasi AI yang menganalisis intonasi, pengucapan, kecepatan berbicara, hingga ekspresi wajah untuk penilaian objektif dan terukur.",
      color: "from-orange-500 to-red-500",
      gradient: "from-orange-50 to-red-50",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Adu Swara",
      description:
        "Sistem gamifikasi yang mempertemukan 2 pengguna dalam tantangan berbicara dengan topik acak dan voting dari komunitas.",
      color: "from-orange-600 to-amber-500",
      gradient: "from-orange-50 to-amber-50",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Podium Swara",
      description:
        "Simulasi panggung virtual dengan audiens 3D yang merespon real-time. Pilih skenario: seminar, konferensi, atau pidato.",
      color: "from-amber-500 to-orange-400",
      gradient: "from-amber-50 to-orange-50",
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Inspira Swara",
      description:
        "Perpustakaan digital interaktif dengan koleksi video dari public speaker terbaik dunia, lengkap dengan transkrip dan AI chatbot.",
      color: "from-orange-500 to-yellow-500",
      gradient: "from-orange-50 to-yellow-50",
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Latih Swara",
      description:
        "Program pembelajaran personal dengan mentoring one-on-one dari praktisi profesional dan modul terstruktur.",
      color: "from-orange-600 to-red-600",
      gradient: "from-orange-50 to-red-50",
    },
  ];

  const benefits = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Evaluasi Adaptif",
      description:
        "AI menganalisis kemampuan kognitif, afektif, dan psikomotorik Anda secara komprehensif",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Ramah Disabilitas",
      description:
        "Dukungan lengkap untuk tunanetra dan tunarungu dengan teknologi aksesibilitas terdepan",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Feedback Real-time",
      description:
        "Dapatkan penilaian objektif dan saran peningkatan instant setiap latihan",
    },
  ];

  const accessibilityFeatures = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Mode Tunanetra",
      items: [
        "Screen reader support",
        "Shortcut navigasi keyboard",
        "Text-to-speech terintegrasi",
      ],
    },
    {
      icon: <Ear className="w-6 h-6" />,
      title: "Mode Tunarungu",
      items: [
        "Subtitle otomatis real-time",
        "Visualisasi intonasi suara",
        "Akses transkrip latihan",
      ],
    },
  ];

  const stats = [
    { number: "10,000+", label: "Pengguna Aktif" },
    { number: "50,000+", label: "Latihan Selesai" },
    { number: "4.9/5", label: "Rating Pengguna" },
    { number: "95%", label: "Tingkat Kepuasan" },
  ];

  return (
    <div className="min-h-screen font-lexend bg-gradient-to-br from-white via-orange-50/30 to-white overflow-x-hidden">
      {/* Navbar */}

      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img src="./logo.svg" alt="Logo" className="w-36" />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
              >
                Fitur
              </a>
              <a
                href="#benefits"
                className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
              >
                Keunggulan
              </a>
              <a
                href="#accessibility"
                className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
              >
                Aksesibilitas
              </a>
              <Link href="/daftar">
                <button className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all">
                  Mulai Sekarang
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4 border-t border-gray-200">
              <a
                href="#features"
                className="block text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Fitur
              </a>
              <a
                href="#benefits"
                className="block text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Keunggulan
              </a>
              <a
                href="#accessibility"
                className="block text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Aksesibilitas
              </a>
              <Link href="/dashboard">
                <button className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold">
                  Mulai Sekarang
                </button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-200 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-block px-4 py-2 bg-orange-100 rounded-full shadow-sm">
                <span className="text-orange-600 font-semibold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Platform Public Speaking #1 di Indonesia
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                Kuasai Seni{" "}
                <span className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent animate-gradient">
                  Public Speaking
                </span>{" "}
                dengan AI
              </h1>
              <p className="text-lg sm:text-xl text-white leading-relaxed">
                Inovasi digital inklusif pembelajaran public speaking melalui
                evaluasi adaptif, simulasi panggung imersif, dan fitur ramah
                disabilitas yang didukung teknologi AI terdepan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                    Mulai Berlatih Gratis
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <button className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-orange-500 text-orange-600 rounded-full font-semibold text-lg hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Lihat Demo
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 border-3 border-white shadow-md"
                      style={{ zIndex: 10 - i }}
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-orange-500 text-orange-500"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">25+</span>{" "}
                    pengguna mempercayai SWARA
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-[500px] xl:h-[600px]">
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl transform rotate-6 opacity-20 animate-float"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl transform -rotate-3 opacity-30 animate-float-delayed"></div>

                {/* Main Card */}
                <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-orange-50 via-white to-red-50 flex flex-col items-center justify-center p-8">
                    <div className="relative">
                      <Mic className="w-32 h-32 text-orange-500 animate-bounce-slow" />
                      <div className="absolute -inset-4 bg-orange-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    </div>
                    <p className="mt-8 text-xl font-semibold text-gray-700 text-center">
                      Berbicara dengan Percaya Diri
                    </p>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-float shadow-lg"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full animate-float-delayed shadow-lg"></div>
                <div
                  className="absolute top-1/2 -right-4 w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-full animate-float shadow-lg"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-12 px-4 sm:px-6 lg:px-8 bg-orange-300 text-white backdrop-blur">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Mengapa Memilih{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                SWARA
              </span>
              ?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Platform pembelajaran public speaking paling komprehensif dengan
              teknologi AI terdepan
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-100 hover:shadow-2xl hover:scale-105 hover:border-orange-300 transition-all duration-300 cursor-pointer"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 transition-transform shadow-lg">
                  <div className="text-white">{benefit.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-red-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Fitur{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Unggulan
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Lima fitur utama yang dirancang untuk mengembangkan kemampuan
              public speaking Anda secara komprehensif
            </p>
          </div>

          {/* Baris Atas — 3 Kolom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.slice(0, 3).map((feature, index) => (
              <div
                key={index}
                className="group relative p-6 lg:p-8 rounded-2xl bg-white border-2 border-gray-100 hover:border-orange-500 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300`}
                ></div>
                <div className="relative z-10">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-orange-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Pelajari lebih lanjut
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Baris Bawah — 2 Kolom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-6">
            {features.slice(3).map((feature, index) => (
              <div
                key={3 + index}
                className="group relative p-6 lg:p-8 rounded-2xl bg-white border-2 border-gray-100 hover:border-orange-500 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setActiveFeature(3 + index)}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300`}
                ></div>
                <div className="relative z-10">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-orange-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Pelajari lebih lanjut
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ranah Pembelajaran Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Evaluasi{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Komprehensif
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              SWARA mengembangkan tiga ranah pembelajaran untuk pengalaman
              belajar yang holistik dan terukur
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                Kognitif
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Menganalisis kemampuan berpikir kritis, struktur argumen, dan
                substansi gagasan melalui teknologi Natural Language Processing
                (NLP).
              </p>
              <ul className="space-y-3">
                {[
                  "Analisis kosakata & diksi",
                  "Struktur kalimat & logika",
                  "Relevansi argumen",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-pink-500">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition-colors">
                Afektif
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Membangun kepercayaan diri dan manajemen kecemasan melalui
                simulasi interaktif dan sistem gamifikasi yang motivatif.
              </p>
              <ul className="space-y-3">
                {[
                  "Audiens virtual 3D",
                  "Sistem badge & reward",
                  "Motivasi berkelanjutan",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-orange-500">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                Psikomotorik
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Mengukur performa berbicara secara kuantitatif melalui analisis
                video dan audio yang presisi dan real-time.
              </p>
              <ul className="space-y-3">
                {[
                  "Intonasi & volume suara",
                  "Kecepatan & artikulasi",
                  "Ekspresi wajah & gestur",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Section */}
      <section
        id="accessibility"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Inklusif untuk{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Semua
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Kami percaya bahwa setiap orang berhak mengembangkan kemampuan
              public speaking tanpa batasan
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {accessibilityFeatures.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border-2 border-orange-100 hover:border-orange-400 hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-orange-600 transition-colors">
                  {feature.title}
                </h3>
                <ul className="space-y-4">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 rounded-2xl p-8 lg:p-12 text-white text-center shadow-2xl">
            <h3 className="text-2xl lg:text-3xl font-bold mb-6">
              Fitur Aksesibilitas Universal
            </h3>
            <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
              Teknologi aksesibilitas terdepan untuk pengalaman belajar yang
              nyaman bagi semua pengguna
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 hover:bg-white/20 transition-all hover:scale-105 cursor-pointer">
                <div className="text-4xl mb-3">🎨</div>
                <p className="font-semibold text-lg">Kontras Tinggi</p>
                <p className="text-sm text-orange-100 mt-2">
                  Mode visual yang optimal
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 hover:bg-white/20 transition-all hover:scale-105 cursor-pointer">
                <div className="text-4xl mb-3">🔤</div>
                <p className="font-semibold text-lg">Ukuran Font Fleksibel</p>
                <p className="text-sm text-orange-100 mt-2">
                  Sesuaikan dengan kebutuhan
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 hover:bg-white/20 transition-all hover:scale-105 cursor-pointer">
                <div className="text-4xl mb-3">⚡</div>
                <p className="font-semibold text-lg">Shortcut Keyboard</p>
                <p className="text-sm text-orange-100 mt-2">
                  Navigasi cepat & mudah
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Cerita{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Pengguna
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Dengar langsung dari mereka yang telah bertransformasi bersama
              SWARA
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Rina Wijaya",
                role: "Mahasiswa Komunikasi",
                content:
                  "SWARA benar-benar mengubah cara saya berbicara di depan umum. Fitur simulasi audiens virtualnya sangat membantu mengurangi nervous saya!",
                rating: 5,
              },
              {
                name: "Budi Santoso",
                role: "Marketing Manager",
                content:
                  "Feedback AI yang detail dan objektif membantu saya meningkatkan skill presentasi bisnis. Sangat recommended untuk profesional!",
                rating: 5,
              },
              {
                name: "Siti Nurhaliza",
                role: "Content Creator",
                content:
                  "Sebagai penyandang tunarungu, saya sangat terbantu dengan fitur subtitle dan visualisasi intonasi. Inklusif banget!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-orange-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-orange-500 text-orange-500"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Siap Menjadi Public Speaker Handal?
          </h2>
          <p className="text-lg sm:text-xl text-orange-100 mb-10">
            Bergabunglah dengan ribuan pengguna yang telah meningkatkan
            kemampuan public speaking mereka bersama SWARA
          </p>

          {/* Primary actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <button className="px-10 py-4 bg-white text-orange-600 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
                Mulai Gratis Sekarang
              </button>
            </Link>
            <Link href="/tentang">
              <button className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-orange-600 transition-all">
                Pelajari Lebih Lanjut
              </button>
            </Link>
          </div>

          {/* Trust bullets */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-orange-100">
            <p className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Tidak perlu kartu kredit
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Akses penuh 7 hari
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Dukungan 24/7
            </p>
          </div>
          <hr className="text-white mt-10" />
          {/* === Offer: Jadi Mentor / Hubungi Admin === */}
          <div className="mt-10 mx-auto max-w-3xl">
            <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-5 sm:p-6">
              <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                <span className="font-bold text-white">
                  Punya pengalaman public speaking atau mengajar?
                </span>
                &nbsp;Bergabung sebagai{" "}
                <span className="font-semibold">mentor SWARA</span> dan bantu
                ribuan pelajar berkembang. Anda akan mendapatkan profil mentor,
                jadwal fleksibel, dan kompensasi per sesi.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                {/* <Link href="/mentor/daftar">
                  <button className="px-6 py-3 bg-white text-orange-700 rounded-full font-semibold hover:shadow-xl transition">
                    Daftar Jadi Mentor
                  </button>
                </Link> */}
                <Link href="/kontak">
                  <button className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-orange-700 transition">
                    Hubungi Admin Swara
                  </button>
                </Link>
              </div>
            </div>
          </div>
          {/* === End mentor block === */}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="./logo.svg" alt="Logo" className="w-36" />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Platform pembelajaran public speaking berbasis AI yang inklusif
                dan inovatif untuk semua.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Fitur</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Skor Swara
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Adu Swara
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Podium Swara
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Inspira Swara
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Latih Swara
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Perusahaan</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Blog & Artikel
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Karir
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Press Kit
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Kontak
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Dukungan</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Pusat Bantuan
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Panduan Pengguna
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Kebijakan Privasi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Syarat & Ketentuan
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              &copy; 2025 SWARA. All rights reserved. Made with ❤️ for better
              communication.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-orange-500 transition-colors">
                Bahasa Indonesia
              </a>
              <span>•</span>
              <a href="#" className="hover:text-orange-500 transition-colors">
                English
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(6deg);
          }
          50% {
            transform: translateY(-20px) rotate(6deg);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0) rotate(-3deg);
          }
          50% {
            transform: translateY(-15px) rotate(-3deg);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.9;
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
