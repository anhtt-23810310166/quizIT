"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, Loader2, X, AlertCircle } from "lucide-react";

type Exam = {
  id: string;
  title: string;
};

type Question = {
  id: string;
  content: string;
  type: string;
  examId: string;
  exam: { title: string };
  options: string[];
  correctOption: number;
};

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    examId: "",
    content: "",
    type: "SINGLE_CHOICE",
    options: ["", "", "", ""],
    correctOption: 0
  });

  const [filterExam, setFilterExam] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [questionsRes, examsRes] = await Promise.all([
        fetch("/api/questions"),
        fetch("/api/exams")
      ]);
      
      const questionsData = await questionsRes.json();
      const examsData = await examsRes.json();
      
      setQuestions(questionsData);
      setExams(examsData);
      
      if (examsData.length > 0 && !formData.examId) {
         setFormData(prev => ({ ...prev, examId: examsData[0].id }));
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
     if (formData.options.length >= 6) return;
     setFormData({ ...formData, options: [...formData.options, ""] });
  };

  const removeOption = (index: number) => {
     if (formData.options.length <= 2) return;
     const newOptions = formData.options.filter((_, i) => i !== index);
     // Adjust correct option if needed
     let newCorrectOption = formData.correctOption;
     if (newCorrectOption === index) newCorrectOption = 0;
     else if (newCorrectOption > index) newCorrectOption -= 1;
     
     setFormData({ ...formData, options: newOptions, correctOption: newCorrectOption });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.examId) {
       alert("Vui lòng chọn đề thi!");
       return;
    }
    
    // Validate options
    if (formData.options.some(opt => !opt.trim())) {
       alert("Vui lòng điền nội dung cho tất cả các đáp án.");
       return;
    }
    
    setFormLoading(true);
    try {
      const url = editingId ? `/api/questions/${editingId}` : "/api/questions";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Có lỗi xảy ra");
        return;
      }
      
      await fetchData();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
       console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Bạn có chắc muốn xóa câu hỏi này?`)) return;
    
    try {
      const res = await fetch(`/api/questions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchData();
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Lỗi khi xóa câu hỏi");
    }
  };

  const resetForm = () => {
    setFormData({
      examId: exams.length > 0 ? exams[0].id : "",
      content: "",
      type: "SINGLE_CHOICE",
      options: ["", "", "", ""],
      correctOption: 0
    });
    setEditingId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (q: Question) => {
    setFormData({
      examId: q.examId,
      content: q.content,
      type: q.type,
      options: [...q.options],
      correctOption: q.correctOption
    });
    setEditingId(q.id);
    setIsModalOpen(true);
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesExam = filterExam === "all" || q.examId === filterExam;
    return matchesSearch && matchesExam;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Quản lý Câu hỏi</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Ngân hàng câu hỏi được liên kết với các đề thi.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
        >
          <Plus className="h-4 w-4" />
          Thêm câu hỏi
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 relative min-h-[400px]">
        {loading ? (
             <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
             </div>
          ) : (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-zinc-200 p-4 dark:border-zinc-800">
              <div className="relative flex-1 w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm nội dung câu hỏi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-transparent py-2 pl-9 pr-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                 <select 
                   value={filterExam}
                   onChange={(e) => setFilterExam(e.target.value)}
                   className="w-full sm:w-auto rounded-lg border border-zinc-200 bg-transparent py-2 px-3 text-sm text-zinc-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white"
                 >
                    <option value="all">Tất cả bài thi</option>
                    {exams.map(e => (
                      <option key={e.id} value={e.id}>{e.title}</option>
                    ))}
                 </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                <thead className="border-b border-zinc-200 bg-zinc-50/50 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-medium w-1/2">Nội dung câu hỏi</th>
                    <th className="px-6 py-4 font-medium">Thuộc đề thi</th>
                    <th className="px-6 py-4 font-medium">Đã có</th>
                    <th className="px-6 py-4 text-right font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filteredQuestions.length === 0 ? (
                      <tr>
                         <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                            Không có câu hỏi nào khớp với tìm kiếm của bạn.
                         </td>
                      </tr>
                    ) : (
                      filteredQuestions.map((q) => (
                        <tr key={q.id} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                          <td className="px-6 py-4">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">{q.content}</span>
                          </td>
                          <td className="px-6 py-4">
                             <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                               {q.exam?.title || "Mất liên kết"}
                             </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              {q.options.length} đáp án
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <button 
                                 onClick={() => openEditModal(q)}
                                 className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800 dark:hover:text-blue-400"
                               >
                                 <Edit2 className="h-4 w-4" />
                               </button>
                               <button 
                                 onClick={() => handleDelete(q.id)}
                                 className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-red-600 dark:hover:bg-zinc-800 dark:hover:text-red-400"
                               >
                                 <Trash2 className="h-4 w-4" />
                               </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center justify-between border-t border-zinc-200 p-4 dark:border-zinc-800">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Gồm {filteredQuestions.length} câu hỏi</span>
            </div>
          </>
        )}
      </div>

      {/* Modal Add/Edit Question */}
      {isModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200 my-8">
               <button 
                 onClick={() => setIsModalOpen(false)}
                 className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
               >
                 <X className="h-4 w-4" />
               </button>
               
               <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
                 {editingId ? "Cập nhật câu hỏi" : "Tạo câu hỏi mới"}
               </h2>
               
               {exams.length === 0 ? (
                  <div className="p-4 bg-amber-50 text-amber-800 rounded-lg dark:bg-amber-500/10 dark:text-amber-400 text-sm flex gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>Bạn cần tạo ít nhất 1 bài thi (Exam) trước khi tạo câu hỏi.</p>
                  </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Thuộc đề thi <span className="text-red-500">*</span></label>
                      <select
                        required
                        value={formData.examId}
                        onChange={(e) => setFormData({...formData, examId: e.target.value})}
                        className="w-full rounded-lg border border-zinc-200 bg-transparent py-2.5 px-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white"
                      >
                        {exams.map(e => (
                          <option key={e.id} value={e.id}>{e.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nội dung câu hỏi <span className="text-red-500">*</span></label>
                      <textarea 
                        required
                        rows={3}
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        className="w-full rounded-lg border border-zinc-200 bg-transparent py-2.5 px-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white resize-none"
                        placeholder="VD: Thủ đô của Việt Nam là gì?"
                      />
                    </div>
                    
                    <div>
                       <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Các đáp án <span className="text-red-500">*</span></label>
                          {formData.options.length < 6 && (
                            <button 
                              type="button" 
                              onClick={addOption}
                              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            >
                              + Thêm đáp án
                            </button>
                          )}
                       </div>
                       
                       <div className="space-y-3">
                          {formData.options.map((opt, idx) => (
                             <div key={idx} className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name="correctOption"
                                  checked={formData.correctOption === idx}
                                  onChange={() => setFormData({...formData, correctOption: idx})}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-zinc-800 dark:border-zinc-700"
                                  title="Chọn làm đáp án đúng"
                                />
                                <input
                                  type="text"
                                  required
                                  value={opt}
                                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                                  className={`flex-1 rounded-lg border py-2 px-3 text-sm outline-none transition-all focus:ring-1 ${
                                     formData.correctOption === idx 
                                       ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/50" 
                                       : "border-zinc-200 bg-transparent focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
                                  }`}
                                  placeholder={`Đáp án ${idx + 1}`}
                                />
                                {formData.options.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => removeOption(idx)}
                                    className="p-2 text-zinc-400 hover:text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                             </div>
                          ))}
                       </div>
                       <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Chọn nút Radio bên trái để xác định đáp án đúng cho câu hỏi.</p>
                    </div>
                    
                    <div className="pt-4 flex items-center justify-end gap-3 mt-8 border-t border-zinc-100 dark:border-zinc-800">
                       <button
                         type="button"
                         onClick={() => setIsModalOpen(false)}
                         className="rounded-xl px-4 py-2 mt-4 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
                       >
                         Hủy bỏ
                       </button>
                       <button
                         type="submit"
                         disabled={formLoading}
                         className="inline-flex mt-4 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                         {editingId ? "Lưu thay đổi" : "Tạo mới"}
                       </button>
                    </div>
                 </form>
               )}
            </div>
         </div>
      )}
    </div>
  );
}
