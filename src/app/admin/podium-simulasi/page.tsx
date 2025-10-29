"use client";
/* eslint-disable */

import React, { useState } from "react";
import { createPortal } from "react-dom";

import {
  Mic,
  MessageSquare,
  Presentation,
  Plus,
  Edit2,
  Trash2,
  X,
  Info,
  Eye,
  Search,
  ChevronUp,
  ChevronDown,
  HelpCircle,
  CheckCircle,
} from "lucide-react";

interface Sentence {
  id: number;
  text: string;
  category: "Master of Ceremony" | "Wawancara" | "Pidato";
  usageCount: number;
  addedDate: string;
}

interface InterviewQuestion {
  id: number;
  question: string;
  usageCount: number;
  addedDate: string;
}

interface InterviewAnswer {
  id: number;
  answer: string;
  usageCount: number;
  addedDate: string;
}

type SortField = "text" | "usageCount" | "addedDate";
type SortOrder = "asc" | "desc";

export default function PodiumSimulasi() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [sentences, setSentences] = useState<Sentence[]>([
    {
      id: 1,
      text: "Selamat datang di acara peluncuran produk terbaru kami yang spektakuler",
      category: "Master of Ceremony",
      usageCount: 245,
      addedDate: "2025-01-15",
    },
    {
      id: 2,
      text: "Izinkan saya memperkenalkan pembicara utama malam ini",
      category: "Master of Ceremony",
      usageCount: 198,
      addedDate: "2025-01-10",
    },
    {
      id: 5,
      text: "Hadirin yang terhormat, mari kita bersama-sama membangun masa depan yang lebih baik",
      category: "Pidato",
      usageCount: 189,
      addedDate: "2025-01-14",
    },
    {
      id: 6,
      text: "Perkenankanlah saya menyampaikan visi dan misi organisasi kita",
      category: "Pidato",
      usageCount: 156,
      addedDate: "2025-01-11",
    },
  ]);

  // Data khusus untuk Wawancara
  const [interviewQuestions, setInterviewQuestions] = useState<
    InterviewQuestion[]
  >([
    {
      id: 1,
      question:
        "Bisakah Anda ceritakan pengalaman kerja terbaik yang pernah Anda miliki?",
      usageCount: 312,
      addedDate: "2025-01-12",
    },
    {
      id: 2,
      question:
        "Apa yang membuat Anda tertarik untuk bergabung dengan perusahaan kami?",
      usageCount: 278,
      addedDate: "2025-01-08",
    },
    {
      id: 3,
      question:
        "Ceritakan tentang tantangan terbesar yang pernah Anda hadapi dalam pekerjaan?",
      usageCount: 195,
      addedDate: "2025-01-10",
    },
  ]);

  const [interviewAnswers, setInterviewAnswers] = useState<InterviewAnswer[]>([
    {
      id: 1,
      answer:
        "Saya memiliki pengalaman 5 tahun di bidang digital marketing dengan fokus pada strategi konten.",
      usageCount: 245,
      addedDate: "2025-01-12",
    },
    {
      id: 2,
      answer:
        "Saya sangat tertarik dengan visi perusahaan untuk berinovasi dalam teknologi pendidikan.",
      usageCount: 198,
      addedDate: "2025-01-09",
    },
    {
      id: 3,
      answer:
        "Keahlian saya dalam public speaking dan komunikasi interpersonal sangat sesuai dengan posisi ini.",
      usageCount: 167,
      addedDate: "2025-01-11",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [interviewTab, setInterviewTab] = useState<"pertanyaan" | "jawaban">(
    "pertanyaan"
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSentence, setSelectedSentence] = useState<Sentence | null>(
    null
  );
  const [selectedQuestion, setSelectedQuestion] =
    useState<InterviewQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<InterviewAnswer | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("addedDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const [formData, setFormData] = useState({
    text: "",
    category: "Master of Ceremony" as
      | "Master of Ceremony"
      | "Wawancara"
      | "Pidato",
  });

  const categories = [
    {
      id: "mc",
      name: "Master of Ceremony",
      description: "Simulasi MC acara",
      icon: Mic,
      color: "from-orange-400 to-orange-500",
      bgColor: "bg-orange-100",
      textColor: "text-orange-700",
    },
    {
      id: "wawancara",
      name: "Wawancara",
      description: "Simulasi interview",
      icon: MessageSquare,
      color: "from-orange-400 to-orange-500",
      bgColor: "bg-orange-100",
      textColor: "text-orange-700",
    },
    {
      id: "pidato",
      name: "Pidato",
      description: "Simulasi berpidato",
      icon: Presentation,
      color: "from-orange-400 to-orange-500",
      bgColor: "bg-orange-100",
      textColor: "text-orange-700",
    },
  ];

  const getCategoryStats = (categoryName: string) => {
    if (categoryName === "Wawancara") {
      const totalSentences =
        interviewQuestions.length + interviewAnswers.length;
      const totalUsage =
        interviewQuestions.reduce((sum, q) => sum + q.usageCount, 0) +
        interviewAnswers.reduce((sum, a) => sum + a.usageCount, 0);
      return { totalSentences, totalUsage };
    }

    const categorySentences = sentences.filter(
      (s) => s.category === categoryName
    );
    const totalSentences = categorySentences.length;
    const totalUsage = categorySentences.reduce(
      (sum, s) => sum + s.usageCount,
      0
    );
    return { totalSentences, totalUsage };
  };

  const filteredSentences = selectedCategory
    ? sentences.filter((s) => {
        const category = categories.find((c) => c.id === selectedCategory);
        return category && s.category === category.name;
      })
    : [];

  const searchedSentences = filteredSentences.filter((s) =>
    s.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchedQuestions = interviewQuestions.filter((q) =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchedAnswers = interviewAnswers.filter((a) =>
    a.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedSentences = [...searchedSentences].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === "addedDate") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const sortedQuestions = [...searchedQuestions].sort((a, b) => {
    let aValue: any = sortField === "text" ? a.question : a[sortField];
    let bValue: any = sortField === "text" ? b.question : b[sortField];

    if (sortField === "addedDate") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const sortedAnswers = [...searchedAnswers].sort((a, b) => {
    let aValue: any = sortField === "text" ? a.answer : a[sortField];
    let bValue: any = sortField === "text" ? b.answer : b[sortField];

    if (sortField === "addedDate") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleAddSentence = () => {
    if (!formData.text.trim()) {
      alert("Mohon masukkan teks kalimat!");
      return;
    }

    const newSentence: Sentence = {
      id: sentences.length + 1,
      text: formData.text,
      category: formData.category,
      usageCount: 0,
      addedDate: new Date().toISOString().split("T")[0],
    };

    setSentences([...sentences, newSentence]);
    setFormData({ text: "", category: "Master of Ceremony" });
    setShowAddModal(false);
    alert("Kalimat berhasil ditambahkan!");
  };

  const handleAddInterviewQuestion = () => {
    if (!formData.text.trim()) {
      alert("Mohon masukkan pertanyaan!");
      return;
    }

    const newQuestion: InterviewQuestion = {
      id: interviewQuestions.length + 1,
      question: formData.text,
      usageCount: 0,
      addedDate: new Date().toISOString().split("T")[0],
    };

    setInterviewQuestions([...interviewQuestions, newQuestion]);
    setFormData({ text: "", category: "Wawancara" });
    setShowAddModal(false);
    alert("Pertanyaan berhasil ditambahkan!");
  };

  const handleAddInterviewAnswer = () => {
    if (!formData.text.trim()) {
      alert("Mohon masukkan jawaban!");
      return;
    }

    const newAnswer: InterviewAnswer = {
      id: interviewAnswers.length + 1,
      answer: formData.text,
      usageCount: 0,
      addedDate: new Date().toISOString().split("T")[0],
    };

    setInterviewAnswers([...interviewAnswers, newAnswer]);
    setFormData({ text: "", category: "Wawancara" });
    setShowAddModal(false);
    alert("Jawaban berhasil ditambahkan!");
  };

  const handleEditSentence = () => {
    if (!selectedSentence) return;

    const updated = sentences.map((s) =>
      s.id === selectedSentence.id
        ? { ...s, text: formData.text, category: formData.category }
        : s
    );

    setSentences(updated);
    setFormData({ text: "", category: "Master of Ceremony" });
    setShowEditModal(false);
    setSelectedSentence(null);
    alert("Kalimat berhasil diperbarui!");
  };

  const handleEditQuestion = () => {
    if (!selectedQuestion) return;

    const updated = interviewQuestions.map((q) =>
      q.id === selectedQuestion.id ? { ...q, question: formData.text } : q
    );

    setInterviewQuestions(updated);
    setFormData({ text: "", category: "Wawancara" });
    setShowEditModal(false);
    setSelectedQuestion(null);
    alert("Pertanyaan berhasil diperbarui!");
  };

  const handleEditAnswer = () => {
    if (!selectedAnswer) return;

    const updated = interviewAnswers.map((a) =>
      a.id === selectedAnswer.id ? { ...a, answer: formData.text } : a
    );

    setInterviewAnswers(updated);
    setFormData({ text: "", category: "Wawancara" });
    setShowEditModal(false);
    setSelectedAnswer(null);
    alert("Jawaban berhasil diperbarui!");
  };

  const handleDeleteSentence = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus kalimat ini?")) {
      setSentences(sentences.filter((s) => s.id !== id));
      alert("Kalimat berhasil dihapus!");
    }
  };

  const handleDeleteQuestion = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus pertanyaan ini?")) {
      setInterviewQuestions(interviewQuestions.filter((q) => q.id !== id));
      alert("Pertanyaan berhasil dihapus!");
    }
  };

  const handleDeleteAnswer = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus jawaban ini?")) {
      setInterviewAnswers(interviewAnswers.filter((a) => a.id !== id));
      alert("Jawaban berhasil dihapus!");
    }
  };

  const openEditModal = (sentence: Sentence) => {
    setSelectedSentence(sentence);
    setFormData({
      text: sentence.text,
      category: sentence.category,
    });
    setShowEditModal(true);
  };

  const openEditQuestionModal = (question: InterviewQuestion) => {
    setSelectedQuestion(question);
    setFormData({
      text: question.question,
      category: "Wawancara",
    });
    setShowEditModal(true);
  };

  const openEditAnswerModal = (answer: InterviewAnswer) => {
    setSelectedAnswer(answer);
    setFormData({
      text: answer.answer,
      category: "Wawancara",
    });
    setShowEditModal(true);
  };

  const totalSentences =
    sentences.length + interviewQuestions.length + interviewAnswers.length;
  const newThisMonth = 4;

  return (
    <div className="pr-8">
      {/* Header */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Manajemen Podium & Simulasi
        </h1>
        <p className="text-gray-600">
          Kelola skenario simulasi panggung virtual dengan audiens 3D real-time
        </p>
        {/* Stats Card */}
        <div className="bg-white rounded-2xl  mt-4 shadow-md p-6  border-2 border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
              +{newThisMonth} bulan ini
            </span>
            <Presentation className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-5xl font-bold text-gray-900 mb-2">
            {totalSentences}
          </p>
          <p className="text-gray-600 font-semibold">Total Kalimat</p>
        </div>
      </div>

      {/* Kategori Simulasi Section */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Kategori Simulasi
        </h2>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-900 font-semibold mb-2">Catatan:</p>
              <p className="text-blue-800">
                Terdapat 3 kategori fixed (Master of Ceremony, Wawancara, dan
                Pidato). Admin hanya dapat menambahkan, mengedit, atau menghapus
                kalimat/teks latihan untuk setiap kategori. Pengguna akan
                mendapat kalimat secara acak saat melakukan simulasi.
              </p>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => {
            const stats = getCategoryStats(category.name);
            const IconComponent = category.icon;

            return (
              <div
                key={category.id}
                className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200 hover:shadow-lg transition-all"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-4xl font-bold text-orange-600">
                      {stats.totalSentences}
                    </p>
                    <p className="text-gray-600 text-sm font-semibold">
                      Kalimat
                    </p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-orange-600">
                      {stats.totalUsage > 1000
                        ? `${(stats.totalUsage / 1000).toFixed(1)}k`
                        : stats.totalUsage}
                    </p>
                    <p className="text-gray-600 text-sm font-semibold">
                      Digunakan
                    </p>
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setInterviewTab("pertanyaan");
                  }}
                  className="w-full py-3 bg-white hover:bg-orange-50 border-2 border-orange-500 text-orange-600 rounded-xl font-semibold transition-colors"
                >
                  Lihat Semua
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Category Detail */}
      {mounted && selectedCategory
        ? createPortal(
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1100] p-4">
              <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      {(() => {
                        const category = categories.find(
                          (c) => c.id === selectedCategory
                        );
                        if (!category) return null;
                        const IconComponent = category.icon;
                        return <IconComponent className="w-6 h-6 text-white" />;
                      })()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {
                          categories.find((c) => c.id === selectedCategory)
                            ?.name
                        }
                      </h2>
                      <p className="text-sm text-gray-600">
                        {
                          categories.find((c) => c.id === selectedCategory)
                            ?.description
                        }
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchQuery("");
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                {/* Sub Navigation untuk Wawancara */}
                {selectedCategory === "wawancara" && (
                  <div className="flex border-b bg-gray-50">
                    <button
                      onClick={() => setInterviewTab("pertanyaan")}
                      className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                        interviewTab === "pertanyaan"
                          ? "text-orange-600 border-b-2 border-orange-600 bg-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <HelpCircle className="w-5 h-5" />
                      Pertanyaan ({interviewQuestions.length})
                    </button>
                    <button
                      onClick={() => setInterviewTab("jawaban")}
                      className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                        interviewTab === "jawaban"
                          ? "text-orange-600 border-b-2 border-orange-600 bg-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                      Jawaban ({interviewAnswers.length})
                    </button>
                  </div>
                )}

                {/* Search and Add */}
                <div className="p-6 border-b flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={
                        selectedCategory === "wawancara"
                          ? interviewTab === "pertanyaan"
                            ? "Cari pertanyaan..."
                            : "Cari jawaban..."
                          : "Cari kalimat..."
                      }
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const category = categories.find(
                        (c) => c.id === selectedCategory
                      );
                      if (category) {
                        setFormData({ ...formData, category: category.name });
                      }
                      setShowAddModal(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all whitespace-nowrap"
                  >
                    <Plus className="w-5 h-5" />
                    {selectedCategory === "wawancara"
                      ? interviewTab === "pertanyaan"
                        ? "Tambah Pertanyaan"
                        : "Tambah Jawaban"
                      : "Tambah Kalimat"}
                  </button>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th
                          className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("text")}
                        >
                          <div className="flex items-center gap-2">
                            {selectedCategory === "wawancara"
                              ? interviewTab === "pertanyaan"
                                ? "PERTANYAAN"
                                : "JAWABAN"
                              : "TEKS KALIMAT"}
                            {sortField === "text" &&
                              (sortOrder === "asc" ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              ))}
                          </div>
                        </th>
                        <th
                          className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("usageCount")}
                        >
                          <div className="flex items-center gap-2">
                            DIGUNAKAN
                            {sortField === "usageCount" &&
                              (sortOrder === "asc" ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              ))}
                          </div>
                        </th>
                        <th
                          className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("addedDate")}
                        >
                          <div className="flex items-center gap-2">
                            DITAMBAHKAN
                            {sortField === "addedDate" &&
                              (sortOrder === "asc" ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              ))}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          AKSI
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedCategory === "wawancara"
                        ? interviewTab === "pertanyaan"
                          ? sortedQuestions.map((question) => (
                              <tr
                                key={question.id}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <p className="text-gray-900">
                                    {question.question}
                                  </p>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="font-bold text-orange-600">
                                    {question.usageCount}x
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-gray-700">
                                    {new Date(
                                      question.addedDate
                                    ).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        openEditQuestionModal(question)
                                      }
                                      className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                                      title="Edit"
                                    >
                                      <Edit2 className="w-5 h-5 text-orange-600" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteQuestion(question.id)
                                      }
                                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Hapus"
                                    >
                                      <Trash2 className="w-5 h-5 text-red-600" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          : sortedAnswers.map((answer) => (
                              <tr
                                key={answer.id}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <p className="text-gray-900">
                                    {answer.answer}
                                  </p>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="font-bold text-orange-600">
                                    {answer.usageCount}x
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-gray-700">
                                    {new Date(
                                      answer.addedDate
                                    ).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        openEditAnswerModal(answer)
                                      }
                                      className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                                      title="Edit"
                                    >
                                      <Edit2 className="w-5 h-5 text-orange-600" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteAnswer(answer.id)
                                      }
                                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Hapus"
                                    >
                                      <Trash2 className="w-5 h-5 text-red-600" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                        : sortedSentences.map((sentence) => (
                            <tr
                              key={sentence.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <p className="text-gray-900">{sentence.text}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-bold text-orange-600">
                                  {sentence.usageCount}x
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-gray-700">
                                  {new Date(
                                    sentence.addedDate
                                  ).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => openEditModal(sentence)}
                                    className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-5 h-5 text-orange-600" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteSentence(sentence.id)
                                    }
                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus"
                                  >
                                    <Trash2 className="w-5 h-5 text-red-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>

                  {((selectedCategory === "wawancara" &&
                    interviewTab === "pertanyaan" &&
                    sortedQuestions.length === 0) ||
                    (selectedCategory === "wawancara" &&
                      interviewTab === "jawaban" &&
                      sortedAnswers.length === 0) ||
                    (selectedCategory !== "wawancara" &&
                      sortedSentences.length === 0)) && (
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        {selectedCategory === "wawancara"
                          ? interviewTab === "pertanyaan"
                            ? "Tidak ada pertanyaan ditemukan"
                            : "Tidak ada jawaban ditemukan"
                          : "Tidak ada kalimat ditemukan"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50">
                  <p className="text-center text-gray-600">
                    Total:{" "}
                    {selectedCategory === "wawancara"
                      ? interviewTab === "pertanyaan"
                        ? sortedQuestions.length
                        : sortedAnswers.length
                      : sortedSentences.length}{" "}
                    {selectedCategory === "wawancara"
                      ? interviewTab === "pertanyaan"
                        ? "pertanyaan"
                        : "jawaban"
                      : "kalimat"}
                  </p>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      {/* Modal Add */}
      {mounted && showAddModal
        ? createPortal(
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1200] p-4">
              <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedCategory === "wawancara"
                        ? interviewTab === "pertanyaan"
                          ? "Tambah Pertanyaan Baru"
                          : "Tambah Jawaban Baru"
                        : "Tambah Kalimat Baru"}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData({ text: "", category: "Master of Ceremony" });
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {selectedCategory !== "wawancara" && (
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">
                        Kategori <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value as
                              | "Master of Ceremony"
                              | "Wawancara"
                              | "Pidato",
                          })
                        }
                        className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="Master of Ceremony">
                          Master of Ceremony
                        </option>
                        <option value="Wawancara">Wawancara</option>
                        <option value="Pidato">Pidato</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">
                      {selectedCategory === "wawancara"
                        ? interviewTab === "pertanyaan"
                          ? "Teks Pertanyaan"
                          : "Teks Jawaban"
                        : "Teks Kalimat"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.text}
                      onChange={(e) =>
                        setFormData({ ...formData, text: e.target.value })
                      }
                      placeholder={
                        selectedCategory === "wawancara"
                          ? interviewTab === "pertanyaan"
                            ? "Masukkan pertanyaan untuk simulasi wawancara..."
                            : "Masukkan contoh jawaban untuk simulasi wawancara..."
                          : "Masukkan teks kalimat untuk latihan simulasi..."
                      }
                      rows={4}
                      className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.text.length} karakter
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-800">
                        {selectedCategory === "wawancara"
                          ? interviewTab === "pertanyaan"
                            ? "Pertanyaan yang ditambahkan akan muncul secara acak saat pengguna melakukan simulasi wawancara."
                            : "Jawaban yang ditambahkan akan digunakan sebagai referensi atau contoh untuk pengguna."
                          : "Kalimat yang ditambahkan akan muncul secara acak saat pengguna melakukan simulasi pada kategori ini."}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        setFormData({
                          text: "",
                          category: "Master of Ceremony",
                        });
                      }}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        if (selectedCategory === "wawancara") {
                          if (interviewTab === "pertanyaan") {
                            handleAddInterviewQuestion();
                          } else {
                            handleAddInterviewAnswer();
                          }
                        } else {
                          handleAddSentence();
                        }
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg"
                    >
                      {selectedCategory === "wawancara"
                        ? interviewTab === "pertanyaan"
                          ? "Tambah Pertanyaan"
                          : "Tambah Jawaban"
                        : "Tambah Kalimat"}
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      {/* Modal Edit */}
      {mounted && showEditModal
        ? createPortal(
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1200] p-4">
              <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Edit2 className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedQuestion
                        ? "Edit Pertanyaan"
                        : selectedAnswer
                        ? "Edit Jawaban"
                        : "Edit Kalimat"}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedSentence(null);
                      setSelectedQuestion(null);
                      setSelectedAnswer(null);
                      setFormData({ text: "", category: "Master of Ceremony" });
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {selectedSentence && (
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">
                        Kategori
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value as
                              | "Master of Ceremony"
                              | "Wawancara"
                              | "Pidato",
                          })
                        }
                        className="w-full px-4 py-3 border text-black border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="Master of Ceremony">
                          Master of Ceremony
                        </option>
                        <option value="Wawancara">Wawancara</option>
                        <option value="Pidato">Pidato</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">
                      {selectedQuestion
                        ? "Teks Pertanyaan"
                        : selectedAnswer
                        ? "Teks Jawaban"
                        : "Teks Kalimat"}
                    </label>
                    <textarea
                      value={formData.text}
                      onChange={(e) =>
                        setFormData({ ...formData, text: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.text.length} karakter
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">
                      Statistik Penggunaan
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {selectedSentence?.usageCount ||
                        selectedQuestion?.usageCount ||
                        selectedAnswer?.usageCount}
                      x digunakan
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedSentence(null);
                        setSelectedQuestion(null);
                        setSelectedAnswer(null);
                        setFormData({
                          text: "",
                          category: "Master of Ceremony",
                        });
                      }}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        if (selectedQuestion) {
                          handleEditQuestion();
                        } else if (selectedAnswer) {
                          handleEditAnswer();
                        } else {
                          handleEditSentence();
                        }
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
