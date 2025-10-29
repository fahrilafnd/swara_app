"use client";

import * as React from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F2E9]">
        <div className="absolute -top-[50px] -left-[70px] bg-[#F0712280] w-[390px] h-[350px] blur-3xl"></div>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main className="frelative flex flex-col flex-1 overflow-x-hidden overflow-y-auto text-black">
          {!pathname.startsWith("/skor-swara/sesi-latihan") && !pathname.startsWith("/skor-swara/hasil-skor") && <Header />}
          <div className={`z-10 lg:pl-0 pl-20 pr-3 md:pr-8 h-full ${pathname.startsWith("/inspira") ? 'overflow-hidden' : 'overflow-auto'}`}>
            {children}
          </div>
        </main>
    </div>
  );
}