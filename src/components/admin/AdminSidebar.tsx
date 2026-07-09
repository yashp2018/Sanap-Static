import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ShoppingCart, Users, Leaf, Package, BarChart3,
  Settings, LogOut, X, Menu, Sprout, Layers, AlertTriangle,
  TrendingUp, ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/S-LOGO.png";

const NAV = [
  { id: "dashboard",  label: "Dashboard",  icon: LayoutDashboard, group: "main" },
  { id: "orders",     label: "Orders",     icon: ShoppingCart,    group: "main", badge: "12" },
  { id: "customers",  label: "Customers",  icon: Users,           group: "main" },
  { id: "categories", label: "Categories", icon: Layers,          group: "catalog" },
  { id: "crops",      label: "Crops",      icon: Leaf,            group: "catalog" },
  { id: "varieties",  label: "Varieties",  icon: Sprout,          group: "catalog" },
  { id: "inventory",  label: "Inventory",  icon: Package,         group: "catalog", badge: "3" },
  { id: "analytics",  label: "Analytics",  icon: TrendingUp,      group: "reports" },
  { id: "reports",    label: "Reports",    icon: BarChart3,       group: "reports" },
  { id: "settings",   label: "Settings",   icon: Settings,        group: "system" },
];

const GROUPS: Record<string, string> = {
  main: "MAIN MENU",
  catalog: "CATALOG",
  reports: "ANALYTICS",
  system: "SYSTEM",
};

interface AdminSidebarProps {
  active: string;
  setActive: (id: string) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  onLogout: () => void;
}

export default function AdminSidebar({
  active, setActive, collapsed, setCollapsed, mobileOpen, setMobileOpen, onLogout,
}: AdminSidebarProps) {

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => {
    const groups = [...new Set(NAV.map(n => n.group))];
    return (
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/5 ${collapsed && !mobile ? "justify-center" : ""}`}>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
              <img src={logo} alt="Sanap" className="relative w-9 h-9 rounded-xl" />
            </div>
            {(!collapsed || mobile) && (
              <div>
                <p className="text-sm font-bold text-white leading-tight">Sanap Admin</p>
                <p className="text-[10px] text-white/40">Hi-Tech Nursery ERP</p>
              </div>
            )}
          </Link>
          {!mobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="ml-auto p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all"
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${collapsed ? "" : "rotate-180"}`} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5 scrollbar-hide">
          {groups.map(group => (
            <div key={group}>
              {(!collapsed || mobile) && (
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.15em] px-3 pt-4 pb-2">
                  {GROUPS[group]}
                </p>
              )}
              {collapsed && !mobile && <div className="my-2 border-t border-white/5" />}
              {NAV.filter(n => n.group === group).map(item => (
                <motion.button
                  key={item.id}
                  onClick={() => { setActive(item.id); setMobileOpen(false); }}
                  whileHover={{ x: collapsed && !mobile ? 0 : 3 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                    ${collapsed && !mobile ? "justify-center" : ""}
                    ${active === item.id
                      ? "bg-purple-500/20 text-purple-300"
                      : "text-white/40 hover:text-white/80 hover:bg-white/5"
                    }`}
                  title={collapsed && !mobile ? item.label : undefined}
                >
                  {active === item.id && (
                    <>
                      <motion.div
                        layoutId="adminActiveNav"
                        className="absolute inset-0 rounded-xl bg-purple-500/10 border border-purple-500/20"
                        style={{ zIndex: -1 }}
                      />
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-purple-400 rounded-full" />
                    </>
                  )}
                  <item.icon className={`w-4.5 h-4.5 shrink-0 ${active === item.id ? "text-purple-400" : ""}`} style={{ width: 18, height: 18 }} />
                  {(!collapsed || mobile) && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="w-5 h-5 bg-purple-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && !mobile && item.badge && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
                  )}
                </motion.button>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-white/5">
          <motion.button
            onClick={onLogout}
            whileHover={{ x: collapsed && !mobile ? 0 : 3 }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium ${collapsed && !mobile ? "justify-center" : ""}`}
          >
            <LogOut style={{ width: 18, height: 18 }} className="shrink-0" />
            {(!collapsed || mobile) && <span>Logout</span>}
          </motion.button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#111827] border border-white/10 text-white rounded-xl flex items-center justify-center shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-[#111827] border-r border-white/5 shadow-2xl"
          >
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-white/30 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent mobile />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.div
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="hidden lg:flex flex-col shrink-0 bg-[#111827] border-r border-white/5 min-h-screen sticky top-0 overflow-hidden"
      >
        <SidebarContent />
      </motion.div>
    </>
  );
}
