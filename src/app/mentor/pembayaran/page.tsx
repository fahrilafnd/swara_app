"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  Calendar,
  CreditCard,
  ArrowUpRight,
  Filter,
  Search,
  Wallet,
  Building,
  User,
  X,
  Loader,
} from "lucide-react";

type BankAccount = {
  bankName: string;
  accountNumber: string;
  accountName: string;
};

type ModalProps = {
  open: boolean;
  initialValues: BankAccount;
  banks?: string[];
  loading?: boolean;
  onClose: () => void;
  onSave: (values: BankAccount) => Promise<void> | void;
};

function EditBankAccountModal({
  open,
  initialValues,
  banks,
  loading = false,
  onClose,
  onSave,
}: ModalProps) {
  const [values, setValues] = useState<BankAccount>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof BankAccount, string>>
  >({});
  const [mounted, setMounted] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (open) {
      setValues(initialValues);
      setErrors({});
      setTimeout(() => firstFieldRef.current?.focus(), 10);
    }
  }, [open, initialValues]);

  const bankOptions = useMemo(
    () =>
      banks && banks.length
        ? banks
        : [
            "Bank BCA",
            "BNI",
            "BRI",
            "Mandiri",
            "CIMB Niaga",
            "Permata",
            "BTN",
            "BSI",
          ],
    [banks]
  );

  if (!open || !mounted) return null;

  const validate = () => {
    const e: Partial<Record<keyof BankAccount, string>> = {};
    if (!values.bankName) e.bankName = "Pilih bank";
    if (!values.accountNumber) e.accountNumber = "Nomor rekening wajib diisi";
    else if (!/^[0-9]{6,20}$/.test(values.accountNumber.replace(/\s/g, "")))
      e.accountNumber = "Nomor rekening tidak valid";
    if (!values.accountName) e.accountName = "Nama pemilik wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await onSave({
      ...values,
      accountNumber: values.accountNumber.replace(/\s/g, ""),
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-rekening-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl my-8 animate-scaleIn">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-lg">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h2
                  id="edit-rekening-title"
                  className="text-xl font-bold text-gray-900"
                >
                  Ubah Rekening
                </h2>
                <p className="text-sm text-gray-600">
                  Atur rekening tujuan penarikan
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 border border-emerald-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Aman & Tervalidasi
              </span>
              <button
                onClick={onClose}
                aria-label="Tutup"
                className="ml-2 rounded-xl p-2 hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[calc(90vh-200px)] overflow-y-auto p-6 space-y-6">
            {/* Bank Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Bank <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className={`w-full rounded-xl px-4 py-4 border-2 ${
                    errors.bankName
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  } text-gray-900 font-medium focus:outline-none focus:ring-2 transition-all appearance-none bg-white`}
                  value={values.bankName}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, bankName: e.target.value }))
                  }
                >
                  <option value="">Pilih bank…</option>
                  {bankOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.bankName && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.bankName}
                </p>
              )}
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Nomor Rekening <span className="text-red-500">*</span>
              </label>
              <input
                ref={firstFieldRef}
                inputMode="numeric"
                autoComplete="off"
                className={`w-full rounded-xl px-4 py-4 border-2 ${
                  errors.accountNumber
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                } text-gray-900 font-medium focus:outline-none focus:ring-2 transition-all`}
                placeholder="Contoh: 1234567890"
                value={values.accountNumber}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    accountNumber: e.target.value.replace(/[^\d\s]/g, ""),
                  }))
                }
              />
              {errors.accountNumber && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.accountNumber}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Pastikan nomor sesuai buku/tabungan & aktif.
              </p>
            </div>

            {/* Account Name */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Nama Pemilik Rekening <span className="text-red-500">*</span>
              </label>
              <input
                className={`w-full rounded-xl px-4 py-4 border-2 ${
                  errors.accountName
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                } text-gray-900 font-medium focus:outline-none focus:ring-2 transition-all`}
                placeholder="Nama sesuai rekening"
                value={values.accountName}
                onChange={(e) =>
                  setValues((v) => ({ ...v, accountName: e.target.value }))
                }
              />
              {errors.accountName && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.accountName}
                </p>
              )}
            </div>

            {/* Warning */}
            <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-amber-900 mb-1">
                    Catatan Penting:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Data rekening dipakai untuk penarikan saldo. Simpan
                    perubahan hanya jika datanya benar. Pastikan nama pemilik
                    rekening sesuai dengan nama yang terdaftar di bank.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 p-6 border-t border-gray-200 bg-white rounded-b-3xl flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-50 font-bold text-gray-700 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Menyimpan…
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>,
    document.body
  );
}

