"use client"

import Link from "next/link"

export default function DetailInspira() {
    return (
        <div className="font-lexend h-full flex flex-col pb-5">
            <div className="bg-white flex items-center py-4 px-6 rounded-2xl font-bold mb-4">
                <Link href={'/inspira'}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.17245 11.9167L11.6641 16.4084C11.8474 16.5917 11.9354 16.8056 11.9281 17.05C11.9208 17.2945 11.8251 17.5084 11.6412 17.6917C11.4579 17.8597 11.244 17.9477 10.9995 17.9557C10.7551 17.9636 10.5412 17.8756 10.3579 17.6917L4.30786 11.6417C4.2162 11.55 4.15111 11.4507 4.11261 11.3438C4.07411 11.2368 4.05547 11.1222 4.0567 11C4.05792 10.8778 4.07717 10.7632 4.11445 10.6563C4.15172 10.5493 4.2165 10.45 4.30878 10.3584L10.3588 4.30836C10.5268 4.1403 10.7371 4.05627 10.9894 4.05627C11.2418 4.05627 11.4594 4.1403 11.6421 4.30836C11.8254 4.49169 11.9171 4.70955 11.9171 4.96194C11.9171 5.21433 11.8254 5.43189 11.6421 5.61461L7.17245 10.0834H17.4162C17.6759 10.0834 17.8938 10.1714 18.0698 10.3474C18.2458 10.5234 18.3335 10.7409 18.3329 11C18.3323 11.2591 18.2443 11.477 18.0689 11.6536C17.8935 11.8302 17.6759 11.9179 17.4162 11.9167H7.17245Z" fill="#F07122" />
                    </svg>
                </Link>
                <p className="text-[#F07122] ml-4">Inspira Swara - Detail Video</p>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <aside className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-6 bg-white rounded-2xl">
                    <iframe width="560" height="315" className="w-full h-[420px] rounded-xl mb-4" src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=OqfFfE6MTHTWbtvV" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen={true}></iframe>
                    <h1 className="text-xl font-semibold text-[#39363D] mb-4">Tips public speaking anti malu</h1>
                    <div className="flex items-center mb-5">
                        <div className="mr-4">
                            <img src="/default-profile.png" alt="" className="rounded-full w-[44px] h-[44px] object-cover object-center" />
                        </div>
                        <div>
                            <p className="font-bold">Tim Kurator Swara</p>
                            <p className="text-sm text-[#B3C8CF]">Ahli Public Speaking & Komunikasi</p>
                        </div>
                    </div>
                    <div className="flex items-center mb-5">
                        <div className="flex items-center mr-5">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V18C1 18.55 1.45 19 2 19H14C14.55 19 15 18.55 15 18V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C15.05 13.06 15.06 13.08 15.07 13.09C16.21 13.92 17 15.03 17 16.5V18C17 18.35 16.93 18.69 16.82 19H22C22.55 19 23 18.55 23 18V16.5C23 14.17 18.33 13 16 13Z" fill="#39363D"/>
                            </svg>
                            <p className="ml-2 text-sm text-[#39363D]">15.2k penonton</p>
                        </div>
                        <div className="flex items-center mr-5">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2ZM12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4ZM12 6C12.2449 6.00003 12.4813 6.08996 12.6644 6.25272C12.8474 6.41547 12.9643 6.63975 12.993 6.883L13 7V11.586L15.707 14.293C15.8863 14.473 15.9905 14.7144 15.9982 14.9684C16.006 15.2223 15.9168 15.4697 15.7488 15.6603C15.5807 15.8508 15.3464 15.9703 15.0935 15.9944C14.8406 16.0185 14.588 15.9454 14.387 15.79L14.293 15.707L11.293 12.707C11.1376 12.5514 11.0378 12.349 11.009 12.131L11 12V7C11 6.73478 11.1054 6.48043 11.2929 6.29289C11.4804 6.10536 11.7348 6 12 6Z" fill="#39363D"/>
                            </svg>
                            <p className="ml-2 text-sm text-[#39363D]">18:45</p>
                        </div>
                        <div className="flex items-center mr-5">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.5 11L12 2L17.5 11H6.5ZM17.5 22C16.25 22 15.1877 21.5627 14.313 20.688C13.4383 19.8133 13.0007 18.7507 13 17.5C12.9993 16.2493 13.437 15.187 14.313 14.313C15.189 13.439 16.2513 13.0013 17.5 13C18.7487 12.9987 19.8113 13.4363 20.688 14.313C21.5647 15.1897 22.002 16.252 22 17.5C21.998 18.748 21.5607 19.8107 20.688 20.688C19.8153 21.5653 18.7527 22.0027 17.5 22ZM3 21.5V13.5H11V21.5H3Z" fill="#39363D"/>
                            </svg>
                            <p className="ml-2 text-sm text-[#39363D]">Motivational</p>
                        </div>
                        <div className="flex items-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C12.896 2 13.764 2.118 14.59 2.339L12.464 4.464C12.3027 4.62593 12.1605 4.80577 12.04 5H12C10.6155 5 9.26215 5.41054 8.11101 6.17971C6.95986 6.94888 6.06266 8.04213 5.53284 9.32122C5.00303 10.6003 4.86441 12.0078 5.1345 13.3656C5.4046 14.7235 6.07128 15.9708 7.05025 16.9497C8.02922 17.9287 9.2765 18.5954 10.6344 18.8655C11.9922 19.1356 13.3997 18.997 14.6788 18.4672C15.9579 17.9373 17.0511 17.0401 17.8203 15.889C18.5895 14.7378 19 13.3845 19 12V11.96C19.1933 11.84 19.3717 11.6983 19.535 11.535L21.661 9.41C21.882 10.236 22 11.104 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2ZM11.586 7.017C11.586 7.868 11.544 8.731 11.59 9.581L11.05 10.121C10.8642 10.3068 10.7169 10.5273 10.6164 10.77C10.5158 11.0127 10.4641 11.2728 10.4641 11.5355C10.4641 11.7982 10.5158 12.0583 10.6164 12.301C10.7169 12.5437 10.8642 12.7642 11.05 12.95C11.2358 13.1358 11.4563 13.2831 11.699 13.3836C11.9417 13.4842 12.2018 13.5359 12.4645 13.5359C12.7272 13.5359 12.9873 13.4842 13.23 13.3836C13.4727 13.2831 13.6932 13.1358 13.879 12.95L14.419 12.41C15.269 12.456 16.131 12.414 16.983 12.414C16.904 13.3643 16.5549 14.2723 15.9768 15.0307C15.3988 15.7892 14.6159 16.3665 13.7205 16.6946C12.8251 17.0227 11.8545 17.0879 10.9233 16.8825C9.99204 16.6771 9.13896 16.2097 8.46465 15.5353C7.79034 14.861 7.32293 14.008 7.11753 13.0767C6.91214 12.1455 6.97734 11.1749 7.30544 10.2795C7.63354 9.38414 8.21085 8.60124 8.96929 8.02317C9.72773 7.44511 10.6357 7.09599 11.586 7.017ZM18.504 2.127C18.6865 2.20268 18.8425 2.33074 18.9524 2.49501C19.0622 2.65928 19.1209 2.8524 19.121 3.05V4.88H20.95C21.1478 4.88004 21.341 4.93871 21.5055 5.0486C21.6699 5.15848 21.798 5.31465 21.8737 5.49735C21.9493 5.68005 21.9692 5.88108 21.9306 6.07503C21.892 6.26898 21.7968 6.44715 21.657 6.587L18.12 10.12C17.9325 10.3075 17.6782 10.4129 17.413 10.413H15L13.172 12.242C12.9844 12.4296 12.7299 12.5351 12.4645 12.5351C12.1991 12.5351 11.9446 12.4296 11.757 12.242C11.5694 12.0544 11.4639 11.7999 11.4639 11.5345C11.4639 11.2691 11.5694 11.0146 11.757 10.827L13.586 9V6.586C13.5859 6.45452 13.6117 6.32431 13.662 6.20282C13.7123 6.08134 13.786 5.97096 13.879 5.878L17.414 2.343C17.5538 2.20307 17.7321 2.10776 17.9261 2.06913C18.1201 2.0305 18.3212 2.0503 18.504 2.126" fill="#39363D"/>
                            </svg>
                            <p className="ml-2 text-sm text-[#39363D]">Level: Pemula</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-x-8 mb-4">
                        <div className="border border-[#B3C8CF] rounded-2xl text-center py-4 shadow-md">
                            <p className="text-[#F07122] text-3xl font-semibold">78%</p>
                            <p className="text-[#B3C8CF]">Percaya Diri</p>
                        </div>
                        <div className="border border-[#B3C8CF] rounded-2xl text-center py-4 shadow-md">
                            <p className="text-[#F07122] text-3xl font-semibold">80%</p>
                            <p className="text-[#B3C8CF]">Kejelasan Suara</p>
                        </div>
                        <div className="border border-[#B3C8CF] rounded-2xl text-center py-4 shadow-md">
                            <p className="text-[#F07122] text-3xl font-semibold">78%</p>
                            <p className="text-[#B3C8CF]">Ekspresi & Emosi</p>
                        </div>
                    </div>
                    <p className="text-sm leading-normal">Video pembelajaran ini akan membawa kamu menyelami seni menunjukkan kerentanan dan keaslian sebagai kunci untuk membangun koneksi yang kuat dengan audiens. Dalam dunia public speaking, sering kali kita merasa harus terlihat sempurna, padahal justru keterbukaan dan kejujuranlah yang membuat pesan kita lebih bermakna. 
                        Melalui materi ini, kamu akan mempelajari teknik storytelling yang powerful untuk menyampaikan pesan secara lebih emosional dan mudah diingat.</p>
                </aside>

                <aside className="w-96 sticky top-0 h-full ml-4 flex flex-col justify-between">
                    <div className="bg-white rounded-2xl h-[38%] overflow-hidden">
                        <div className="bg-[#F07122] text-white flex items-center py-4 px-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 16C5 15.7348 5.10536 15.4804 5.29289 15.2929C5.48043 15.1054 5.73478 15 6 15H14C14.2652 15 14.5196 15.1054 14.7071 15.2929C14.8946 15.4804 15 15.7348 15 16C15 16.2652 14.8946 16.5196 14.7071 16.7071C14.5196 16.8946 14.2652 17 14 17H6C5.73478 17 5.48043 16.8946 5.29289 16.7071C5.10536 16.5196 5 16.2652 5 16ZM18 11C18.2652 11 18.5196 11.1054 18.7071 11.2929C18.8946 11.4804 19 11.7348 19 12C19 12.2652 18.8946 12.5196 18.7071 12.7071C18.5196 12.8946 18.2652 13 18 13H10C9.73478 13 9.48043 12.8946 9.29289 12.7071C9.10536 12.5196 9 12.2652 9 12C9 11.7348 9.10536 11.4804 9.29289 11.2929C9.48043 11.1054 9.73478 11 10 11H18ZM16 16C16 15.7348 16.1054 15.4804 16.2929 15.2929C16.4804 15.1054 16.7348 15 17 15H18C18.2652 15 18.5196 15.1054 18.7071 15.2929C18.8946 15.4804 19 15.7348 19 16C19 16.2652 18.8946 16.5196 18.7071 16.7071C18.5196 16.8946 18.2652 17 18 17H17C16.7348 17 16.4804 16.8946 16.2929 16.7071C16.1054 16.5196 16 16.2652 16 16ZM7 11C7.26522 11 7.51957 11.1054 7.70711 11.2929C7.89464 11.4804 8 11.7348 8 12C8 12.2652 7.89464 12.5196 7.70711 12.7071C7.51957 12.8946 7.26522 13 7 13H6C5.73478 13 5.48043 12.8946 5.29289 12.7071C5.10536 12.5196 5 12.2652 5 12C5 11.7348 5.10536 11.4804 5.29289 11.2929C5.48043 11.1054 5.73478 11 6 11H7Z" fill="white"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M4 3C3.20435 3 2.44129 3.31607 1.87868 3.87868C1.31607 4.44129 1 5.20435 1 6V18C1 18.7956 1.31607 19.5587 1.87868 20.1213C2.44129 20.6839 3.20435 21 4 21H20C20.7956 21 21.5587 20.6839 22.1213 20.1213C22.6839 19.5587 23 18.7956 23 18V6C23 5.20435 22.6839 4.44129 22.1213 3.87868C21.5587 3.31607 20.7956 3 20 3H4ZM20 5H4C3.73478 5 3.48043 5.10536 3.29289 5.29289C3.10536 5.48043 3 5.73478 3 6V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H20C20.2652 19 20.5196 18.8946 20.7071 18.7071C20.8946 18.5196 21 18.2652 21 18V6C21 5.73478 20.8946 5.48043 20.7071 5.29289C20.5196 5.10536 20.2652 5 20 5Z" fill="white"/>
                            </svg>
                            <p className="font-semibold ml-3">Transkrip Interaktif</p>
                        </div>
                        <div className="overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden h-full pb-14 p-4">
                            <div className="bg-[#FFF3CD] rounded-lg border-x-4 border-[#F07122] p-3 text-sm mb-2">
                                <p className="text-[#F07122] mb-2">[00:12]</p>
                                <p>Jadi, saya akan mulai dengan ini: beberapa tahun yang lalu, seorang perencana acara menghubungi saya karena saya akan mengadakan acara pidato.</p>
                            </div>
                            <div className="rounded-lg border-x-4 border-transparent p-3 text-sm mb-2">
                                <p className="text-[#F07122] mb-2">[00:18]</p>
                                <p>Dia menelepon dan berkata, “Saya benar-benar kesulitan menulis tentang Anda di brosur kecil ini.”</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl h-[60%] overflow-hidden">
                        <div className="bg-[#F07122] text-white flex items-center py-4 px-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 5C10.0609 5 11.0783 5.42143 11.8284 6.17157C12.5786 6.92172 13 7.93913 13 9C13 10.0609 12.5786 11.0783 11.8284 11.8284C11.0783 12.5786 10.0609 13 9 13C7.93913 13 6.92172 12.5786 6.17157 11.8284C5.42143 11.0783 5 10.0609 5 9C5 7.93913 5.42143 6.92172 6.17157 6.17157C6.92172 5.42143 7.93913 5 9 5ZM9 15C11.67 15 17 16.34 17 19V21H1V19C1 16.34 6.33 15 9 15ZM16.76 5.36C18.78 7.56 18.78 10.61 16.76 12.63L15.08 10.94C15.92 9.76 15.92 8.23 15.08 7.05L16.76 5.36ZM20.07 2C24 6.05 23.97 12.11 20.07 16L18.44 14.37C21.21 11.19 21.21 6.65 18.44 3.63L20.07 2Z" fill="white"/>
                            </svg>
                            <p className="font-semibold ml-3">Teknik yang Dipelajari</p>
                        </div>
                        <div className="overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden h-full pb-20 p-4">
                            <div className="text-sm flex flex-wrap items-center mb-2">
                                <p className="mr-4">Teknik Pembuka : </p>
                                <p className="text-[#1976D2] bg-[#1976D230] w-max py-2 px-4 rounded-full text-xs mr-2 mb-2">Personal Story</p>
                                <p className="text-[#1976D2] bg-[#1976D230] w-max py-2 px-4 rounded-full text-xs mr-2 mb-2">Hook</p>
                                <p className="text-[#1976D2] bg-[#1976D230] w-max py-2 px-4 rounded-full text-xs mr-2 mb-2">Bicara Mudah</p>
                            </div>
                            <div className="text-sm flex flex-wrap items-center mb-2">
                                <p className="mr-4">Gaya Penyampaian : </p>
                                <p className="text-[#1976D2] bg-[#1976D230] w-max py-2 px-4 rounded-full text-xs mr-2 mb-2">Tone Bicara</p>
                                <p className="text-[#1976D2] bg-[#1976D230] w-max py-2 px-4 rounded-full text-xs mr-2 mb-2">Humor</p>
                                <p className="text-[#1976D2] bg-[#1976D230] w-max py-2 px-4 rounded-full text-xs mr-2 mb-2">Tegas</p>
                            </div>
                            <div className="text-sm flex flex-wrap items-center mb-4">
                                <p className="mr-4">Struktur : </p>
                                <p className="text-[#1976D2] bg-[#1976D230] w-max py-2 px-4 rounded-full text-xs mr-2 mb-2">Masalah-Solusi</p>
                                <p className="text-[#1976D2] bg-[#1976D230] w-max py-2 px-4 rounded-full text-xs mr-2 mb-2">Berbasis Penelitian</p>
                                <p className="text-[#1976D2] bg-[#1976D230] w-max py-2 px-4 rounded-full text-xs mr-2 mb-2">Call To Action</p>
                            </div>
                            <div className="bg-[#F8F9FA] p-4 rounded-2xl">
                                <p className="text-sm font-semibold mb-3">💡 AI Insight:</p>
                                <p className="text-[#39363D] text-sm">Brené menggunakan pembukaan yang sangat personal dan relatable. Perhatikan bagaimana dia membangun koneksi dengan audiens sejak kalimat pertama.</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}