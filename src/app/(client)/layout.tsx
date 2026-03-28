import { ClientSidebar } from "@/components/layout/client-sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FDFDFD] dark:bg-[#0A0A0A]">
      <ClientSidebar />
      <div className="flex flex-1 flex-col md:pl-64">
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
