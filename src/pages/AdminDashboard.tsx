import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader  from "@/components/admin/AdminHeader";

import AdminOverview      from "@/pages/admin/AdminOverview";
import ManageOrders       from "@/pages/admin/ManageOrders";
import ManageCustomers    from "@/pages/admin/ManageCustomers";
import ManageCategories   from "@/pages/admin/ManageCategories";
import ManageCrops        from "@/pages/admin/ManageCrops";
import ManageVarieties    from "@/pages/admin/ManageVarieties";
import Inventory          from "@/pages/admin/Inventory";
import Analytics          from "@/pages/admin/Analytics";
import Reports            from "@/pages/admin/Reports";
import AdminSettings      from "@/pages/admin/AdminSettings";

const PAGE_META: Record<string, { title: string; desc: string }> = {
  dashboard:  { title: "Dashboard",          desc: "Welcome back! Here's your business overview." },
  orders:     { title: "Order Management",   desc: "View, update and manage all customer orders." },
  customers:  { title: "Customers",          desc: "Manage your customer base and activity." },
  categories: { title: "Categories",         desc: "Manage product categories." },
  crops:      { title: "Crop Management",    desc: "Add, edit and manage all crops." },
  varieties:  { title: "Variety Management", desc: "Manage all plant varieties, pricing and stock." },
  inventory:  { title: "Inventory",          desc: "Monitor stock levels and inventory alerts." },
  analytics:  { title: "Analytics",          desc: "Customer participation and engagement insights." },
  reports:    { title: "Reports",            desc: "Sales, revenue and performance reports." },
  settings:   { title: "Settings",           desc: "Configure your admin panel and preferences." },
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [active, setActive]         = useState("dashboard");
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => { await logout(); navigate("/"); };

  const meta = PAGE_META[active] ?? PAGE_META.dashboard;

  const renderPage = () => {
    switch (active) {
      case "dashboard":  return <AdminOverview />;
      case "orders":     return <ManageOrders />;
      case "customers":  return <ManageCustomers />;
      case "categories": return <ManageCategories />;
      case "crops":      return <ManageCrops />;
      case "varieties":  return <ManageVarieties />;
      case "inventory":  return <Inventory />;
      case "analytics":  return <Analytics />;
      case "reports":    return <Reports />;
      case "settings":   return <AdminSettings />;
      default:           return <AdminOverview />;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#0B1020" }}>
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/6 rounded-full blur-3xl" />
      </div>

      <AdminSidebar
        active={active}
        setActive={setActive}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <AdminHeader adminName={user?.name ?? "Admin"} />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {/* Page header */}
          <motion.div
            key={active + "-header"}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-xl font-bold text-white">{meta.title}</h1>
            <p className="text-xs text-white/30 mt-0.5">{meta.desc}</p>
          </motion.div>

          {/* Page content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
