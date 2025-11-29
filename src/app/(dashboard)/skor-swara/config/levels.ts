// app/skor-swara/config/levels.ts
export interface LevelConfig {
  level: number;
  unlockedModes: TrainingMode[];
  badge: string;
  title: string;
  description: string;
}

export type TrainingMode = "full-text" | "topic-image" | "custom-topic";

export interface TrainingTopic {
  skor_swara_topic_id?: number; // ✅ Match database column name
  id?: string; // Local identifier for topics
  topic: string; // ✅ Match database column name (bukan 'title')
  title?: string; // Display title
  text?: string;
  level?: number;
  category?: string;
  difficulty?: string;
  minWords?: number;
  maxWords?: number;
  image?: string;
  keywords?: string[];
}

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    unlockedModes: ["full-text"],
    badge: "🌱",
    title: "Pemula",
    description: "Latihan dengan teks lengkap dan teleprompter",
  },
  {
    level: 2,
    unlockedModes: ["full-text"],
    badge: "🌿",
    title: "Berkembang",
    description: "Tingkatkan kemampuan membaca dan intonasi",
  },
  {
    level: 3,
    unlockedModes: ["full-text", "topic-image", "custom-topic"],
    badge: "🌳",
    title: "Mahir",
    description: "Unlock semua mode latihan",
  },
  {
    level: 4,
    unlockedModes: ["full-text", "topic-image", "custom-topic"],
    badge: "⭐",
    title: "Ahli",
    description: "Master dalam public speaking",
  },
  {
    level: 5,
    unlockedModes: ["full-text", "topic-image", "custom-topic"],
    badge: "🏆",
    title: "Master",
    description: "Professional speaker level",
  },
];

export const TRAINING_TOPICS: TrainingTopic[] = [
  {
    id: "career-digital",
    title: "Merancang Masa Depan: Membangun Karier di Era Digital",
    category: "Karier",
    difficulty: "medium",
    text: `Keterampilan komunikasi yang kuat dan kemampuan beradaptasi adalah dua hal yang saya anggap sangat penting di dunia kerja. Dengan komunikasi yang efektif, saya dapat menyampaikan ide dengan jelas dan berkolaborasi dengan tim.

Dalam era saat ini, ketepatan bicara, cara menyampaikan informasi dengan jelas juga menjadi harga mahal yang memang sangat berguna di era Industri 5.0 di mana banyak persaingan dalam berbagai bidang.`,
    topic: ""
  },
  {
    id: "public-speaking",
    title: "Menguasai Seni Berbicara di Depan Umum",
    category: "Komunikasi",
    difficulty: "easy",
    text: `Berbicara di depan umum adalah keterampilan yang dapat dipelajari oleh siapa saja. Kunci utamanya adalah persiapan yang matang dan latihan yang konsisten.

Mulailah dengan topik yang Anda kuasai, lalu perlahan tingkatkan kompleksitas materi. Jangan takut membuat kesalahan, karena setiap kesalahan adalah pembelajaran berharga untuk tampil lebih baik di masa depan.`,
    topic: ""
  },
  {
    id: "leadership",
    title: "Kepemimpinan dalam Tim: Membangun Sinergi yang Produktif",
    category: "Leadership",
    difficulty: "hard",
    text: `Kepemimpinan yang efektif tidak hanya tentang memberikan instruksi, tetapi tentang menginspirasi dan memberdayakan tim. Seorang pemimpin yang baik mendengarkan anggota timnya, memahami kekuatan masing-masing individu, dan menciptakan lingkungan di mana setiap orang dapat berkontribusi maksimal.

Dalam menghadapi tantangan, pemimpin harus mampu tetap tenang, membuat keputusan berbasis data, dan mengomunikasikan visi dengan jelas kepada seluruh tim.`,
    topic: ""
  },

  // MODE 2: Topic + Image
  {
    id: "climate-change",
    title: "Perubahan Iklim dan Tanggung Jawab Kita",
    category: "Lingkungan",
    difficulty: "medium",
    image: "https://res.cloudinary.com/dluvt9ppm/image/upload/v1763314273/swara-image-topics/bdwoos99wnpj7havvrpg.jpg", // Updated to use URL
    topic: "Perubahan Iklim Global",
    minWords: 100,
    maxWords: 300,
  },
  {
    id: "technology-future",
    title: "Teknologi dan Masa Depan Pekerjaan",
    category: "Teknologi",
    difficulty: "hard",
    image: "https://res.cloudinary.com/dluvt9ppm/image/upload/v1763314273/swara-image-topics/bdwoos99wnpj7havvrpg.jpg", // Updated to use URL
    topic: "Artificial Intelligence dan Otomasi",
    minWords: 150,
    maxWords: 350,
  },
  {
    id: "education",
    title: "Pendidikan di Era Digital",
    category: "Pendidikan",
    difficulty: "easy",
    image: "https://res.cloudinary.com/dluvt9ppm/image/upload/v1763314273/swara-image-topics/bdwoos99wnpj7havvrpg.jpg", // Updated to use URL
    topic: "Pembelajaran Online",
    minWords: 80,
    maxWords: 250,
  },
  {
    id: "environment-universe",
    title: "Alam Semesta",
    category: "Lingkungan",
    difficulty: "easy",
    image: "https://res.cloudinary.com/dluvt9ppm/image/upload/v1763314273/swara-image-topics/bdwoos99wnpj7havvrpg.jpg",
    keywords: ["lingkungan", "alam", "kebersihan", "sekitar", "kepedulian"],
    minWords: 100,
    maxWords: 300,
    topic: ""
  },
  {
    id: "current-concerns",
    title: "Keresahan Warga Jaman Sekarang",
    category: "Lingkungan",
    difficulty: "medium",
    image: "https://res.cloudinary.com/dluvt9ppm/image/upload/v1763314273/swara-image-topics/bdwoos99wnpj7havvrpg.jpg",
    keywords: ["banjir", "kebakaran", "hujan"],
    minWords: 100,
    maxWords: 300,
    topic: ""
  },
  {
    id: "environment-cleanliness",
    title: "Kebersihan Lingkungan",
    category: "Lingkungan",
    difficulty: "hard",
    image: "https://res.cloudinary.com/dluvt9ppm/image/upload/v1763314273/swara-image-topics/bdwoos99wnpj7havvrpg.jpg",
    keywords: ["tenang", "ekspresi wajah", "intonasi yang tepat", "kontrol napas", "gerakan tubuh yang tenang", "kejelasan penyampaian", "konsistensi nada suara", "kesabaran", "rileksasi mental", "teknik meditasi"],
    minWords: 100,
    maxWords: 300,
    topic: ""
  },
  {
    id: "sustainable-practices",
    title: "Praktik Berkelanjutan",
    category: "Lingkungan",
    difficulty: "medium",
    image: "https://res.cloudinary.com/dluvt9ppm/image/upload/v1763314273/swara-image-topics/bdwoos99wnpj7havvrpg.jpg",
    keywords: ["daur ulang", "konservasi", "energi terbarukan", "pertanian berkelanjutan"],
    minWords: 100,
    maxWords: 300,
    topic: ""
  },
];

