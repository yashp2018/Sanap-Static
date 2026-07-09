import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { getOrders, type ApiOrder } from "@/services/api";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

// Dashboard home
import StatsCards from "@/components/dashboard/StatsCards";
import RevenueChart from "@/components/dashboard/RevenueChart";
import OrdersTable from "@/components/dashboard/OrdersTable";
import { QuickActions, ProfileCard } from "@/components/dashboard/QuickActions";

// Inner pages
import OrdersPage from "@/components/dashboard/OrdersPage";
import ProfilePage from "@/components/dashboard/ProfilePage";
import NotificationsPage from "@/components/dashboard/NotificationsPage";
import SettingsPage from "@/components/dashboard/SettingsPage";

const PAGE_TITLES: Record<string, string> = {
  dashboard:     "Dashboard",
  orders:        "My Orders",
  profile:       "My Profile",
  notifications: "Notifications",
  settings:      "Settings",
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [active, setActive]         = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [orders, setOrders]         = useState<ApiOrder[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    getOrders()
      .then(r => setOrders(r.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => { await logout(); navigate("/"); };

  // Unread notifications = orders with active statuses (not cancelled)
  const unreadNotifs = useMemo(
    () => orders.filter(o => o.order_status !== "cancelled").length,
    [orders]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-screen bg-gray-50"
    >
      <Sidebar
        active={active}
        setActive={setActive}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
        unreadNotifs={unreadNotifs}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header userName={user?.name ?? "User"} />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-800">{PAGE_TITLES[active]}</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {active === "dashboard" && "Welcome back! Here's your overview."}
              {active === "orders" && "Track and manage all your orders."}
              {active === "profile" && "Manage your personal information."}
              {active === "notifications" && "Stay updated on your order activity."}
              {active === "settings" && "Customize your account preferences."}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* ── Dashboard home ── */}
              {active === "dashboard" && (
                <motion.div key="dashboard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
                  <StatsCards orders={orders} />
                  <RevenueChart orders={orders} />
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2">
                      <OrdersTable orders={orders} onViewOrder={() => setActive("orders")} userName={user?.name ?? ""} userPhone={user?.phone ?? ""} />
                    </div>
                    <div className="flex flex-col gap-6">
                      <QuickActions />
                      <ProfileCard
                        name={user?.name ?? "User"}
                        phone={user?.phone ?? ""}
                        email={user?.email}
                        totalOrders={orders.length}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Orders page ── */}
              {active === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <OrdersPage
                    orders={orders}
                    onOrdersChange={setOrders}
                    userName={user?.name ?? ""}
                    userPhone={user?.phone ?? ""}
                  />
                </motion.div>
              )}

              {/* ── Profile page ── */}
              {active === "profile" && user && (
                <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <ProfilePage user={user} orders={orders} />
                </motion.div>
              )}

              {/* ── Notifications page ── */}
              {active === "notifications" && (
                <motion.div key="notifications" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <NotificationsPage orders={orders} />
                </motion.div>
              )}

              {/* ── Settings page ── */}
              {active === "settings" && (
                <motion.div key="settings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <SettingsPage onLogout={handleLogout} />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>
      </div>
    </motion.div>
  );
}
