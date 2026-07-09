import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, X, Phone, Mail, ShoppingBag, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { fetchAdminCustomers, type AdminCustomer } from "@/components/admin/adminData";

function CustomerModal({ customer, onClose }: { customer: AdminCustomer; onClose: () => void }) {
  const joined = customer.created_at || customer.joined || "";
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
        className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative p-6 border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/5" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-white">{customer.name}</h3>
              {joined && <p className="text-xs text-white/40">Joined {new Date(joined).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</p>}
            </div>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Phone,       label: "Phone",        value: customer.phone },
              { icon: Mail,        label: "Email",        value: customer.email || "—" },
              { icon: ShoppingBag, label: "Total Orders", value: String(customer.total_orders) },
              { icon: IndianRupee, label: "Total Spent",  value: `₹${Number(customer.total_spent).toLocaleString()}` },
            ].map(f => (
              <div key={f.label} className="bg-white/[0.03] rounded-xl p-3 flex items-start gap-2">
                <f.icon className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-white/30">{f.label}</p>
                  <p className="text-xs font-semibold text-white/70 mt-0.5">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
          {customer.last_order_at && (
            <div className="bg-white/[0.03] rounded-xl p-3">
              <p className="text-[10px] text-white/30 mb-1">Last Order</p>
              <p className="text-xs font-semibold text-white/70">{new Date(customer.last_order_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ManageCustomers() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState<AdminCustomer | null>(null);

  useEffect(() => {
    fetchAdminCustomers()
      .then(r => setCustomers(r.data))
      .catch(() => toast.error("Failed to load customers"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Customers", value: customers.length,                                   color: "from-purple-500 to-purple-700" },
          { label: "With Orders",     value: customers.filter(c => c.total_orders > 0).length,   color: "from-green-500 to-green-700"   },
          { label: "Top Spenders",    value: customers.filter(c => c.total_spent > 100000).length,color: "from-amber-500 to-amber-700"   },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-white/40 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/8 rounded-xl text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            />
          </div>
          <span className="text-xs text-white/30 ml-auto">{filtered.length} customers</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-white/30 text-sm">Loading customers...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Customer", "Phone", "Email", "Orders", "Total Spent", "Last Order", ""].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-semibold text-white/20 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center text-xs font-bold text-purple-300">
                          {c.name.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-white/70">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-white/40">{c.phone}</td>
                    <td className="px-5 py-3.5 text-xs text-white/40">{c.email || "—"}</td>
                    <td className="px-5 py-3.5 text-xs font-bold text-white/60">{c.total_orders}</td>
                    <td className="px-5 py-3.5 text-xs font-bold text-white/60">₹{Number(c.total_spent).toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-[10px] text-white/30 whitespace-nowrap">
                      {c.last_order_at ? new Date(c.last_order_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setSelected(c)} className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-500/20 text-white/30 hover:text-purple-400 transition-all opacity-0 group-hover:opacity-100">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && <CustomerModal customer={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}
