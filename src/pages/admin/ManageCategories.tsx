import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Check, Layers } from "lucide-react";
import { toast } from "sonner";

interface Category { id: number; name: string; icon: string; total_crops: number; total_varieties: number; status: "active" | "inactive"; }

const INITIAL: Category[] = [
  { id: 1, name: "Vegetables", icon: "🥦", total_crops: 6, total_varieties: 38, status: "active"   },
  { id: 2, name: "Fruits",     icon: "🍉", total_crops: 3, total_varieties: 11, status: "active"   },
  { id: 3, name: "Flowers",    icon: "🌸", total_crops: 2, total_varieties: 4,  status: "inactive" },
  { id: 4, name: "Herbs",      icon: "🌿", total_crops: 1, total_varieties: 2,  status: "inactive" },
];

function CatModal({ cat, onSave, onClose }: { cat: Partial<Category> | null; onSave: (c: Category) => void; onClose: () => void }) {
  const [form, setForm] = useState<Partial<Category>>(cat ?? { status: "active" });
  const isEdit = !!cat?.id;

  const handleSave = () => {
    if (!form.name) return toast.error("Category name required");
    onSave({ id: form.id ?? Date.now(), name: form.name!, icon: form.icon ?? "🌱", total_crops: form.total_crops ?? 0, total_varieties: form.total_varieties ?? 0, status: form.status ?? "active" });
    toast.success(isEdit ? "Category updated!" : "Category added!");
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="text-sm font-bold text-white">{isEdit ? "Edit Category" : "Add Category"}</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: "Category Name *", key: "name", placeholder: "e.g. Vegetables" },
            { label: "Icon (emoji)",    key: "icon", placeholder: "🌱" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1.5 block">{f.label}</label>
              <input value={(form as any)[f.key] ?? ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/50" />
            </div>
          ))}
          <div>
            <label className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1.5 block">Status</label>
            <div className="flex gap-2">
              {(["active", "inactive"] as const).map(s => (
                <button key={s} onClick={() => setForm({ ...form, status: s })}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border capitalize transition-all ${form.status === s ? "bg-purple-500/20 border-purple-500/40 text-purple-300" : "bg-white/[0.03] border-white/8 text-white/40"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-white/40 hover:text-white/70 transition-colors">Cancel</button>
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-purple-500 text-white text-xs font-semibold hover:bg-purple-600 transition-colors flex items-center justify-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> {isEdit ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ManageCategories() {
  const [cats, setCats]   = useState<Category[]>(INITIAL);
  const [modal, setModal] = useState<Partial<Category> | null | false>(false);

  const handleSave = (c: Category) => setCats(prev => prev.some(x => x.id === c.id) ? prev.map(x => x.id === c.id ? c : x) : [...prev, c]);
  const handleDelete = (id: number) => { setCats(prev => prev.filter(c => c.id !== id)); toast.success("Category deleted"); };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => setModal({})}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500 text-white text-xs font-semibold hover:bg-purple-600 transition-colors shadow-lg shadow-purple-500/20">
          <Plus className="w-3.5 h-3.5" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cats.map((cat, i) => (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-purple-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-4xl mb-4">{cat.icon}</div>
            <h3 className="font-bold text-white/80 text-sm mb-1">{cat.name}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.status === "active" ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}`}>
              {cat.status}
            </span>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-white/[0.03] rounded-xl p-2.5 text-center">
                <p className="text-lg font-bold text-purple-400">{cat.total_crops}</p>
                <p className="text-[10px] text-white/30">Crops</p>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-2.5 text-center">
                <p className="text-lg font-bold text-blue-400">{cat.total_varieties}</p>
                <p className="text-[10px] text-white/30">Varieties</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setModal(cat)} className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-purple-500/20 text-white/30 hover:text-purple-400 text-xs font-semibold transition-all flex items-center justify-center gap-1">
                <Edit2 className="w-3 h-3" /> Edit
              </button>
              <button onClick={() => handleDelete(cat.id)} className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/30 hover:text-red-400 text-xs font-semibold transition-all flex items-center justify-center gap-1">
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modal !== false && <CatModal cat={modal} onSave={handleSave} onClose={() => setModal(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}
