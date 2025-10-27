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
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F2E9] relative">
        <div className="absolute -top-[50px] -left-[70px] bg-[#F0712280] w-[390px] h-[350px] blur-3xl z-0"></div>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto text-black z-10">
<Header />
          <div className={`z-20 lg:pl-0 pl-20 pr-3 md:pr-8 h-full ${pathname.startsWith("/inspira") ? 'overflow-hidden' : 'overflow-auto'}`}>
            {children}
          </div>
        </main>
    </div>
  );
}