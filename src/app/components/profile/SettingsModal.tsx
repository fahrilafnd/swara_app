"use client";

import React, { useState } from 'react';
import { Settings, X, Plus } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  bio: string;
}

interface Interest {
  id: number;
  name: string;
  color: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData, interests: Interest[]) => void;
  initialFormData: FormData;
  initialInterests: Interest[];
}

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialFormData, 
  initialInterests 
}: SettingsModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [interests, setInterests] = useState<Interest[]>(initialInterests);
  const [newInterest, setNewInterest] = useState("");
  const [showAddInterest, setShowAddInterest] = useState(false);

  // Function to add new interest
  const addInterest = () => {
    if (newInterest.trim()) {
      const colors = ["bg-orange-500", "bg-teal-500", "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-pink-500"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      setInterests([...interests, {
        id: interests.length + 1,
        name: newInterest.trim(),
        color: randomColor
      }]);
      setNewInterest("");
      setShowAddInterest(false);
    }
  };

  // Function to remove interest
  const removeInterest = (id: number) => {
    setInterests(interests.filter(interest => interest.id !== id));
  };

  // Function to save changes
  const handleSave = () => {
    onSave(formData, interests);
    onClose();
  };

  // Function to cancel changes
  const handleCancel = () => {
    setFormData(initialFormData);
    setInterests(initialInterests);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-3 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Pengaturan Profil</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6">
          {/* Form Fields */}
          <div className="space-y-4 sm:space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Nama</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            {/* Phone and Birth Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Nomor telepon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Tanggal lahir</label>
                <input
                  type="text"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                placeholder="Ceritakan sedikit tentang diri Anda..."
              />
            </div>

            {/* Interests Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Minat & Keahlian</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {interests.map((interest) => (
                  <div
                    key={interest.id}
                    className={`${interest.color} text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 group`}
                  >
                    <span>{interest.name}</span>
                    <button
                      onClick={() => removeInterest(interest.id)}
                      className="hover:bg-white hover:bg-opacity-30 rounded-full p-1 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {/* Add Interest Button/Input */}
                {showAddInterest ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                      placeholder="Minat baru..."
                      className="px-3 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      autoFocus
                    />
                    <button
                      onClick={addInterest}
                      className="bg-orange-500 text-white px-3 py-2 rounded-full text-sm hover:bg-orange-600 transition-colors"
                    >
                      Tambah
                    </button>
                    <button
                      onClick={() => {
                        setShowAddInterest(false);
                        setNewInterest("");
                      }}
                      className="text-gray-500 hover:text-gray-700 px-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddInterest(true)}
                    className="border-2 border-dashed border-gray-300 text-gray-500 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:border-orange-500 hover:text-orange-500 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Minat</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-8">
            <button
              onClick={handleSave}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
            >
              SIMPAN PERUBAHAN
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
            >
              BATAL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
