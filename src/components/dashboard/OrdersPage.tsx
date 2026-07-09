import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, XCircle, AlertTriangle, Package,
  ChevronLeft, ChevronRight, Search, Filter, Wallet, ShieldCheck, Clock, FileText,
} from "lucide-react";
import { toast } from "sonner";
import { cancelOrder, type ApiOrder } from "@/services/api";
import BillReceipt, { type BillData } from "@/components/BillReceipt";

const STATUS_STYLE: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-700 border border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border border-blue-200",
  shipped:   "bg-purple-100 text-purple-700 border border-purple-200",
  delivered: "bg-green-100 text-green-700 border border-green-200",
  cancelled: "bg-red-100 text-red-700 border border-red-200",
};
const STATUS_DOT: Record<string, string> = {
  pending: "bg-yellow-500", confirmed: "bg-blue-500",
  shipped: "bg-purple-500", delivered: "bg-green-500", cancelled: "bg-red-500",
};

const PAYMENT_STYLE: Record<string, string> = {
  pending:         "bg-gray-100 text-gray-600",
  advance_paid:    "bg-orange-100 text-orange-700",
  fully_paid:      "bg-green-100 text-green-700",
  partially_paid:  "bg-yellow-100 text-yellow-700",
  cancelled:       "bg-red-100 text-red-700",
  refunded:        "bg-purple-100 text-purple-700",
};
const PAYMENT_LABEL: Record<string, string> = {
  pending:        "Pending",
  advance_paid:   "Advance Paid",
  fully_paid:     "Fully Paid",
  partially_paid: "Partially Paid",
  cancelled:      "Cancelled",
  refunded:       "Refunded",
};

const ITEMS_PER_PAGE = 8;

// ── helpers ───────────────────────────────────────────────────
function buildBillData(order: ApiOrder, userName: string, userPhone: string): BillData {
  const d = new Date(order.created_at);
  const dateStr = `${d.getDate().toString().padStart(2,"0")}.${(d.getMonth()+1).toString().padStart(2,"0")}.${d.getFullYear()}`;
  const receiptNo = order.order_number.replace(/\D/g, "").slice(-3) || "001";
  return {
    receiptNo,
    date: dateStr,
    orderNumber: order.order_number,
    customerName: userName,
    customerPhone: userPhone,
    customerAddress: `${order.delivery_city}, ${order.delivery_state}`,
    items: order.items.map(i => ({
      name: i.variety_name,
      qty: Number(i.quantity),
      rate: Number(i.unit_price),
      amount: Number(i.line_total),
      company: i.company,
    })),
    totalAmount: Number(order.total_amount),
    advanceAmount: Number(order.advance_amount),
    remainingAmount: Number(order.remaining_amount),
    paymentType: order.payment_type,
    paymentMethod: order.payment_method === "cod" ? "Cash" : order.payment_method === "bank" ? "Bank Transfer" : "Online",
  };
}

