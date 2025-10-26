"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  Upload,
  Calendar,
  Eye,
  MessageSquare,
  Heart,
  Share2,
} from "lucide-react";

interface Activity {
  id: number;
  mentorName: string;
  mentorImage: string;
  mentorTitle: string;
  postedAt: string;
  label: string;
  description: string;
  image: string;
  likes: number;
  comments: number;
  shares: number;
}

export default function Aktivitas() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      mentorName: "Daffa Arif Setyawan",
      mentorImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      mentorTitle: "CEO Merah Putih",
      postedAt: "7 bulan lalu",
      label: "PUBLIC SPEAKER",
      description:
        "Sebuah pengalaman yang menakjubkan dimana saya bisa merajadi pemberi diskusi dengan orang-orang besar, dimana saya bangga...",
      image:
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop",
      likes: 124,
      comments: 23,
      shares: 12,
    },
    {
      id: 2,
      mentorName: "Daffa Arif Setyawan",
      mentorImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      mentorTitle: "CEO Merah Putih",
      postedAt: "7 bulan lalu",
      label: "PUBLIC SPEAKER",
      description:
        "Sebuah pengalaman yang menakjubkan dimana saya bisa merajadi pemberi diskusi dengan orang-orang besar, dimana saya bangga...",
      image:
        "https://images.unsplash.com/photo-1560439514-4e9645039924?w=800&h=600&fit=crop",
      likes: 98,
      comments: 15,
      shares: 8,
    },
    {
      id: 3,
      mentorName: "Daffa Arif Setyawan",
      mentorImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      mentorTitle: "CEO Merah Putih",
      postedAt: "7 bulan lalu",
      label: "PUBLIC SPEAKER",
      description:
        "Sebuah pengalaman yang menakjubkan dimana saya bisa merajadi pemberi diskusi dengan orang-orang besar, dimana saya bangga...",
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop",
      likes: 156,
      comments: 31,
      shares: 19,
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    label: "",
    description: "",
    image: null as File | null,
  });

  const handleCreateActivity = () => {
    if (!formData.label || !formData.description) {
      alert("Mohon lengkapi semua field!");
      return;
    }

    const newActivity: Activity = {
      id: activities.length + 1,
      mentorName: "Daffa Arif Setyawan",
      mentorImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      mentorTitle: "CEO Merah Putih",
      postedAt: "Baru saja",
      label: formData.label,
      description: formData.description,
      image:
        previewImage ||
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop",
      likes: 0,
      comments: 0,
      shares: 0,
    };

    setActivities([newActivity, ...activities]);
    resetForm();
    setShowCreateModal(false);
    alert("Aktivitas berhasil dibuat!");
  };

  const handleEditActivity = () => {
    if (!editingActivity) return;

    const updated = activities.map((act) =>
      act.id === editingActivity.id
        ? {
            ...act,
            label: formData.label,
            description: formData.description,
            image: previewImage || act.image,
          }
        : act
    );

    setActivities(updated);
    resetForm();
    setShowEditModal(false);
    setEditingActivity(null);
    alert("Aktivitas berhasil diperbarui!");
  };

  const handleDeleteActivity = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus aktivitas ini?")) {
      setActivities(activities.filter((act) => act.id !== id));
      alert("Aktivitas berhasil dihapus!");
    }
  };

  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      label: activity.label,
      description: activity.description,
      image: null,
    });
    setPreviewImage(activity.image);
    setShowEditModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      label: "",
      description: "",
      image: null,
    });
    setPreviewImage(null);
  };

  return (
    <div className="pr-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Aktivitas</h1>
          <p className="text-gray-600">
            Kelola dan bagikan aktivitas mentoring Anda kepada mentee
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Buat Aktivitas Baru
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-semibold">
              Total Postingan
            </p>
            <MessageSquare className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {activities.length}
          </p>
        </div>

     
      </div>

      {activities.length > 0 ? (
        <div className="grid bg-white p-6 rounded-xl shadow-sm grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-200">
                      <img
                        src={activity.mentorImage}
                        alt={activity.mentorName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        {activity.mentorName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.postedAt}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons - Hidden by default, shown on hover */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(activity)}
                      className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-orange-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                  [ {activity.label} ]
                </span>
              </div>

              {/* Card Content */}
              <div className="p-4">
                <p className="text-gray-700 text-sm line-clamp-3 mb-3">
                  {activity.description}
                </p>
              </div>

              {/* Card Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={activity.image}
                  alt="Activity"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

             
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Belum Ada Aktivitas
          </h3>
          <p className="text-gray-600 mb-6">
            Mulai bagikan pengalaman mentoring Anda dengan membuat aktivitas
            pertama
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Buat Aktivitas
          </button>
        </div>
      )}

      {/* Modal Create Activity */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Buat Aktivitas Baru
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Label/Category */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Label/Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  placeholder="Contoh: PUBLIC SPEAKER, WORKSHOP, SEMINAR"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Deskripsi Aktivitas <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Ceritakan tentang aktivitas mentoring Anda..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.description.length} karakter
                </p>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Gambar Aktivitas
                </label>

                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <button
                      onClick={() => {
                        setPreviewImage(null);
                        setFormData({ ...formData, image: null });
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors">
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                      id="image-upload-create"
                    />
                    <label
                      htmlFor="image-upload-create"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-orange-500" />
                      </div>
                      <p className="text-gray-900 font-semibold mb-1">
                        Klik untuk upload gambar
                      </p>
                      <p className="text-gray-600 text-sm">
                        PNG, JPG, JPEG (Max 5MB)
                      </p>
                    </label>
                  </div>
                )}
              </div>

              {/* Preview Card */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Preview Postingan:
                </p>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div>
                        <p className="font-bold text-sm">Daffa Arif Setyawan</p>
                        <p className="text-xs text-gray-500">Baru saja</p>
                      </div>
                    </div>
                    {formData.label && (
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                        [ {formData.label} ]
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-700">
                      {formData.description ||
                        "Deskripsi aktivitas akan muncul di sini..."}
                    </p>
                  </div>
                  {previewImage && (
                    <div className="h-48">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleCreateActivity}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Publikasikan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Activity */}
      {showEditModal && editingActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Edit2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Aktivitas
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingActivity(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Label/Category */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Label/Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  placeholder="Contoh: PUBLIC SPEAKER, WORKSHOP, SEMINAR"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Deskripsi Aktivitas <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Ceritakan tentang aktivitas mentoring Anda..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Gambar Aktivitas
                </label>

                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <button
                      onClick={() => {
                        setPreviewImage(null);
                        setFormData({ ...formData, image: null });
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors">
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                      id="image-upload-edit"
                    />
                    <label
                      htmlFor="image-upload-edit"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-orange-500" />
                      </div>
                      <p className="text-gray-900 font-semibold mb-1">
                        Klik untuk upload gambar baru
                      </p>
                      <p className="text-gray-600 text-sm">
                        PNG, JPG, JPEG (Max 5MB)
                      </p>
                    </label>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingActivity(null);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleEditActivity}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
