"use client";

import React from 'react';
import Link from 'next/link';
import { X, Star } from 'lucide-react';
import Portal from '@/app/components/portal';

type ModalType = 'skor-swara' | 'adu-swara' | 'inspira-swara' | 'podium-swara' | 'latih-swara';

interface ModalContentItem {
  title: string;
  icon: React.ReactNode; 
  description: string;
  buttonText: string;
  buttonLink: string;
}

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModal: ModalType;
  modalContent: Record<ModalType, ModalContentItem>;
  tips: string[];
  mekanismeLatihan: string[];
  peraturanLatihan: Array<{ Image: string; text: string }>;
}

export default function InfoModal({ 
  isOpen, 
  onClose, 
  activeModal, 
  modalContent, 
  tips, 
  mekanismeLatihan, 
  peraturanLatihan 
}: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      {/* Overlay untuk blur effect */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[9999]" 
        style={{ backdropFilter: 'blur(20px) saturate(180%)' }}
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none z-[9999]">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide pointer-events-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-500 text-xl">{modalContent[activeModal].icon}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">{modalContent[activeModal].title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-orange-500 font-bold text-lg mb-3">Apa itu {modalContent[activeModal].title.replace('Tentang ', '')}?</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {modalContent[activeModal].description}
              </p>
            </div>

            {/* Komponen Penilaian - For Skor Swara, Adu Swara, and Podium Swara */}
            {(activeModal === 'skor-swara' || activeModal === 'adu-swara' || activeModal === 'podium-swara') && (
              <div className="bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-orange-800 font-bold text-base">Komponen Penilaian Skor Swara</h3>
                  <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Durasi: 1 Menit
                  </span>
                </div>
                
                {/* Stars */}
                <div className="flex justify-center gap-3 mb-6">
                  <Star className="w-12 h-12 fill-yellow-400 text-yellow-400" />
                  <Star className="w-12 h-12 fill-yellow-400 text-yellow-400" />
                  <Star className="w-12 h-12 fill-yellow-400 text-yellow-400" />
                </div>

                {/* Score Components */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-indigo-100 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-300 mb-2">5</div>
                    <p className="text-gray-800 text-xs font-medium">Kelancaran & Pengucapan</p>
                  </div>
                  <div className="bg-indigo-100 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-300 mb-2">5</div>
                    <p className="text-gray-800 text-xs font-medium">Kontak Mata & Gestur</p>
                  </div>
                  <div className="bg-indigo-100 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-300 mb-2">5</div>
                    <p className="text-gray-800 text-xs font-medium">Penggunaan Bahasa</p>
                  </div>
                </div>

                {/* Additional boxes for Adu Swara and Podium Swara */}
                {(activeModal === 'adu-swara' || activeModal === 'podium-swara') && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-indigo-100 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-yellow-300 mb-2">5</div>
                      <p className="text-gray-800 text-xs font-medium">Isi</p>
                    </div>
                    <div className="bg-indigo-100 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-yellow-300 mb-2">5</div>
                      <p className="text-gray-800 text-xs font-medium">Organisasi & Struktur</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mekanisme Latihan - For Skor Swara, Adu Swara, and Podium Swara */}
            {(activeModal === 'skor-swara' || activeModal === 'adu-swara' || activeModal === 'podium-swara') && (
              <div>
                <h3 className="text-orange-500 font-bold text-lg mb-4">Mekanisme Latihan</h3>
                <ol className="space-y-3">
                  {mekanismeLatihan.map((item, index) => (
                    <li key={index} className="flex gap-3 text-gray-700 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Peraturan Latihan - For Skor Swara, Adu Swara, and Podium Swara */}
            {(activeModal === 'skor-swara' || activeModal === 'adu-swara' || activeModal === 'podium-swara') && (
              <div className="overflow-hidden">
                <h3 className="text-orange-500 font-bold text-lg mb-4">Peraturan Latihan</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
                  {peraturanLatihan.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <div className="w-20 h-20 md:w-32 md:h-32  rounded-full p-4 md:p-6 flex items-center justify-center mb-3">
                        <img src={item.Image} alt={item.text} className="w-full h-full object-contain" />
                      </div>
                      <p className="text-black text-[10px] md:text-xs leading-tight font-medium text-center w-full">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features Section for Other Modals */}
            {activeModal !== 'skor-swara' && activeModal !== 'adu-swara' && activeModal !== 'podium-swara' && (
              <div className="bg-gradient-to-br from-orange-100 to-purple-200 rounded-2xl p-6">
                <h3 className="text-orange-800 font-bold text-base mb-4">Fitur Utama</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeModal === 'inspira-swara' && (
                    <>
                      <div className="bg-white/70 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">📚</div>
                        <p className="text-orange-900 text-xs font-medium">Artikel Berkualitas</p>
                        <p className="text-gray-600 text-[10px] mt-1">Akses artikel terbaik dari para ahli</p>
                      </div>
                      <div className="bg-white/70 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">🎬</div>
                        <p className="text-orange-900 text-xs font-medium">Video Tutorial</p>
                        <p className="text-gray-600 text-[10px] mt-1">Pelajari teknik dari video tutorial interaktif</p>
                      </div>
                      <div className="bg-white/70 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">💡</div>
                        <p className="text-orange-900 text-xs font-medium">Tips & Trik</p>
                        <p className="text-gray-600 text-[10px] mt-1">Tips praktis untuk meningkatkan kemampuan Anda</p>
                      </div>
                    </>
                  )}
                  {activeModal === 'latih-swara' && (
                    <>
                      <div className="bg-white/70 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">📖</div>
                        <p className="text-orange-900 text-xs font-medium">Kursus Terstruktur</p>
                        <p className="text-gray-600 text-[10px] mt-1">Mulai dari dasar hingga tingkat lanjut</p>
                      </div>
                      <div className="bg-white/70 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">✅</div>
                        <p className="text-orange-900 text-xs font-medium">Latihan Praktis</p>
                        <p className="text-gray-600 text-[10px] mt-1">Praktik langsung dengan panduan step-by-step</p>
                      </div>
                      <div className="bg-white/70 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">🎯</div>
                        <p className="text-orange-900 text-xs font-medium">Progress Tracking</p>
                        <p className="text-gray-600 text-[10px] mt-1">Pantau perkembangan belajar Anda</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <Link href={modalContent[activeModal].buttonLink} onClick={onClose}>
              <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                {modalContent[activeModal].buttonText}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Portal>
  );
}
