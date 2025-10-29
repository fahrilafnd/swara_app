import MentorSidebar from ".././components/mentor/sidebar";
import MentorHeader from ".././components/mentor/header";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F2E9]">
      <MentorSidebar />
      <main
        id="app-scroll"
        className="flex-1 overflow-y-auto overflow-x-hidden text-black"
      >
        <MentorHeader />
        <div className="px-6 py-4">{children}</div>
      </main>
    </div>
  );
}
