import { Mic, Clock, Target, MessageSquare, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default function PodiumSwara() {
  return (
    <div className="pr-8 pb-8">
      <div className="flex bg-white px-6 py-4 rounded-xl items-center gap-2 mb-4">
        <div className="w-4 h-1 bg-orange-500"></div>
        <h1 className="text-orange-500 font-semibold text-lg">Podium Swara</h1>
      </div>
      <div className="bg-white  shadow-md rounded-xl w-full min-h-screen p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Pilih Arena Virtual Latihanmu!
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <Link href={"/podium-swara/mc"}  className="bg-gradient-to-br from-orange-200 to-orange-300 rounded-2xl relative overflow-hidden min-h-[120px] cursor-pointer hover:shadow-lg transition-shadow">
              <h3 className="text-orange-700 font-bold text-lg relative z-10 p-6">
                Master of
                <br />
                Ceremony
              </h3>
              <div className="absolute -right-4 -top-4">
                <img src="/podium/mc.png" alt="Wawancara" />
              </div>
            </Link>

            <Link href={"/podium-swara/wawancara"} className="bg-gradient-to-br from-blue-200 to-blue-400 rounded-2xl p-6 relative overflow-hidden min-h-[120px] cursor-pointer hover:shadow-lg transition-shadow">
              <h3 className="text-blue-800 font-bold text-xl relative z-10">
                Wawancara
              </h3>
              <div className="absolute -right-4 -top-4">
                <img src="/podium/wwc.png" alt="Wawancara" />
              </div>
            </Link>

            <Link href={"/podium-swara/pidato"} className="bg-gradient-to-br from-green-300 to-green-400 rounded-2xl p-6 relative overflow-hidden min-h-[120px] cursor-pointer hover:shadow-lg transition-shadow">
              <h3 className="text-green-800 font-bold text-xl relative z-10">
                Pidato
              </h3>
              <div className="absolute -right-4 -top-10">
                <img src="/podium/pidato.png" alt="Wawancara" />
              </div>
            </Link>
          </div>
        </div>

        <div className="mb-8 p-6 bg-gray-100 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Progress & Pencapaianmu
          </h2>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 mb-6 text-center">
            <div className="text-white">
              <div className="text-6xl font-bold mb-1">87</div>
              <div className="text-sm font-medium tracking-wider">
                OVERALL SCORE
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {/* Kepercayaan Diri */}
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Mic className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-gray-400 text-sm mb-3">Kepercayaan Diri</h4>
              <div className="text-xl font-bold text-gray-900 mb-2">
                3.5 / 10
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-orange-500 h-1.5 rounded-full"
                  style={{ width: "35%" }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-gray-400 text-sm mb-3">Manajemen Waktu</h4>
              <div className="text-xl font-bold text-gray-900 mb-2">4 / 10</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-orange-500 h-1.5 rounded-full"
                  style={{ width: "40%" }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-gray-400 text-sm mb-3">
                Ketertarikan Audiens
              </h4>
              <div className="text-xl font-bold text-gray-900 mb-2">6 / 10</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-orange-500 h-1.5 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-gray-400 text-sm mb-3">Struktur Kalimat</h4>
              <div className="text-xl font-bold text-gray-900 mb-2">5 / 10</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-orange-500 h-1.5 rounded-full"
                  style={{ width: "50%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Bingung Cara Kerjanya?
          </h2>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=100&h=100&fit=crop"
                  alt="Tutorial"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-white text-xl font-semibold">
                Lihat Petunjuk
              </span>
            </div>
            <ChevronRight className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
