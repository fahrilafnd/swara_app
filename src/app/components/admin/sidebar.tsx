"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import penggunaIcon from "@/public/admin/pengguna.svg"; // atau "@/assets/pengguna.svg"

export default function AdminSidebar({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsCollapsed]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (window.innerWidth < 1024 && !isCollapsed) {
        if (!target.closest('.sidebar') && !target.closest('.mobile-menu-button')) {
          setIsCollapsed(true);
        }
      }
    };

    if (window.innerWidth < 1024 && !isCollapsed) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isCollapsed, setIsCollapsed]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (window.innerWidth < 1024 && !isCollapsed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCollapsed]);

  const menuItems = [
    {
      title: "Beranda",
      href: "/admin",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 12.204C2 9.915 2 8.771 2.52 7.823C3.038 6.874 3.987 6.286 5.884 5.108L7.884 3.867C9.889 2.622 10.892 2 12 2C13.108 2 14.11 2.622 16.116 3.867L18.116 5.108C20.013 6.286 20.962 6.874 21.481 7.823C22 8.772 22 9.915 22 12.203V13.725C22 17.625 22 19.576 20.828 20.788C19.656 22 17.771 22 14 22H10C6.229 22 4.343 22 3.172 20.788C2.001 19.576 2 17.626 2 13.725V12.204Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M12 15V18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      title: "Manajemen Pengguna",
      href: "/admin/manage-pengguna",
      icon: (
        <img src="/admin/pengguna.svg" alt="Pengguna" className="w-5 h-5" />
      ),
    },
    {
      title: "Manajemen Skor Swara",
      href: "/admin/manage-skor-swara",
      icon: (
        <img src="/admin/skor-swara.svg" alt="Skor Swara" className="w-5 h-5" />
      ),
    },
    {
      title: "Manajemen Adu Swara",
      href: "/admin/manage-adu-swara",
      icon: (
        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 10.8489C16.45 10.8489 15.9793 10.6572 15.588 10.2739C15.1967 9.89054 15.0007 9.41554 15 8.84888V4.84888C15 4.28221 15.196 3.80721 15.588 3.42388C15.98 3.04054 16.4507 2.84888 17 2.84888C17.5667 2.84888 18.0417 3.04054 18.425 3.42388C18.8083 3.80721 19 4.28221 19 4.84888V8.84888C19 9.41554 18.8083 9.89054 18.425 10.2739C18.0417 10.6572 17.5667 10.8489 17 10.8489ZM3 22.8489V2.84888H13V4.84888H5V20.8489H16V18.8489H18V22.8489H3ZM7 18.8489V16.8489H14V18.8489H7ZM7 15.8489V13.8489H12V15.8489H7ZM18 16.8489H16V14.2489C14.7167 14.0155 13.6457 13.3949 12.787 12.3869C11.9283 11.3789 11.4993 10.1995 11.5 8.84888H13.5C13.5 9.81554 13.8417 10.6405 14.525 11.3239C15.2083 12.0072 16.0333 12.3489 17 12.3489C17.9833 12.3489 18.8127 12.0072 19.488 11.3239C20.1633 10.6405 20.5007 9.81554 20.5 8.84888H22.5C22.5 10.1989 22.075 11.3782 21.225 12.3869C20.375 13.3955 19.3 14.0162 18 14.2489V16.8489Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      title: "Manajemen Inspira",
      href: "/admin/manajemen-inspira",
      icon: (
        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 2.09885C7.74022 2.09885 6.53204 2.59929 5.64124 3.49009C4.75045 4.38089 4.25 5.58907 4.25 6.84885C4.25 8.10862 4.75045 9.31681 5.64124 10.2076C6.53204 11.0984 7.74022 11.5988 9 11.5988C10.2598 11.5988 11.468 11.0984 12.3588 10.2076C13.2496 9.31681 13.75 8.10862 13.75 6.84885C13.75 5.58907 13.2496 4.38089 12.3588 3.49009C11.468 2.59929 10.2598 2.09885 9 2.09885ZM5.75 6.84885C5.75 5.98689 6.09241 5.16024 6.7019 4.55075C7.3114 3.94126 8.13805 3.59885 9 3.59885C9.86195 3.59885 10.6886 3.94126 11.2981 4.55075C11.9076 5.16024 12.25 5.98689 12.25 6.84885C12.25 7.7108 11.9076 8.53745 11.2981 9.14694C10.6886 9.75644 9.86195 10.0988 9 10.0988C8.13805 10.0988 7.3114 9.75644 6.7019 9.14694C6.09241 8.53745 5.75 7.7108 5.75 6.84885Z"
            fill="currentColor"
          />
          <path
            d="M15 3.09885C14.8011 3.09885 14.6103 3.17786 14.4697 3.31852C14.329 3.45917 14.25 3.64993 14.25 3.84885C14.25 4.04776 14.329 4.23852 14.4697 4.37918C14.6103 4.51983 14.8011 4.59885 15 4.59885C15.5967 4.59885 16.169 4.8359 16.591 5.25786C17.0129 5.67981 17.25 6.25211 17.25 6.84885C17.25 7.44558 17.0129 8.01788 16.591 8.43984C16.169 8.86179 15.5967 9.09885 15 9.09885C14.8011 9.09885 14.6103 9.17786 14.4697 9.31852C14.329 9.45917 14.25 9.64993 14.25 9.84885C14.25 10.0478 14.329 10.2385 14.4697 10.3792C14.6103 10.5198 14.8011 10.5988 15 10.5988C15.9946 10.5988 16.9484 10.2038 17.6517 9.5005C18.3549 8.79724 18.75 7.84341 18.75 6.84885C18.75 5.85428 18.3549 4.90046 17.6517 4.1972C16.9484 3.49393 15.9946 3.09885 15 3.09885Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.678 14.3688C5.078 13.5688 6.961 13.0988 9 13.0988C11.039 13.0988 12.922 13.5688 14.322 14.3688C15.7 15.1568 16.75 16.3588 16.75 17.8488C16.75 19.3388 15.7 20.5408 14.322 21.3288C12.922 22.1288 11.039 22.5988 9 22.5988C6.961 22.5988 5.078 22.1288 3.678 21.3288C2.3 20.5408 1.25 19.3388 1.25 17.8488C1.25 16.3588 2.3 15.1568 3.678 14.3688ZM4.422 15.6718C3.267 16.3318 2.75 17.1288 2.75 17.8488C2.75 18.5688 3.267 19.3658 4.422 20.0258C5.556 20.6738 7.173 21.0988 9 21.0988C10.827 21.0988 12.444 20.6738 13.578 20.0258C14.733 19.3658 15.25 18.5678 15.25 17.8488C15.25 17.1298 14.733 16.3318 13.578 15.6718C12.444 15.0238 10.827 14.5988 9 14.5988C7.173 14.5988 5.556 15.0238 4.422 15.6718Z"
            fill="currentColor"
          />
          <path
            d="M18.1603 14.1158C17.9659 14.0734 17.7626 14.1099 17.5951 14.2174C17.4276 14.3249 17.3097 14.4944 17.2673 14.6888C17.2248 14.8833 17.2614 15.0866 17.3688 15.254C17.4763 15.4215 17.6459 15.5394 17.8403 15.5818C18.6323 15.7548 19.2653 16.0538 19.6833 16.3958C20.1013 16.7378 20.2503 17.0728 20.2503 17.3488C20.2503 17.5988 20.1303 17.8938 19.7973 18.2028C19.4623 18.5138 18.9473 18.8008 18.2843 19.0008C18.1899 19.0292 18.1021 19.0759 18.0257 19.1382C17.9494 19.2005 17.8861 19.2773 17.8395 19.364C17.7928 19.4508 17.7637 19.5459 17.7538 19.6439C17.7439 19.742 17.7534 19.841 17.7818 19.9353C17.8101 20.0297 17.8568 20.1175 17.9191 20.1939C17.9814 20.2702 18.0582 20.3335 18.1449 20.3801C18.2317 20.4268 18.3268 20.4559 18.4249 20.4658C18.5229 20.4757 18.6219 20.4662 18.7163 20.4378C19.5393 20.1898 20.2743 19.8068 20.8183 19.3018C21.3643 18.7948 21.7503 18.1278 21.7503 17.3488C21.7503 16.4838 21.2763 15.7608 20.6333 15.2348C19.9893 14.7078 19.1223 14.3268 18.1603 14.1158Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      title: "Podium & Simulasi",
      href: "/admin/podium-simulasi",
      icon: <img src="/admin/podium.svg" alt="Podium" className="w-5 h-5" />,
    },
    {
      title: "Mentoring & Jadwal",
      href: "/admin/mentoring-jadwal",
      icon: <img src="/admin/mentor.svg" alt="Mentor" className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[9998] lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <aside
        className={`sidebar fixed left-0 top-0 z-[9999] flex h-screen flex-col overflow-y-auto py-3 sm:py-5 lg:static lg:translate-x-0 lg:z-auto text-black transition-all duration-300 ${
          isCollapsed
            ? "-translate-x-full lg:translate-x-0 lg:w-[92px] px-2"
            : "translate-x-0 w-[280px] sm:w-[285px] xl:w-[330px] px-3 sm:px-5"
        }`}
      >
        <div className="h-full w-full rounded-3xl border border-gray-200 bg-white flex flex-col">
          <div
            className={`pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6 lg:pb-7 flex justify-between items-center ${
              isCollapsed ? "w-full px-2" : "px-3 sm:px-4 lg:px-6"
            }`}
          >
            {!isCollapsed && (
              <Link href="/dashboard">
                <img src="/logo.svg" alt="logo" className="w-24 sm:w-28 lg:w-32" />
              </Link>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-8 h-8 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Toggle sidebar"
            >
              <img
                src="/toggle-sidebar.svg"
                alt="toggle-sidebar"
                className="w-8 object-cover"
              />
            </button>
          </div>

          <div className="flex flex-col duration-300 ease-linear overflow-y-auto flex-1">
            <nav>
              <ul
                className={`flex flex-col ${
                  isCollapsed ? "items-center px-2" : "px-3 sm:px-4 lg:px-6"
                }`}
              >
                {menuItems.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);
                  return (
                    <li
                      key={item.title}
                      className="rounded-xl py-2 sm:py-3 font-lexend relative w-full"
                    >
                      <div
                        className={`absolute -left-[20px] sm:-left-[25px] top-0 w-[4px] sm:w-[6px] rounded-full h-full ${
                          isActive ? "bg-[#F07122]" : "hidden"
                        }`}
                      ></div>
                      <Link
                        href={item.href}
                        className={`flex items-center transition-colors ${
                          isCollapsed ? "justify-center" : ""
                        } ${isActive ? "text-[#F07122]" : "text-[#B3C8CF]"}`}
                        onClick={() => {
                          if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                            setIsCollapsed(true);
                          }
                        }}
                      >
                        <span
                          className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${
                            isActive ? "text-[#F07122]" : "text-[#B3C8CF]"
                          }`}
                        >
                          {item.icon}
                        </span>
                        {!isCollapsed && (
                          <span
                            className={`ml-3 sm:ml-4 truncate text-sm sm:text-base ${
                              isActive ? "text-[#F07122]" : "text-[#B3C8CF]"
                            }`}
                          >
                            {item.title}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
