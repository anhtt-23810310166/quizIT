"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  Home, 
  GraduationCap, 
  LogOut,
  UserCircle
} from "lucide-react";

const navItems = [
  { name: "Trang chủ", href: "/", icon: Home },
  { name: "Lịch sử thi", href: "/my-exams", icon: GraduationCap },
];

export function ClientSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-zinc-200 bg-white/50 backdrop-blur-xl md:flex dark:border-zinc-800 dark:bg-zinc-950/50">
      <div className="flex h-16 shrink-0 items-center justify-center border-b border-zinc-200 px-6 dark:border-zinc-800">
        <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">QuizIT</span>
        </Link>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto p-4">
        <div className="mb-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-2">
          Học viên
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/10 dark:bg-white dark:text-zinc-900" 
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white dark:text-zinc-900" : "text-zinc-400 dark:text-zinc-500"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        {status === "loading" ? (
          <div className="flex items-center justify-center p-3">
             <div className="h-5 w-5 rounded-full border-2 border-zinc-300 border-t-zinc-600 animate-spin" />
          </div>
        ) : session?.user ? (
          <div className="group relative flex items-center justify-between gap-3 rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
             <div className="flex items-center gap-3 truncate">
               <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex shrink-0 items-center justify-center text-white font-bold text-sm shadow-sm">
                 {session.user.name?.charAt(0).toUpperCase() || "S"}
               </div>
               <div className="flex flex-col flex-1 truncate">
                 <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{session.user.name}</span>
                 <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{session.user.email}</span>
               </div>
             </div>
             <button 
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="shrink-0 p-2 text-zinc-400 hover:text-red-600 transition-colors focus:outline-none"
                title="Đăng xuất"
             >
               <LogOut className="h-4 w-4" />
             </button>
          </div>
        ) : (
           <Link 
             href="/login" 
             className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 p-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400"
           >
             <UserCircle className="h-5 w-5" />
             Đăng nhập ngay
           </Link>
        )}
      </div>
    </aside>
  );
}
