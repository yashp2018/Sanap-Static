import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Clock, User, LogOut, Eye, Download, X,
  MapPin, Phone, Mail, CheckCircle, Printer, XCircle, AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getOrders, cancelOrder, ApiOrder } from "@/services/api";
import logo from "@/assets/S-LOGO.png";

const STATUS_STYLE: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-700 border border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border border-blue-200",
  shipped:   "bg-purple-100 text-purple-700 border border-purple-200",
  delivered: "bg-green-100 text-green-700 border border-green-200",
  cancelled: "bg-red-100 text-red-700 border border-red-200",
};

// ── Cancel Confirmation Dialog ────────────────────────────────
function CancelDialog({
  order, onConfirm, onClose, loading,
}: {
  order: ApiOrder;
  onConfirm: (reason: string) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [reason, setReason] = useState("");
  const reasons = [
    "Changed my mind",
    "Ordered by mistake",
    "Found better price elsewhere",
    "Delivery time too long",
    "Other",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-background rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-destructive/5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h3 className="font-display text-lg font-bold text-foreground">Cancel Order</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Order info */}
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-sm font-semibold text-foreground">Order #{order.order_number}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {order.items?.[0]?.variety_name}{order.items?.length > 1 ? ` +${order.items.length - 1} more` : ""}
            </p>
            <p className="text-sm font-bold text-primary mt-1">₹{Number(order.total_amount).toLocaleString()}</p>
          </div>

          {/* Warning */}
          <p className="text-sm text-muted-foreground">
            Are you sure you want to cancel this order? This action <strong>cannot be undone</strong>.
          </p>

          {/* Reason */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Reason for cancellation *</label>
            <div className="space-y-2">
              {reasons.map(r => (
                <label key={r} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio" name="cancel-reason" value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="w-4 h-4 accent-destructive"
                  />
                  <span className={`text-sm transition-colors ${
                    reason === r ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
                  }`}>{r}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-all"
            >
              Keep Order
            </button>
            <button
              onClick={() => reason && onConfirm(reason)}
              disabled={!reason || loading}
              className="flex-1 py-3 rounded-xl bg-destructive text-white text-sm font-semibold hover:bg-destructive/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Cancelling...</>
              ) : (
                <><XCircle className="w-4 h-4" /> Confirm Cancel</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
function Invoice({ order, user }: { order: ApiOrder; user: any }) {
  const subtotal = order.items.reduce((s, i) => s + Number(i.line_total), 0);

  return (
    <div className="bg-white p-8 rounded-2xl" id="invoice-print">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-primary/20">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Sanap" className="w-16 h-16 rounded-full border-2 border-primary/20" />
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Sanap Hi-Tech Nursery</h2>
            <p className="text-sm text-muted-foreground">Near MUHS, Tal. Dindori, Dist. Nashik - 422 004</p>
            <p className="text-sm text-muted-foreground">+91 74477 70803 · info.sanapnursery@gmail.com</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-display font-bold text-primary">INVOICE</p>
          <p className="text-sm font-semibold text-foreground mt-1">#{order.order_number}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLE[order.order_status] || STATUS_STYLE.pending}`}>
            {order.order_status}
          </span>
        </div>
      </div>

      {/* Bill To */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Bill To</p>
          <p className="font-semibold text-foreground">{user?.name}</p>
          <p className="text-sm text-muted-foreground">{user?.phone}</p>
          {user?.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
        </div>
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Delivery To</p>
          <p className="text-sm text-muted-foreground">{order.delivery_city}, {order.delivery_state}</p>
          <p className="text-sm text-muted-foreground capitalize">Payment: {order.payment_method}</p>
          <p className="text-sm text-muted-foreground capitalize">Status: {order.payment_status}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary/5 rounded-lg">
              <th className="text-left px-4 py-3 font-semibold text-foreground rounded-l-lg">Variety</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Crop</th>
              <th className="text-right px-4 py-3 font-semibold text-foreground">Qty (Plants)</th>
              <th className="text-right px-4 py-3 font-semibold text-foreground">Unit Price</th>
              <th className="text-right px-4 py-3 font-semibold text-foreground">Delivery</th>
              <th className="text-right px-4 py-3 font-semibold text-foreground rounded-r-lg">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => {
              const deliveryCost = Number(item.line_total) - Number(item.unit_price) * Number(item.quantity);
              return (
                <tr key={i} className="border-b border-border/40">
                  <td className="px-4 py-3 font-medium text-foreground">{item.variety_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.crop_name}</td>
                  <td className="px-4 py-3 text-right">{Number(item.quantity).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">₹{Number(item.unit_price).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {deliveryCost > 0 ? `₹${deliveryCost.toLocaleString()}` : "Included"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-primary">₹{Number(item.line_total).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Total Plants</span>
            <span>{Number(order.total_plants).toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-foreground text-base border-t border-border pt-2 mt-2">
            <span>Grand Total</span>
            <span className="text-primary text-lg">₹{Number(order.total_amount).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/40 pt-6 text-center">
        <p className="text-sm text-muted-foreground">Thank you for your order! For queries: <span className="text-primary font-medium">+91 74477 70803</span></p>
        <p className="text-xs text-muted-foreground mt-1">This is a computer-generated invoice. No signature required.</p>
      </div>
    </div>
  );
}

// ── Invoice Component (also used for print) ──────────────────
function OrderModal({ order, user, onClose }: { order: ApiOrder; user: any; onClose: () => void }) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    win.document.write(`
      <html><head><title>Invoice - ${order.order_number}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; padding: 32px; color: #1a1a1a; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px 14px; text-align: left; }
        th { background: #f0fdf4; font-weight: 600; }
        td { border-bottom: 1px solid #e5e7eb; }
        .text-right { text-align: right; }
        .text-primary { color: #16a34a; }
        .text-muted { color: #6b7280; }
        .font-bold { font-weight: 700; }
        img { width: 64px; height: 64px; border-radius: 50%; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #dcfce7; }
        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
        .totals { display: flex; justify-content: flex-end; margin-bottom: 32px; }
        .totals-box { width: 260px; }
        .totals-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; color: #6b7280; }
        .totals-total { display: flex; justify-content: space-between; padding: 10px 0 0; border-top: 1px solid #e5e7eb; font-weight: 700; font-size: 16px; }
        .footer { border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; font-size: 13px; color: #6b7280; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; background: #dcfce7; color: #15803d; }
        .logo-row { display: flex; align-items: center; gap: 16px; }
        .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin-bottom: 6px; }
      </style></head><body>${content}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-background rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Order Details</h3>
              <p className="text-sm text-muted-foreground">#{order.order_number}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-cta text-primary-foreground text-sm font-semibold hover:shadow-elevated transition-all"
              >
                <Printer className="w-4 h-4" /> Print / Download Invoice
              </button>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Invoice */}
          <div className="overflow-y-auto flex-1 p-4" ref={printRef}>
            <Invoice order={order} user={user} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Order Detail Modal ────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab]       = useState<"orders" | "profile">("orders");
  const [orders, setOrders]             = useState<ApiOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [profile, setProfile] = useState({
    name: user?.name || "", phone: user?.phone || "", email: user?.email || "", address: "",
  });

  useEffect(() => {
    getOrders()
      .then(r => setOrders(r.data))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  }, []);

  const handleLogout = async () => { await logout(); navigate("/"); };

  const totalSpent   = orders.reduce((s, o) => s + Number(o.total_amount), 0);
  const totalPlants  = orders.reduce((s, o) => s + Number(o.total_plants), 0);
  const activeOrders = orders.filter(o => !["delivered", "cancelled"].includes(o.order_status)).length;

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="gradient-hero text-primary-foreground py-12">
        <div className="container-nursery flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full gradient-gold flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-primary-foreground/60 text-sm">Welcome back,</p>
              <h1 className="font-display text-2xl md:text-3xl font-bold">{user?.name}</h1>
              <p className="text-primary-foreground/70 text-sm">{user?.phone}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/products" className="gradient-gold text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:shadow-gold transition-all">
              New Order
            </Link>
            <button onClick={handleLogout} className="bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-primary-foreground/20 transition-all flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </section>

      <div className="container-nursery py-10">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Orders",   value: orders.length,                                          icon: Package,      color: "text-blue-500" },
            { label: "Active Orders",  value: activeOrders,                                           icon: Clock,        color: "text-yellow-500" },
            { label: "Total Spent",    value: totalSpent > 0 ? `₹${(totalSpent/1000).toFixed(0)}K` : "₹0", icon: CheckCircle, color: "text-green-500" },
            { label: "Plants Ordered", value: totalPlants > 0 ? totalPlants.toLocaleString() : "0",   icon: Package,      color: "text-purple-500" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border/50 p-5 shadow-card"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-border">
          {[
            { id: "orders"  as const, label: "Order History", icon: Package },
            { id: "profile" as const, label: "My Profile",    icon: User },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
                activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
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
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-foreground mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">Start by browsing our product catalog</p>
                <Link to="/products" className="text-primary font-semibold hover:underline">Browse Products →</Link>
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        {["Order ID", "Date", "Items", "Plants", "Total", "Status", "Actions"].map(h => (
                          <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                          <td className="px-5 py-4 text-sm font-bold text-primary">{order.order_number}</td>
                          <td className="px-5 py-4 text-sm text-muted-foreground whitespace-nowrap">
                            {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-5 py-4 text-sm text-foreground max-w-[180px]">
                            <p className="truncate">{order.items?.[0]?.variety_name || "—"}</p>
                            {order.items?.length > 1 && <p className="text-xs text-muted-foreground">+{order.items.length - 1} more</p>}
                          </td>
                          <td className="px-5 py-4 text-sm text-foreground">{Number(order.total_plants).toLocaleString()}</td>
                          <td className="px-5 py-4 text-sm font-bold text-foreground">₹{Number(order.total_amount).toLocaleString()}</td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLE[order.order_status] || STATUS_STYLE.pending}`}>
                              {order.order_status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-semibold"
                              >
                                <Eye className="w-3.5 h-3.5" /> View
                              </button>
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors text-xs font-semibold"
                              >
                                <Download className="w-3.5 h-3.5" /> Invoice
                              </button>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6 md:p-8 max-w-2xl">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
                <div className="w-16 h-16 rounded-full gradient-cta flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.phone}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-primary" /> Full Name</label>
                    <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> Phone</label>
                    <input type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary" /> Email</label>
                  <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" /> Address</label>
                  <textarea value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                </div>
                <button onClick={() => toast.success("Profile updated!")}
                  className="gradient-cta text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:shadow-elevated transition-all hover:scale-[1.02]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Order Detail / Invoice Modal */}
      {selectedOrder && (
        <OrderModal order={selectedOrder} user={user} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
