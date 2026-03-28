"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Layers, 
  FileText, 
  HelpCircle, 
  Users, 
  LogOut 
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Categories", href: "/categories", icon: Layers },
  { name: "Exams", href: "/exams", icon: FileText },
  { name: "Questions", href: "/questions", icon: HelpCircle },
  { name: "Users", href: "/users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-zinc-200 bg-white/50 backdrop-blur-xl md:flex dark:border-zinc-800 dark:bg-zinc-950/50">
      <div className="flex h-16 shrink-0 items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <span className="text-blue-600 dark:text-blue-500">Quiz</span>IT Admin
        </Link>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto p-4">
        <div className="mb-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Menu
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" 
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-blue-700 dark:text-blue-400" : "text-zinc-400 dark:text-zinc-500"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800 space-y-4">
         {session?.user && (
           <div className="flex items-center gap-3 px-3 py-2">
             <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm dark:bg-blue-900/50 dark:text-blue-300">
               {session.user.name?.charAt(0) || "A"}
             </div>
             <div className="flex flex-col truncate">
               <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{session.user.name}</span>
               <span className="text-xs text-zinc-500 dark:text-zinc-400">Admin</span>
             </div>
           </div>
         )}
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        >
          <LogOut className="h-5 w-5 opacity-70" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