// ── Order detail modal ────────────────────────────────────────
function OrderModal({ order, userName, userPhone, onClose }: {
  order: ApiOrder; userName: string; userPhone: string; onClose: () => void;
}) {
  const [activeBill, setActiveBill] = useState<"receipt" | "invoice" | null>(null);
  const billData = buildBillData(order, userName, userPhone);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-800">Order #{order.order_number}</h3>
            <p className="text-xs text-gray-400">
              {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
              {" · "}
              <span className={`capitalize font-semibold ${STATUS_STYLE[order.order_status]?.split(" ")[1] ?? "text-gray-600"}`}>{order.order_status}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {/* Bill type selector */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" /> Select Bill to View / Print
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveBill(activeBill === "receipt" ? null : "receipt")}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  activeBill === "receipt" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <p className="font-bold text-gray-800 text-sm">🧾 Payment Receipt</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {order.payment_type === "advance"
                    ? `Advance ₹${Number(order.advance_amount).toLocaleString("en-IN")}`
                    : `Full ₹${Number(order.total_amount).toLocaleString("en-IN")}`}
                </p>
              </button>
              <button
                onClick={() => setActiveBill(activeBill === "invoice" ? null : "invoice")}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  activeBill === "invoice" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <p className="font-bold text-gray-800 text-sm">📄 Credit Invoice</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Total ₹{Number(order.total_amount).toLocaleString("en-IN")}
                  {order.payment_type === "advance" && ` · ₹${Number(order.remaining_amount).toLocaleString("en-IN")} due`}
                </p>
              </button>
            </div>
          </div>

          {/* Bill preview */}
          {activeBill && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <BillReceipt data={billData} type={activeBill} />
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Cancel dialog ─────────────────────────────────────────────
function CancelDialog({ order, onConfirm, onClose, loading }: {
  order: ApiOrder; onConfirm: (reason: string) => void; onClose: () => void; loading: boolean;
}) {
  const [reason, setReason] = useState("");
  const reasons = ["Changed my mind", "Ordered by mistake", "Found better price", "Delivery time too long", "Other"];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-gray-800">Cancel Order</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-red-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-sm font-semibold text-gray-800">Order #{order.order_number}</p>
            <p className="text-xs text-gray-500 mt-0.5">{order.items?.[0]?.variety_name}{order.items?.length > 1 ? ` +${order.items.length - 1} more` : ""}</p>
            <p className="text-sm font-bold text-indigo-600 mt-1">₹{Number(order.total_amount).toLocaleString()}</p>
          </div>
          <p className="text-sm text-gray-500">This action <strong>cannot be undone</strong>.</p>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Reason *</p>
            <div className="space-y-2">
              {reasons.map(r => (
                <label key={r} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="w-4 h-4 accent-red-500" />
                  <span className={`text-sm ${reason === r ? "text-gray-800 font-medium" : "text-gray-500"}`}>{r}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Keep Order
            </button>
            <button
              onClick={() => reason && onConfirm(reason)}
              disabled={!reason || loading}
              className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <XCircle className="w-4 h-4" />}
              {loading ? "Cancelling..." : "Confirm Cancel"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Orders Page ──────────────────────────────────────────
interface OrdersPageProps {
  orders: ApiOrder[];
  onOrdersChange: (orders: ApiOrder[]) => void;
  userName: string;
  userPhone: string;
}

export default function OrdersPage({ orders, onOrdersChange, userName, userPhone }: OrdersPageProps) {
  const [search, setSearch]           = useState("");
  const [filter, setFilter]           = useState("all");
  const [page, setPage]               = useState(1);
  const [selectedOrder, setSelected]  = useState<ApiOrder | null>(null);
  const [cancelTarget, setCancelTarget] = useState<ApiOrder | null>(null);
  const [cancelling, setCancelling]   = useState(false);

  const filtered = orders.filter(o =>
    (filter === "all" || o.order_status === filter) &&
    (o.order_number.toLowerCase().includes(search.toLowerCase()) ||
     o.items?.[0]?.variety_name?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleCancel = async (reason: string) => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await cancelOrder(cancelTarget.order_number, reason);
      onOrdersChange(orders.map(o =>
        o.order_number === cancelTarget.order_number ? { ...o, order_status: "cancelled" } : o
      ));
      toast.success("Order cancelled successfully");
      setCancelTarget(null);
    } catch {
      toast.error("Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.order_status === "pending").length,
    confirmed: orders.filter(o => o.order_status === "confirmed").length,
    shipped: orders.filter(o => o.order_status === "shipped").length,
    delivered: orders.filter(o => o.order_status === "delivered").length,
    cancelled: orders.filter(o => o.order_status === "cancelled").length,
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Summary pills */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {(["all", "pending", "confirmed", "shipped", "delivered", "cancelled"] as const).map(s => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`rounded-2xl p-3 text-center transition-all ${
              filter === s ? "bg-indigo-600 text-white shadow-lg" : "bg-white border border-gray-100 hover:border-indigo-200"
            }`}
          >
            <p className={`text-xl font-bold ${filter === s ? "text-white" : "text-gray-800"}`}>{statusCounts[s]}</p>
            <p className={`text-[10px] font-semibold capitalize mt-0.5 ${filter === s ? "text-white/80" : "text-gray-400"}`}>{s}</p>
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by order # or product..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 ml-auto">
            <Filter className="w-3.5 h-3.5" />
            <span>{filtered.length} orders</span>
          </div>
        </div>

        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Package className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  {["Order #", "Items", "Plants", "Amount", "Advance", "Balance", "Date", "Payment", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((order, i) => {
                  const canCancel = ["pending", "confirmed"].includes(order.order_status);
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-gray-50 hover:bg-indigo-50/20 transition-colors group"
                    >
                      <td className="px-5 py-4 text-sm font-bold text-indigo-600">{order.order_number}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-800">{order.items?.[0]?.variety_name ?? "—"}</p>
                        {order.items?.length > 1 && <p className="text-xs text-gray-400">+{order.items.length - 1} more</p>}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{Number(order.total_plants).toLocaleString()}</td>
                      <td className="px-5 py-4 text-sm font-bold text-gray-800">₹{Number(order.total_amount).toLocaleString()}</td>
                      {/* Advance */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <Wallet className="w-3.5 h-3.5 text-orange-500" />
                          <span className="text-xs font-semibold text-orange-600">₹{Number(order.advance_amount || 0).toLocaleString()}</span>
                        </div>
                      </td>
                      {/* Balance */}
                      <td className="px-5 py-4">
                        {order.payment_status === "fully_paid" ? (
                          <div className="flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-xs font-semibold text-green-600">Nil</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-red-400" />
                            <span className="text-xs font-semibold text-red-500">₹{Number(order.remaining_amount || 0).toLocaleString()}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${PAYMENT_STYLE[order.payment_status] ?? PAYMENT_STYLE.pending}`}>
                          {PAYMENT_LABEL[order.payment_status] ?? order.payment_status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLE[order.order_status] ?? STATUS_STYLE.pending}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[order.order_status] ?? STATUS_DOT.pending}`} />
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelected(order)}
                            className="p-1.5 rounded-lg hover:bg-indigo-100 text-indigo-500 transition-colors"
                            title="View Bills"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          {canCancel && (
                            <button
                              onClick={() => setCancelTarget(order)}
                              className="p-1.5 rounded-lg hover:bg-red-100 text-red-400 transition-colors"
                              title="Cancel Order"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-xl text-xs font-semibold ${page === i + 1 ? "bg-indigo-600 text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderModal order={selectedOrder} userName={userName} userPhone={userPhone} onClose={() => setSelected(null)} />
        )}
        {cancelTarget && (
          <CancelDialog order={cancelTarget} onConfirm={handleCancel} onClose={() => setCancelTarget(null)} loading={cancelling} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
