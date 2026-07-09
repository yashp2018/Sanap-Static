import { motion } from "framer-motion";
import { MapPin, Download, MessageCircle, RefreshCw, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  { icon: MapPin,        label: "Track Order",       desc: "Real-time tracking",    color: "from-indigo-500 to-purple-600", link: "/dashboard" },
  { icon: Download,      label: "Download Invoice",  desc: "PDF invoice",           color: "from-blue-500 to-cyan-500",     link: "/dashboard" },
  { icon: MessageCircle, label: "Contact Support",   desc: "WhatsApp / Call",       color: "from-green-500 to-emerald-600", link: "/contact"   },
  { icon: RefreshCw,     label: "Reorder",           desc: "Repeat last order",     color: "from-orange-400 to-pink-500",   link: "/products"  },
];

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((a, i) => (
          <motion.div key={a.label} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
            <Link to={a.link} className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all group">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow-md`}>
                <a.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{a.label}</p>
                <p className="text-[10px] text-gray-400">{a.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

interface ProfileCardProps {
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
}

export function ProfileCard({ name, phone, email, totalOrders }: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 shadow-lg text-white relative overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full blur-xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold shadow-lg border border-white/30">
            {name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-white text-lg leading-tight">{name}</p>
            <p className="text-white/60 text-xs">{phone}</p>
            {email && <p className="text-white/50 text-[10px] truncate max-w-[140px]">{email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
            <p className="text-2xl font-bold text-white">{totalOrders}</p>
            <p className="text-white/60 text-xs">Total Orders</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
            <p className="text-2xl font-bold text-white">🌱</p>
            <p className="text-white/60 text-xs">Loyal Farmer</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full">
          ⭐ Premium Customer
        </div>

        <Link to="/products" className="mt-4 flex items-center justify-between bg-white/10 hover:bg-white/20 transition-all rounded-2xl px-4 py-3 group">
          <span className="text-sm font-semibold text-white">Place New Order</span>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
