"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import AduSwaraIntroModal from "@/app/components/adu-swara/AduSwaraIntroModal";

export default function Adu() {
  const [isOpenMatch, setIsOpenMatch] = useState(false);

  const [showModal, setShowModal] = useState(false);
  // const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // const alreadyShown = sessionStorage.getItem("swaraModalShown");
    setShowModal(true);
    // if (!alreadyShown) {
    //   setShowModal(true);
    //   sessionStorage.setItem("swaraModalShown", "true");
    // }
  }, []);

  return (
    <div className="font-lexend h-full flex flex-col pb-5">
      <AduSwaraIntroModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
      <div className="flex flex-1 overflow-hidden">
        <aside className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="bg-white rounded-2xl mb-6 p-10 flex items-center">
            <div>
              <img
                src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg"
                alt="profile"
                className="w-[280px] rounded-full mb-6"
              />
              <h2 className="text-center text-[#39363D] text-3xl font-semibold">
                Kimberly
              </h2>
            </div>
            <div className="flex-1 ml-12">
              <div className="flex items-center mb-6">
                <p className="font-bold text-2xl border border-[#30303040] w-max py-3 px-3 rounded-3xl mr-5">
                  🥇
                </p>
                <p className="text-[#39363D] py-3 px-8 border border-[#30303040] rounded-3xl text-lg font-medium w-full flex justify-between">
                  Win rate &nbsp;&nbsp;: <span>53%</span>
                </p>
              </div>
              <div className="flex items-center mb-6">
                <p className="font-bold text-2xl border border-[#30303040] w-max py-3 px-3 rounded-3xl mr-5">
                  💯
                </p>
                <p className="text-[#39363D] py-3 px-8 border border-[#30303040] rounded-3xl text-lg font-medium w-full flex justify-between">
                  Latest Score &nbsp;&nbsp;: <span>320</span>
                </p>
              </div>
              <div className="flex items-center mb-6">
                <p className="font-bold text-2xl border border-[#30303040] w-max py-3 px-3 rounded-3xl mr-5">
                  🥇
                </p>
                <p className="text-[#39363D] py-3 px-8 border border-[#30303040] rounded-3xl text-lg font-medium w-full flex justify-between">
                  Weekly Rank &nbsp;&nbsp;: <span>44th</span>
                </p>
              </div>
              <div className="flex items-center mb-6">
                <p className="font-bold text-2xl border border-[#30303040] w-max py-3 px-3 rounded-3xl mr-5">
                  📊
                </p>
                <p className="text-[#39363D] py-3 px-8 border border-[#30303040] rounded-3xl text-lg font-medium w-full flex justify-between">
                  Average Score &nbsp;&nbsp;: <span>280</span>
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white grid grid-cols-2 rounded-2xl p-7 gap-6 mb-7">
            <div className="bg-[#F0712220] border border-[#F07122] rounded-2xl p-6">
              <span className="flex items-center mb-4">
                <p className="text-2xl bg-[#F0712220] p-2 rounded-xl">🎯</p>
                <p className="text-[#39363D] ml-4">Kelancaran & Pengucapan</p>
              </span>
              <p className="text-sm text-[#39363D] mb-3">Poin: 0-5</p>
              <p className="text-sm text-[#39363D]">
                Swara akan menilai kelancaran penyampaianmu, termasuk mendeteksi
                jeda yang terlalu lama. Pastikan setiap kata diucapkan dengan
                jelas.
              </p>
            </div>
            <div className="bg-[#F0712220] border border-[#F07122] rounded-2xl p-6">
              <span className="flex items-center mb-4">
                <p className="text-2xl bg-[#F0712220] p-2 rounded-xl">📝</p>
                <p className="text-[#39363D] ml-4">Isi</p>
              </span>
              <p className="text-sm text-[#39363D] mb-3">Poin: 0-5</p>
              <p className="text-sm text-[#39363D]">
                Swara akan menilai kelancaran penyampaianmu, termasuk mendeteksi
                jeda yang terlalu lama. Pastikan setiap kata diucapkan dengan
                jelas.
              </p>
            </div>
            <div className="bg-[#F0712220] border border-[#F07122] rounded-2xl p-6">
              <span className="flex items-center mb-4">
                <p className="text-2xl bg-[#F0712220] p-2 rounded-xl">🏗️</p>
                <p className="text-[#39363D] ml-4">Organisasi % Struktur</p>
              </span>
              <p className="text-sm text-[#39363D] mb-3">Poin: 0-5</p>
              <p className="text-sm text-[#39363D]">
                Swara akan menilai kelancaran penyampaianmu, termasuk mendeteksi
                jeda yang terlalu lama. Pastikan setiap kata diucapkan dengan
                jelas.
              </p>
            </div>
            <div className="bg-[#F0712220] border border-[#F07122] rounded-2xl p-6">
              <span className="flex items-center mb-4">
                <p className="text-2xl bg-[#F0712220] p-2 rounded-xl">💬</p>
                <p className="text-[#39363D] ml-4">Penggunaan Bahasa</p>
              </span>
              <p className="text-sm text-[#39363D] mb-3">Poin: 0-5</p>
              <p className="text-sm text-[#39363D]">
                Swara akan menilai kelancaran penyampaianmu, termasuk mendeteksi
                jeda yang terlalu lama. Pastikan setiap kata diucapkan dengan
                jelas.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpenMatch(true)}
            className="bg-[#F07122] text-white text-2xl py-4 w-full rounded-2xl font-bold mb-7"
          >
            {" "}
            ⚔️ Mulai Battle ⚔️{" "}
          </button>
          <div className="bg-white rounded-2xl p-7">
            <h1 className="text-xl text-[#39363D] font-bold mb-5">Riwayat</h1>
            <div className="flex space-x-5 overflow-x-auto scrollbar-custom pb-2">
              <div className="flex-shrink-0 bg-white rounded-2xl border border-[#B3C8CF] shadow-md text-center py-5 px-4">
                <img
                  src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg"
                  className="w-[130px] h-[130px] rounded-full mb-2"
                  alt=""
                />
                <p className="font-bold text-[#39363D] mb-3">Tokoyaki22</p>
                <span className="block w-full bg-[#509F7F] text-white text-sm rounded-full py-2 font-semibold mb-2">
                  MENANG!
                </span>
                <span className="block w-full bg-[#7EC492] text-white text-sm rounded-full py-2 font-semibold">
                  25
                </span>
              </div>
              <div className="flex-shrink-0 bg-white rounded-2xl border border-[#B3C8CF] shadow-md text-center py-5 px-4">
                <img
                  src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg"
                  className="w-[130px] h-[130px] rounded-full mb-2"
                  alt=""
                />
                <p className="font-bold text-[#39363D] mb-3">Tokoyaki22</p>
                <span className="block w-full bg-[#509F7F] text-white text-sm rounded-full py-2 font-semibold mb-2">
                  MENANG!
                </span>
                <span className="block w-full bg-[#7EC492] text-white text-sm rounded-full py-2 font-semibold">
                  25
                </span>
              </div>
            </div>
          </div>
        </aside>

        <aside className="w-96 sticky top-0 h-full ml-4 flex flex-col justify-between">
          <div className="bg-white rounded-2xl h-full overflow-hidden">
            <div className="bg-[#F07122] text-white flex items-center py-4 px-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 16C5 15.7348 5.10536 15.4804 5.29289 15.2929C5.48043 15.1054 5.73478 15 6 15H14C14.2652 15 14.5196 15.1054 14.7071 15.2929C14.8946 15.4804 15 15.7348 15 16C15 16.2652 14.8946 16.5196 14.7071 16.7071C14.5196 16.8946 14.2652 17 14 17H6C5.73478 17 5.48043 16.8946 5.29289 16.7071C5.10536 16.5196 5 16.2652 5 16ZM18 11C18.2652 11 18.5196 11.1054 18.7071 11.2929C18.8946 11.4804 19 11.7348 19 12C19 12.2652 18.8946 12.5196 18.7071 12.7071C18.5196 12.8946 18.2652 13 18 13H10C9.73478 13 9.48043 12.8946 9.29289 12.7071C9.10536 12.5196 9 12.2652 9 12C9 11.7348 9.10536 11.4804 9.29289 11.2929C9.48043 11.1054 9.73478 11 10 11H18ZM16 16C16 15.7348 16.1054 15.4804 16.2929 15.2929C16.4804 15.1054 16.7348 15 17 15H18C18.2652 15 18.5196 15.1054 18.7071 15.2929C18.8946 15.4804 19 15.7348 19 16C19 16.2652 18.8946 16.5196 18.7071 16.7071C18.5196 16.8946 18.2652 17 18 17H17C16.7348 17 16.4804 16.8946 16.2929 16.7071C16.1054 16.5196 16 16.2652 16 16ZM7 11C7.26522 11 7.51957 11.1054 7.70711 11.2929C7.89464 11.4804 8 11.7348 8 12C8 12.2652 7.89464 12.5196 7.70711 12.7071C7.51957 12.8946 7.26522 13 7 13H6C5.73478 13 5.48043 12.8946 5.29289 12.7071C5.10536 12.5196 5 12.2652 5 12C5 11.7348 5.10536 11.4804 5.29289 11.2929C5.48043 11.1054 5.73478 11 6 11H7Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 3C3.20435 3 2.44129 3.31607 1.87868 3.87868C1.31607 4.44129 1 5.20435 1 6V18C1 18.7956 1.31607 19.5587 1.87868 20.1213C2.44129 20.6839 3.20435 21 4 21H20C20.7956 21 21.5587 20.6839 22.1213 20.1213C22.6839 19.5587 23 18.7956 23 18V6C23 5.20435 22.6839 4.44129 22.1213 3.87868C21.5587 3.31607 20.7956 3 20 3H4ZM20 5H4C3.73478 5 3.48043 5.10536 3.29289 5.29289C3.10536 5.48043 3 5.73478 3 6V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H20C20.2652 19 20.5196 18.8946 20.7071 18.7071C20.8946 18.5196 21 18.2652 21 18V6C21 5.73478 20.8946 5.48043 20.7071 5.29289C20.5196 5.10536 20.2652 5 20 5Z"
                  fill="white"
                />
              </svg>
              <p className="font-semibold ml-3">Tingkatkan Kemampuanmu!</p>
            </div>
            <div className="overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden h-full pb-14 p-4">
              <Link
                href={`/inspira/slug`}
                className="flex flex-col justify-end relative h-[185px] rounded-2xl overflow-hidden mb-5 bg-[url('https://static.honestdocs.id/780x300/webp/system/blog_articles/images/000/008/579/original/mengatasi_suara_serak.jpg')] bg-cover bg-center"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b to-[#434343] from-[#D9D9D910]"></div>
                <div className="mx-auto cursor-pointer absolute top-0 bottom-0 right-0 left-0 m-auto w-max h-max">
                  <svg
                    width="38"
                    height="38"
                    viewBox="0 0 38 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="19" cy="19" r="19" fill="white" />
                    <path
                      d="M26.2664 20.516C26.4979 20.3369 26.6853 20.1071 26.8142 19.8443C26.9431 19.5815 27.0101 19.2927 27.0101 19C27.0101 18.7073 26.9431 18.4185 26.8142 18.1557C26.6853 17.8929 26.4979 17.6631 26.2664 17.484C23.2686 15.1652 19.9216 13.3371 16.3504 12.068L15.6974 11.836C14.4494 11.393 13.1304 12.237 12.9614 13.526C12.4894 17.1601 12.4894 20.8399 12.9614 24.474C13.1314 25.763 14.4494 26.607 15.6974 26.164L16.3504 25.932C19.9216 24.6629 23.2686 22.8348 26.2664 20.516Z"
                      fill="#F07122"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-white ml-4 mb-5 z-10 text-sm">
                  Rahasia Public Speaking Tanpa Grogi
                </h4>
              </Link>
              <Link
                href={`/inspira/slug`}
                className="flex flex-col justify-end relative h-[185px] rounded-2xl overflow-hidden mb-5 bg-[url('https://static.honestdocs.id/780x300/webp/system/blog_articles/images/000/008/579/original/mengatasi_suara_serak.jpg')] bg-cover bg-center"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b to-[#434343] from-[#D9D9D910]"></div>
                <div className="mx-auto cursor-pointer absolute top-0 bottom-0 right-0 left-0 m-auto w-max h-max">
                  <svg
                    width="38"
                    height="38"
                    viewBox="0 0 38 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="19" cy="19" r="19" fill="white" />
                    <path
                      d="M26.2664 20.516C26.4979 20.3369 26.6853 20.1071 26.8142 19.8443C26.9431 19.5815 27.0101 19.2927 27.0101 19C27.0101 18.7073 26.9431 18.4185 26.8142 18.1557C26.6853 17.8929 26.4979 17.6631 26.2664 17.484C23.2686 15.1652 19.9216 13.3371 16.3504 12.068L15.6974 11.836C14.4494 11.393 13.1304 12.237 12.9614 13.526C12.4894 17.1601 12.4894 20.8399 12.9614 24.474C13.1314 25.763 14.4494 26.607 15.6974 26.164L16.3504 25.932C19.9216 24.6629 23.2686 22.8348 26.2664 20.516Z"
                      fill="#F07122"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-white ml-4 mb-5 z-10 text-sm">
                  Rahasia Public Speaking Tanpa Grogi
                </h4>
              </Link>
              <Link
                href={`/inspira/slug`}
                className="flex flex-col justify-end relative h-[185px] rounded-2xl overflow-hidden mb-5 bg-[url('https://static.honestdocs.id/780x300/webp/system/blog_articles/images/000/008/579/original/mengatasi_suara_serak.jpg')] bg-cover bg-center"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b to-[#434343] from-[#D9D9D910]"></div>
                <div className="mx-auto cursor-pointer absolute top-0 bottom-0 right-0 left-0 m-auto w-max h-max">
                  <svg
                    width="38"
                    height="38"
                    viewBox="0 0 38 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="19" cy="19" r="19" fill="white" />
                    <path
                      d="M26.2664 20.516C26.4979 20.3369 26.6853 20.1071 26.8142 19.8443C26.9431 19.5815 27.0101 19.2927 27.0101 19C27.0101 18.7073 26.9431 18.4185 26.8142 18.1557C26.6853 17.8929 26.4979 17.6631 26.2664 17.484C23.2686 15.1652 19.9216 13.3371 16.3504 12.068L15.6974 11.836C14.4494 11.393 13.1304 12.237 12.9614 13.526C12.4894 17.1601 12.4894 20.8399 12.9614 24.474C13.1314 25.763 14.4494 26.607 15.6974 26.164L16.3504 25.932C19.9216 24.6629 23.2686 22.8348 26.2664 20.516Z"
                      fill="#F07122"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-white ml-4 mb-5 z-10 text-sm">
                  Rahasia Public Speaking Tanpa Grogi
                </h4>
              </Link>
              <Link
                href={`/inspira/slug`}
                className="flex flex-col justify-end relative h-[185px] rounded-2xl overflow-hidden mb-5 bg-[url('https://static.honestdocs.id/780x300/webp/system/blog_articles/images/000/008/579/original/mengatasi_suara_serak.jpg')] bg-cover bg-center"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b to-[#434343] from-[#D9D9D910]"></div>
                <div className="mx-auto cursor-pointer absolute top-0 bottom-0 right-0 left-0 m-auto w-max h-max">
                  <svg
                    width="38"
                    height="38"
                    viewBox="0 0 38 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="19" cy="19" r="19" fill="white" />
                    <path
                      d="M26.2664 20.516C26.4979 20.3369 26.6853 20.1071 26.8142 19.8443C26.9431 19.5815 27.0101 19.2927 27.0101 19C27.0101 18.7073 26.9431 18.4185 26.8142 18.1557C26.6853 17.8929 26.4979 17.6631 26.2664 17.484C23.2686 15.1652 19.9216 13.3371 16.3504 12.068L15.6974 11.836C14.4494 11.393 13.1304 12.237 12.9614 13.526C12.4894 17.1601 12.4894 20.8399 12.9614 24.474C13.1314 25.763 14.4494 26.607 15.6974 26.164L16.3504 25.932C19.9216 24.6629 23.2686 22.8348 26.2664 20.516Z"
                      fill="#F07122"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-white ml-4 mb-5 z-10 text-sm">
                  Rahasia Public Speaking Tanpa Grogi
                </h4>
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {isOpenMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-lg w-[600px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Topik pilihan</h2>
              <button onClick={() => setIsOpenMatch(false)}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.575 7.975L1.675 12.875C1.49167 13.0583 1.25833 13.15 0.975 13.15C0.691667 13.15 0.458333 13.0583 0.275 12.875C0.0916663 12.6917 0 12.4583 0 12.175C0 11.8917 0.0916663 11.6583 0.275 11.475L5.175 6.575L0.275 1.675C0.0916663 1.49167 0 1.25833 0 0.975C0 0.691667 0.0916663 0.458333 0.275 0.275C0.458333 0.0916663 0.691667 0 0.975 0C1.25833 0 1.49167 0.0916663 1.675 0.275L6.575 5.175L11.475 0.275C11.6583 0.0916663 11.8917 0 12.175 0C12.4583 0 12.6917 0.0916663 12.875 0.275C13.0583 0.458333 13.15 0.691667 13.15 0.975C13.15 1.25833 13.0583 1.49167 12.875 1.675L7.975 6.575L12.875 11.475C13.0583 11.6583 13.15 11.8917 13.15 12.175C13.15 12.4583 13.0583 12.6917 12.875 12.875C12.6917 13.0583 12.4583 13.15 12.175 13.15C11.8917 13.15 11.6583 13.0583 11.475 12.875L6.575 7.975Z"
                    fill="black"
                  />
                </svg>
              </button>
            </div>
            <p className="border border-[#B3C8CF] shadow-md mb-4 p-3 rounded-2xl text-[#F07122] text-sm">
              Merancang Masa Depan: Membangun Karier di Era Digital
            </p>
            <hr className="h-[2px] bg-[#B3C8CF] rounded-full mb-4" />
            <p className="text-center">Siapkan Dirimu!</p>
            <p className="text-center text-[#F07122] text-9xl font-bold">30</p>
            <p className="text-center text-[#F07122] text-lg font-semibold">
              detik
            </p>
            <Link
              href={"/adu/slug"}
              className="text-center bg-[#F07122] w-[80%] py-3 text-white font-semibold rounded-full mt-6 mx-auto block"
            >
              Sudah Siap!
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
