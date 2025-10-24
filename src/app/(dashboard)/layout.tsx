"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { User, ChevronRight, LogOut, Settings } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // Always show header at the top
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide header (only after scrolling 100px)
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Add scroll listener to document
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const userData = {
    name: "Fabyan Yastika Permana",
    level: 2,
    xp: 650,
    maxXp: 1000,
  };

  return (
    <div className="flex min-h-screen bg-[#F5F3EF]">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 md:ml-60">
        {/* Header with scroll behavior */}
        <div 
          className={`transition-transform duration-300 ${
            isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <Header onUserClick={() => setShowProfileModal(true)} />
        </div>
        
        {/* Spacer to offset fixed header on desktop */}
        <div className="hidden md:block h-14" />
        
        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Profile Modal Dropdown */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50" onClick={() => setShowProfileModal(false)}>
          <div className="absolute top-20 right-4 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-orange-600">F</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{userData.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-orange-400 px-3 py-1 rounded-full text-xs font-semibold">Level {userData.level}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>XP Progress</span>
                  <span>{userData.xp}/{userData.maxXp} XP</span>
                </div>
                <div className="w-full bg-orange-400 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{ width: `${(userData.xp / userData.maxXp) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4">
              <button 
                onClick={() => {
                  setShowProfileModal(false);
                  router.push('/profile');
                }}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Lihat Profile</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Pengaturan</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <div className="border-t my-2"></div>

              <button className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-lg transition-colors text-red-600">
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Keluar</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
