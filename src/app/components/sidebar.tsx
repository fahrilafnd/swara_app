"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  Footprints,
  GraduationCap,
  Home,
  LucideIcon,
  Menu,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string | null;
}

const menuItems: MenuItem[] = [
  { icon: Home, label: "Beranda", href: "/dashboard" },
  { icon: BarChart3, label: "Insight Karbon", href: "/insight-carbon" },
  { icon: Footprints, label: "Jejakku", href: "/jejakku" },
  { icon: FileText, label: "Lapor ESG", href: "/lapor-esg" },
  { icon: TrendingUp, label: "Pasar Karbon", href: "/pasar-karbon" },
  { icon: Trophy, label: "Challenge", href: "/challenge" },
  { icon: GraduationCap, label: "Nuvora Edu", href: "/nuvora-edu" },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  const isActive = (href: string | null, label: string) => {
    if (!href) return false;
    if (label === "Beranda")
      return pathname === "/" || pathname.startsWith("/dashboard");
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div>
      {/* Mobile top bar */}
      <div className="fixed top-0 z-40 flex h-14 items-center gap-3 border-b border-gray-100 bg-white px-4 shadow-sm md:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Buka menu"
          className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 hover:bg-gray-50"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="m-4 mr-0 hidden w-64 flex-col rounded-2xl border border-gray-100 bg-white shadow-sm md:flex">
        {/* Brand */}
        <div className="border-b border-gray-100 p-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <img src="/logo.svg" alt="Logo" className="w-40" />
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.href, item.label);
              const classes = cn(
                "relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200",
                active
                  ? "text-white bg-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-nuvora-green"
              );

              const Icon = item.icon;

              return (
                <li key={item.label} className="cursor-pointer">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={classes}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {active && (
                        <div className="bg-nuvora-green absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full" />
                      )}
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ) : (
                    <span className={classes}>
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
            onClick={() => setOpen(false)}
          />
          {/* Panel */}
          <aside
            role="dialog"
            aria-modal="true"
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col rounded-r-2xl border-r border-gray-100 bg-white shadow-2xl transition-transform duration-200 md:hidden"
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-3"
                onClick={() => setOpen(false)}
              >
                <img src="/logo.svg" alt="Logo" className="w-32" />
              </Link>
              <button
                onClick={() => setOpen(false)}
                aria-label="Tutup menu"
                className="rounded-lg p-2 hover:bg-gray-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 p-4">
              <ul className="space-y-1">
                {menuItems.map((item) => {
                  const active = isActive(item.href, item.label);
                  const classes = cn(
                    "relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200",
                    active
                      ? "text-nuvora-green bg-nuvora-green/10"
                      : "text-gray-600 hover:bg-gray-50 hover:text-nuvora-green"
                  );
                  const Icon = item.icon;

                  return (
                    <li key={item.label} className="cursor-pointer">
                      {item.href ? (
                        <Link
                          href={item.href}
                          className={classes}
                          aria-current={active ? "page" : undefined}
                          onClick={() => setOpen(false)}
                        >
                          {active && (
                            <div className="bg-nuvora-green absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full" />
                          )}
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ) : (
                        <span className={classes}>
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
