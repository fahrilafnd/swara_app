'use client';

import React, { useState, useMemo } from "react";
import { Trash2, ChevronUp, ChevronDown, Eye } from "lucide-react";
import Link from "next/link";

interface DataItemHistory {
    id: number;
    peserta: string;
    topik: string;
    pemenang: string;
    bergabung: string;
}

type SortFieldHistory = "peserta" | "topik" | "pemenang" | "bergabung";
type SortOrderHistory = "asc" | "desc";

export default function ManageAduSwara() {
    const [activeTab, setActiveTab] = useState('history');

    const [dataHistory, setDataHistory] = useState<DataItemHistory[]>([
        {
            id: 1,
            peserta: "Ya",
            topik: "apa",
            pemenang: "aa",
            bergabung: "dd"
        },
        {
            id: 2,
            peserta: "Rie",
            topik: "ba",
            pemenang: "aa",
            bergabung: "dd"
        },
    ]);

    const [sortFieldHistory, setSortFieldHistory] = useState<SortFieldHistory>("topik");
    const [sortOrderHistory, setSortOrderHistory] = useState<SortOrderHistory>("asc");

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

    return (
        <div className="font-lexend h-full flex flex-col">
            <div className="bg-white rounded-2xl p-6 mb-6">
                <p className="font-bold text-xl mb-1">Manajemen Adu Swara</p>
                <p className="text-gray-600 mb-4">Kelola topik campaign dan lihat history kompetisi berbicara dengan sistem gamifikasi</p>
                <div className="flex justify-between space-x-8">
                    <div className="flex-1 bg-white rounded-2xl border border-[#B3C8CF] shadow py-3 px-6">
                        <p className="text-[#41A745] bg-[#E9F6EC] text-sm w-max py-1 px-3 rounded-full mb-6">+42 bulan ini</p>
                        <p className="font-bold text-5xl text-[#39363D] mb-1">248</p>
                        <p className="text-gray-600">Total Pertandingan</p>
                    </div>
                    <div className="flex-1 bg-white rounded-2xl border border-[#B3C8CF] shadow py-3 px-6">
                        <p className="text-[#41A745] bg-[#E9F6EC] text-sm w-max py-1 px-3 rounded-full mb-6">85 topik aktif</p>
                        <p className="font-bold text-5xl text-[#39363D] mb-1">102</p>
                        <p className="text-gray-600">Total Topik</p>
                    </div>
                    <div className="flex-1 bg-white rounded-2xl border border-[#B3C8CF] shadow py-3 px-6">
                        <p className="text-[#3F71EC] bg-[#EFF6FF] text-sm w-max py-1 px-3 rounded-full mb-6">+3</p>
                        <p className="font-bold text-5xl text-[#39363D] mb-1">1,248</p>
                        <p className="text-gray-600">Total Partisipan</p>
                    </div>
                </div>
            </div>
            <div className='bg-white rounded-2xl'>
                <div className="">
                    {/* Tabs Header */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex justify-center items-center flex-1 gap-2 px-6 py-4 font-medium transition-colors relative ${activeTab === 'history'
                                ? 'text-orange-500 bg-[#FFE4D3] rounded-tl-2xl'
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
                            className={`flex justify-center items-center flex-1 gap-2 px-6 py-4 font-medium transition-colors relative ${activeTab === 'topics'
                                ? 'text-orange-500 bg-[#FFE4D3] rounded-tr-2xl'
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
                    <div className="p-6">
                        {activeTab === 'history' && (
                            <div>
                                <p className="text-gray-500 text-sm mb-6">
                                    Menampilkan riwayat pertandingan yang sudah selesai
                                </p>
                                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th
                                                        className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                        onClick={() => handleSort("topik")}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            TOPIK
                                                            <span className="inline-flex w-4 justify-center">
                                                                {sortFieldHistory === "topik" &&
                                                                (sortOrderHistory === "asc" ? (
                                                                    <ChevronUp className="w-4 h-4" />
                                                                ) : (
                                                                    <ChevronDown className="w-4 h-4" />
                                                                ))}
                                                            </span>
                                                        </div>
                                                    </th>
                                                    <th
                                                        className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                        onClick={() => handleSort("peserta")}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            PESERTA
                                                            <span className="inline-flex w-4 justify-center">
                                                                {sortFieldHistory === "peserta" &&
                                                                    (sortOrderHistory === "asc" ? (
                                                                        <ChevronUp className="w-4 h-4" />
                                                                    ) : (
                                                                        <ChevronDown className="w-4 h-4" />
                                                                    ))}
                                                            </span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                                        AKSI
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {sortedData.map((item) => (
                                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <span className="font-semibold text-gray-900">
                                                                {item.topik}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-gray-700 text-sm">{item.peserta}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <Link 
                                                                    href={'/admin/manage-adu-swara/apacb'}
                                                                    className="p-2 hover:bg-orange-300 rounded-lg transition-colors"
                                                                >
                                                                    <Eye className="w-5 h-5 text-[#F07122]" />
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {sortedData.length === 0 && (
                                            <div className="text-center py-12">
                                                <p className="text-gray-500 text-lg">Tidak ada data</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'topics' && (
                            <div>
                                <p className="text-gray-500 text-sm mb-6">
                                    Kelola topik-topik untuk pertandingan debat
                                </p>
                                <div className="text-center py-12 text-gray-400">
                                    {/* Konten kelola topik */}
                                    <p>Konten kelola topik akan ditampilkan di sini</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}