// ===== LEVEL MANAGEMENT =====
const DEFAULT_LEVEL = 3;

export const getUserLevel = (): number => {
  if (typeof window === "undefined") return DEFAULT_LEVEL;
  try {
    const stored = localStorage.getItem("skor-swara:userLevel");
    return stored ? parseInt(stored) : DEFAULT_LEVEL;
  } catch {
    return DEFAULT_LEVEL;
  }
};

export const setUserLevel = (level: number): void => {
  if (typeof window === "undefined") return;
  try {
    if (level < 1 || level > LEVELS.length) {
      console.error(
        `Invalid level: ${level}. Must be between 1 and ${LEVELS.length}`
      );
      return;
    }
    localStorage.setItem("skor-swara:userLevel", String(level));
    console.log(`✅ Level set to: ${level} (${LEVELS[level - 1].title})`);
  } catch (e) {
    console.error("Failed to set level:", e);
  }
};

export const resetLevel = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("skor-swara:userLevel");
    console.log(`🔄 Level reset to default: ${DEFAULT_LEVEL}`);
  } catch (e) {
    console.error("Failed to reset level:", e);
  }
};

export const isModeLocked = (mode: TrainingMode): boolean => {
  const userLevel = getUserLevel();
  const levelConfig = LEVELS.find((l) => l.level === userLevel);
  return !levelConfig?.unlockedModes.includes(mode);
};

export const getLevelInfo = (level: number): LevelConfig | undefined => {
  return LEVELS.find((l) => l.level === level);
};

if (typeof window !== "undefined") {
  (window as any).skorSwaraDebug = {
    setLevel: setUserLevel,
    getLevel: getUserLevel,
    resetLevel: resetLevel,
    showLevels: () => {
      console.table(
        LEVELS.map((l) => ({
          Level: l.level,
          Badge: l.badge,
          Title: l.title,
          Modes: l.unlockedModes.join(", "),
        }))
      );
    },
  };
}
