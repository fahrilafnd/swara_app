import React from 'react';

export default function UserPerformance() {
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

  return (
    <div className="min-h-screen">
        {/* User Header Card */}
        <div className="rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl font-bold">R</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Rina Sari</h1>
                <p className="text-gray-500 mb-3">rina.s@email.com</p>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                    Pengguna Umum
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-full">
                    Aktif
                  </span>
                  <span className="text-sm text-gray-500">
                    Bergabung sejak 15 Januari 2025
                  </span>
                </div>
              </div>
            </div>
            <button className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
              Nonaktifkan
            </button>
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
                  <p className="font-medium text-gray-800">Ahmad Rizki</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-gray-800">ahmad.rizki@email.com</p>
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
  );
}