"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Loader2, User, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Đăng ký thất bại");
      }
      
      setSuccess("Đăng ký thành công! Đang chuyển hướng đến Đăng nhập...");
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Tạo tài khoản mới</h1>
        <p className="mt-3 text-zinc-400">Tham gia hệ thống trắc nghiệm và nâng cao kiến thức ngay hôm nay.</p>
      </div>

      <div className="rounded-3xl border border-zinc-700/50 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        
        {error && (
           <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 p-4 text-sm font-medium text-red-400 border border-red-500/20">
             <AlertCircle className="h-5 w-5 shrink-0" />
             <p>{error}</p>
           </div>
        )}
        
        {success && (
           <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-500/10 p-4 text-sm font-medium text-emerald-400 border border-emerald-500/20">
             <CheckCircle2 className="h-5 w-5 shrink-0" />
             <p>{success}</p>
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-blue-500" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-800/50 py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 outline-none transition-all focus:border-blue-500 focus:bg-zinc-800 focus:ring-1 focus:ring-blue-500"
                placeholder="Họ và Tên"
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-blue-500" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-800/50 py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 outline-none transition-all focus:border-blue-500 focus:bg-zinc-800 focus:ring-1 focus:ring-blue-500"
                placeholder="name@example.com"
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-blue-500" />
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-800/50 py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 outline-none transition-all focus:border-blue-500 focus:bg-zinc-800 focus:ring-1 focus:ring-blue-500"
                placeholder="Tạo mật khẩu (Ít nhất 6 ký tự)"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!success}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Hoàn tất đăng ký
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-400">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-semibold text-white transition-colors hover:text-blue-400 underline decoration-blue-500/30 underline-offset-4">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
