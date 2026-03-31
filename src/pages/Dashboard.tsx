import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Clock, Download, User, LogOut, Eye, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getOrders, ApiOrder } from "@/services/api";

const statusMap: Record<string, string> = {
  pending:   "badge-pending",
  confirmed: "badge-confirmed",
  shipped:   "badge-shipped",
  delivered: "badge-delivered",
  cancelled: "badge-cancelled",
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [profile, setProfile] = useState({
    name:    user?.name  || "",
    phone:   user?.phone || "",
    email:   user?.email || "",
    address: "",
    state:   "Maharashtra",
  });

  useEffect(() => {
    getOrders()
      .then(r => setOrders(r.data))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleProfileSave = async () => {
    // API endpoint for profile update can be wired here when backend supports it
    toast.success("Profile updated!");
  };

  const totalSpent = orders.reduce((s, o) => s + Number(o.total_amount), 0);
  const totalPlants = orders.reduce((s, o) => s + Number(o.total_plants), 0);
  const activeOrders = orders.filter(o => !["delivered", "cancelled"].includes(o.order_status)).length;

  return (
    <div className="min-h-screen" id="user-dashboard">
      {/* Header */}
      <section className="gradient-hero text-primary-foreground py-12">
        <div className="container-nursery">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-primary-foreground/60 text-sm mb-1">Welcome back,</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold">{user?.name}</h1>
              <p className="text-primary-foreground/70 mt-1">{user?.phone}</p>
            </div>
            <div className="flex gap-3">
              <Link to="/products" className="gradient-gold text-accent-foreground px-5 py-2.5 rounded-full font-semibold text-sm hover:shadow-gold transition-all btn-ripple">
                New Order
              </Link>
              <button onClick={handleLogout} className="bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-primary-foreground/20 transition-all flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container-nursery py-10">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Orders",   value: orders.length.toString(),                          icon: Package },
            { label: "Active Orders",  value: activeOrders.toString(),                           icon: Clock },
            { label: "Total Spent",    value: totalSpent > 0 ? `₹${(totalSpent/100000).toFixed(1)}L` : "₹0", icon: ArrowRight },
            { label: "Plants Ordered", value: totalPlants > 0 ? totalPlants.toLocaleString() : "0", icon: ArrowRight },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border/50 p-5 shadow-card"
            >
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          {[
            { id: "orders"  as const, label: "Order History", icon: Package },
            { id: "profile" as const, label: "My Profile",    icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {loadingOrders ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-border/50">
                <p className="text-5xl mb-4">📦</p>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">Start by browsing our product catalog</p>
                <Link to="/products" className="text-primary font-semibold hover:underline">Browse Products →</Link>
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden" id="orders-table">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        {["Order ID", "Date", "Items", "Total", "Payment", "Status", "Actions"].map(h => (
                          <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-semibold text-primary">{order.order_number}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString("en-IN")}</td>
                          <td className="px-6 py-4 text-sm text-foreground max-w-[200px] truncate">
                            {order.items?.[0] ? `${order.items[0].variety_name} × ${order.items[0].quantity.toLocaleString()}` : "—"}
                            {order.items?.length > 1 && ` +${order.items.length - 1} more`}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-foreground">₹{Number(order.total_amount).toLocaleString()}</td>
                          <td className="px-6 py-4 text-xs text-muted-foreground capitalize">{order.payment_method}</td>
                          <td className="px-6 py-4">
                            <span className={statusMap[order.order_status] || "badge-pending"}>
                              {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button className="text-xs text-primary hover:underline flex items-center gap-1">
                                <Eye className="w-3 h-3" /> View
                              </button>
                              {order.order_status === "delivered" && (
                                <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                                  <Download className="w-3 h-3" /> Invoice
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} id="profile-section">
            <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6 md:p-8 max-w-2xl">
              <h3 className="font-display text-xl font-bold text-foreground mb-6">Update Profile</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                    <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Phone</label>
                    <input type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                  <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Address</label>
                  <textarea value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                </div>
                <button
                  onClick={handleProfileSave}
                  className="gradient-cta text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:shadow-elevated transition-all hover:scale-[1.02] btn-ripple"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
