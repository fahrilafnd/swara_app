"use client";
import React, { useState, useMemo } from "react";
import { Edit2, Trash2, ChevronUp, ChevronDown } from "lucide-react";

interface DataItem {
    id: number;
    topik: string;
    kalimat: string;
}

type SortField = "topik" | "kalimat";
type SortOrder = "asc" | "desc";


export default function ManageSkorSwara() {
    const [data, setData] = useState<DataItem[]>([
        {
            id: 1,
            topik: "Public Speaking",
            kalimat: "Berbicara di depan umum membutuhkan latihan dan kepercayaan diri",
        },
        {
            id: 2,
            topik: "Motivasi",
            kalimat: "Kunci kesuksesan adalah konsistensi dan kerja keras",
        },
        {
            id: 3,
            topik: "Leadership",
            kalimat: "Pemimpin yang baik mendengarkan dan menginspirasi timnya",
        },
        {
            id: 4,
            topik: "Bisnis",
            kalimat: "Strategi yang tepat membawa kesuksesan dalam berbisnis",
        },
        {
            id: 5,
            topik: "Komunikasi",
            kalimat: "Komunikasi efektif adalah kunci hubungan yang baik",
        },
    ]);

    const [sortField, setSortField] = useState<SortField>("topik");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
    const [formData, setFormData] = useState({
        topik: "",
        kalimat: "",
    });

    // Sorting logic
    const sortedData = useMemo(() => {
        const sorted = [...data].sort((a, b) => {
            const aValue = a[sortField].toLowerCase();
            const bValue = b[sortField].toLowerCase();

            if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
            if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [data, sortField, sortOrder]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const handleEdit = (item: DataItem) => {
        setSelectedItem(item);
        setFormData({
            topik: item.topik,
            kalimat: item.kalimat,
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = (item: DataItem) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedItem) {
            setData(data.filter((item) => item.id !== selectedItem.id));
            setShowDeleteModal(false);
            setSelectedItem(null);
        }
    };

    const handleSaveEdit = () => {
        if (!formData.topik || !formData.kalimat) {
            alert("Mohon lengkapi semua field!");
            return;
        }

        if (selectedItem) {
            const updated = data.map((item) =>
                item.id === selectedItem.id
                    ? { ...item, topik: formData.topik, kalimat: formData.kalimat }
                    : item
            );
            setData(updated);
            setShowEditModal(false);
            setSelectedItem(null);
            setFormData({ topik: "", kalimat: "" });
        }
    };

    return (
        <div className="font-lexend h-full flex flex-col">
            <div className="bg-white rounded-2xl p-6 mb-6">
                <p className="font-bold text-xl mb-1">Manajemen Skor Swara</p>
                <p className="text-gray-600 mb-4">Kelola data latihan skor swara dan olah kalimat yang ingin disajikan.</p>
                <div className="flex justify-between space-x-8">
                    <div className="flex-1 bg-white rounded-2xl border border-[#B3C8CF] shadow py-3 px-6">
                        <p className="text-[#41A745] bg-[#E9F6EC] text-sm w-max py-1 px-3 rounded-full mb-6">+12%</p>
                        <p className="font-bold text-5xl text-[#39363D] mb-1">50</p>
                        <p className="text-gray-600">Total Penggunaan</p>
                    </div>
                    <div className="flex-1 bg-white rounded-2xl border border-[#B3C8CF] shadow py-3 px-6">
                        <p className="text-[#41A745] bg-[#E9F6EC] text-sm w-max py-1 px-3 rounded-full mb-6">+3</p>
                        <p className="font-bold text-5xl text-[#39363D] mb-1">20</p>
                        <p className="text-gray-600">Kalimat dibuat</p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-6">
                <p className="font-bold text-xl mb-4">Skor Swara</p>
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
                                            {sortField === "topik" &&
                                                (sortOrder === "asc" ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                ))}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort("kalimat")}
                                    >
                                        <div className="flex items-center gap-2">
                                            KALIMAT
                                            {sortField === "kalimat" &&
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
                                {sortedData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-gray-900">
                                                {item.topik}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-700 text-sm">{item.kalimat}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-5 h-5 text-orange-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(item)}
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

                        {sortedData.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">Tidak ada data</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Modal Edit */}
            {showEditModal && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 shadow-lg w-[600px]">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-semibold">Edit Skor Swara</h2>
                            <button onClick={() => setShowEditModal(false)}>
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6.575 7.975L1.675 12.875C1.49167 13.0583 1.25833 13.15 0.975 13.15C0.691667 13.15 0.458333 13.0583 0.275 12.875C0.0916663 12.6917 0 12.4583 0 12.175C0 11.8917 0.0916663 11.6583 0.275 11.475L5.175 6.575L0.275 1.675C0.0916663 1.49167 0 1.25833 0 0.975C0 0.691667 0.0916663 0.458333 0.275 0.275C0.458333 0.0916663 0.691667 0 0.975 0C1.25833 0 1.49167 0.0916663 1.675 0.275L6.575 5.175L11.475 0.275C11.6583 0.0916663 11.8917 0 12.175 0C12.4583 0 12.6917 0.0916663 12.875 0.275C13.0583 0.458333 13.15 0.691667 13.15 0.975C13.15 1.25833 13.0583 1.49167 12.875 1.675L7.975 6.575L12.875 11.475C13.0583 11.6583 13.15 11.8917 13.15 12.175C13.15 12.4583 13.0583 12.6917 12.875 12.875C12.6917 13.0583 12.4583 13.15 12.175 13.15C11.8917 13.15 11.6583 13.0583 11.475 12.875L6.575 7.975Z"
                                        fill="black"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Topik
                                </label>
                                <input
                                    type="text"
                                    value={formData.topik}
                                    onChange={(e) =>
                                        setFormData({ ...formData, topik: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-[#B3C8CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F07122]"
                                    placeholder="Masukkan topik"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kalimat
                                </label>
                                <textarea
                                    value={formData.kalimat}
                                    onChange={(e) =>
                                        setFormData({ ...formData, kalimat: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-[#B3C8CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F07122] resize-none"
                                    rows={4}
                                    placeholder="Masukkan kalimat"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSaveEdit}
                            className="bg-[#F07122] w-full py-3 text-white font-medium rounded-lg mt-6 mx-auto block hover:bg-[#d96419] transition-colors text-sm"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Delete */}
            {showDeleteModal && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 shadow-lg w-[600px]">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Konfirmasi</h2>
                            <button onClick={() => setShowDeleteModal(false)}>
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6.575 7.975L1.675 12.875C1.49167 13.0583 1.25833 13.15 0.975 13.15C0.691667 13.15 0.458333 13.0583 0.275 12.875C0.0916663 12.6917 0 12.4583 0 12.175C0 11.8917 0.0916663 11.6583 0.275 11.475L5.175 6.575L0.275 1.675C0.0916663 1.49167 0 1.25833 0 0.975C0 0.691667 0.0916663 0.458333 0.275 0.275C0.458333 0.0916663 0.691667 0 0.975 0C1.25833 0 1.49167 0.0916663 1.675 0.275L6.575 5.175L11.475 0.275C11.6583 0.0916663 11.8917 0 12.175 0C12.4583 0 12.6917 0.0916663 12.875 0.275C13.0583 0.458333 13.15 0.691667 13.15 0.975C13.15 1.25833 13.0583 1.49167 12.875 1.675L7.975 6.575L12.875 11.475C13.0583 11.6583 13.15 11.8917 13.15 12.175C13.15 12.4583 13.0583 12.6917 12.875 12.875C12.6917 13.0583 12.4583 13.15 12.175 13.15C11.8917 13.15 11.6583 13.0583 11.475 12.875L6.575 7.975Z"
                                        fill="black"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="text-center py-8">
                            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <Trash2 className="w-12 h-12 text-red-600" />
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Apakah Kamu Yakin Akan Menonaktifkan Pengguna Ini?
                            </h3>

                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4 mb-6">
                                <p className="text-sm font-semibold text-gray-700">
                                    Topik: {selectedItem.topik}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {selectedItem.kalimat}
                                </p>
                            </div>
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