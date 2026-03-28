"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Award, BookOpen, CheckCircle, ChevronLeft, Clock, History, Loader2, Target, XCircle } from "lucide-react";

type ResultData = {
  id: string;
  score: number;
  totalCorrect: number;
  totalAnswers: number;
  submittedAt: string;
  exam: {
    title: string;
    duration: number;
    category: { name: string };
  };
  user: {
    name: string;
    email: string;
  };
};

export default function ResultDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(`/api/client/results/${id}`);
        if (!res.ok) {
           const errData = await res.json();
           throw new Error(errData.error || "Không thể tải kết quả");
        }
        const data = await res.json();
        setResult(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="text-zinc-500">Đang tải kết quả...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-red-100 p-4 dark:bg-red-500/10">
          <XCircle className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Lỗi truy cập</h2>
        <p className="text-zinc-500">{error || "Không tìm thấy kết quả bản ghi."}</p>
        <button onClick={() => router.push("/")} className="mt-4 rounded-xl bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Về trang chủ
        </button>
      </div>
    );
  }

  const isPassed = result.score >= 5; // Điểm chuẩn pass (5/10)
  const percentageScore = (result.score / 10) * 100;
  const incorrectAnswers = result.totalAnswers - result.totalCorrect;

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8">
       {/* Nút Quay lại */}
       <button onClick={() => router.push("/")} className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Về trang chủ
       </button>

       {/* Thẻ Điểm Số Chỉnh */}
       <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className={`p-10 text-center ${
            isPassed 
              ? "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white" 
              : "bg-gradient-to-br from-rose-500 to-rose-700 text-white"
          }`}>
             <span className="flex items-center justify-center gap-2 mx-auto mb-4 rounded-full bg-white/20 px-4 py-1.5 w-max text-sm font-bold backdrop-blur-md">
                {isPassed ? <Award className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {isPassed ? "Chúc mừng bạn đã Đạt!" : "Thật tiếc, bạn Chưa Đạt."}
             </span>
             
             <div className="relative inline-flex items-center justify-center">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/20" />
                  <circle 
                     cx="96" cy="96" r="88" 
                     stroke="currentColor" 
                     strokeWidth="12" 
                     fill="transparent" 
                     strokeDasharray={2 * Math.PI * 88} 
                     strokeDashoffset={2 * Math.PI * 88 * (1 - percentageScore / 100)}
                     className="text-white drop-shadow-lg transition-all duration-1000 ease-out" 
                     strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                   <span className="text-5xl font-black drop-shadow-md">{result.score}</span>
                   <span className="text-sm font-medium text-white/80 uppercase tracking-widest mt-1">Điểm</span>
                </div>
             </div>
             
             <h1 className="mt-6 text-2xl font-bold">{result.exam.title}</h1>
             <p className="mt-2 text-white/80">{result.exam.category.name}</p>
          </div>

          {/* Chi tiết thống kê */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800 p-6">
             <div className="flex flex-col items-center justify-center p-4">
                <Target className="h-6 w-6 text-blue-500 mb-2" />
                <span className="text-2xl font-bold text-zinc-900 dark:text-white">{result.totalAnswers}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-semibold tracking-wider mt-1">Tổng số câu</span>
             </div>
             <div className="flex flex-col items-center justify-center p-4">
                <CheckCircle className="h-6 w-6 text-emerald-500 mb-2" />
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{result.totalCorrect}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-semibold tracking-wider mt-1">Trả lời đúng</span>
             </div>
             <div className="flex flex-col items-center justify-center p-4">
                <XCircle className="h-6 w-6 text-rose-500 mb-2" />
                <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">{incorrectAnswers}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-semibold tracking-wider mt-1">Trả lời sai</span>
             </div>
             <div className="flex flex-col items-center justify-center p-4">
                <Clock className="h-6 w-6 text-amber-500 mb-2" />
                <span className="text-2xl font-bold text-zinc-900 dark:text-white text-center">
                   {new Date(result.submittedAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-semibold tracking-wider mt-1 text-center">
                   Giờ nộp bài <br/> {new Date(result.submittedAt).toLocaleDateString("vi-VN")}
                </span>
             </div>
          </div>
       </div>

       {/* Call to actions */}
       <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link 
             href="/" 
             className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:scale-105"
          >
             <BookOpen className="h-5 w-5" />
             Luyện tập đề khác
          </Link>
          <Link 
             href="#" 
             className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 px-8 py-3.5 font-bold text-zinc-900 dark:text-white transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700"
          >
             <History className="h-5 w-5" />
             Xem lịch sử thi
          </Link>
       </div>
    </div>
  );
}
