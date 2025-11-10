"use client";

import React, { useMemo, useState } from "react";
import {
  Users,
  User as UserIcon,
  Eye,
  UserCheck,
  UserPlus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

/** ==== Types ==== */
type SortKey = "nama" | "role" | "status" | "skor" | "bergabung";

type SortDir = "asc" | "desc";

interface AppUser {
  id: number;
  nama: string;
  email: string;
  avatar: string;
  avatarColor: string;
  role: "Mentor" | "Pengguna Umum";
  roleColor: string;
  status: "AKTIF" | "NONAKTIF";
  statusColor: string;
  skor: string; // bisa "-" atau angka string
  bergabung: string; // contoh: "05 Des 2024"
}

interface FormData {
  input1: string;
  input2: string;
  input3: string;
}

interface SortConfig {
  key: SortKey | null;
  direction: SortDir;
}

/** ==== Helpers ==== */
const ID_MONTHS: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  Mei: 4,
  Jun: 5,
  Jul: 6,
  Agu: 7, // Agustus (kadang "Agt" atau "Agu")
  Agt: 7,
  Sep: 8,
  Okt: 9,
  Nov: 10,
  Des: 11,
};

function parseTanggalID(d: string): number {
  // "05 Des 2024" -> timestamp
  const [dd, mmm, yyyy] = d.split(" ");
  const day = parseInt(dd, 10);
  const month = ID_MONTHS[mmm] ?? 0;
  const year = parseInt(yyyy, 10);
  return new Date(year, month, day).getTime();
}

function toNumberSkor(s: string): number {
  if (s === "-" || s.trim() === "") return -Infinity;
  const n = Number(s.replace(/[^\d.-]/g, ""));
  return Number.isNaN(n) ? -Infinity : n;
}

