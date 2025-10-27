"use client";

import React, { useState } from 'react';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import ProfileHeader from '../components/profile/ProfileHeader';
import StatsGrid from '../components/profile/StatsGrid';
import SettingsModal from '../components/profile/SettingsModal';
import BadgesSection from '../components/profile/BadgesSection';
import LevelAlert from '../components/profile/LevelAlert';

import { LogOut } from 'lucide-react';

export default function SwaraProfilePage() {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    name: "Talitha",
    email: "Talitha",
    phone: "+62 812-3456-7890",
    birthDate: "12/12/2006",
    bio: ""
  });
  
  // Interests state
  const [interests, setInterests] = useState([
    { id: 1, name: "Presentasi", color: "bg-orange-500" },
    { id: 2, name: "Wawancara", color: "bg-teal-500" },
    { id: 3, name: "Storytelling", color: "bg-blue-500" }
  ]);

  // Function to save changes
  const handleSaveChanges = (newFormData: typeof formData, newInterests: typeof interests) => {
    setFormData(newFormData);
    setInterests(newInterests);
    console.log("Saving profile changes:", { formData: newFormData, interests: newInterests });
  };

  const userData = {
    name: "Fabyan Yastika Permana",
    level: 2,
    xp: 650,
    maxXp: 1000,
    location: "Jakarta, Indonesia",
    joinDate: "Bergabung 31 Agustus 2025",
    totalPoints: 2340,
    stats: {
      completedTraining: 24,
      minutesPracticed: 256,
      successRate: 60,
      badgesEarned: 12
    },
    badges: [
      { id: 1, name: "Langkah Pertama", description: "Menyelesaikan latihan pertama", icon: "🎯", unlocked: true },
      { id: 2, name: "Rajin Berlatih", description: "Berlatih 7 hari berturut-turut", icon: "🔥", unlocked: true },
      { id: 3, name: "Presenter Hebat", description: "Mendapat rating 5 bintang", icon: "⭐", unlocked: true },
      { id: 4, name: "Eksplorasi", description: "10 latihan berbeda", icon: "🎪", unlocked: true },
      { id: 5, name: "Dedikasi Tinggi", description: "Streak 7 hari (2/7)", icon: "🏆", unlocked: false },
      { id: 6, name: "Pagi Produktif", description: "Latihan sebelum jam 9 pagi", icon: "⏰", unlocked: false }
    ]
  };

  return (
    <div className="flex h-screen bg-[#F5F2E9] overflow-hidden relative">
      <div className="absolute -top-[50px] -left-[70px] bg-[#F0712280] w-[390px] h-[350px] blur-3xl z-0"></div>
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-full overflow-hidden relative z-10">
        <Header />
        
        {/* Profile Settings Modal */}
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          onSave={handleSaveChanges}
          initialFormData={formData}
          initialInterests={interests}
        />

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto w-full max-h-full">
          <LevelAlert level={userData.level} nextLevelXp={350} />
          
          <ProfileHeader 
            userData={userData} 
            onSettingsClick={() => setShowSettingsModal(true)} 
          />

          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden mb-3 md:mb-4 w-full">
            <div className="p-3 sm:p-4 md:p-6 lg:p-8 w-full">
              <StatsGrid stats={userData.stats} />

              {/* Logout Button */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <button 
                  onClick={() => {
                    // Add logout functionality here
                    console.log("Logging out...");
                    // You can add actual logout logic like clearing tokens, redirecting to login, etc.
                  }}
                  className="w-full flex items-center justify-center gap-2 sm:gap-3 py-2.5 sm:py-3 px-4 sm:px-6 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors text-sm sm:text-base"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          </div>

          <BadgesSection badges={userData.badges} />
        </main>
      </div>
    </div>
  );
}