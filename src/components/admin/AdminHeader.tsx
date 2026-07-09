import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Sun, Moon, ShoppingCart, AlertTriangle, UserPlus, CreditCard, X } from "lucide-react";

const NOTIFS = [
  { id: 1, type: "order",   icon: ShoppingCart, color: "text-purple-400", bg: "bg-purple-500/10", title: "New Order Received",       desc: "SN-3011 from Deepak Nair — ₹28,000",    time: "2m ago",  unread: true  },
  { id: 2, type: "payment", icon: CreditCard,   color: "text-blue-400",   bg: "bg-blue-500/10",   title: "Payment Confirmed",          desc: "₹39,000 received for SN-3003",           time: "15m ago", unread: true  },
  { id: 3, type: "stock",   icon: AlertTriangle,color: "text-amber-400",  bg: "bg-amber-500/10",  title: "Low Stock Alert",            desc: "Sai-22 Tomato — only 3,200 plants left", time: "1h ago",  unread: true  },
  { id: 4, type: "user",    icon: UserPlus,     color: "text-green-400",  bg: "bg-green-500/10",  title: "New Customer Registered",    desc: "Kavita Shinde joined from Ahmednagar",   time: "3h ago",  unread: false },
  { id: 5, type: "stock",   icon: AlertTriangle,color: "text-amber-400",  bg: "bg-amber-500/10",  title: "Out of Stock",               desc: "Comandar Brinjal — 0 plants remaining",  time: "5h ago",  unread: false },
];

interface AdminHeaderProps { adminName: string; }

export default function AdminHeader({ adminName }: AdminHeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [dark, setDark]           = useState(true);
  const unread = NOTIFS.filter(n => n.unread).length;
  const today  = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="flex items-center gap-3 px-4 md:px-6 py-3.5 bg-[#0B1020]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
      {/* Search */}
      <div className="relative flex-1 max-w-md hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input
          type="text"
          placeholder="Search orders, customers, varieties..."
          className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/8 rounded-xl text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Date */}
        <span className="hidden md:block text-xs text-white/30 font-medium">{today}</span>

        {/* Theme toggle */}
        <button
          onClick={() => setDark(v => !v)}
          className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
        >
          {dark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
                {unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <p className="text-sm font-bold text-white">Notifications</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-purple-400 font-semibold cursor-pointer hover:text-purple-300">Mark all read</span>
                      <button onClick={() => setNotifOpen(false)} className="text-white/30 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {NOTIFS.map(n => (
                      <div key={n.id} className={`flex gap-3 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/3 ${n.unread ? "bg-purple-500/5" : ""}`}>
                        <div className={`w-8 h-8 rounded-xl ${n.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <n.icon className={`w-4 h-4 ${n.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <p className="text-xs font-semibold text-white/80">{n.title}</p>
                            <span className="text-[10px] text-white/20 whitespace-nowrap">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-white/40 mt-0.5 truncate">{n.desc}</p>
                        </div>
                        {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Admin avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-white/8 ml-1">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 rounded-xl blur-sm opacity-40" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {adminName?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-white/80 leading-tight">{adminName}</p>
            <p className="text-[10px] text-white/30">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
