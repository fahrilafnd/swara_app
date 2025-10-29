"use client"

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

interface UserPerformanceProps {
  params: {
    id: string;
  };
}

export default function UserPerformance({ params }: UserPerformanceProps) {
  // Mock user data - in real app, fetch based on params.id
  const user = {
    id: params.id,
    nama: 'Farhan Abdullah',
    email: 'farhan@gmail.com',
    avatar: 'F',
    avatarColor: 'bg-orange-500',
    role: 'Mentor',
    roleColor: 'bg-blue-100 text-blue-600',
    status: 'AKTIF',
    statusColor: 'bg-green-100 text-green-600',
    joinDate: '12 Jan 2025'
  };

  const progressData = [
    { label: 'Intonasi', value: 85, color: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
    { label: 'Artikulasi', value: 78, color: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
    { label: 'Kecepatan Bicara', value: 92, color: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
    { label: 'Bahasa Tubuh', value: 88, color: 'bg-gradient-to-r from-yellow-400 to-orange-500' }
  ];

  const stats = [
    { label: 'Total Latihan', value: '47', subtext: '+5 Bulan ini', color: 'text-gray-800' },
    { label: 'Jam Praktik', value: '28.5', subtext: '+3.2 bulan ini', color: 'text-gray-800' },
    { label: 'Adu Swara', value: '12', subtext: '5 menang', color: 'text-gray-800' },
    { label: 'Skor Swara', value: '850', subtext: '1.045 bulan ini', color: 'text-gray-800' }
  ];

  const handleDeactivateUser = (userId: string, userName: string) => {
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


        {/* User Header Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 ${user.avatarColor} rounded-full flex items-center justify-center`}>
                <span className="text-white text-3xl font-bold">{user.avatar}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">{user.nama}</h1>
                <p className="text-gray-500 mb-3">{user.email}</p>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${user.roleColor}`}>
                    {user.role}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${user.statusColor}`}>
                    {user.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    Bergabung sejak {user.joinDate}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
                Nonaktifkan
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Informasi Pribadi</h2>
              <p className="text-sm text-gray-500 mb-6">Data lengkap pengguna</p>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nama Lengkap</p>
                  <p className="font-medium text-gray-800">{user.nama}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-gray-800">{user.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Nomor Telepon</p>
                  <p className="font-medium text-gray-800">+62 812-3456-7890</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Tanggal Lahir</p>
                  <p className="font-medium text-gray-800">15 Agustus 1995</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Jenis Kelamin</p>
                  <p className="font-medium text-gray-800">Laki-laki</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Alamat</p>
                  <p className="font-medium text-gray-800">Jl. Merdeka No. 123, Jakarta Pusat</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Statistics & Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Statistik Perkembangan</h2>
              <p className="text-sm text-gray-500 mb-6">Perkembangan kemampuan public speaking</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                    <p className="text-xs text-gray-400">{stat.subtext}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Progres Keterampilan</h2>
              <p className="text-sm text-gray-500 mb-6">Evaluasi per aspek</p>

              <div className="space-y-6">
                {progressData.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      <span className="text-sm font-bold text-gray-800">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full ${item.color} transition-all duration-500 rounded-full`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
