"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, ShieldCheck, Clock, Loader2, X } from "lucide-react";

type Category = {
  id: string;
  name: string;
};

type Exam = {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  status: string;
  categoryId: string;
  category: { name: string };
  _count: { questions: number };
};

export default function AdminExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 60,
    categoryId: "",
    status: "DRAFT"
  });

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsRes, categoriesRes] = await Promise.all([
        fetch("/api/exams"),
        fetch("/api/categories")
      ]);
      
      const examsData = await examsRes.json();
      const categoriesData = await categoriesRes.json();
      
      setExams(examsData);
      setCategories(categoriesData);
      
      if (categoriesData.length > 0 && !formData.categoryId) {
         setFormData(prev => ({ ...prev, categoryId: categoriesData[0].id }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
       alert("Vui lòng chọn danh mục!");
       return;
    }
    
    setFormLoading(true);
    try {
      const url = editingId ? `/api/exams/${editingId}` : "/api/exams";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          duration: Number(formData.duration)
        })
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

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa đề thi "${title}"?`)) return;
    
    try {
      const res = await fetch(`/api/exams/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchData();
    } catch (error) {
      console.error("Error deleting exam:", error);
      alert("Lỗi khi xóa đề thi");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      duration: 60,
      categoryId: categories.length > 0 ? categories[0].id : "",
      status: "DRAFT"
    });
    setEditingId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (exam: Exam) => {
    setFormData({
      title: exam.title,
      description: exam.description || "",
      duration: exam.duration,
      categoryId: exam.categoryId,
      status: exam.status
    });
    setEditingId(exam.id);
    setIsModalOpen(true);
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || exam.categoryId === filterCategory;
    const matchesStatus = filterStatus === "all" || exam.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Quản lý Đề thi</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Danh sách các bài thi và trạng thái xuất bản.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
        >
          <Plus className="h-4 w-4" />
          Tạo đề thi mới
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
                  placeholder="Tìm kiếm đề thi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-transparent py-2 pl-9 pr-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                 <select 
                   value={filterCategory}
                   onChange={(e) => setFilterCategory(e.target.value)}
                   className="w-full sm:w-auto rounded-lg border border-zinc-200 bg-transparent py-2 px-3 text-sm text-zinc-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white"
                 >
                    <option value="all">Tất cả danh mục</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                 </select>
                 <select 
                   value={filterStatus}
                   onChange={(e) => setFilterStatus(e.target.value)}
                   className="w-full sm:w-auto rounded-lg border border-zinc-200 bg-transparent py-2 px-3 text-sm text-zinc-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white"
                 >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="PUBLISHED">Đã xuất bản</option>
                    <option value="DRAFT">Bản nháp</option>
                 </select>
              </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                <thead className="border-b border-zinc-200 bg-zinc-50/50 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Đề thi</th>
                    <th className="px-6 py-4 font-medium">Danh mục</th>
                    <th className="px-6 py-4 font-medium">Thời gian</th>
                    <th className="px-6 py-4 font-medium">Trạng thái</th>
                    <th className="px-6 py-4 font-medium">Số câu</th>
                    <th className="px-6 py-4 text-right font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filteredExams.length === 0 ? (
                    <tr>
                       <td colSpan={6} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                          {exams.length === 0 ? "Chưa có đề thi nào." : "Không có kết quả khớp với tìm kiếm."}
                       </td>
                    </tr>
                  ) : (
                    filteredExams.map((exam) => (
                      <tr key={exam.id} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{exam.title}</span>
                          {exam.description && <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{exam.description}</p>}
                        </td>
                        <td className="px-6 py-4">{exam.category.name}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                            <Clock className="h-4 w-4" />
                            {exam.duration} phút
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                            exam.status === 'PUBLISHED' 
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                          }`}>
                            {exam.status === 'PUBLISHED' && <ShieldCheck className="h-3.5 w-3.5" />}
                            {exam.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                           {exam._count?.questions || 0}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => openEditModal(exam)}
                               className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800 dark:hover:text-blue-400"
                              >
                               <Edit2 className="h-4 w-4" />
                             </button>
                             <button 
                               onClick={() => handleDelete(exam.id, exam.title)}
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
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Gồm {filteredExams.length} đề thi</span>
            </div>
          </>
        )}
      </div>

      {/* Modal Cập Nhật / Thêm mới Đề thi */}
      {isModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200 my-8">
               <button 
                 onClick={() => setIsModalOpen(false)}
                 className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
               >
                 <X className="h-4 w-4" />
               </button>
               
               <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
                 {editingId ? "Cập nhật Đề thi" : "Tạo Đề thi Mới"}
               </h2>
               
               {categories.length === 0 ? (
                  <div className="p-4 bg-amber-50 text-amber-800 rounded-lg dark:bg-amber-500/10 dark:text-amber-400 text-sm">
                    Bạn cần tạo ít nhất 1 Danh mục trước khi tạo Đề thi.
                  </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Tiêu đề <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full rounded-lg border border-zinc-200 bg-transparent py-2.5 px-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white"
                        placeholder="VD: Đề thi học kỳ 1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Danh mục <span className="text-red-500">*</span></label>
                        <select
                          required
                          value={formData.categoryId}
                          onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                          className="w-full rounded-lg border border-zinc-200 bg-transparent py-2.5 px-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white"
                        >
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Thời gian (phút) <span className="text-red-500">*</span></label>
                        <input 
                          type="number" 
                          required
                          min={1}
                          max={300}
                          value={formData.duration}
                          onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                          className="w-full rounded-lg border border-zinc-200 bg-transparent py-2.5 px-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Trạng thái</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full rounded-lg border border-zinc-200 bg-transparent py-2.5 px-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white"
                      >
                        <option value="DRAFT">Bản nháp (DRAFT)</option>
                        <option value="PUBLISHED">Xuất bản (PUBLISHED)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Mô tả chi tiết</label>
                      <textarea 
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full rounded-lg border border-zinc-200 bg-transparent py-2.5 px-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white resize-none"
                        placeholder="Mô tả về đề thi (tùy chọn)"
                      />
                    </div>
                    
                    <div className="pt-4 flex items-center justify-end gap-3">
                       <button
                         type="button"
                         onClick={() => setIsModalOpen(false)}
                         className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
                       >
                         Hủy bỏ
                       </button>
                       <button
                         type="submit"
                         disabled={formLoading}
                         className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
