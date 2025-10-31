import Link from "next/link";

export default function ManageAduSwaraDetail() {
  return (
    <div className="font-lexend h-full flex flex-col">
      <div className="bg-white  relative rounded-2xl py-8 px-6 lg:px-10 mb-6  h-fit pb-4 shadow-md overflow-hidden">
        {/* Header duel */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] items-start gap-8 mb-10">
          {/* Kiri */}
          <div className="min-w-0 flex flex-col">
            <div className="w-max rounded-3xl rounded-tl-none bg-[#F5F5F5] flex items-center px-4 py-3 mb-6">
              <img
                src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg"
                alt="pp"
                className="w-[50px] h-[50px] rounded-full object-cover object-center"
              />
              <p className="text-lg text-[#39363D] font-semibold ml-5">
                Husein
              </p>
            </div>

            <div className="w-full h-4 border border-[#BFBFBE] rounded-full mb-16 relative overflow-hidden">
              <div className="w-[40%] h-full bg-[#BFBFBE] rounded-full" />
              <span className="absolute bg-white shadow-md px-4 py-3 rounded-2xl text-sm -bottom-12 left-[30%]">
                <b>14</b>/25
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* bintang-bintang abu */}
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  width="58"
                  height="58"
                  viewBox="0 0 58 58"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25.4404 4.94214C26.53 1.80768 30.9632 1.80767 32.0527 4.94214L36.4658 17.6365C36.5345 17.834 36.7186 17.9682 36.9277 17.9724L50.3643 18.2468C53.6819 18.3144 55.0523 22.53 52.4082 24.5349L41.6982 32.6541C41.5316 32.7804 41.4609 32.9978 41.5215 33.198L45.4131 46.0613C46.374 49.2374 42.7883 51.843 40.0645 49.948L29.0322 42.2712C28.8606 42.1519 28.6326 42.1518 28.4609 42.2712L17.4297 49.948C14.7059 51.8434 11.1191 49.2375 12.0801 46.0613L15.9717 33.198C16.032 32.997 15.9624 32.7803 15.7959 32.6541L5.08594 24.5349C2.44159 22.5301 3.81121 18.3145 7.12891 18.2468L20.5664 17.9724C20.7753 17.968 20.9597 17.8339 21.0283 17.6365L25.4404 4.94214Z"
                    fill={i === 0 ? "#BFBFBE" : "rgba(191,191,190,0.1)"}
                    stroke="#BFBFBE"
                    strokeWidth="3"
                  />
                </svg>
              ))}
            </div>
          </div>

          {/* Tengah */}
          <p className="text-2xl text-[#F07122] text-center">VS</p>

          {/* Kanan */}
          <div className="min-w-0 flex flex-col items-end">
            <div className="w-max rounded-3xl rounded-tr-none bg-[#F5F5F5] flex items-center px-4 py-3 mb-6">
              <p className="text-lg text-[#39363D] font-semibold mr-5">
                Husein
              </p>
              <img
                src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg"
                alt="pp"
                className="w-[50px] h-[50px] rounded-full object-cover object-center"
              />
              <div className="ml-5">
                <svg
                  width="45"
                  height="45"
                  viewBox="0 0 45 45"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.37452 38.4375H35.6245M31.6345 32.8125H13.3645C11.437 32.8125 10.4733 32.8125 9.74202 32.2931C9.01077 31.7756 8.69202 30.8663 8.05452 29.0456L3.84702 17.0194C3.7363 16.6941 3.71998 16.3441 3.79995 16.01C3.87992 15.6758 4.05291 15.3711 4.29889 15.1312C4.60742 14.8293 5.00986 14.6418 5.43953 14.5998C5.86919 14.5579 6.30029 14.664 6.66139 14.9006L8.96952 16.4194C11.302 17.9531 12.4683 18.7181 13.6476 18.4406C14.827 18.1613 15.5264 16.9538 16.927 14.5406L21.0783 7.37812C21.2236 7.13016 21.4312 6.92447 21.6805 6.78141C21.9298 6.63835 22.2121 6.56289 22.4995 6.5625C23.0883 6.5625 23.6301 6.87375 23.9226 7.37625L28.0739 14.5388C29.4745 16.9538 30.1739 18.1613 31.3533 18.4388C32.5326 18.72 33.697 17.9513 36.0295 16.4194L38.3414 14.9006C38.7023 14.6645 39.133 14.5587 39.5623 14.6006C39.9915 14.6425 40.3936 14.8297 40.702 15.1312C41.2026 15.6263 41.377 16.3556 41.152 17.0194L36.9426 29.0456C36.3051 30.8644 35.9864 31.7756 35.2551 32.2931C34.5239 32.8125 33.562 32.8125 31.6345 32.8125Z"
                    stroke="#F07122"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className="w-full h-4 bg-[#F0712220] border border-[#F07122] rounded-full mb-16 relative overflow-hidden">
              <div className="w-[65%] h-full bg-[#F07122] rounded-full ml-auto" />
              <span className="absolute bg-white shadow-md px-4 py-3 rounded-2xl text-sm -bottom-12 left-[30%]">
                <b>20</b>/25
              </span>
            </div>

            <div className="flex gap-3 w-full justify-end">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  width="58"
                  height="58"
                  viewBox="0 0 58 58"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25.4404 4.94214C26.53 1.80768 30.9632 1.80767 32.0527 4.94214L36.4658 17.6365C36.5345 17.834 36.7186 17.9682 36.9277 17.9724L50.3643 18.2468C53.6819 18.3144 55.0523 22.53 52.4082 24.5349L41.6982 32.6541C41.5316 32.7804 41.4609 32.9978 41.5215 33.198L45.4131 46.0613C46.374 49.2374 42.7883 51.843 40.0645 49.948L29.0322 42.2712C28.8606 42.1519 28.6326 42.1518 28.4609 42.2712L17.4297 49.948C14.7059 51.8434 11.1191 49.2375 12.0801 46.0613L15.9717 33.198C16.032 32.997 15.9624 32.7803 15.7959 32.6541L5.08594 24.5349C2.44159 22.5301 3.81121 18.3145 7.12891 18.2468L20.5664 17.9724C20.7753 17.968 20.9597 17.8339 21.0283 17.6365L25.4404 4.94214Z"
                    fill={i < 3 ? "#F07122" : "rgba(240,113,34,0.1)"}
                    stroke="#F07122"
                    strokeWidth="3"
                  />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Ringkasan */}
        <div className="rounded-2xl border border-[#ACACAC] flex flex-col lg:flex-row overflow-hidden">
          <div className="bg-gradient-to-b to-[#9EAAFF] from-[#6877E0] text-white rounded-2xl lg:rounded-r-none w-full lg:max-w-[400px] p-6 flex justify-center items-center">
            <p className="text-center w-full">Hasil Latihanmu</p>
          </div>

          <div className="px-6 lg:px-12 py-6 w-full min-w-0">
            <p className="text-center text-[#303B59] mb-8">
              Ringkasan Penilaian
            </p>

            <div className="flex justify-between bg-[#CA2C3110] p-4 rounded-2xl text-sm mb-4">
              <p className="text-[#CA2C31] w-[200px]">
                Kelancaran dan Pengucapan
              </p>
              <p className="text-[#303B59]">
                <b>5</b>/5
              </p>
              <p className="text-[#303B59] w-[90px] text-end">Sangat Baik</p>
            </div>

            <div className="flex justify-between bg-[#FFF7E2] p-4 rounded-2xl text-sm mb-4">
              <p className="text-[#BA9A14] w-[200px]">Isi</p>
              <p className="text-[#303B59]">
                <b>3</b>/5
              </p>
              <p className="text-[#303B59] w-[90px] text-end">Cukup</p>
            </div>

            <div className="flex justify-between bg-[#F4FAFA] p-4 rounded-2xl text-sm mb-4">
              <p className="text-[#3D9758] w-[200px]">
                Organisasi dan Struktur
              </p>
              <p className="text-[#303B59]">
                <b>4</b>/5
              </p>
              <p className="text-[#303B59] w-[90px] text-end">Baik</p>
            </div>

            <div className="flex justify-between bg-[#F1FBFF] p-4 rounded-2xl text-sm mb-4">
              <p className="text-[#224AA0] w-[200px]">
                Kontak Mata dan Ekspresi
              </p>
              <p className="text-[#303B59]">
                <b>5</b>/5
              </p>
              <p className="text-[#303B59] w-[90px] text-end">Sangat Baik</p>
            </div>

            <div className="flex justify-between bg-[#F3F3FD] p-4 rounded-2xl text-sm">
              <p className="text-[#224AA0] w-[200px]">Penggunaan Bahasa</p>
              <p className="text-[#303B59]">
                <b>5</b>/5
              </p>
              <p className="text-[#303B59] w-[90px] text-end">Sangat Baik</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 animate-bounce left-4">
          <Link
            href={"/admin/manage-adu-swara"}
            className="bg-primary w-full animate-bounce rounded-xl px-10 text-white py-4"
          >
            Siap, Paham!
          </Link>
        </div>
      </div>
    </div>
  );
}
