import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-50/50 dark:bg-zinc-900/50">
      <AdminSidebar />
      <div className="flex flex-1 flex-col md:pl-64">
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
