'use client'

import React, { useState } from 'react';
import { Users, UserCheck, Calendar, TrendingUp, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const [activePeriod, setActivePeriod] = useState('Minggu');
  const stats = [
    {
      icon: Users,
      value: '2,847',
      label: 'Pengguna Aktif',
      change: '+12%',
      isPositive: true,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-500'
    },
    {
      icon: UserCheck,
      value: '127',
      label: 'Mentor Terdaftar',
      change: '+8%',
      isPositive: true,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-500'
    },
    {
      icon: Calendar,
      value: '1,524',
      label: 'Latihan Minggu Ini',
      change: '+24%',
      isPositive: true,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-500'
    },
    {
      icon: Activity,
      value: '34',
      label: 'Event Aktif',
      change: '-8%',
      isPositive: false,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-500'
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden scrollbar-hide">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl p-8 mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Hi, Fabyan Yastika Permana
          </h1>
          <p className="text-white text-opacity-90">
            Selamat datang di SWARA, rumah belajar public speaking!
          </p>
        </div>
        
        {/* Decorative microphones */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <div className="flex gap-4">
            <div className="w-16 h-24 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full transform rotate-12 shadow-lg"></div>
            <div className="w-16 h-24 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full transform -rotate-12 shadow-lg"></div>
          </div>
        </div>
        
        {/* Decorative dots */}
        <div className="absolute top-8 right-64">
          <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
        </div>
        <div className="absolute bottom-12 left-1/3">
          <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <span className={`text-sm font-semibold ${
                stat.isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Aktivitas Pengguna
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActivePeriod('Minggu')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activePeriod === 'Minggu' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Minggu
                </button>
                <button 
                  onClick={() => setActivePeriod('Bulan')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activePeriod === 'Bulan' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Bulan
                </button>
                <button 
                  onClick={() => setActivePeriod('Tahun')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activePeriod === 'Tahun' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tahun
                </button>
              </div>
            </div>
          </div>
          
          {/* Placeholder for chart */}
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">GRAFIK PERKEMBANGAN AKTIVITAS</p>
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-8">
            Tingkat Keberhasilan
          </h2>
          
          {/* Circular Progress */}
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-6">
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-5xl font-bold text-white">87%</span>
              </div>
            </div>
            
            <p className="text-center text-gray-600 text-sm">
              Rata-rata Keberhasilan Pengguna
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
