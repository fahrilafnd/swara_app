'use client';

import React, { useState, useMemo } from "react";
import { Plus, ChevronUp, ChevronDown, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface DataItemHistory {
    id: number;
    peserta: string;
    topik: string;
    pemenang: string;
    bergabung: string;
}

interface DataItemTopik {
    id: number;
    topik: string;
    kategori: string;
    digunakan: string;
    dibuat: string;
}

type SortFieldHistory = "peserta" | "topik" | "pemenang" | "bergabung";
type SortOrderHistory = "asc" | "desc";

type SortFieldTopik = "topik" | "kategori" | "digunakan" | "dibuat";
type SortOrderTopik = "asc" | "desc";

export default function ManageAduSwara() {
    const [activeTab, setActiveTab] = useState('history');

    const [dataHistory, setDataHistory] = useState<DataItemHistory[]>([
        {
            id: 1,
            peserta: "Ya",
            topik: "Teknologi AI dalam pendidikan",
            pemenang: "Siti Nurhalizah",
            bergabung: "20 Jan 2025 | 14.30 WIB"
        },
        {
            id: 2,
            peserta: "Rie",
            topik: "Pertanian Industiral",
            pemenang: "Siti Nurhalizah",
            bergabung: "20 Jan 2025 | 14.30 WIB"
        },
    ]);

    const [dataTopik, setDataTopik] = useState<DataItemTopik[]>([
        {
            id: 1,
            dibuat: "12 Jan 2025",
            digunakan: "14x",
            kategori: "Teknologi",
            topik: "Keamanan Siber di Era Digital"
        },
        {
            id: 2,
            dibuat: "10 Jan 2025",
            digunakan: "4x",
            kategori: "Islam",
            topik: "Amal jariyah"
        },
    ]);

    const [sortFieldHistory, setSortFieldHistory] = useState<SortFieldHistory>("topik");
    const [sortOrderHistory, setSortOrderHistory] = useState<SortOrderHistory>("asc");

    const [sortFieldTopik, setSortFieldTopik] = useState<SortFieldTopik>("topik");
    const [sortOrderTopik, setSortOrderTopik] = useState<SortOrderTopik>("asc");

    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<DataItemTopik | null>(null);
    const [formData, setFormData] = useState({
        topik: "",
        kategori: "",
    });

    // Sorting logic
    const sortedData = useMemo(() => {
        const sorted = [...dataHistory].sort((a, b) => {
            const aValue = a[sortFieldHistory].toLowerCase();
            const bValue = b[sortFieldHistory].toLowerCase();

            if (aValue < bValue) return sortOrderHistory === "asc" ? -1 : 1;
            if (aValue > bValue) return sortOrderHistory === "asc" ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [dataHistory, sortFieldHistory, sortOrderHistory]);

    const handleSort = (field: SortFieldHistory) => {
        if (sortFieldHistory === field) {
            setSortOrderHistory(sortOrderHistory === "asc" ? "desc" : "asc");
        } else {
            setSortFieldHistory(field);
            setSortOrderHistory("asc");
        }
    };

    // Sorting logic
    const sortedDataTopik = useMemo(() => {
        const sorted = [...dataTopik].sort((a, b) => {
            const aValue = a[sortFieldTopik].toLowerCase();
            const bValue = b[sortFieldTopik].toLowerCase();

            if (aValue < bValue) return sortOrderTopik === "asc" ? -1 : 1;
            if (aValue > bValue) return sortOrderTopik === "asc" ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [dataTopik, sortFieldTopik, sortOrderTopik]);

    const handleSortTopik = (field: SortFieldTopik) => {
        if (sortFieldTopik === field) {
            setSortOrderTopik(sortOrderTopik === "asc" ? "desc" : "asc");
        } else {
            setSortFieldTopik(field);
            setSortOrderTopik("asc");
        }
    };

    const handleEdit = (item: DataItemTopik) => {
        setSelectedItem(item);
        setFormData({ topik: item.topik, kategori: item.kategori });
        setShowEditModal(true);
      };

    const handleAdd = () => {
        setShowAddModal(true);
      };
    
      const handleDeleteClick = (item: DataItemTopik) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
      };
    
      const confirmDelete = () => {
        if (selectedItem) {
          setDataTopik(dataTopik.filter((i) => i.id !== selectedItem.id));
          setShowDeleteModal(false);
          setSelectedItem(null);
        }
      };
    
      const handleSaveEdit = () => {
        if (!formData.topik || !formData.kategori) {
          alert("Mohon lengkapi semua field!");
          return;
        }
        if (selectedItem) {
          const updated = dataTopik.map((item) =>
            item.id === selectedItem.id
              ? { ...item, topik: formData.topik, kategori: formData.kategori }
              : item
          );
          setDataTopik(updated);
          setShowEditModal(false);
          setSelectedItem(null);
        }
      };

    return (
        <div className="font-lexend min-h-full flex flex-col">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
                <p className="font-bold text-lg sm:text-xl mb-1">Manajemen Adu Swara</p>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">Kelola topik campaign dan lihat history kompetisi berbicara dengan sistem gamifikasi</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-white rounded-xl sm:rounded-2xl border border-[#B3C8CF] shadow py-3 sm:py-4 px-4 sm:px-6 min-w-0">
                        <p className="text-[#41A745] bg-[#E9F6EC] text-xs sm:text-sm w-max py-1 px-2 sm:px-3 rounded-full mb-4 sm:mb-6">+42 bulan ini</p>
                        <p className="font-bold text-3xl sm:text-4xl md:text-5xl text-[#39363D] mb-1">248</p>
                        <p className="text-gray-600 text-sm sm:text-base">Total Pertandingan</p>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-2xl border border-[#B3C8CF] shadow py-3 sm:py-4 px-4 sm:px-6 min-w-0">
                        <p className="text-[#41A745] bg-[#E9F6EC] text-xs sm:text-sm w-max py-1 px-2 sm:px-3 rounded-full mb-4 sm:mb-6">85 topik aktif</p>
                        <p className="font-bold text-3xl sm:text-4xl md:text-5xl text-[#39363D] mb-1">102</p>
                        <p className="text-gray-600 text-sm sm:text-base">Total Topik</p>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-2xl border border-[#B3C8CF] shadow py-3 sm:py-4 px-4 sm:px-6 min-w-0">
                        <p className="text-[#3F71EC] bg-[#EFF6FF] text-xs sm:text-sm w-max py-1 px-2 sm:px-3 rounded-full mb-4 sm:mb-6">+3</p>
                        <p className="font-bold text-3xl sm:text-4xl md:text-5xl text-[#39363D] mb-1">1,248</p>
                        <p className="text-gray-600 text-sm sm:text-base">Total Partisipan</p>
                    </div>
                </div>
            </div>
            <div className='bg-white rounded-xl sm:rounded-2xl overflow-hidden'>
                <div className="">
                    {/* Tabs Header */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex justify-center items-center flex-1 gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-medium transition-colors relative text-xs sm:text-base ${activeTab === 'history'
                                ? 'text-orange-500 bg-[#FFE4D3] rounded-tl-xl sm:rounded-tl-2xl'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            History Pertandingan
                            {activeTab === 'history' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('topics')}
                            className={`flex justify-center items-center flex-1 gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-medium transition-colors relative text-xs sm:text-base ${activeTab === 'topics'
                                ? 'text-orange-500 bg-[#FFE4D3] rounded-tr-xl sm:rounded-tr-2xl'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                            </svg>
                            Kelola Topik
                            {activeTab === 'topics' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                            )}
                        </button>
                    </div>

                    {/* Tabs Content */}
                    <div className="p-4 sm:p-6">
                        {activeTab === 'history' && (
                            <div>
                                <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">
                                    Menampilkan riwayat pertandingan yang sudah selesai
                                </p>
                                <div className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden">
                                    <div className="relative">
                                        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-gray-100 pb-2" style={{ scrollbarWidth: 'thin' }}>
                                            <div className="inline-block min-w-full align-middle">
                                                <table className="w-full min-w-[900px] sm:min-w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th
                                                            className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap min-w-[200px]"
                                                            onClick={() => handleSort("peserta")}
                                                        >
                                                            <div className="flex items-center gap-1 sm:gap-2">
                                                                PESERTA
                                                                <span className="inline-flex w-3 sm:w-4 justify-center">
                                                                    {sortFieldHistory === "peserta" &&
                                                                    (sortOrderHistory === "asc" ? (
                                                                        <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                    ) : (
                                                                        <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                    ))}
                                                                </span>
                                                            </div>
                                                        </th>
                                                        <th
                                                            className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[200px]"
                                                            onClick={() => handleSort("topik")}
                                                        >
                                                            <div className="flex items-center gap-1 sm:gap-2">
                                                                TOPIK
                                                                <span className="inline-flex w-3 sm:w-4 justify-center">
                                                                    {sortFieldHistory === "topik" &&
                                                                        (sortOrderHistory === "asc" ? (
                                                                            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                        ) : (
                                                                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                        ))}
                                                                </span>
                                                            </div>
                                                        </th>
                                                        <th
                                                            className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap min-w-[150px]"
                                                            onClick={() => handleSort("pemenang")}
                                                        >
                                                            <div className="flex items-center gap-1 sm:gap-2">
                                                                PEMENANG
                                                                <span className="inline-flex w-3 sm:w-4 justify-center">
                                                                    {sortFieldHistory === "pemenang" &&
                                                                        (sortOrderHistory === "asc" ? (
                                                                            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                        ) : (
                                                                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                        ))}
                                                                </span>
                                                            </div>
                                                        </th>
                                                        <th
                                                            className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap min-w-[180px]"
                                                            onClick={() => handleSort("bergabung")}
                                                        >
                                                            <div className="flex items-center gap-1 sm:gap-2">
                                                                BERGABUNG
                                                                <span className="inline-flex w-3 sm:w-4 justify-center">
                                                                    {sortFieldHistory === "bergabung" &&
                                                                        (sortOrderHistory === "asc" ? (
                                                                            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                        ) : (
                                                                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                        ))}
                                                                </span>
                                                            </div>
                                                        </th>
                                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[80px]">
                                                            AKSI
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {sortedData.map((item) => (
                                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap min-w-[200px]">
                                                                <div className="flex items-center gap-2 sm:gap-3">
                                                                    <div className="flex items-center min-w-0">
                                                                        <img src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg" className="w-6 h-6 sm:w-[38px] sm:h-[38px] rounded-full mr-1 sm:mr-2 flex-shrink-0" alt="pp1" />
                                                                        <p className="text-xs sm:text-sm whitespace-nowrap">Siti Nurhaliza</p>
                                                                    </div>
                                                                    <p className="text-[#F07122] text-xs sm:text-sm font-bold flex-shrink-0">VS</p>
                                                                    <div className="flex items-center min-w-0">
                                                                        <img src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg" className="w-6 h-6 sm:w-[38px] sm:h-[38px] rounded-full mr-1 sm:mr-2 flex-shrink-0" alt="pp1" />
                                                                        <p className="text-xs sm:text-sm whitespace-nowrap">Siti Nurhaliza</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 sm:px-6 py-3 sm:py-4 min-w-[200px] max-w-[300px]">
                                                                <p className="text-[#39363D] text-xs sm:text-sm break-words">{item.topik}</p>
                                                            </td>
                                                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap min-w-[150px]">
                                                                <p className="inline-block text-white text-xs sm:text-sm bg-gradient-to-l to-[#F07122] from-[#F8C56A] py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg whitespace-nowrap">🏆 {item.pemenang}</p>
                                                            </td>
                                                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap min-w-[180px]">
                                                                <p className="text-[#39363D] text-xs sm:text-sm">{item.bergabung}</p>
                                                            </td>
                                                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                                <div className="flex items-center gap-1 sm:gap-2">
                                                                    <Link 
                                                                        href={'/admin/manage-adu-swara/apacb'}
                                                                        className="p-1.5 sm:p-2 hover:bg-orange-300 rounded-lg transition-colors"
                                                                    >
                                                                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-[#F07122]" />
                                                                    </Link>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    </div>
                                    {sortedData.length === 0 && (
                                        <div className="text-center py-12 px-4">
                                            <p className="text-gray-500 text-lg">Tidak ada data</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'topics' && (
                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
                                    <p className="text-gray-500 text-xs sm:text-sm">
                                        Topik akan diacak otomatis oleh sistem saat pertandingan dimulai
                                    </p>
                                    <button className="bg-[#F07122] text-white py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm rounded-md flex items-center justify-center whitespace-nowrap" onClick={() => handleAdd()}><Plus className="w-4 h-4 mr-2 sm:mr-3" />Tambah Topik Baru</button>
                                </div>
                                <div className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden">
                                    <div className="relative">
                                        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-gray-100 pb-2" style={{ scrollbarWidth: 'thin' }}>
                                            <div className="inline-block min-w-full align-middle">
                                                <table className="w-full min-w-[900px] sm:min-w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th
                                                            className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[250px]"
                                                            onClick={() => handleSortTopik("topik")}
                                                        >
                                                            <div className="flex items-center gap-1 sm:gap-2">
                                                                TOPIK
                                                                <span className="inline-flex w-3 sm:w-4 justify-center">
                                                                    {sortFieldTopik === "topik" &&
                                                                    (sortOrderTopik === "asc" ? (
                                                                        <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                    ) : (
                                                                        <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                    ))}
                                                                </span>
                                                            </div>
                                                        </th>
                                                        <th
                                                            className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap min-w-[120px]"
                                                            onClick={() => handleSortTopik("kategori")}
                                                        >
                                                            <div className="flex items-center gap-1 sm:gap-2">
                                                                KATEGORI
                                                                <span className="inline-flex w-3 sm:w-4 justify-center">
                                                                    {sortFieldTopik === "kategori" &&
                                                                        (sortOrderTopik === "asc" ? (
                                                                            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                        ) : (
                                                                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                        ))}
                                                                </span>
                                                            </div>
                                                        </th>
                                                        <th
                                                            className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap min-w-[100px]"
                                                            onClick={() => handleSortTopik("digunakan")}
                                                        >
                                                            <div className="flex items-center gap-1 sm:gap-2">
                                                                DIGUNAKAN
                                                                <span className="inline-flex w-3 sm:w-4 justify-center">
                                                                    {sortFieldTopik === "digunakan" &&
                                                                        (sortOrderTopik === "asc" ? (
                                                                            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                        ) : (
                                                                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                        ))}
                                                                </span>
                                                            </div>
                                                        </th>
                                                        <th
                                                            className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap min-w-[130px]"
                                                            onClick={() => handleSortTopik("dibuat")}
                                                        >
                                                            <div className="flex items-center gap-1 sm:gap-2">
                                                                DIBUAT
                                                                <span className="inline-flex w-3 sm:w-4 justify-center">
                                                                    {sortFieldTopik === "dibuat" &&
                                                                        (sortOrderTopik === "asc" ? (
                                                                            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                        ) : (
                                                                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                        ))}
                                                                </span>
                                                            </div>
                                                        </th>
                                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[100px]">
                                                            AKSI
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {sortedDataTopik.map((item) => (
                                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-3 sm:px-6 py-3 sm:py-4 min-w-[250px] max-w-[400px]">
                                                                <p className="text-xs sm:text-sm break-words">{item.topik}</p>
                                                            </td>
                                                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap min-w-[120px]">
                                                                <p className="text-[#3C40AF] text-xs bg-[#DBEAFE] inline-block py-1.5 sm:py-2 px-2 sm:px-4 rounded-full whitespace-nowrap">{item.kategori}</p>
                                                            </td>
                                                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap min-w-[100px]">
                                                                <p className="text-xs sm:text-sm">{item.digunakan}</p>
                                                            </td>
                                                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap min-w-[130px]">
                                                                <p className="text-[#39363D] text-xs sm:text-sm">{item.dibuat}</p>
                                                            </td>
                                                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                                <div className="flex items-center gap-1 sm:gap-2">
                                                                    <button
                                                                        onClick={() => handleEdit(item)}
                                                                        className="p-1.5 sm:p-2 hover:bg-orange-300 rounded-lg transition-colors"
                                                                    >
                                                                        <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-[#F07122]" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteClick(item)}
                                                                        className="p-1.5 sm:p-2 hover:bg-orange-300 rounded-lg transition-colors"
                                                                    >
                                                                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#F07122]" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    </div>
                                    {sortedDataTopik.length === 0 && (
                                        <div className="text-center py-12 px-4">
                                            <p className="text-gray-500 text-lg">Tidak ada data</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showEditModal && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-semibold">Edit Topik</h2>
                            <button onClick={() => setShowEditModal(false)}>✕</button>
                        </div>

                        <div className="flex space-x-4 mb-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Judul Topik*
                                </label>
                                <input
                                    type="text"
                                    value={formData.topik}
                                    onChange={(e) =>
                                        setFormData({ ...formData, topik: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-[#B3C8CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F07122]"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kategori*
                                </label>
                                <select name="" id="" className="w-full px-4 py-2 border border-[#B3C8CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F07122]">
                                    <option value="">Kategori</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kata Kunci*
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-[#B3C8CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F07122] mb-1"
                            />
                            <p className="text-xs text-gray-400">Masukkan kata kunci dan pisahkan dengan koma</p>
                        </div>

                        <button
                            onClick={handleSaveEdit}
                            className="bg-[#F07122] w-full py-3 text-white font-medium rounded-lg mt-6 hover:bg-[#d96419] transition-colors text-sm"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Tambah Topik Baru</h2>
                            <button onClick={() => setShowAddModal(false)}>✕</button>
                        </div>

                        <div className="py-2 px-3 border border-[#65B5F0] text-[#65B5F0] bg-[#EFF6FF] rounded-lg mb-3 text-sm">
                            Topik yang Anda buat akan otomatis masuk ke dalam sistem pengacakan. Pastikan topik relevan, menarik, dan sesuai dengan kategori yang dipilih.
                        </div>

                        <div className="flex space-x-4 mb-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Judul Topik*
                                </label>
                                <input
                                    type="text"
                                    value={formData.topik}
                                    onChange={(e) =>
                                        setFormData({ ...formData, topik: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-[#B3C8CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F07122]"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kategori*
                                </label>
                                <select name="" id="" className="w-full px-4 py-2 border border-[#B3C8CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F07122]">
                                    <option value="">Kategori</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kata Kunci*
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-[#B3C8CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F07122] mb-1"
                            />
                            <p className="text-xs text-gray-400">Masukkan kata kunci dan pisahkan dengan koma</p>
                        </div>

                        <button
                            onClick={handleSaveEdit}
                            className="bg-[#F07122] w-full py-3 text-white font-medium rounded-lg mt-6 hover:bg-[#d96419] transition-colors text-sm"
                        >
                            Simpan Topik
                        </button>
                    </div>
                </div>
            )}

            {showDeleteModal && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg w-full max-w-[600px]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Konfirmasi</h2>
                            <button onClick={() => setShowDeleteModal(false)}>✕</button>
                        </div>

                        <div className="text-center py-8">
                            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <Trash2 className="w-12 h-12 text-red-600" />
                            </div>

                            <p className="text-gray-800 font-semibold mb-2">
                                Apakah kamu yakin ingin menghapus topik ini?
                            </p>
                            <p className="text-gray-600 mb-4">{selectedItem.topik}</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-3 bg-[#F07122] text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}