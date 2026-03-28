"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Loader2, PlayCircle } from "lucide-react";

type Exam = {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  category: { name: string };
  _count: { questions: number };
};

export default function ClientHomePage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch("/api/client/exams");
        const data = await res.json();
        setExams(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-zinc-900 px-8 py-16 text-center shadow-2xl dark:bg-zinc-800/50">
        <div className="relative z-10 mx-auto max-w-2xl">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Sẵn sàng để <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">bứt phá</span> điểm số?
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
            Khám phá các đề thi đa dạng, theo dõi tiến độ và nâng cao kỹ năng của bạn mỗi ngày với nền tảng thi trắc nghiệm tốt nhất.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link 
              href="#exams" 
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:bg-zinc-100 hover:scale-105"
            >
              Bắt đầu luyện tập
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 bg-blue-500/20 blur-[100px]" />
      </section>

      {/* Danh sách đề thi */}
      <section id="exams" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Đề thi mới nhất</h2>
        </div>
        
        {loading ? (
             <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
             </div>
        ) : exams.length === 0 ? (
             <div className="text-center py-20 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-2xl border-dashed">
                Hiện tại chưa có đề thi nào được xuất bản.
             </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <div key={exam.id} className="group relative flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {exam.category?.name || "Khác"}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      <Clock className="h-3.5 w-3.5" />
                      {exam.duration} phút
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 line-clamp-2">
                    {exam.title}
                  </h3>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                  {exam.description || "Bài kiểm tra kiến thức tổng hợp."}
                </p>
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between mt-auto">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                    <BookOpen className="h-4 w-4" />
                    {exam._count?.questions || 0} Câu
                  </span>
                  {exam._count?.questions > 0 ? (
                    <Link 
                       href={`/exam/${exam.id}`}
                       className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900 inline-flex items-center gap-2"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Làm bài
                    </Link>
                  ) : (
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 flex rounded-md dark:bg-amber-500/10 dark:text-amber-400">
                      Đang cập nhật câu hỏi
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
