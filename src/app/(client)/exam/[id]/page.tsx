"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle, Clock, Loader2 } from "lucide-react";

type Question = {
  id: string;
  content: string;
  type: string;
  options: string[];
};

type Exam = {
  id: string;
  title: string;
  duration: number;
  questions: Question[];
};

export default function ExamPage() {
  const { id } = useParams();
  const router = useRouter();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await fetch(`/api/client/exams/${id}`);
        if (!res.ok) {
           const errData = await res.json();
           throw new Error(errData.error || "Không thể tải đề thi");
        }
        const data = await res.json();
        setExam(data);
        setTimeLeft(data.duration * 60); // Convert minutes to seconds
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchExam();
  }, [id]);

  useEffect(() => {
    if (isStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, timeLeft]);

  const handleStart = () => setIsStarted(true);

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const res = await fetch(`/api/client/exams/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      router.push(`/results/${data.resultId}`);
    } catch (error: any) {
      alert(error.message || "Lỗi khi nộp bài");
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="text-zinc-500">Đang khởi tạo bài thi...</p>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-red-100 p-4 dark:bg-red-500/10">
          <Circle className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Lỗi truy cập</h2>
        <p className="text-zinc-500">{error || "Không tìm thấy nội dung bài thi."}</p>
        <button onClick={() => router.back()} className="mt-4 rounded-xl bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Quay lại
        </button>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="mx-auto max-w-3xl py-12">
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900/50">
           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white sm:p-12">
              <h1 className="text-3xl font-bold sm:text-4xl">{exam.title}</h1>
              <div className="mt-6 flex flex-wrap items-center gap-6 text-blue-100">
                 <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 opacity-80" />
                    <span className="font-medium text-lg">{exam.duration} Phút</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 opacity-80" />
                    <span className="font-medium text-lg">{exam.questions.length} Câu hỏi</span>
                 </div>
              </div>
           </div>
           
           <div className="p-8 sm:p-12 space-y-8">
              <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
                 <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Nội quy & Lưu ý</h3>
                 <ul className="list-disc pl-5 space-y-2">
                    <li>Sau khi nhấn <strong className="text-zinc-900 dark:text-white">Bắt đầu</strong>, thời gian sẽ được tính tự động.</li>
                    <li>Không tải lại (refresh) trang web trong quá trình làm bài để tránh mất dữ liệu.</li>
                    <li>Hệ thống sẽ tự động nộp bài khi thời gian kết thúc.</li>
                    <li>Chắc chắn mạng kết nối ổn định trước khi làm bài.</li>
                 </ul>
              </div>
              
              <button
                onClick={handleStart}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-lg font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50"
              >
                Bắt đầu làm bài thi
              </button>
           </div>
        </div>
      </div>
    );
  }

  const currentQ = exam.questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const isTimeWarning = timeLeft < 300; // Under 5 minutes

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-8 max-w-6xl mx-auto h-[calc(100vh-6rem)]">
      {/* Cột Làm Bài */}
      <div className="flex-1 flex flex-col space-y-6">
        <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
           <h2 className="text-lg font-bold text-zinc-900 dark:text-white truncate pr-4">
             {exam.title}
           </h2>
           <div className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xl font-bold tracking-wider ${
              isTimeWarning ? "bg-red-50 text-red-600 animate-pulse dark:bg-red-900/20" : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
           }`}>
             <Clock className="h-5 w-5" />
             {formatTime(timeLeft)}
           </div>
        </div>

        <div className="flex-1 overflow-y-auto rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-10">
           <div className="mb-8 flex items-center justify-between">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                Câu Hỏi {currentQuestionIndex + 1} / {exam.questions.length}
              </span>
           </div>
           
           <h3 className="text-xl font-medium text-zinc-900 dark:text-white leading-relaxed mb-8">
             {currentQ.content}
           </h3>

           <div className="space-y-4">
             {currentQ.options.map((opt, idx) => {
               const isSelected = answers[currentQ.id] === idx;
               return (
                 <label 
                   key={idx}
                   onClick={() => handleAnswerSelect(currentQ.id, idx)}
                   className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
                     isSelected 
                       ? "border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-900/20" 
                       : "border-zinc-200 dark:border-zinc-800"
                   }`}
                 >
                   <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                     isSelected ? "border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500" : "border-zinc-300 dark:border-zinc-600"
                   }`}>
                     {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                   </div>
                   <span className={`text-base font-medium ${isSelected ? "text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-300"}`}>
                     {opt}
                   </span>
                 </label>
               );
             })}
           </div>

           <div className="mt-12 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-6">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(p => p - 1)}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <ArrowLeft className="h-4 w-4" /> Câu trước
              </button>
              
              <button
                disabled={currentQuestionIndex === exam.questions.length - 1}
                onClick={() => setCurrentQuestionIndex(p => p + 1)}
                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 lg:hover:bg-zinc-200"
              >
                Câu tiếp theo <ArrowLeft className="h-4 w-4 rotate-180" />
              </button>
           </div>
        </div>
      </div>

      {/* Cột Navigation Sidebar */}
      <div className="w-full md:w-80 flex flex-col space-y-6">
         <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex-1 overflow-y-auto">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Tiến độ làm bài</h3>
            <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400 mb-6">
               <span>Đã trả lời: <strong className="text-emerald-600 dark:text-emerald-400">{answeredCount}</strong>/{exam.questions.length}</span>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-8">
               {exam.questions.map((q, idx) => {
                 const isAnswered = answers[q.id] !== undefined;
                 const isCurrent = currentQuestionIndex === idx;
                 return (
                   <button
                     key={q.id}
                     onClick={() => setCurrentQuestionIndex(idx)}
                     className={`flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-all ${
                       isCurrent 
                         ? "ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-zinc-900" 
                         : ""
                     } ${
                       isAnswered 
                         ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300" 
                         : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                     }`}
                   >
                     {idx + 1}
                   </button>
                 );
               })}
            </div>

            <button
               onClick={() => {
                 if(answeredCount < exam.questions.length) {
                    if(!confirm("Bạn chưa hoàn thành tất cả câu hỏi. Vẫn muốn nộp bài?")) return;
                 }
                 handleSubmit();
               }}
               disabled={isSubmitting}
               className="w-full rounded-xl bg-orange-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-700 disabled:opacity-70 mt-auto flex items-center justify-center gap-2"
            >
               {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
               Nộp bài ngay
            </button>
         </div>
      </div>
    </div>
  );
}
