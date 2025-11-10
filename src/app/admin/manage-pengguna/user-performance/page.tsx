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
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1 min-w-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-2xl sm:text-3xl font-bold">R</span>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 truncate">Rina Sari</h1>
                <p className="text-gray-500 mb-2 sm:mb-3 text-sm sm:text-base truncate">rina.s@email.com</p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap">
                    Pengguna Umum
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-600 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap">
                    Aktif
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                    Bergabung sejak 15 Januari 2025
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 flex-shrink-0">
              <button className="px-4 sm:px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors text-sm sm:text-base whitespace-nowrap">
                Nonaktifkan
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Informasi Pribadi</h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Data lengkap pengguna</p>

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
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Statistics Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Statistik Perkembangan</h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Perkembangan kemampuan public speaking</p>

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
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Progres Keterampilan</h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Evaluasi per aspek</p>

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