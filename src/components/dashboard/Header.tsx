import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Settings, ChevronDown } from "lucide-react";

const notifications = [
  { id: 1, title: "Order Delivered!", desc: "Your Tomato order #SN-2401 has been delivered.", time: "2m ago", color: "bg-green-500", unread: true },
  { id: 2, title: "Payment Confirmed", desc: "Payment of ₹18,500 received for order #SN-2398.", time: "1h ago", color: "bg-blue-500", unread: true },
  { id: 3, title: "Order Shipped", desc: "Chilli order #SN-2395 is on the way.", time: "3h ago", color: "bg-purple-500", unread: true },
  { id: 4, title: "New Variety Available", desc: "Aryaman Tomato now in stock!", time: "1d ago", color: "bg-orange-500", unread: false },
];

interface HeaderProps { userName: string; }

export default function Header({ userName }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = notifications.filter(n => n.unread).length;

  const today = new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="flex items-center gap-4 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
      {/* Search */}
      <div className="relative flex-1 max-w-sm hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search orders, products..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
        />
      </div>

      {/* Date */}
      <p className="hidden md:block text-sm font-semibold text-indigo-600 ml-auto">{today}</p>

      <div className="flex items-center gap-2 ml-auto sm:ml-0">
        {/* Settings */}
        <button className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
          <Settings className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <p className="font-bold text-gray-800 text-sm">Notifications</p>
                  <span className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${n.unread ? "bg-indigo-50/50" : ""}`}>
                      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                        <p className="text-xs text-gray-500 truncate">{n.desc}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 ml-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {userName?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-gray-800 leading-tight">{userName}</p>
            <p className="text-[10px] text-gray-400">Customer</p>
          </div>
          <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
        </div>
      </div>
    </div>
  );
}
