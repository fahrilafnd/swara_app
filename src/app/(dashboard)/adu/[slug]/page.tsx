import Link from "next/link";

export default function AduSession() {
  return (
    <div className="font-lexend bg-white rounded-xl p-8 shadow-md mb-10 flex flex-col pb-8">
      {/* Header Topik + Gambar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md p-4 md:p-5 mb-6">
        <div className="flex items-center gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-[#F8C56A] text-[#EF5C00] font-semibold">
            Topik Pembicaraan
          </span>
          <span className="text-[#9a6b3b] hidden md:inline">
            Deskripsikan benda/objek pada gambar berikut
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-[110px,1fr] gap-4 items-center">
          {/* Gambar Topik */}
          <div className="flex md:block justify-center">
            <img
              src="https://images.unsplash.com/photo-1601084195907-44baaa49dabd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=900"
              alt="Gambar topik"
              className="w-24 h-24 md:w-[110px] md:h-[110px] object-cover rounded-2xl ring-2 ring-[#F8C56A]"
              loading="lazy"
            />
          </div>

          {/* Judul Topik */}
          <div className="bg-[#FFF8EE] border border-[#F8C56A] rounded-2xl px-5 py-4 flex justify-between items-center">
            <div className="flex flex-col gap-2">
            <p className="text-[#F07122] font-bold text-xl md:text-2xl leading-snug">
              Merancang Masa Depan: Membangun Karier di Era Digital
            </p>
            <p className="text-[#6b6157] text-sm mt-1">
              Gunakan 30–60 detik untuk menjelaskan: peluang, tantangan, dan
              contoh konkret.
            </p>
            </div>
            <Link
              href="/adu/result"
              className=" bg-[#F8C56A] text-lg text-white flex w-max items-center py-3 px-5 rounded-2xl border-2 border-[#F07122] mx-auto shadow hover:brightness-[0.98] transition"
            >
              <div className="mr-3">
                <svg
                  width="20"
                  height="24"
                  viewBox="0 0 20 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.84375 7.875C1.06753 7.875 1.28214 7.9639 1.44037 8.12213C1.59861 8.28036 1.6875 8.49497 1.6875 8.71875V9.84375C1.6875 10.9148 1.89847 11.9755 2.30836 12.965C2.71825 13.9546 3.31903 14.8537 4.07641 15.6111C4.83379 16.3685 5.73293 16.9693 6.72249 17.3791C7.71205 17.789 8.77266 18 9.84375 18C10.9148 18 11.9754 17.789 12.965 17.3791C13.9546 16.9693 14.8537 16.3685 15.6111 15.6111C16.3685 14.8537 16.9692 13.9546 17.3791 12.965C17.789 11.9755 18 10.9148 18 9.84375V8.71875C18 8.49497 18.0889 8.28036 18.2471 8.12213C18.4054 7.9639 18.62 7.875 18.8437 7.875C19.0675 7.875 19.2821 7.9639 19.4404 8.12213C19.5986 8.28036 19.6875 8.49497 19.6875 8.71875V9.84375C19.6876 12.3085 18.763 14.6835 17.0966 16.4995C15.4302 18.3155 13.1431 19.4402 10.6875 19.6515V22.2188C10.6875 22.4425 10.5986 22.6571 10.4404 22.8154C10.2821 22.9736 10.0675 23.0625 9.84375 23.0625C9.61997 23.0625 9.40536 22.9736 9.24713 22.8154C9.08889 22.6571 9 22.4425 9 22.2188V19.6515C6.54437 19.4402 4.25733 18.3155 2.59091 16.4995C0.924491 14.6835 -5.69285e-05 12.3085 2.62909e-09 9.84375V8.71875C2.62909e-09 8.49497 0.0888947 8.28036 0.247129 8.12213C0.405362 7.9639 0.619974 7.875 0.84375 7.875Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.84375 0C8.12813 0 6.48278 0.681527 5.26965 1.89465C4.05653 3.10778 3.375 4.75313 3.375 6.46875V9.84375C3.375 11.5594 4.05653 13.2047 5.26965 14.4178C6.48278 15.631 8.12813 16.3125 9.84375 16.3125C11.5594 16.3125 13.2047 15.631 14.4178 14.4178C15.631 13.2047 16.3125 11.5594 16.3125 9.84375V6.46875C16.3125 4.75313 15.631 3.10778 14.4178 1.89465C13.2047 0.681527 11.5594 0 9.84375 0ZM12.0938 10.6875C12.3175 10.6875 12.5321 10.5986 12.6904 10.4404C12.8486 10.2821 12.9375 10.0675 12.9375 9.84375C12.9375 9.61997 12.8486 9.40536 12.6904 9.24713C12.5321 9.08889 12.3175 9 12.0938 9H7.59375C7.36997 9 7.15536 9.08889 6.99713 9.24713C6.8389 9.40536 6.75 9.61997 6.75 9.84375C6.75 10.0675 6.8389 10.2821 6.99713 10.4404C7.15536 10.5986 7.36997 10.6875 7.59375 10.6875H12.0938ZM11.8125 6.46875C11.8125 6.69253 11.7236 6.90714 11.5654 7.06537C11.4071 7.2236 11.1925 7.3125 10.9688 7.3125H8.71875C8.49497 7.3125 8.28036 7.2236 8.12213 7.06537C7.9639 6.90714 7.875 6.69253 7.875 6.46875C7.875 6.24497 7.9639 6.03036 8.12213 5.87213C8.28036 5.71389 8.49497 5.625 8.71875 5.625H10.9688C11.1925 5.625 11.4071 5.71389 11.5654 5.87213C11.7236 6.03036 11.8125 6.24497 11.8125 6.46875Z"
                    fill="white"
                  />
                </svg>
              </div>
              Mulai Berbicara
            </Link>
          </div>
        </div>
      </div>

      {/* Area Kamera */}
      <div className="bg-white rounded-3xl p-4 md:p-6 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-end">
          {/* kamera kiri */}
          <div className="relative">
            <img
              className="w-full rounded-2xl"
              src="https://www.totaljobs.com/advice/wp-content/uploads/how-to-set-up-and-test-cammio-for-your-video-interview.jpg"
              alt="Kamera kiri"
            />
          </div>
          {/* kamera kanan */}
          <div className="relative">
            <img
              className="w-full rounded-2xl border-8 border-[#F07122]"
              src="https://media.gettyimages.com/id/1635403579/video/video-call-communication-face-or-man-wave-hello-discussion-and-consulting-with-webinar.jpg?s=640x640&k=20&c=ok5TDCZBzxcWIE5ZSwZgSkdWRl29uj1aiXvLpN7GMkw="
              alt="Kamera kanan"
            />
          </div>
        </div>
      </div>

      {/* Identitas & Status giliran */}
      <div className="mx-auto w-full max-w-6xl px-4 mt-4 flex justify-between gap-4">
        <div className="flex items-end">
          <div className="bg-white flex items-center py-3 px-5 rounded-2xl rounded-tl-none shadow">
            <img
              className="w-[50px] h-[50px] object-cover rounded-full mr-4"
              src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg"
              alt="Avatar Kimberly"
            />
            <p className="text-lg font-bold text-[#39363D]">Kimberly</p>
          </div>
        </div>

        <div className="flex items-end">
          <span className="bg-[#F07122] text-white text-base md:text-xl font-medium mr-4 px-3 py-2 rounded-2xl shadow-sm">
            Your Turn!
          </span>
          <div className="bg-white flex items-center py-3 px-5 rounded-2xl rounded-tr-none shadow">
            <p className="text-lg font-bold text-[#39363D]">Kimberly</p>
            <img
              className="w-[50px] h-[50px] object-cover rounded-full ml-4"
              src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg"
              alt="Avatar Kimberly"
            />
          </div>
        </div>
      </div>

      {/* Timer */}
      <span className="mt-5 w-max mx-auto text-[#F07122] bg-white font-semibold text-2xl py-2 px-4 rounded-2xl shadow">
        02:11
      </span>

    </div>
  );
}
