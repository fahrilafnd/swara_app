"use client";

import * as React from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen font-lexend overflow-hidden bg-[#F5F2E9]">
      <div className="absolute -top-[50px] -left-[70px] bg-[#F0712280] w-[390px] h-[350px] blur-3xl"></div>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id="app-scroll"
        className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto text-black"
      >
        <Header scrollContainerId="app-scroll" />
        <div className="z-10 lg:pl-0 pl-20 pt-2">{children}</div>
      </main>
    </div>
  );
}