interface Transaction {
  id: string;
  orderId: string;
  menteeName: string;
  menteeImage: string;
  sessionTitle: string;
  amount: number;
  fee: number;
  netAmount: number;
  paymentMethod: string;
  status: "settlement" | "pending" | "expire" | "cancel";
  transactionDate: string;
  settlementDate: string | null;
  canWithdraw: boolean;
  daysUntilWithdraw: number;
}

export default function Pembayaran() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [activeTab, setActiveTab] = useState<"transaksi" | "penarikan">(
    "transaksi"
  );
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Bank account info
  const [bankAccount] = useState({
    bankName: "Bank BCA",
    accountNumber: "1234567890",
    accountName: "Daffa Arif Setyawan",
  });

  // Summary data
  const summary = {
    totalEarnings: 15750000,
    availableBalance: 8500000,
    pendingSettlement: 4250000,
    withdrawn: 3000000,
    thisMonthEarnings: 4250000,
    withdrawalFee: 2500,
  };

  const transactions: Transaction[] = [
    {
      id: "TRX001",
      orderId: "ORDER-2025-001",
      menteeName: "Ahmad Rizki Pramono",
      menteeImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      sessionTitle: "Public Speaking Dasar - Sesi 1",
      amount: 150000,
      fee: 7500,
      netAmount: 142500,
      paymentMethod: "BCA Virtual Account",
      status: "settlement",
      transactionDate: "2025-10-15 14:30",
      settlementDate: "2025-10-22",
      canWithdraw: true,
      daysUntilWithdraw: 0,
    },
    {
      id: "TRX002",
      orderId: "ORDER-2025-002",
      menteeName: "Sarah Johnson",
      menteeImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      sessionTitle: "Presentasi Bisnis Advanced",
      amount: 200000,
      fee: 10000,
      netAmount: 190000,
      paymentMethod: "Gopay",
      status: "pending",
      transactionDate: "2025-10-20 10:15",
      settlementDate: "2025-10-27",
      canWithdraw: false,
      daysUntilWithdraw: 4,
    },
    {
      id: "TRX003",
      orderId: "ORDER-2025-003",
      menteeName: "Bambang Wijaya",
      menteeImage:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      sessionTitle: "Story Telling untuk Presentasi",
      amount: 150000,
      fee: 7500,
      netAmount: 142500,
      paymentMethod: "Mandiri Virtual Account",
      status: "settlement",
      transactionDate: "2025-10-10 16:45",
      settlementDate: "2025-10-17",
      canWithdraw: true,
      daysUntilWithdraw: 0,
    },
    {
      id: "TRX004",
      orderId: "ORDER-2025-004",
      menteeName: "Elena Martinez",
      menteeImage:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
      sessionTitle: "MC & Public Speaking",
      amount: 175000,
      fee: 8750,
      netAmount: 166250,
      paymentMethod: "Credit Card",
      status: "expire",
      transactionDate: "2025-10-05 09:00",
      settlementDate: null,
      canWithdraw: false,
      daysUntilWithdraw: 0,
    },
  ];

  const withdrawalHistory = [
    {
      id: "WD001",
      amount: 1500000,
      fee: 2500,
      netAmount: 1497500,
      status: "success",
      requestDate: "2025-09-25",
      processedDate: "2025-09-26",
      bankName: "Bank BCA",
      accountNumber: "1234567890",
    },
    {
      id: "WD002",
      amount: 1500000,
      fee: 2500,
      netAmount: 1497500,
      status: "success",
      requestDate: "2025-09-10",
      processedDate: "2025-09-11",
      bankName: "Bank BCA",
      accountNumber: "1234567890",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "settlement":
        return {
          label: "Settlement",
          className: "bg-green-100 text-green-700 border border-green-300",
          icon: <CheckCircle className="w-4 h-4" />,
        };
      case "pending":
        return {
          label: "Pending Settlement",
          className: "bg-yellow-100 text-yellow-700 border border-yellow-300",
          icon: <Clock className="w-4 h-4" />,
        };
      case "expire":
        return {
          label: "Expired",
          className: "bg-red-100 text-red-700 border border-red-300",
          icon: <XCircle className="w-4 h-4" />,
        };
      case "cancel":
        return {
          label: "Cancelled",
          className: "bg-gray-100 text-gray-700 border border-gray-300",
          icon: <XCircle className="w-4 h-4" />,
        };
      default:
        return {
          label: status,
          className: "bg-gray-100 text-gray-700",
          icon: <AlertCircle className="w-4 h-4" />,
        };
    }
  };

  const filteredTransactions = transactions.filter((trx) => {
    const matchesStatus = filterStatus === "all" || trx.status === filterStatus;
    const matchesSearch =
      trx.menteeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleWithdraw = () => {
    // Logic untuk request withdrawal
    console.log("Withdraw requested");
    setShowWithdrawModal(false);
    alert(
      "Permintaan penarikan berhasil! Dana akan diproses dalam 1-2 hari kerja."
    );
  };

  //   Ubah Rekening
  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (values: BankAccount) => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Saved:", values);
      alert("Rekening berhasil diperbarui!");
      setOpenEdit(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pr-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pembayaran</h1>
        <p className="text-gray-600">
          Kelola penghasilan dan riwayat transaksi Anda
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <TrendingUp className="w-6 h-6 opacity-70" />
          </div>
          <p className="text-orange-100 text-sm mb-1">Total Penghasilan</p>
          <p className="text-3xl font-bold">
            {formatCurrency(summary.totalEarnings)}
          </p>
          <p className="text-orange-100 text-xs mt-2">Sejak bergabung</p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <CheckCircle className="w-6 h-6 opacity-70" />
          </div>
          <p className="text-green-100 text-sm mb-1">Saldo Tersedia</p>
          <p className="text-3xl font-bold">
            {formatCurrency(summary.availableBalance)}
          </p>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="mt-3 text-sm font-semibold underline hover:text-green-50 transition-colors"
          >
            Tarik Saldo →
          </button>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <AlertCircle className="w-6 h-6 opacity-70" />
          </div>
          <p className="text-yellow-100 text-sm mb-1">Pending Settlement</p>
          <p className="text-3xl font-bold">
            {formatCurrency(summary.pendingSettlement)}
          </p>
          <p className="text-yellow-100 text-xs mt-2">Menunggu 7 hari kerja</p>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-6 h-6 opacity-70" />
          </div>
          <p className="text-blue-100 text-sm mb-1">Bulan Ini</p>
          <p className="text-3xl font-bold">
            {formatCurrency(summary.thisMonthEarnings)}
          </p>
          <p className="text-blue-100 text-xs mt-2">Oktober 2025</p>
        </div>
      </div>

      {/* Bank Account Info */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Building className="w-7 h-7 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Rekening Terdaftar</p>
              <p className="font-bold text-gray-900 text-lg">
                {bankAccount.bankName}
              </p>
              <p className="text-gray-700">
                {bankAccount.accountNumber} - {bankAccount.accountName}
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpenEdit(true)}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
          >
            Ubah Rekening
          </button>
        </div>
      </div>

      {/* Edit Bank Account Modal */}
      <EditBankAccountModal
        open={openEdit}
        initialValues={bankAccount}
        onClose={() => setOpenEdit(false)}
        onSave={handleSave}
        loading={saving}
        banks={["Bank BCA", "BNI", "BRI", "Mandiri", "CIMB Niaga", "Permata"]}
      />

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("transaksi")}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === "transaksi"
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Riwayat Transaksi
          </button>
          <button
            onClick={() => setActiveTab("penarikan")}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === "penarikan"
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Riwayat Penarikan
          </button>
        </div>

        {/* Transaksi Tab */}
        {activeTab === "transaksi" && (
          <div className="p-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari nama mentee atau order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[200px]"
              >
                <option value="all">Semua Status</option>
                <option value="settlement">Settlement</option>
                <option value="pending">Pending</option>
                <option value="expire">Expired</option>
                <option value="cancel">Cancelled</option>
              </select>
            </div>

            {/* Transactions List */}
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => {
                const statusInfo = getStatusBadge(transaction.status);
                return (
                  <div
                    key={transaction.id}
                    className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-200">
                          <img
                            src={transaction.menteeImage}
                            alt={transaction.menteeName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {transaction.menteeName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {transaction.sessionTitle}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(transaction.netAmount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Fee: {formatCurrency(transaction.fee)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusInfo.className}`}
                        >
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                        {transaction.status === "pending" && (
                          <span className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                            <Clock className="w-3 h-3" />
                            {transaction.daysUntilWithdraw} hari lagi
                          </span>
                        )}
                        {transaction.canWithdraw && (
                          <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                            <CheckCircle className="w-3 h-3" />
                            Bisa ditarik
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowDetailModal(true);
                          }}
                          className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-xl font-semibold transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Detail
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-gray-600">
                        <span>Order ID: {transaction.orderId}</span>
                        <span>•</span>
                        <span>{transaction.paymentMethod}</span>
                      </div>
                      <span className="text-gray-500">
                        {transaction.transactionDate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Tidak ada transaksi ditemukan
                </p>
              </div>
            )}
          </div>
        )}

        {/* Penarikan Tab */}
        {activeTab === "penarikan" && (
          <div className="p-6">
            <div className="space-y-4">
              {withdrawalHistory.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <ArrowUpRight className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          Penarikan ke {withdrawal.bankName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {withdrawal.accountNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(withdrawal.netAmount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Fee: {formatCurrency(withdrawal.fee)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-300">
                      <CheckCircle className="w-4 h-4" />
                      Berhasil
                    </span>
                    <div className="text-sm text-gray-600">
                      <span>Diproses: {withdrawal.processedDate}</span>
                      <span className="mx-2">•</span>
                      <span>ID: {withdrawal.id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Withdraw */}
      {mounted && showWithdrawModal
        ? createPortal(
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl max-w-xl w-full">
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Tarik Saldo
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Available Balance */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <p className="text-green-700 text-sm mb-2">
                      Saldo Tersedia
                    </p>
                    <p className="text-4xl font-bold text-green-700">
                      {formatCurrency(summary.availableBalance)}
                    </p>
                  </div>

                  {/* Withdrawal Amount */}
                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">
                      Jumlah Penarikan
                    </label>
                    <input
                      type="number"
                      placeholder="Masukkan jumlah"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      defaultValue={summary.availableBalance}
                    />
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-gray-600">
                        Minimum: {formatCurrency(50000)}
                      </span>
                      <button className="text-green-600 font-semibold hover:underline">
                        Tarik Semua
                      </button>
                    </div>
                  </div>

                  {/* Bank Account */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">Ditransfer ke:</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <Building className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {bankAccount.bankName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {bankAccount.accountNumber} -{" "}
                          {bankAccount.accountName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Fee Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-700">
                        <p className="font-semibold mb-1">
                          Informasi Penarikan:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>
                            Biaya admin: {formatCurrency(summary.withdrawalFee)}
                          </li>
                          <li>Dana akan diproses dalam 1-2 hari kerja</li>
                          <li>
                            Penarikan hanya dapat dilakukan untuk saldo yang
                            sudah settlement (7 hari setelah transaksi)
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Jumlah Penarikan</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(summary.availableBalance)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Biaya Admin</span>
                      <span className="font-semibold text-red-600">
                        - {formatCurrency(summary.withdrawalFee)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="font-bold text-gray-900">
                        Total Diterima
                      </span>
                      <span className="font-bold text-green-600 text-xl">
                        {formatCurrency(
                          summary.availableBalance - summary.withdrawalFee
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowWithdrawModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleWithdraw}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Tarik Saldo
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      {/* Modal Transaction Detail */}
      {mounted && showDetailModal && selectedTransaction
        ? createPortal(
            <div className="fixed inset-0 bg-black z-[90] bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Detail Transaksi
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Status */}
                  <div className="flex items-center justify-center">
                    {(() => {
                      const statusInfo = getStatusBadge(
                        selectedTransaction.status
                      );
                      return (
                        <span
                          className={`flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold ${statusInfo.className}`}
                        >
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Mentee Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-3">
                      Informasi Mentee
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-200">
                        <img
                          src={selectedTransaction.menteeImage}
                          alt={selectedTransaction.menteeName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">
                          {selectedTransaction.menteeName}
                        </p>
                        <p className="text-gray-600">
                          {selectedTransaction.sessionTitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-3">
                    <p className="font-bold text-gray-900">Detail Pembayaran</p>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID</span>
                        <span className="font-semibold text-gray-900">
                          {selectedTransaction.orderId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID</span>
                        <span className="font-semibold text-gray-900">
                          {selectedTransaction.id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Metode Pembayaran</span>
                        <span className="font-semibold text-gray-900">
                          {selectedTransaction.paymentMethod}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tanggal Transaksi</span>
                        <span className="font-semibold text-gray-900">
                          {selectedTransaction.transactionDate}
                        </span>
                      </div>
                      {selectedTransaction.settlementDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Tanggal Settlement
                          </span>
                          <span className="font-semibold text-gray-900">
                            {selectedTransaction.settlementDate}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amount Breakdown */}
                  <div className="space-y-3">
                    <p className="font-bold text-gray-900">Rincian Jumlah</p>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Harga Sesi</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(selectedTransaction.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Biaya Platform (5%)
                        </span>
                        <span className="font-semibold text-red-600">
                          - {formatCurrency(selectedTransaction.fee)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-3 border-t">
                        <span className="font-bold text-gray-900">
                          Total Diterima
                        </span>
                        <span className="font-bold text-green-600 text-xl">
                          {formatCurrency(selectedTransaction.netAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Settlement Info */}
                  {selectedTransaction.status === "pending" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-gray-700">
                          <p className="font-semibold mb-1">
                            Menunggu Settlement
                          </p>
                          <p>
                            Dana akan tersedia untuk ditarik dalam{" "}
                            <strong>
                              {selectedTransaction.daysUntilWithdraw} hari
                            </strong>{" "}
                            (tanggal {selectedTransaction.settlementDate}).
                            Settlement otomatis dilakukan 7 hari kerja setelah
                            transaksi berhasil.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
