import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronLeft, ChevronRight, Eye, X, Wallet, ShieldCheck, Clock } from "lucide-react";
import { toast } from "sonner";
import { fetchAdminOrders, updateOrderStatus, updatePaymentStatus, type AdminOrder } from "@/components/admin/adminData";
import { StatusBadge } from "./AdminOverview";

const STATUSES = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;
const ITEMS_PER_PAGE = 8;

const PAYMENT_BADGE: Record<string, string> = {
  pending:        "bg-gray-500/20 text-gray-300 border-gray-500/30",
  advance_paid:   "bg-orange-500/20 text-orange-300 border-orange-500/30",
  fully_paid:     "bg-green-500/20 text-green-300 border-green-500/30",
  partially_paid: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  cancelled:      "bg-red-500/20 text-red-300 border-red-500/30",
  refunded:       "bg-purple-500/20 text-purple-300 border-purple-500/30",
};
const PAYMENT_LABEL: Record<string, string> = {
  pending:        "Pending",
  advance_paid:   "Advance Paid",
  fully_paid:     "Fully Paid",
  partially_paid: "Partially Paid",
  cancelled:      "Cancelled",
  refunded:       "Refunded",
};

// ── Order Detail Modal ────────────────────────────────────────
function OrderDetailModal({ order, onClose, onStatusChange, onPaymentChange }: {
  order: AdminOrder;
  onClose: () => void;
  onStatusChange: (id: number, status: AdminOrder["order_status"]) => void;
  onPaymentChange: (id: number, status: AdminOrder["payment_status"]) => void;
}) {
  const nextStatuses: AdminOrder["order_status"][] = ["pending", "confirmed", "processing", "shipped", "delivered"];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h3 className="text-sm font-bold text-white">Order {order.order_number}</h3>
            <p className="text-xs text-white/30">
              {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Customer info */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Customer",   value: order.customer_name },
              { label: "Phone",      value: order.customer_phone },
              { label: "City",       value: `${order.delivery_city}, ${order.delivery_state}` },
              { label: "Pay Method", value: `${order.payment_method} · ${order.payment_type ?? "advance"}` },
              { label: "Plants",     value: order.total_plants.toLocaleString() },
              { label: "Grand Total",value: `₹${Number(order.total_amount).toLocaleString()}` },
            ].map(f => (
              <div key={f.label} className="bg-white/[0.03] rounded-xl p-3">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{f.label}</p>
                <p className="text-xs font-semibold text-white/80">{f.value}</p>
              </div>
            ))}
          </div>

          {/* Payment breakdown */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-center">
              <p className="text-[10px] text-orange-300/70 mb-1">Advance (25%)</p>
              <p className="text-sm font-bold text-orange-300">₹{Number(order.advance_amount || 0).toLocaleString()}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
              <p className="text-[10px] text-red-300/70 mb-1">Remaining (75%)</p>
              <p className="text-sm font-bold text-red-300">₹{Number(order.remaining_amount || 0).toLocaleString()}</p>
            </div>
            <div className={`rounded-xl p-3 text-center border ${PAYMENT_BADGE[order.payment_status] ?? PAYMENT_BADGE.pending}`}>
              <p className="text-[10px] opacity-70 mb-1">Pay Status</p>
              <p className="text-xs font-bold">{PAYMENT_LABEL[order.payment_status] ?? order.payment_status}</p>
            </div>
          </div>

          {/* Items */}
          {order.items && order.items.length > 0 && (
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Items</p>
              <div className="space-y-1.5">
                {order.items.map((item, i) => (
                  <div key={i} className="bg-white/[0.03] rounded-xl p-2.5 flex justify-between text-xs">
                    <span className="text-white/60">{item.variety_name} ({item.crop_name})</span>
                    <span className="text-white/40">{item.quantity.toLocaleString()} · ₹{Number(item.line_total).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Update Payment Status */}
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Update Payment Status</p>
            <div className="flex flex-wrap gap-2">
              {(["pending", "advance_paid", "fully_paid", "partially_paid", "refunded"] as AdminOrder["payment_status"][]).map(ps => (
                <button
                  key={ps}
                  onClick={() => { onPaymentChange(order.id, ps); onClose(); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    order.payment_status === ps
                      ? `${PAYMENT_BADGE[ps]}`
                      : "bg-white/[0.03] border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
                  }`}
                >
                  {PAYMENT_LABEL[ps]}
                </button>
              ))}
            </div>
          </div>

          {/* Update Order Status */}
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Update Order Status</p>
            <div className="flex flex-wrap gap-2">
              {nextStatuses.map(s => (
                <button
                  key={s}
                  onClick={() => { onStatusChange(order.id, s); onClose(); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize ${
                    order.order_status === s
                      ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                      : "bg-white/[0.03] border-white/10 text-white/40 hover:border-purple-500/30 hover:text-white/70"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────
export default function ManageOrders() {
  const [orders, setOrders]     = useState<AdminOrder[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState<typeof STATUSES[number]>("all");
  const [page, setPage]         = useState(1);
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchAdminOrders(undefined, 1, 200)
      .then(r => setOrders(r.data.map(o => ({
        ...o,
        items_summary: o.items?.map(i => i.variety_name).join(", ") || "",
      }))))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter(o =>
    (filter === "all" || o.order_status === filter) &&
    (o.order_number.toLowerCase().includes(search.toLowerCase()) ||
     o.customer_name.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleStatusChange = async (id: number, status: AdminOrder["order_status"]) => {
    try {
      await updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, order_status: status } : o));
      toast.success(`Order status → ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handlePaymentChange = async (id: number, payment_status: AdminOrder["payment_status"]) => {
    try {
      const res = await updatePaymentStatus(id, payment_status);
      setOrders(prev => prev.map(o =>
        o.id === id
          ? { ...o, payment_status, order_status: (res.data as any).order_status ?? o.order_status }
          : o
      ));
      toast.success(`Payment → ${PAYMENT_LABEL[payment_status]}`);
    } catch {
      toast.error("Failed to update payment status");
    }
  };

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = s === "all" ? orders.length : orders.filter(o => o.order_status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize ${
              filter === s
                ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/70"
            }`}
          >
            {s} <span className="ml-1 opacity-60">({counts[s] ?? 0})</span>
          </button>
        ))}
      </div>

      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search orders or customers..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/[0.08] rounded-xl text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/30 ml-auto">
            <Filter className="w-3.5 h-3.5" />
            <span>{filtered.length} orders</span>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-white/30 text-sm">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Order #", "Customer", "Items", "Plants", "Total", "Advance", "Balance", "Pay Status", "Date", "Status", ""].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-white/20 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="px-4 py-3.5 text-xs font-bold text-purple-400">{order.order_number}</td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-semibold text-white/70">{order.customer_name}</p>
                      <p className="text-[10px] text-white/30">{order.customer_phone}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-white/50 max-w-[120px] truncate">{order.items_summary}</td>
                    <td className="px-4 py-3.5 text-xs text-white/50">{Number(order.total_plants).toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-xs font-bold text-white/70">₹{Number(order.total_amount).toLocaleString()}</td>

                    {/* Advance paid */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <Wallet className="w-3 h-3 text-orange-400" />
                        <span className="text-xs text-orange-300">₹{Number(order.advance_amount || 0).toLocaleString()}</span>
                      </div>
                    </td>

                    {/* Remaining balance */}
                    <td className="px-4 py-3.5">
                      {order.payment_status === "fully_paid" ? (
                        <div className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-green-400" />
                          <span className="text-xs text-green-300">Nil</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-red-400" />
                          <span className="text-xs text-red-300">₹{Number(order.remaining_amount || 0).toLocaleString()}</span>
                        </div>
                      )}
                    </td>

                    {/* Payment status badge */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${PAYMENT_BADGE[order.payment_status] ?? PAYMENT_BADGE.pending}`}>
                        {PAYMENT_LABEL[order.payment_status] ?? order.payment_status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-[10px] text-white/30 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={order.order_status} /></td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => setSelected(order)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-500/20 text-white/30 hover:text-purple-400 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/5">
            <p className="text-xs text-white/30">
              {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${page === i + 1 ? "bg-purple-500 text-white" : "bg-white/5 border border-white/[0.08] text-white/40 hover:text-white"}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <OrderDetailModal
            order={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
            onPaymentChange={handlePaymentChange}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
