"use client";

import * as React from "react";
import AdminSidebar from "../components/admin/sidebar";
import AdminHeader from "../components/admin/header";

export default function DashboardAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F2E9]">
        <div className="absolute -top-[50px] -left-[70px] bg-[#F0712280] w-[390px] h-[350px] blur-3xl"></div>
        <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto text-black">
          <AdminHeader setIsCollapsed={setIsCollapsed} />
          <div className={`z-50 px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6 pb-4 sm:pb-6 min-h-0 flex-1 overflow-y-auto scrollbar-custom`}>
            {children}
          </div>
        </main>
    </div>
  );
}
