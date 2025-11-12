"use client";

import { useState } from "react";
import AdminSidebar from "../components/mentor/sidebar";
import MentorHeader from "../components/mentor/header";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F2E9]">
      <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <MentorHeader setIsCollapsed={setIsCollapsed} />
        
        <main className="flex-1 flex justify-center overflow-y-auto">
          <div className="w-full max-w-screen-2xl px-5 sm:px-8 lg:px-12 py-4 sm:py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
