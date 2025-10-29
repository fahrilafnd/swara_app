"use client"

import React, { useState } from 'react';
import { Users, User, Eye, UserCheck, UserPlus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

interface User {
  id: number;
  nama: string;
  email: string;
  avatar: string;
  avatarColor: string;
  role: string;
  roleColor: string;
  status: string;
  statusColor: string;
  skor: string;
  bergabung: string;
}

interface FormData {
  input1: string;
  input2: string;
  input3: string;
}

interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc';
}

export default function ManajemenPengguna() {
  const [activeTab, setActiveTab] = useState<string>('Semua');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    input1: '',
    input2: '',
    input3: ''
  });
  
  const stats = [
    {
      icon: Users,
      value: '1,234',
      label: 'Total Pengguna',
      change: '+10%',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    },
    {
      icon: User,
      value: '892',
      label: 'Pengguna Aktif',
      change: '+8%',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    },
    {
      icon: UserCheck,
      value: '45',
      label: 'Mentor Tersedia',
      change: '+3%',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    },
    {
      icon: UserPlus,
      value: '156',
      label: 'Pengguna Baru Bulan Ini',
      change: '+1',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    }
  ];

  const tabs = ['Semua', 'Pengguna Umum', 'Mentor', 'Aktif', 'Nonaktif'];

  const [users] = useState<User[]>([
    {
      id: 1,
      nama: 'Farhan Abdullah',
      email: 'farhan@gmail.com',
      avatar: 'F',
      avatarColor: 'bg-orange-500',
      role: 'Mentor',
      roleColor: 'bg-blue-100 text-blue-600',
      status: 'AKTIF',
      statusColor: 'bg-green-100 text-green-600',
      skor: '-',
      bergabung: '12 Jan 2025'
    },
    {
      id: 2,
      nama: 'Rina Sari',
      email: 'rina@gmail.com',
      avatar: 'R',
      avatarColor: 'bg-orange-500',
      role: 'Pengguna Umum',
      roleColor: 'bg-gray-100 text-gray-600',
      status: 'AKTIF',
      statusColor: 'bg-green-100 text-green-600',
      skor: '25',
      bergabung: '05 Des 2024'
    }
  ]);

  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form data:', formData);
    // Handle form submission here
    setIsModalOpen(false);
    setFormData({ input1: '', input2: '', input3: '' });
  };

  const handleDeactivateUser = (userId: number, userName: string) => {
    Swal.fire({
      title: '',
      html: `
        <div style="text-align: center; padding: 20px 0;">
          <div style="display: inline-block; background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%); border-radius: 20px; padding: 20px; margin-bottom: 20px;">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 style="font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">Konfirmasi</h2>
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">Apakah Kamu Yakin Akan Menonaktifkan Pengguna Ini?</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#e5e7eb',
      confirmButtonText: '<span style="color: white; font-weight: 500;">Konfirmasi</span>',
      cancelButtonText: '<span style="color: #6b7280; font-weight: 500;">Batal</span>',
      buttonsStyling: true,
      customClass: {
        popup: 'rounded-3xl',
        confirmButton: 'rounded-xl px-8 py-3',
        cancelButton: 'rounded-xl px-8 py-3'
      },
      showCloseButton: true,
      closeButtonHtml: '×',
      width: '400px',
      padding: '2rem'
    }).then((result) => {
      if (result.isConfirmed) {
        // Handle deactivation logic here
        console.log(`Deactivating user ${userId}`);
        Swal.fire({
          title: 'Berhasil!',
          text: `${userName} telah dinonaktifkan.`,
          icon: 'success',
          confirmButtonColor: '#f97316',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'rounded-3xl',
            confirmButton: 'rounded-xl px-8 py-3'
          },
          width: '400px',
          padding: '2rem'
        });
      }
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Manajemen Pengguna</h1>
          <p className="text-gray-500">Kelola data pengguna, mentor, dan hak akses dalam platform SWARA</p>
        </div>

        {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <span className="text-sm font-semibold text-green-500">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Pengguna</h2>
          </div>

          {/* Tabs */}
          <div className="px-6 pt-4 flex gap-2 border-b border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Add Mentor Button */}
          <div className="px-6 py-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-colors"
            >
              Tambahkan Mentor
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('pengguna')}
                  >
                    <div className="flex items-center gap-2">
                      Pengguna
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center gap-2">
                      Role
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('skor')}
                  >
                    <div className="flex items-center gap-2">
                      Skor SWARA
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('bergabung')}
                  >
                    <div className="flex items-center gap-2">
                      Bergabung
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('aksi')}
                  >
                    <div className="flex items-center gap-2">
                      Aksi
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/profile/${user.id}`}>
                          <div className={`w-10 h-10 ${user.avatarColor} rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`}>
                            <span className="text-white font-semibold">{user.avatar}</span>
                          </div>
                        </Link>
                        <div>
                          <div className="text-sm font-medium text-gray-800">{user.nama}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${user.roleColor}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${user.statusColor}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-800">{user.skor}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-800">{user.bergabung}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-3">
                        <Link href={`/admin/manage-pengguna/user-performance/${user.id}`}>
                          <button className="p-1 text-gray-400 hover:text-green-500 transition-colors" title="Lihat Performance">
                            <Eye className="w-5 h-5" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDeactivateUser(user.id, user.nama)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors" 
                          title="Nonaktifkan Pengguna"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Menampilkan 1-2 dari 2 data
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Previous
              </button>
              <button className="px-3 py-1 bg-orange-500 text-white rounded-lg text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">Tambah</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  {/* Input 1 & 2 in row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Judul 1
                      </label>
                      <input
                        type="text"
                        name="input1"
                        value={formData.input1}
                        onChange={handleInputChange}
                        placeholder="Input 1"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-600 placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Judul 2
                      </label>
                      <input
                        type="text"
                        name="input2"
                        value={formData.input2}
                        onChange={handleInputChange}
                        placeholder="Input 2"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-600 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Input 3 full width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Judul 3
                    </label>
                    <input
                      type="text"
                      name="input3"
                      value={formData.input3}
                      onChange={handleInputChange}
                      placeholder="Input 3"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-600 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-colors text-lg"
                  >
                    Simpan .....
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}