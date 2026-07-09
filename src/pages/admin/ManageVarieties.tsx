import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, X, Check, Sprout, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { fetchAdminVarieties, updateVariety, deactivateVariety, deriveStatus, type AdminVariety } from "@/components/admin/adminData";

const STATUS_COLORS: Record<string, string> = {
  active:       "bg-green-500/10 text-green-400",
  inactive:     "bg-gray-500/10 text-gray-400",
  low_stock:    "bg-amber-500/10 text-amber-400",
  out_of_stock: "bg-red-500/10 text-red-400",
};

function VarietyModal({ variety, onSave, onClose }: {
  variety: Partial<AdminVariety> | null; onSave: (v: AdminVariety) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<AdminVariety>>(variety ?? { is_active: true });
  const isEdit = !!variety?.id;
  const set = (k: keyof AdminVariety, v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.name || !form.crop_name) return toast.error("Fill required fields");
    if (isEdit && form.id) {
      try {
        await updateVariety(form.id, {
          name: form.name,
          company: form.company,
          stock: form.stock,
          is_active: form.is_active,
          price_ex_factory: form.price_ex_factory,
          price_15k: form.price_15k,
          price_30k: form.price_30k,
          delivery_local: form.delivery_local,
          delivery_250km: form.delivery_250km,
          min_order_qty: form.min_order_qty,
        });
        onSave({ ...form } as AdminVariety);
        toast.success("Variety updated!");
        onClose();
      } catch {
        toast.error("Failed to update variety");
      }
    } else {
      toast.info("Adding new varieties requires crop_id — use the server API directly.");
    }
  };

  const Field = ({ label, k, type = "text", placeholder = "" }: { label: string; k: keyof AdminVariety; type?: string; placeholder?: string }) => (
    <div>
      <label className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1.5 block">{label}</label>
      <input type={type} value={(form as any)[k] ?? ""} onChange={e => set(k, type === "number" ? Number(e.target.value) : e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 bg-white/5 border border-white/8 rounded-xl text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/50" />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <h3 className="text-sm font-bold text-white">{isEdit ? "Edit Variety" : "Add New Variety"}</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          <div>
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-3">Basic Information</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Variety Name *" k="name" placeholder="e.g. Aryaman" />
              <Field label="Company Name"   k="company" placeholder="e.g. Syngenta" />
              <Field label="Crop Name *"    k="crop_name" placeholder="e.g. Tomato" />
              <div>
                <label className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1.5 block">Active</label>
                <div className="flex gap-2">
                  {([true, false] as const).map(v => (
                    <button key={String(v)} onClick={() => set("is_active", v)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border capitalize transition-all ${form.is_active === v ? "bg-purple-500/20 border-purple-500/40 text-purple-300" : "bg-white/[0.03] border-white/8 text-white/40"}`}>
                      {v ? "Active" : "Inactive"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-3">Pricing (₹ per plant)</p>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Ex Factory"  k="price_ex_factory" type="number" placeholder="1.50" />
              <Field label="15,000+ qty" k="price_15k"        type="number" placeholder="1.80" />
              <Field label="30,000+ qty" k="price_30k"        type="number" placeholder="1.60" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-3">Delivery Charges (₹ per plant)</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Local Delivery" k="delivery_local"  type="number" placeholder="0.20" />
              <Field label="250km Delivery" k="delivery_250km"  type="number" placeholder="0.50" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-3">Inventory</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Stock Quantity" k="stock"         type="number" placeholder="50000" />
              <Field label="Min Order Qty"  k="min_order_qty" type="number" placeholder="1000" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-white/5 shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-white/40 hover:text-white/70 transition-colors">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-purple-500 text-white text-xs font-semibold hover:bg-purple-600 transition-colors flex items-center justify-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> {isEdit ? "Update" : "Add Variety"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ManageVarieties() {
  const [varieties, setVarieties] = useState<AdminVariety[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [modal, setModal]         = useState<Partial<AdminVariety> | null | false>(false);

  useEffect(() => {
    fetchAdminVarieties()
      .then(r => setVarieties(r.data.map(v => ({
        ...v,
        category: v.category_name || "",
        delivery_local: Number(v.delivery_local_charge ?? v.delivery_local ?? 0),
        delivery_250km: Number(v.delivery_250km_charge ?? v.delivery_250km ?? 0),
        status: deriveStatus(v),
      }))))
      .catch(() => toast.error("Failed to load varieties"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = varieties.filter(v =>
    (catFilter === "All" || v.category === catFilter) &&
    (v.name.toLowerCase().includes(search.toLowerCase()) || v.crop_name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = (updated: AdminVariety) => {
    setVarieties(prev => prev.map(v => v.id === updated.id ? { ...updated, status: deriveStatus(updated) } : v));
  };

  const handleDelete = async (id: number) => {
    try {
      await deactivateVariety(id);
      setVarieties(prev => prev.map(v => v.id === id ? { ...v, is_active: false, status: "inactive" } : v));
      toast.success("Variety deactivated");
    } catch {
      toast.error("Failed to deactivate variety");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search varieties or crops..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/8 rounded-xl text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/50" />
        </div>
        <div className="flex gap-1.5">
          {["All", "Vegetable Plants", "Fruit Plants", "Flower Plants"].map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${catFilter === c ? "bg-purple-500/20 border-purple-500/40 text-purple-300" : "bg-white/[0.03] border-white/8 text-white/40 hover:text-white/70"}`}>
              {c === "All" ? "All" : c.replace(" Plants", "")}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/30 text-sm">Loading varieties...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Variety", "Crop", "Company", "Stock", "Ex Factory", "15K Rate", "30K Rate", "Status", ""].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-semibold text-white/20 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => (
                  <motion.tr
                    key={v.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {v.image_url ? (
                          <img src={v.image_url} alt={v.name} className="w-8 h-8 rounded-lg object-cover opacity-80" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Sprout className="w-4 h-4 text-purple-400" />
                          </div>
                        )}
                        <span className="text-xs font-semibold text-white/70">{v.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-white/40">{v.crop_name}</td>
                    <td className="px-5 py-3.5 text-xs text-white/40">{v.company}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {(v.status === "low_stock" || v.status === "out_of_stock") && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                        <span className="text-xs font-semibold text-white/60">{Number(v.stock).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-white/50">₹{v.price_ex_factory}</td>
                    <td className="px-5 py-3.5 text-xs text-white/50">₹{v.price_15k}</td>
                    <td className="px-5 py-3.5 text-xs text-white/50">₹{v.price_30k}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg capitalize ${STATUS_COLORS[v.status ?? "active"]}`}>
                        {(v.status ?? "active").replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setModal(v)} className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-500/20 text-white/30 hover:text-purple-400 transition-all">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(v.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal !== false && <VarietyModal variety={modal} onSave={handleSave} onClose={() => setModal(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}
