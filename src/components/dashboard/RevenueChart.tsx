import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import type { ApiOrder } from "@/services/api";

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const PIE_COLORS = ["#6366f1","#8b5cf6","#f59e0b","#ec4899","#10b981","#3b82f6","#ef4444"];

interface RevenueChartProps { orders: ApiOrder[]; }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-3">
      <p className="text-xs font-bold text-gray-600 mb-1">{label}</p>
      <p className="text-sm font-bold text-indigo-600">₹{Number(payload[0].value).toLocaleString()}</p>
      <p className="text-xs text-gray-400">{payload[0].payload.orders} orders</p>
    </div>
  );
};

export default function RevenueChart({ orders }: RevenueChartProps) {
  // Monthly revenue — last 8 months
  const barData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 8 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 7 + i, 1);
      const month = MONTH_LABELS[d.getMonth()];
      const yr = d.getFullYear();
      const mo = d.getMonth();
      const slice = orders.filter(o => {
        const od = new Date(o.created_at);
        return od.getFullYear() === yr && od.getMonth() === mo;
      });
      return {
        month,
        orders: slice.length,
        amount: slice.reduce((s, o) => s + Number(o.total_amount), 0),
      };
    });
  }, [orders]);

  // Crop breakdown from order items
  const pieData = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o =>
      o.items?.forEach(item => {
        const crop = item.crop_name || "Other";
        map[crop] = (map[crop] || 0) + Number(item.line_total);
      })
    );
    const total = Object.values(map).reduce((s, v) => s + v, 0) || 1;
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value], i) => ({
        name,
        value: Math.round((value / total) * 100),
        color: PIE_COLORS[i % PIE_COLORS.length],
      }));
  }, [orders]);

  const hasData = orders.length > 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="xl:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
      >
        <div className="mb-6">
          <h3 className="font-bold text-gray-800">Revenue</h3>
          <p className="text-xs text-gray-400">Last 8 months</p>
        </div>
        {hasData ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barSize={28}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9ca3af" }} tickFormatter={v => `₹${v / 1000}K`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6", radius: 8 }} />
              <Bar dataKey="amount" fill="url(#barGrad)" radius={[8, 8, 0, 0]} animationDuration={1200} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">No order data yet</div>
        )}
      </motion.div>

      {/* Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
      >
        <div className="mb-4">
          <h3 className="font-bold text-gray-800">By Crop</h3>
          <p className="text-xs text-gray-400">Spend breakdown</p>
        </div>
        {pieData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" animationDuration={1200}>
                  {pieData.map((_, i) => <Cell key={i} fill={pieData[i].color} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [`${v}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-gray-600">{d.name}</span>
                  </div>
                  <span className="font-semibold text-gray-700">{d.value}%</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-[160px] flex items-center justify-center text-gray-400 text-sm">No data yet</div>
        )}
      </motion.div>
    </div>
  );
}
