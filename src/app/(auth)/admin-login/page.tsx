"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Loader2, AlertCircle, ShieldAlert } from "lucide-react";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Gọi credential cơ bản, Authjs phân quyền ở backend
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push("/dashboard"); // Chuyển thẳng tới dashboard admin
        router.refresh(); 
      }
    } catch {
      setError("Đã có lỗi xảy ra. Xin vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center">
        <div className="flex justify-center mb-6">
           <div className="rounded-full bg-rose-500/10 p-4 ring-1 ring-rose-500/20">
              <ShieldAlert className="h-8 w-8 text-rose-500" />
           </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Quản Trị Viên</h1>
        <p className="mt-3 text-zinc-400">Đăng nhập bằng tài khoản Admin để quản lý Đề thi và Hệ thống.</p>
      </div>

      <div className="rounded-3xl border border-zinc-700/50 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-xl sm:p-10 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-orange-500" />
        
        {error && (
           <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 p-4 text-sm font-medium text-red-400 border border-red-500/20">
             <AlertCircle className="h-5 w-5 shrink-0" />
             <p>{error}</p>
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-rose-500" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-800/50 py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 outline-none transition-all focus:border-rose-500 focus:bg-zinc-800 focus:ring-1 focus:ring-rose-500"
                placeholder="admin@quiz.it"
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-rose-500" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-800/50 py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 outline-none transition-all focus:border-rose-500 focus:bg-zinc-800 focus:ring-1 focus:ring-rose-500"
                placeholder="Mật khẩu Admin"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-rose-600 to-orange-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-rose-500/30 active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Đăng nhập Admin
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-400">
          Bạn là học viên?{" "}
          <Link href="/login" className="font-semibold text-white transition-colors hover:text-rose-400 underline decoration-rose-500/30 underline-offset-4">
            Đăng nhập Học viên
          </Link>
        </p>
      </div>
    </div>
  );
}
