import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, Package, Truck, CheckCircle, XCircle, CreditCard, Info } from "lucide-react";
import type { ApiOrder } from "@/services/api";

interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  unread: boolean;
  orderNumber?: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30)  return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function buildNotifications(orders: ApiOrder[]): Notification[] {
  const notifs: Notification[] = [];

  orders.forEach(o => {
    const base = { orderNumber: o.order_number, unread: true };

    if (o.order_status === "delivered") {
      notifs.push({ ...base, id: `del-${o.id}`, title: "Order Delivered!", desc: `Your order #${o.order_number} has been delivered successfully.`, time: timeAgo(o.created_at), icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" });
    } else if (o.order_status === "shipped") {
      notifs.push({ ...base, id: `ship-${o.id}`, title: "Order Shipped", desc: `Order #${o.order_number} is on the way to you.`, time: timeAgo(o.created_at), icon: Truck, color: "text-purple-600", bg: "bg-purple-100" });
    } else if (o.order_status === "confirmed") {
      notifs.push({ ...base, id: `conf-${o.id}`, title: "Order Confirmed", desc: `Order #${o.order_number} has been confirmed by our team.`, time: timeAgo(o.created_at), icon: Package, color: "text-blue-600", bg: "bg-blue-100" });
    } else if (o.order_status === "pending") {
      notifs.push({ ...base, id: `pend-${o.id}`, title: "Order Placed", desc: `Order #${o.order_number} received. We'll confirm shortly.`, time: timeAgo(o.created_at), icon: Package, color: "text-yellow-600", bg: "bg-yellow-100" });
    } else if (o.order_status === "cancelled") {
      notifs.push({ ...base, id: `can-${o.id}`, title: "Order Cancelled", desc: `Order #${o.order_number} has been cancelled.`, time: timeAgo(o.created_at), icon: XCircle, color: "text-red-500", bg: "bg-red-100", unread: false });
    }

    if (o.payment_status === "paid") {
      notifs.push({ ...base, id: `pay-${o.id}`, title: "Payment Confirmed", desc: `Payment of ₹${Number(o.total_amount).toLocaleString()} received for #${o.order_number}.`, time: timeAgo(o.created_at), icon: CreditCard, color: "text-indigo-600", bg: "bg-indigo-100" });
    }
  });

  // Sort newest first (by order id desc as proxy)
  return notifs.sort((a, b) => {
    const ai = parseInt(a.id.split("-")[1]);
    const bi = parseInt(b.id.split("-")[1]);
    return bi - ai;
  });
}

interface NotificationsPageProps { orders: ApiOrder[]; }

export default function NotificationsPage({ orders }: NotificationsPageProps) {
  const allNotifs = useMemo(() => buildNotifications(orders), [orders]);
  const [read, setRead] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const markAllRead = () => setRead(new Set(allNotifs.map(n => n.id)));
  const markRead    = (id: string) => setRead(prev => new Set([...prev, id]));

  const displayed = allNotifs.filter(n => filter === "all" || !read.has(n.id));
  const unreadCount = allNotifs.filter(n => !read.has(n.id)).length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <Bell className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Notifications</h2>
            <p className="text-xs text-gray-400">{unreadCount} unread</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            {(["all", "unread"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${filter === f ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                {f}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors">
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Bell className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-medium">No notifications</p>
            <p className="text-xs mt-1">You're all caught up!</p>
          </div>
        ) : (
          <AnimatePresence>
            {displayed.map((n, i) => {
              const isUnread = !read.has(n.id);
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10, height: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => markRead(n.id)}
                  className={`flex items-start gap-4 px-6 py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${isUnread ? "bg-indigo-50/30" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-2xl ${n.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <n.icon className={`w-5 h-5 ${n.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold ${isUnread ? "text-gray-800" : "text-gray-600"}`}>{n.title}</p>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.desc}</p>
                    {n.orderNumber && (
                      <span className="inline-block mt-1.5 text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        #{n.orderNumber}
                      </span>
                    )}
                  </div>
                  {isUnread && <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2" />}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Empty orders state */}
      {orders.length === 0 && (
        <div className="bg-indigo-50 rounded-3xl p-6 flex items-start gap-4">
          <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-indigo-800">No orders yet</p>
            <p className="text-xs text-indigo-600 mt-0.5">Notifications will appear here once you place your first order.</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
