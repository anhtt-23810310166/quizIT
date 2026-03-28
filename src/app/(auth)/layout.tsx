import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Background decoration */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 bg-blue-500/10 blur-[120px]" />
      <div className="absolute right-0 top-0 -z-10 h-72 w-72 bg-indigo-500/10 blur-[100px]" />
      
      <div className="w-full max-w-md p-6">
        <Link 
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại trang chủ
        </Link>
        
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900/80 dark:backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
