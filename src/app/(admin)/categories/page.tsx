"use client";

import { useEffect, useState } from "react";
import { Plus, Search, MoreVertical, Edit2, Trash2, Loader2, X } from "lucide-react";

type Category = {
  id: string;
  name: string;
  description: string | null;
  _count: { exams: number };
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
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
      
      await fetchCategories();
      setIsModalOpen(false);
      setFormData({ name: "", description: "" });
      setEditingId(null);
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"?`)) return;
    
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE"
      });
      
      if (!res.ok) {
         const error = await res.json();
         alert(error.error || "Lỗi khi xóa danh mục");
         return;
      }
      
      await fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const openEditModal = (category: Category) => {
    setFormData({ name: category.name, description: category.description || "" });
    setEditingId(category.id);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setFormData({ name: "", description: "" });
    setEditingId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Quản lý Danh mục</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Danh sách các danh mục của đề thi.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
        >
          <Plus className="h-4 w-4" />
          Thêm danh mục
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 relative min-h-[400px]">
        {loading ? (
           <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
           </div>
        ) : (
          <>
            <div className="flex items-center gap-2 border-b border-zinc-200 p-4 dark:border-zinc-800">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm danh mục..."
                  className="w-full rounded-lg border border-zinc-200 bg-transparent py-2 pl-9 pr-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                <thead className="border-b border-zinc-200 bg-zinc-50/50 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Tên Danh Mục</th>
                    <th className="px-6 py-4 font-medium">Mô tả</th>
                    <th className="px-6 py-4 font-medium">Số đề thi</th>
                    <th className="px-6 py-4 text-right font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {categories.length === 0 ? (
                    <tr>
                       <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                          Không có danh mục nào. Hãy tạo mới.
                       </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr key={category.id} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{category.name}</span>
                        </td>
                        <td className="px-6 py-4">{category.description || "-"}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                            {category._count?.exams || 0} đề
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => openEditModal(category)}
                              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800 dark:hover:text-blue-400"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(category.id, category.name)}
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
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Gồm {categories.length} danh mục</span>
            </div>
          </>
        )}
      </div>

      {/* Modal Cập Nhật / Thêm mới */}
      {isModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
               <button 
                 onClick={() => setIsModalOpen(false)}
                 className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
               >
                 <X className="h-4 w-4" />
               </button>
               
               <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
                 {editingId ? "Cập nhật Danh mục" : "Tạo Danh Mục Mới"}
               </h2>
               
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Tên danh mục <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full rounded-lg border border-zinc-200 bg-transparent py-2.5 px-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white"
                      placeholder="VD: Toán Học"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Mô tả chi tiết</label>
                    <textarea 
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full rounded-lg border border-zinc-200 bg-transparent py-2.5 px-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white resize-none"
                      placeholder="Mô tả về danh mục này (tùy chọn)"
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
            </div>
         </div>
      )}
    </div>
  );
}
