import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, ShoppingBag, Bell, Settings, LogOut, X, Menu, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/S-LOGO.png";

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "orders",    icon: ShoppingBag,     label: "Orders" },
  { id: "profile",   icon: User,            label: "Profile" },
  { id: "notifications", icon: Bell,        label: "Notifications" },
  { id: "settings",  icon: Settings,        label: "Settings" },
];

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  onLogout: () => void;
  unreadNotifs?: number;
}

export default function Sidebar({ active, setActive, mobileOpen, setMobileOpen, onLogout, unreadNotifs = 0 }: SidebarProps) {
  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6 px-3">
      {/* Logo — click to go back to main site */}
      <Link to="/" className="flex items-center gap-3 px-3 mb-10 group" title="Back to website">
        <img src={logo} alt="Sanap" className="w-10 h-10 rounded-xl shadow-lg group-hover:scale-105 transition-transform" />
        <div className="hidden lg:block">
          <p className="text-xs font-bold text-white/90 leading-tight">Sanap Hi-Tech</p>
          <p className="text-[10px] text-white/50 flex items-center gap-1">
            <ArrowLeft className="w-2.5 h-2.5" /> Back to site
          </p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => { setActive(item.id); setMobileOpen(false); }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
            className={`relative w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium transition-all group ${
              active === item.id
                ? "bg-white text-indigo-600 shadow-lg shadow-white/20"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            {active === item.id && (
              <motion.div layoutId="activeNav" className="absolute inset-0 bg-white rounded-2xl" style={{ zIndex: -1 }} />
            )}
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="hidden lg:block">{item.label}</span>
            {item.id === "notifications" && unreadNotifs > 0 && (
              <span className="ml-auto hidden lg:flex w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full items-center justify-center">{unreadNotifs}</span>
            )}
          </motion.button>
        ))}
      </nav>

      {/* Logout */}
      <motion.button
        onClick={onLogout}
        whileHover={{ x: 4 }}
        className="flex items-center gap-3 px-3 py-3 rounded-2xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
      >
        <LogOut className="w-5 h-5 shrink-0" />
        <span className="hidden lg:block">Logout</span>
      </motion.button>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-gradient-to-b from-indigo-600 to-purple-700 shadow-2xl"
          >
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-20 xl:w-64 shrink-0 bg-gradient-to-b from-indigo-600 via-indigo-700 to-purple-800 min-h-screen sticky top-0 shadow-2xl shadow-indigo-900/30">
        <SidebarContent />
      </div>
    </>
  );
}
