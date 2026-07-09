import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download, FileText, TrendingUp, ShoppingCart, Users } from "lucide-react";
import { toast } from "sonner";
import { fetchDashboard, fetchAdminCustomers, type AdminDashboard } from "@/components/admin/adminData";

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a2235] border border-white/10 rounded-xl p-3 shadow-2xl">
      <p className="text-[10px] font-bold text-white/40 mb-1">{label}</p>
      <p className="text-sm font-bold text-purple-400">₹{Number(payload[0].value).toLocaleString()}</p>
    </div>
  );
};

export default function Reports() {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchDashboard().then(r => setDashboard(r.data)),
      fetchAdminCustomers().then(r => setCustomerCount(r.data.length)),
    ])
      .catch(() => toast.error("Failed to load reports"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-white/40 text-sm p-8">Loading reports...</div>;
  if (!dashboard) return <div className="text-red-400 text-sm p-8">Failed to load reports.</div>;

  const { stats, monthly } = dashboard;
  const totalRevenue = Number(stats.total_revenue);
  const totalOrders  = Number(stats.total_orders);

  const reports = [
    { title: "Revenue Report",   desc: "Monthly revenue breakdown with trends",  icon: TrendingUp,   color: "from-purple-500 to-purple-700", value: `₹${(totalRevenue / 100000).toFixed(1)}L` },
    { title: "Orders Report",    desc: "All orders with status and details",      icon: ShoppingCart, color: "from-blue-500 to-blue-700",     value: `${totalOrders} orders` },
    { title: "Customer Report",  desc: "Customer list with spending analysis",    icon: Users,        color: "from-emerald-500 to-emerald-700",value: `${customerCount} customers` },
    { title: "Inventory Report", desc: "Stock levels and low inventory alerts",   icon: FileText,     color: "from-amber-500 to-amber-700",   value: `${stats.active_varieties} varieties` },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {reports.map((r, i) => (
          <motion.div key={r.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 group cursor-pointer relative overflow-hidden">
            <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${r.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity`} />
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center mb-4 shadow-lg`}>
              <r.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-bold text-white/80 mb-1">{r.title}</h3>
            <p className="text-xs text-white/30 mb-4">{r.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400">{r.value}</span>
              <button
                onClick={() => toast.success(`${r.title} download started!`)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-purple-500/20 text-white/30 hover:text-purple-400 text-xs font-semibold transition-all"
              >
                <Download className="w-3 h-3" /> Export
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-white">Monthly Revenue</h3>
            <p className="text-xs text-white/30 mt-0.5">Last 12 months performance</p>
          </div>
          <button onClick={() => toast.success("Revenue report exported!")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold hover:bg-purple-500/20 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthly} barSize={28}>
            <defs>
              <linearGradient id="repGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} tickFormatter={v => `₹${v / 1000}K`} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="revenue" fill="url(#repGrad)" radius={[6, 6, 0, 0]} animationDuration={1200} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h3 className="text-sm font-bold text-white">Order Summary by Month</h3>
          <button onClick={() => toast.success("Orders report exported!")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-white/40 text-xs font-semibold hover:text-white/70 transition-colors">
            <Download className="w-3 h-3" /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Month", "Orders", "Revenue", "Avg Order Value", "Growth"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-semibold text-white/20 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthly.map((row, i) => {
                const prev = monthly[i - 1];
                const growth = prev ? (((Number(row.revenue) - Number(prev.revenue)) / Number(prev.revenue)) * 100).toFixed(1) : null;
                return (
                  <motion.tr key={row.month + i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-xs font-semibold text-white/60">{row.month}</td>
                    <td className="px-5 py-3 text-xs text-white/50">{row.orders}</td>
                    <td className="px-5 py-3 text-xs font-bold text-purple-400">₹{Number(row.revenue).toLocaleString()}</td>
                    <td className="px-5 py-3 text-xs text-white/50">
                      {row.orders > 0 ? `₹${Math.round(Number(row.revenue) / Number(row.orders)).toLocaleString()}` : "—"}
                    </td>
                    <td className="px-5 py-3">
                      {growth !== null && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${Number(growth) >= 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                          {Number(growth) >= 0 ? "+" : ""}{growth}%
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
