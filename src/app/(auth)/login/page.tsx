"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
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
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push("/");
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
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Đăng nhập Học viên</h1>
        <p className="mt-3 text-zinc-400">Chào mừng bạn quay trở lại! Điền thông tin để bắt đầu hệ bài tập mới.</p>
      </div>

      <div className="rounded-3xl border border-zinc-700/50 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        {error && (
           <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 p-4 text-sm font-medium text-red-400 border border-red-500/20">
             <AlertCircle className="h-5 w-5 shrink-0" />
             <p>{error}</p>
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-800/50 py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 outline-none transition-all focus:border-blue-500 focus:bg-zinc-800 focus:ring-1 focus:ring-blue-500"
                placeholder="Mật khẩu của bạn"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link href="#" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Đăng nhập ngay
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col space-y-3 text-center text-sm text-zinc-400">
          <p>
            Chưa có tài khoản?{" "}
            <Link href="/register" className="font-semibold text-white transition-colors hover:text-blue-400 underline decoration-blue-500/30 underline-offset-4">
              Đăng ký tài khoản mới
            </Link>
          </p>
          <p className="pt-3 border-t border-zinc-800">
            Bạn là Quản trị viên?{" "}
            <Link href="/admin-login" className="font-semibold text-white transition-colors hover:text-rose-400 underline decoration-blue-500/30 underline-offset-4">
              Đăng nhập Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
