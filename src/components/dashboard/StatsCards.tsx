import { motion } from "framer-motion";
import { ShoppingBag, Clock, CheckCircle, IndianRupee, TrendingUp, TrendingDown } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import type { ApiOrder } from "@/services/api";

interface StatsCardsProps { orders: ApiOrder[]; }

export default function StatsCards({ orders }: StatsCardsProps) {
  const total     = orders.length;
  const pending   = orders.filter(o => !["delivered", "cancelled"].includes(o.order_status)).length;
  const delivered = orders.filter(o => o.order_status === "delivered").length;
  const spent     = orders.reduce((s, o) => s + Number(o.total_amount), 0);

  const stats = [
    { label: "Total Orders",   value: total,   prefix: "",  gradient: "from-indigo-500 to-purple-600", bg: "bg-indigo-50",  iconColor: "text-indigo-600", icon: ShoppingBag,   up: true  },
    { label: "Active Orders",  value: pending, prefix: "",  gradient: "from-orange-400 to-pink-500",   bg: "bg-orange-50",  iconColor: "text-orange-500", icon: Clock,         up: false },
    { label: "Delivered",      value: delivered, prefix: "", gradient: "from-green-400 to-emerald-600", bg: "bg-green-50",  iconColor: "text-green-600",  icon: CheckCircle,   up: true  },
    { label: "Total Spent",    value: spent,   prefix: "₹", gradient: "from-blue-500 to-cyan-500",     bg: "bg-blue-50",   iconColor: "text-blue-600",   icon: IndianRupee,   up: true  },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
    </div>
  );
}

function StatCard({ stat, index }: { stat: ReturnType<typeof buildStat>; index: number }) {
  const { count, ref } = useCountUp(stat.value);
  const display = stat.value >= 1000
    ? `${stat.prefix}${(count / 1000).toFixed(0)}K`
    : `${stat.prefix}${count}`;

  return (
    <motion.div
      ref={ref as any}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)" }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 cursor-pointer relative overflow-hidden group"
    >
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-2xl ${stat.bg} flex items-center justify-center`}>
          <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
        </div>
        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
          {stat.up ? <TrendingUp className="w-3.5 h-3.5 text-white" /> : <TrendingDown className="w-3.5 h-3.5 text-white" />}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-800 mb-1">{display}</p>
      <p className="text-sm text-gray-500">{stat.label}</p>
    </motion.div>
  );
}

// helper only used for type inference
function buildStat(s: { label: string; value: number; prefix: string; gradient: string; bg: string; iconColor: string; icon: any; up: boolean }) { return s; }
