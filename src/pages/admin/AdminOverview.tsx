import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart, Users, TrendingUp, Package, Clock, AlertTriangle,
  ArrowUpRight, ArrowDownRight, IndianRupee, Sprout,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { useCountUp } from "@/hooks/useCountUp";
import { fetchDashboard, type AdminDashboard } from "@/components/admin/adminData";

const PIE_COLORS = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#6B7280"];

function GlassCard({ children, className = "", glow = "" }: { children: React.ReactNode; className?: string; glow?: string }) {
  return (
    <div className={`relative bg-white/[0.03] border border-white/[0.08] rounded-2xl backdrop-blur-sm overflow-hidden ${className}`}>
      {glow && <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${glow}`} />}
      {children}
    </div>
  );
}

function StatCard({ label, value, prefix = "", suffix = "", change, up, icon: Icon, gradient, delay }: {
  label: string; value: number; prefix?: string; suffix?: string;
  change: string; up: boolean; icon: any; gradient: string; delay: number;
}) {
  const { count, ref } = useCountUp(value);
  const display = value >= 100000
    ? `${prefix}${(count / 100000).toFixed(1)}L`
    : value >= 1000
    ? `${prefix}${(count / 1000).toFixed(0)}K`
    : `${prefix}${count}${suffix}`;

  return (
    <motion.div
      ref={ref as any}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 overflow-hidden group cursor-pointer"
    >
      <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${gradient}`} />
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${up ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
          {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{display}</p>
      <p className="text-xs text-white/40">{label}</p>
    </motion.div>
  );
}

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a2235] border border-white/10 rounded-xl p-3 shadow-2xl">
      <p className="text-xs font-bold text-white/60 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
          {p.name === "revenue" ? `₹${Number(p.value).toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function AdminOverview() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard()
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-white/40 text-sm p-8">Loading dashboard...</div>;
  if (!data) return <div className="text-red-400 text-sm p-8">Failed to load dashboard.</div>;

  const { stats, monthly, cropSales, lowStock } = data;

  const statCards = [
    { label: "Total Orders",     value: Number(stats.total_orders),     prefix: "",  change: "", up: true,  icon: ShoppingCart,  gradient: "from-purple-500 to-purple-700",  delay: 0    },
    { label: "Total Revenue",    value: Number(stats.total_revenue),    prefix: "₹", change: "", up: true,  icon: IndianRupee,   gradient: "from-blue-500 to-blue-700",      delay: 0.05 },
    { label: "Total Customers",  value: Number(stats.total_customers),  prefix: "",  change: "", up: true,  icon: Users,         gradient: "from-emerald-500 to-emerald-700",delay: 0.1  },
    { label: "Active Varieties", value: Number(stats.active_varieties), prefix: "",  change: "", up: true,  icon: Sprout,        gradient: "from-pink-500 to-pink-700",       delay: 0.15 },
    { label: "Pending Orders",   value: Number(stats.pending_orders),   prefix: "",  change: "", up: false, icon: Clock,         gradient: "from-amber-500 to-amber-700",     delay: 0.2  },
    { label: "Low Stock",        value: Number(stats.low_stock_count),  prefix: "",  change: "", up: false, icon: AlertTriangle, gradient: "from-red-500 to-red-700",         delay: 0.25 },
  ];

  const pieData = cropSales.map((c, i) => ({
    name: c.crop_name,
    value: Number(c.total_plants),
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));
  const totalPiePlants = pieData.reduce((s, d) => s + d.value, 0);
  const piePercent = pieData.map(d => ({ ...d, pct: totalPiePlants ? Math.round((d.value / totalPiePlants) * 100) : 0 }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <GlassCard className="xl:col-span-2 p-5" glow="bg-purple-500">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">Revenue Overview</h3>
              <p className="text-xs text-white/30 mt-0.5">Last 12 months</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} tickFormatter={v => `₹${v / 1000}K`} />
              <Tooltip content={<ChartTooltip />} />
              <Area dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} fill="url(#revGrad)" animationDuration={1500} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5" glow="bg-blue-500">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white">Sales by Crop</h3>
            <p className="text-xs text-white/30 mt-0.5">Plants distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={piePercent} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" animationDuration={1200}>
                {piePercent.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [Number(v).toLocaleString() + " plants", ""]} contentStyle={{ background: "#1a2235", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {piePercent.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-white/50">{d.name}</span>
                </div>
                <span className="font-bold text-white/70">{d.pct}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <GlassCard className="xl:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h3 className="text-sm font-bold text-white">Revenue by Month</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Month", "Orders", "Revenue"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-semibold text-white/20 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthly.slice(-5).map((row, i) => (
                  <motion.tr
                    key={row.month + i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-5 py-3 text-xs font-bold text-purple-400">{row.month}</td>
                    <td className="px-5 py-3 text-xs text-white/50">{row.orders}</td>
                    <td className="px-5 py-3 text-xs font-bold text-white/70">₹{Number(row.revenue).toLocaleString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Low Stock Alerts</h3>
          </div>
          <div className="space-y-3">
            {lowStock.length === 0 && <p className="text-xs text-white/30">All stock levels healthy.</p>}
            {lowStock.map(v => (
              <div key={v.id} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/5">
                <div>
                  <p className="text-xs font-semibold text-white/70">{v.name}</p>
                  <p className="text-[10px] text-white/30">{v.crop_name} · {v.stock.toLocaleString()} left</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${v.stock === 0 ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>
                  {v.stock === 0 ? "Out" : "Low"}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    confirmed:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
    processing: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    shipped:    "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    delivered:  "bg-green-500/10 text-green-400 border-green-500/20",
    cancelled:  "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border capitalize ${map[status] ?? map.pending}`}>
      <span className="w-1 h-1 rounded-full bg-current" />
      {status}
    </span>
  );
}
