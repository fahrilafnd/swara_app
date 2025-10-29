"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Sidebar({
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
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsCollapsed]);

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
      href: "/admin/manajemen-pengguna",
      icon: <img src={"../admin/pengguna.svg"} alt="Pengguna" />,
    },
    {
      title: "Manajemen Skor Swara",
      href: "/admin/manajemen-skor-swara",
      icon: <img src={"../admin/skor-swara.svg"} alt="Skor Swara" />,
    },
    {
      title: "Manajemen Adu Swara",
      href: "/admin/manajemen-adu-swara",
      icon: (
        <svg
          width="27"
          height="25"
          viewBox="0 0 27 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_758_374)">
            <path
              d="M7.1625 2.0926C5.65313 3.87853 4.53281 5.96447 3.88594 8.20978C3.88594 8.21916 3.88125 8.22385 3.88125 8.23322C2.03906 8.9926 0.75 10.802 0.75 12.9113C0.75 15.7051 3.01875 17.9738 5.8125 17.9738C8.60625 17.9738 10.875 15.7051 10.875 12.9113C10.875 10.4035 9.05156 8.32228 6.65625 7.91916C7.39219 5.95978 8.55 4.18791 10.0453 2.7301C10.1297 2.6551 10.2328 2.60822 10.3406 2.58478C12.0844 2.04572 13.9359 1.96135 15.7219 2.34103C21.3141 3.5176 25.0312 8.81916 24.2391 14.4723C23.8453 17.4067 22.4297 19.7551 20.1281 21.5692C17.7797 23.4301 15.0891 24.1145 12.15 24.016L11.025 23.9692C11.6062 24.1004 12.1969 24.1988 12.7875 24.2645C14.6953 24.4613 16.6031 24.3629 18.4172 23.6785C22.8234 22.0145 25.4156 18.8832 26.0531 14.1863C26.2781 11.7207 25.7812 9.24572 24.6094 7.06135C21.3094 0.878534 13.6313 -1.45115 7.45312 1.84885C7.34062 1.91447 7.24219 1.99416 7.15781 2.0926H7.1625ZM14.5031 20.6879C14.4047 21.227 14.3062 21.7145 13.8187 22.1551C16.3125 22.1082 19.5938 20.7863 21.4031 17.6035C23.2641 14.327 23.1656 11.0457 21.1078 7.86291C19.3969 5.27072 16.8984 4.00041 13.7672 3.80353C13.8375 3.91135 13.9172 4.00978 14.0109 4.09885L14.2547 4.39416C15.4313 5.86135 16.0172 7.57697 16.2609 9.43322C16.3594 10.1692 16.2141 10.8535 15.6234 11.3926C15.4266 11.5379 15.3797 11.6879 15.4266 11.8801L15.7687 12.7098L17.1422 15.2551C17.3859 15.7942 17.3391 16.1832 16.8469 16.577C16.6969 16.6942 16.5328 16.7926 16.3594 16.8723L15.4781 17.266L15.6234 17.9035C15.7687 18.1988 15.6703 18.4895 15.4781 18.7332C15.3609 18.8457 15.3 19.0098 15.3328 19.1738C15.4313 19.7129 15.2344 20.102 14.7469 20.3504C14.6484 20.3973 14.55 20.5942 14.5031 20.6926V20.6879ZM8.24063 20.5426C9.02344 21.0817 9.85781 21.5223 10.7344 21.766C11.8594 22.0098 12.6937 21.4707 12.8391 20.3457C12.8859 19.952 13.0828 19.6613 13.425 19.516C13.7672 19.3192 13.8188 19.1738 13.5234 18.8785L13.0828 18.4848L13.7203 18.2879C14.0156 18.1895 14.0625 18.0442 13.9641 17.7488C13.8984 17.6082 13.8516 17.4582 13.8187 17.3082C13.6734 16.6238 13.7203 16.5723 14.3578 16.427C14.7516 16.2817 15.0938 16.1317 15.3844 15.841C15.5297 15.7426 15.5297 15.6442 15.4313 15.4473L14.6484 14.027C14.6016 13.9379 14.55 13.8488 14.5031 13.7598C14.2031 13.2113 13.8938 12.6535 13.7672 12.0207C13.6688 11.5801 13.7203 11.191 14.1609 10.8957C14.4047 10.6988 14.5547 10.4551 14.5547 10.1129C14.5359 9.63947 14.4844 9.16135 14.4094 8.6926C14.1141 6.9301 13.3313 5.46291 12.0094 4.23947C11.7656 4.0426 11.5688 3.94416 11.2266 4.0426L9.55781 4.63791L9.83906 4.80666C10.1344 4.9801 10.4109 5.14885 10.6359 5.37385C12.0562 6.59728 12.5953 8.26135 12.7875 10.0707C12.8344 10.4645 12.7875 10.8535 12.4453 11.0973C12.0516 11.341 11.9578 11.6832 12.1031 12.077C12.3328 12.6957 12.5906 13.2957 12.8859 13.8863L13.6688 15.2551C13.3734 15.6488 13.0313 15.7942 12.6422 15.9395C12.0563 16.0848 11.9578 16.2817 12.1547 16.9192C12.1828 16.9895 12.2203 17.0504 12.2531 17.116C12.3516 17.3598 12.3 17.5098 12.0563 17.6035L11.4703 17.7488L11.7141 17.9457L11.9109 18.1426C12.1078 18.3863 12.1078 18.5363 11.8125 18.6301C11.4703 18.827 11.2734 19.0707 11.2734 19.4598C11.2734 20.0457 10.9312 20.3879 10.3922 20.5848C10.2141 20.6317 10.0359 20.6551 9.85312 20.6317L8.23594 20.5332L8.24063 20.5426Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="clip0_758_374">
              <rect
                width="27"
                height="24"
                fill="white"
                transform="translate(0 0.348846)"
              />
            </clipPath>
          </defs>
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
            d="M17 10.8489C16.45 10.8489 15.9793 10.6572 15.588 10.2739C15.1967 9.89054 15.0007 9.41554 15 8.84888V4.84888C15 4.28221 15.196 3.80721 15.588 3.42388C15.98 3.04054 16.4507 2.84888 17 2.84888C17.5667 2.84888 18.0417 3.04054 18.425 3.42388C18.8083 3.80721 19 4.28221 19 4.84888V8.84888C19 9.41554 18.8083 9.89054 18.425 10.2739C18.0417 10.6572 17.5667 10.8489 17 10.8489ZM3 22.8489V2.84888H13V4.84888H5V20.8489H16V18.8489H18V22.8489H3ZM7 18.8489V16.8489H14V18.8489H7ZM7 15.8489V13.8489H12V15.8489H7ZM18 16.8489H16V14.2489C14.7167 14.0155 13.6457 13.3949 12.787 12.3869C11.9283 11.3789 11.4993 10.1995 11.5 8.84888H13.5C13.5 9.81554 13.8417 10.6405 14.525 11.3239C15.2083 12.0072 16.0333 12.3489 17 12.3489C17.9833 12.3489 18.8127 12.0072 19.488 11.3239C20.1633 10.6405 20.5007 9.81554 20.5 8.84888H22.5C22.5 10.1989 22.075 11.3782 21.225 12.3869C20.375 13.3955 19.3 14.0162 18 14.2489V16.8489Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      title: "Podium & Simulasi",
      href: "/admin/podium-simulasi",
      icon: <img src={"../admin/podium.svg"} alt="Podium" />,
    },
    {
      title: "Mentoring & Jadwal",
      href: "/admin/mentoring-jadwal",
      icon: <img src={"../admin/mentor.svg"} alt="mentor" />,
    },
  ];

  return (
    <aside
      className={`sidebar fixed left-0 z-40 md:z-0 top-0 flex h-screen flex-col overflow-y-hidden md:px-5 py-5 lg:static lg:translate-x-0 text-black transition-all duration-300 ${
        isCollapsed ? "w-[92px] px-2" : "w-[285px] xl:w-[330px]"
      }`}
    >
      <div className="h-full w-max md:w-full rounded-3xl border border-gray-200 bg-white flex flex-col">
        <div
          className={`pt-8 pb-7 flex justify-between items-center ${
            isCollapsed ? "w-full px-3" : "px-3 lg:px-6"
          }`}
        >
          {!isCollapsed && (
            <Link href="/admin">
              <img src="/logo.svg" alt="logo" className="w-32" />
            </Link>
          )}
          <img
            src="/toggle-sidebar.svg"
            alt="toggle-sidebar"
            className="w-8 cursor-pointer toggle-sidebar object-cover"
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
        </div>

        <div className="flex flex-col duration-300 ease-linear overflow-y-auto">
          <nav>
            <ul
              className={`flex flex-col ${
                isCollapsed ? "items-center" : "px-6"
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
                    className="rounded-xl py-3 font-lexend relative w-full"
                  >
                    <div
                      className={`absolute -left-[25px] top-0 w-[6px] rounded-full h-full ${
                        isActive ? "bg-[#F07122]" : "hidden"
                      }`}
                    ></div>
                    <Link
                      href={item.href}
                      className={`flex items-center transition-colors ${
                        isCollapsed ? "justify-center" : ""
                      } ${isActive ? "text-[#F07122]" : "text-[#B3C8CF]"}`}
                    >
                      <span
                        className={`w-6 h-6 ${
                          isActive ? "text-[#F07122]" : "text-[#B3C8CF]"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span
                          className={`ml-4 ${
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
  );
}
