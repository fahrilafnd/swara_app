"use client";

import React from 'react';
import { MapPin, Calendar, Star, ChevronRight } from 'lucide-react';

interface UserData {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  location: string;
  joinDate: string;
  totalPoints: number;
}

interface ProfileHeaderProps {
  userData: UserData;
  onSettingsClick: () => void;
}

export default function ProfileHeader({ userData, onSettingsClick }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden mb-3 md:mb-4 w-full">
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-3 md:mb-4 gap-3 md:gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-6 w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">F</span>
            </div>
            <div className="flex-1 w-full min-w-0">
              <div className="flex items-center justify-between mb-2 gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 truncate">{userData.name}</h1>
                <button 
                  onClick={onSettingsClick}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                </button>
              </div>
              {/* Level Progress Bar - Combined */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-4 mb-3 md:mb-4 w-full">
                {/* Level Indicator */}
                <div className="bg-orange-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold text-sm sm:text-base whitespace-nowrap flex-shrink-0">
                  Level {userData.level}
                </div>
                
                {/* Progress Bar Container */}
                <div className="flex-1 relative min-w-0 w-full">
                  <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 relative overflow-visible">
                    <div className="bg-orange-500 h-3 sm:h-4 rounded-full transition-all duration-500 relative" style={{ width: '65%' }}>
                      {/* Rocket icon on progress bar */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-3">
                        <img 
                          src="/noto_rocket.png" 
                          alt="Rocket" 
                          className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* XP Display */}
                <div className="text-orange-500 font-semibold text-sm sm:text-base whitespace-nowrap flex-shrink-0">
                  {userData.xp}/{userData.maxXp} XP
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-4 text-gray-600 text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">{userData.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">{userData.joinDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 fill-orange-500 flex-shrink-0" />
                  <span className="whitespace-nowrap">Total Poin: {userData.totalPoints.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
