import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from "recharts";
import { Users, TrendingUp, Repeat, Star } from "lucide-react";
import { fetchDashboard, fetchAdminCustomers, type AdminDashboard, type AdminCustomer } from "@/components/admin/adminData";
import { toast } from "sonner";

const PIE_COLORS = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#6B7280"];

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a2235] border border-white/10 rounded-xl p-3 shadow-2xl">
      <p className="text-[10px] font-bold text-white/40 mb-1.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs font-semibold" style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      fetchDashboard().then(r => setDashboard(r.data)),
      fetchAdminCustomers().then(r => setCustomers(r.data)),
    ])
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-white/40 text-sm p-8">Loading analytics...</div>;
  if (!dashboard) return <div className="text-red-400 text-sm p-8">Failed to load analytics.</div>;

  const { stats, monthly, cropSales } = dashboard;

  const totalCustomers = customers.length;
  const returningPct   = totalCustomers
    ? Math.round((customers.filter(c => c.total_orders > 1).length / totalCustomers) * 100)
    : 0;
  const totalSpent  = customers.reduce((s, c) => s + Number(c.total_spent), 0);
  const totalOrders = customers.reduce((s, c) => s + Number(c.total_orders), 0);
  const avgOrderValue = totalOrders ? Math.round(totalSpent / totalOrders) : 0;
  const topCustomers  = [...customers].sort((a, b) => Number(b.total_spent) - Number(a.total_spent)).slice(0, 5);

  const pieData = cropSales.map((c, i) => ({
    name: c.crop_name,
    value: Number(c.total_plants),
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));
  const totalPiePlants = pieData.reduce((s, d) => s + d.value, 0);
  const piePercent = pieData.map(d => ({ ...d, pct: totalPiePlants ? Math.round((d.value / totalPiePlants) * 100) : 0 }));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Customers",  value: totalCustomers,  suffix: "",  icon: Users,      color: "from-purple-500 to-purple-700" },
          { label: "Returning Rate",   value: returningPct,    suffix: "%", icon: Repeat,     color: "from-blue-500 to-blue-700"     },
          { label: "Avg Order Value",  value: avgOrderValue,   suffix: "",  prefix: "₹",      icon: TrendingUp, color: "from-emerald-500 to-emerald-700" },
          { label: "Top Spender",      value: topCustomers[0] ? Number(topCustomers[0].total_spent) : 0, suffix: "", prefix: "₹", icon: Star, color: "from-amber-500 to-amber-700" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg`}>
              <s.icon className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <p className="text-2xl font-bold text-white">
              {(s as any).prefix ?? ""}{typeof s.value === "number" && s.value >= 1000 ? `${(s.value / 1000).toFixed(0)}K` : s.value}{s.suffix}
            </p>
            <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue trend + crop breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
          <div className="mb-5">
            <h3 className="text-sm font-bold text-white">Revenue Trend</h3>
            <p className="text-xs text-white/30 mt-0.5">Monthly revenue & order count</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} />
              <YAxis yAxisId="rev" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} tickFormatter={v => `₹${v / 1000}K`} />
              <YAxis yAxisId="ord" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }} />
              <Line yAxisId="rev" type="monotone" dataKey="revenue" name="Revenue" stroke="#8B5CF6" strokeWidth={2} dot={false} animationDuration={1500} />
              <Line yAxisId="ord" type="monotone" dataKey="orders"  name="Orders"  stroke="#3B82F6" strokeWidth={2} dot={false} animationDuration={1500} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white">Sales by Crop</h3>
            <p className="text-xs text-white/30 mt-0.5">Plants share</p>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={piePercent} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" animationDuration={1200}>
                {piePercent.map((_, i) => <Cell key={i} fill={piePercent[i].color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1a2235", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 11 }} formatter={(v: any) => [Number(v).toLocaleString() + " plants", ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {piePercent.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-white/40">{d.name}</span>
                </div>
                <span className="font-bold text-white/60">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top customers */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" /> Top Customers
          </h3>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {topCustomers.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
              <span className="text-xs font-bold text-white/20 w-4">#{i + 1}</span>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center text-xs font-bold text-purple-300">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-white/70">{c.name}</p>
                <p className="text-[10px] text-white/30">{c.total_orders} orders</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-purple-400">₹{Number(c.total_spent).toLocaleString()}</p>
                <p className="text-[10px] text-white/30">total spent</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