/** ==== Component ==== */
export default function ManajemenPengguna() {
  const [activeTab, setActiveTab] = useState<
    "Semua" | "Pengguna Umum" | "Mentor" | "Aktif" | "Nonaktif"
  >("Semua");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    input1: "",
    input2: "",
    input3: "",
  });

  const stats = [
    { icon: Users, value: "1,234", label: "Total Pengguna", change: "+10%" },
    { icon: UserIcon, value: "892", label: "Pengguna Aktif", change: "+8%" },
    { icon: UserCheck, value: "45", label: "Mentor Tersedia", change: "+3%" },
    {
      icon: UserPlus,
      value: "156",
      label: "Pengguna Baru Bulan Ini",
      change: "+1",
    },
  ];

  const tabs: Array<typeof activeTab> = [
    "Semua",
    "Pengguna Umum",
    "Mentor",
    "Aktif",
    "Nonaktif",
  ];

  const [users] = useState<AppUser[]>([
    {
      id: 1,
      nama: "Farhan Abdullah",
      email: "farhan@gmail.com",
      avatar: "F",
      avatarColor: "bg-orange-500",
      role: "Mentor",
      roleColor: "bg-blue-100 text-blue-600",
      status: "AKTIF",
      statusColor: "bg-green-100 text-green-600",
      skor: "-",
      bergabung: "12 Jan 2025",
    },
    {
      id: 2,
      nama: "Rina Sari",
      email: "rina@gmail.com",
      avatar: "R",
      avatarColor: "bg-orange-500",
      role: "Pengguna Umum",
      roleColor: "bg-gray-100 text-gray-600",
      status: "AKTIF",
      statusColor: "bg-green-100 text-green-600",
      skor: "25",
      bergabung: "05 Des 2024",
    },
  ]);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form data:", formData);
    setIsModalOpen(false);
    setFormData({ input1: "", input2: "", input3: "" });
  };

  const handleDeactivateUser = (userId: number, userName: string) => {
    Swal.fire({
      title: "",
      html: `
        <div style="text-align:center;padding:20px 0;">
          <div style="display:inline-block;background:linear-gradient(135deg,#ff6b6b 0%,#ff5252 100%);border-radius:20px;padding:20px;margin-bottom:20px;">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 style="font-size:20px;font-weight:600;color:#1f2937;margin-bottom:8px;">Konfirmasi</h2>
          <p style="font-size:14px;color:#6b7280;margin-bottom:0;">Apakah Kamu Yakin Akan Menonaktifkan Pengguna Ini?</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#e5e7eb",
      confirmButtonText:
        '<span style="color:white;font-weight:500;">Konfirmasi</span>',
      cancelButtonText:
        '<span style="color:#6b7280;font-weight:500;">Batal</span>',
      customClass: {
        popup: "rounded-3xl",
        confirmButton: "rounded-xl px-8 py-3",
        cancelButton: "rounded-xl px-8 py-3",
      },
      showCloseButton: true,
      closeButtonHtml: "×",
      width: "400px",
      padding: "2rem",
    }).then((res) => {
      if (res.isConfirmed) {
        console.log(`Deactivating user ${userId}`);
        Swal.fire({
          title: "Berhasil!",
          text: `${userName} telah dinonaktifkan.`,
          icon: "success",
          confirmButtonColor: "#f97316",
          confirmButtonText: "OK",
          customClass: {
            popup: "rounded-3xl",
            confirmButton: "rounded-xl px-8 py-3",
          },
          width: "400px",
          padding: "2rem",
        });
      }
    });
  };

  /** ==== Filter & Sort ==== */
  const filteredUsers = useMemo(() => {
    switch (activeTab) {
      case "Pengguna Umum":
        return users.filter((u) => u.role === "Pengguna Umum");
      case "Mentor":
        return users.filter((u) => u.role === "Mentor");
      case "Aktif":
        return users.filter((u) => u.status === "AKTIF");
      case "Nonaktif":
        return users.filter((u) => u.status === "NONAKTIF");
      default:
        return users;
    }
  }, [activeTab, users]);

  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filteredUsers;

    const dir = sortConfig.direction === "asc" ? 1 : -1;
    const key = sortConfig.key;

    return [...filteredUsers].sort((a, b) => {
      switch (key) {
        case "nama": {
          return a.nama.localeCompare(b.nama) * dir;
        }
        case "role": {
          return a.role.localeCompare(b.role) * dir;
        }
        case "status": {
          return a.status.localeCompare(b.status) * dir;
        }
        case "skor": {
          const na = toNumberSkor(a.skor);
          const nb = toNumberSkor(b.skor);
          return (na - nb) * dir;
        }
        case "bergabung": {
          const ta = parseTanggalID(a.bergabung);
          const tb = parseTanggalID(b.bergabung);
          return (ta - tb) * dir;
        }
        default:
          return 0;
      }
    });
  }, [filteredUsers, sortConfig]);

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
            Manajemen Pengguna
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Kelola data pengguna, mentor, dan hak akses dalam platform SWARA
          </p>
        </div>

        {/* Statistic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="bg-green-50 p-2 sm:p-3 rounded-lg">
                  <s.icon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-green-500">
                  {s.change}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                {s.value}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Pengguna</h2>
        </div>

        {/* Tabs */}
        <div className="px-4 sm:px-6 pt-3 sm:pt-4 flex gap-1 sm:gap-2 border-b border-gray-100 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Add Mentor Button */}
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 sm:py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-colors text-sm sm:text-base"
          >
            Tambahkan Mentor
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <Th
                  onClick={() => handleSort("nama")}
                  active={sortConfig.key === "nama"}
                  dir={sortConfig.direction}
                >
                  Pengguna
                </Th>
                <Th
                  onClick={() => handleSort("role")}
                  active={sortConfig.key === "role"}
                  dir={sortConfig.direction}
                >
                  Role
                </Th>
                <Th
                  onClick={() => handleSort("status")}
                  active={sortConfig.key === "status"}
                  dir={sortConfig.direction}
                >
                  Status
                </Th>
                <Th
                  onClick={() => handleSort("skor")}
                  active={sortConfig.key === "skor"}
                  dir={sortConfig.direction}
                >
                  Skor SWARA
                </Th>
                <Th
                  onClick={() => handleSort("bergabung")}
                  active={sortConfig.key === "bergabung"}
                  dir={sortConfig.direction}
                >
                  Bergabung
                </Th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {sortedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Link href={`/admin/profile/${user.id}`}>
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 ${user.avatarColor} rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`}
                        >
                          <span className="text-white font-semibold text-xs sm:text-sm">
                            {user.avatar}
                          </span>
                        </div>
                      </Link>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                          {user.nama}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 sm:px-3 py-1 text-xs font-medium rounded-full ${user.roleColor}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 sm:px-3 py-1 text-xs font-medium rounded-full ${user.statusColor}`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span className="text-xs sm:text-sm text-gray-800">{user.skor}</span>
                  </td>

                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span className="text-xs sm:text-sm text-gray-800">
                      {user.bergabung}
                    </span>
                  </td>

                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <Link
                        href={`/admin/manage-pengguna/user-performance/${user.id}`}
                      >
                        <button
                          className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                          title="Lihat Performance"
                        >
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDeactivateUser(user.id, user.nama)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Nonaktifkan Pengguna"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {sortedUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 sm:px-6 py-8 sm:py-10 text-center text-gray-500 text-sm sm:text-base"
                  >
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (dummy) */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <div className="text-xs sm:text-sm text-gray-500">
            Menampilkan {sortedUsers.length} data
          </div>
          <div className="flex gap-2">
            <button
              className="px-2 sm:px-3 py-1 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-600 hover:bg-gray-50"
              disabled
            >
              Previous
            </button>
            <button className="px-2 sm:px-3 py-1 bg-orange-500 text-white rounded-lg text-xs sm:text-sm">
              1
            </button>
            <button
              className="px-2 sm:px-3 py-1 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-600 hover:bg-gray-50"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal Tambah (contoh form sederhana) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Tambah</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1 sm:mb-2">
                      Judul 1
                    </label>
                    <input
                      type="text"
                      name="input1"
                      value={formData.input1}
                      onChange={handleInputChange}
                      placeholder="Input 1"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base text-gray-600 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1 sm:mb-2">
                      Judul 2
                    </label>
                    <input
                      type="text"
                      name="input2"
                      value={formData.input2}
                      onChange={handleInputChange}
                      placeholder="Input 2"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base text-gray-600 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1 sm:mb-2">
                    Judul 3
                  </label>
                  <input
                    type="text"
                    name="input3"
                    value={formData.input3}
                    onChange={handleInputChange}
                    placeholder="Input 3"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base text-gray-600 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="mt-6 sm:mt-8">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 sm:py-4 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-colors text-sm sm:text-base md:text-lg"
                >
                  Simpan …..
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/** Small header cell with chevron */
function Th({
  children,
  onClick,
  active,
  dir,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  dir: SortDir;
}) {
  return (
    <th
      className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none"
      onClick={onClick}
    >
      <div className="flex items-center gap-1 sm:gap-2">
        {children}
        <svg
          width="8"
          height="8"
          className={`sm:w-[10px] sm:h-[10px] transition-transform ${
            active && dir === "desc" ? "rotate-180" : ""
          }`}
          viewBox="0 0 10 10"
        >
          <path
            d="M1 3.5L5 7.5L9 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </th>
  );
}
