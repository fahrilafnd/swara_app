"use client";

import * as React from "react";
import Sidebar from "../components/sidebar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="md:flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">Header</main>
      </div>
    </div>
  );
}
