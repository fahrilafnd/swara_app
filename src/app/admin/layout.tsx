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
        <main className="frelative flex flex-col flex-1 overflow-x-hidden overflow-y-auto text-black">
          <AdminHeader />
          <div className={`z-50 lg:pl-0 pl-20 pr-3 md:pr-8 h-full overflow-auto scrollbar-custom`}>
            {children}
          </div>
        </main>
    </div>
  );
}
