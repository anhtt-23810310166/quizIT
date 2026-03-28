import { Users, FileText, LayoutDashboard, Layers } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    { name: "Total Users", value: "1,200", icon: Users, color: "text-blue-600 bg-blue-100 dark:bg-blue-500/20 dark:text-blue-400" },
    { name: "Total Exams", value: "24", icon: FileText, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400" },
    { name: "Total Categories", value: "8", icon: Layers, color: "text-violet-600 bg-violet-100 dark:bg-violet-500/20 dark:text-violet-400" },
    { name: "Active Sessions", value: "142", icon: LayoutDashboard, color: "text-amber-600 bg-amber-100 dark:bg-amber-500/20 dark:text-amber-400" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Welcome back to QuizIT&apos;s Admin portal. Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.name}</p>
                  <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Placeholder for charts or recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 h-80 flex items-center justify-center text-zinc-400">
           Chart Placeholder
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 h-80 flex items-center justify-center text-zinc-400">
           Recent Activity Placeholder
        </div>
      </div>
    </div>
  );
}
