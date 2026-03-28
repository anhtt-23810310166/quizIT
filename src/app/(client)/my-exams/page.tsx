"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { GraduationCap, Clock, Award, CheckCircle2, XCircle, ArrowRight, Loader2 } from "lucide-react";

interface ExamResult {
  id: string;
  score: number;
  totalCorrect: number;
  totalAnswers: number;
  submittedAt: string;
  exam: {
    title: string;
    duration: number;
    category: {
      name: string;
    };
  };
}

export default function MyExamsPage() {
  const { data: session } = useSession();
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyExams = async () => {
      if (!session?.user?.id) return;
      
      try {
        // Trong trường hợp thực tế, bạn sẽ tạo thêm 1 endpoint GET /api/client/my-exams
        // Ở đây giả định chung route (cần tạo thêm route này)
        const res = await fetch("/api/client/my-exams");
        if (!res.ok) throw new Error("Không thể tải danh sách kết quả thi");
        const data = await res.json();
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchMyExams();
  }, [session]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="text-zinc-500 font-medium">Đang tải lịch sử thi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
        <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-red-500 mb-2">Đã có lỗi xảy ra</h3>
        <p className="text-zinc-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-8 sm:p-12 shadow-2xl dark:bg-zinc-950/50">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
           <div className="h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 border border-blue-500/20">
              <GraduationCap className="h-4 w-4" />
              Lịch sử bài thi
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Thành tích của bạn
            </h1>
            <p className="text-lg text-zinc-400 max-w-xl">
              Xem lại danh sách các bài thi bạn đã hoàn thành và đánh giá sự tiến bộ của bản thân qua từng ngày.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800 backdrop-blur-sm">
             <div className="text-center px-4 border-r border-zinc-800">
                <div className="text-3xl font-black text-white">{results.length}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Bài đã giải</div>
             </div>
             <div className="text-center px-4">
                <div className="text-3xl font-black text-emerald-400">
                  {results.length > 0 ? (results.reduce((acc, curr) => acc + curr.score, 0) / results.length).toFixed(1) : "0"}
                </div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Điểm TB</div>
             </div>
          </div>
        </div>
      </div>

      {/* Results List */}
      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 py-20 px-4 text-center dark:border-zinc-800 dark:bg-zinc-900/20">
          <Award className="h-16 w-16 text-zinc-300 dark:text-zinc-700 mb-6" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Chưa có bài thi nào</h2>
          <p className="text-zinc-500 max-w-md mx-auto mb-8">
            Bạn chưa hoàn thành bất kỳ bài thi nào. Hãy quay lại trang chủ, chọn một đề tài phù hợp và bắt đầu thử thách ngay nhé!
          </p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-500/25"
          >
            Khám phá đề thi mới
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => {
            const isPassed = result.score >= 5; // Giả định >= 5 là qua
            
            return (
              <div 
                key={result.id} 
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950/40"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {result.exam.category.name}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      isPassed ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    }`}>
                      {isPassed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                      {result.score.toFixed(1)} Điểm
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-zinc-900 line-clamp-2 mb-2 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {result.exam.title}
                  </h3>
                  
                  <div className="mt-auto pt-4 space-y-3">
                    <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                      <Clock className="mr-2 h-4 w-4" />
                      Thời gian thi: {result.exam.duration} Phút
                    </div>
                    <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                      Đúng {result.totalCorrect}/{result.totalAnswers} Câu
                    </div>
                    <div className="text-xs text-zinc-400 dark:text-zinc-500 border-t border-zinc-100 dark:border-zinc-800 pt-3 mt-3">
                      Nộp lúc: {format(new Date(result.submittedAt), "HH:mm - dd/MM/yyyy", { locale: vi })}
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <Link 
                    href={`/results/${result.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-200 transition-all hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-700"
                  >
                    Xem chi tiết
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
