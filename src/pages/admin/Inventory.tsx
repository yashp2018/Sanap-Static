import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Package, TrendingDown, CheckCircle, BarChart2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { fetchAdminVarieties, deriveStatus, type AdminVariety } from "@/components/admin/adminData";
import { toast } from "sonner";

const STOCK_COLORS: Record<string, string> = {
  active:       "#10B981",
  low_stock:    "#F59E0B",
  out_of_stock: "#EF4444",
  inactive:     "#6B7280",
};

export default function Inventory() {
  const [varieties, setVarieties] = useState<(AdminVariety & { status: string })[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetchAdminVarieties()
      .then(r => setVarieties(r.data.map(v => ({ ...v, status: deriveStatus(v) }))))
      .catch(() => toast.error("Failed to load inventory"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-white/40 text-sm p-8">Loading inventory...</div>;

  const total      = varieties.reduce((s, v) => s + Number(v.stock), 0);
  const outOfStock = varieties.filter(v => v.status === "out_of_stock").length;
  const lowStock   = varieties.filter(v => v.status === "low_stock").length;
  const healthy    = varieties.filter(v => v.status === "active").length;
  const maxStock   = Math.max(...varieties.map(v => Number(v.stock)), 1);

  const chartData = varieties.map(v => ({
    name: v.name.length > 10 ? v.name.slice(0, 10) + "…" : v.name,
    stock: Number(v.stock),
    status: v.status,
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Stock",   value: `${(total / 1000).toFixed(0)}K`, icon: Package,       color: "from-purple-500 to-purple-700", desc: "plants available" },
          { label: "Healthy Stock", value: healthy,                          icon: CheckCircle,   color: "from-green-500 to-green-700",   desc: "varieties in stock" },
          { label: "Low Stock",     value: lowStock,                         icon: TrendingDown,  color: "from-amber-500 to-amber-700",   desc: "need restocking" },
          { label: "Out of Stock",  value: outOfStock,                       icon: AlertTriangle, color: "from-red-500 to-red-700",       desc: "varieties empty" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 relative overflow-hidden group">
            <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity`} />
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg`}>
              <s.icon className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
            <p className="text-[10px] text-white/20 mt-0.5">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
        <div className="mb-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-400" /> Stock by Variety
          </h3>
          <p className="text-xs text-white/30 mt-0.5">Current inventory levels</p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} tickFormatter={v => `${v / 1000}K`} />
            <Tooltip
              contentStyle={{ background: "#1a2235", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
              formatter={(v: any) => [Number(v).toLocaleString() + " plants", "Stock"]}
            />
            <Bar dataKey="stock" radius={[6, 6, 0, 0]} animationDuration={1200}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={STOCK_COLORS[entry.status] ?? "#8B5CF6"} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-sm font-bold text-white">Inventory Details</h3>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {varieties.map((v, i) => {
            const pct = (Number(v.stock) / maxStock) * 100;
            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-xs font-semibold text-white/70">{v.name}</span>
                      <span className="text-[10px] text-white/30 ml-2">{v.crop_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white/60">{Number(v.stock).toLocaleString()}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg capitalize ${
                        v.status === "active" ? "bg-green-500/10 text-green-400" :
                        v.status === "low_stock" ? "bg-amber-500/10 text-amber-400" :
                        v.status === "out_of_stock" ? "bg-red-500/10 text-red-400" : "bg-gray-500/10 text-gray-400"
                      }`}>
                        {v.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                      className="h-full rounded-full"
                      style={{ background: STOCK_COLORS[v.status] ?? "#8B5CF6" }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
