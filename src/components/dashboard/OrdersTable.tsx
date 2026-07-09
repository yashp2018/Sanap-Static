import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Package, X, FileText } from "lucide-react";
import type { ApiOrder } from "@/services/api";
import BillReceipt, { type BillData } from "@/components/BillReceipt";

const STATUS_STYLE: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped:   "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};
const STATUS_DOT: Record<string, string> = {
  pending:   "bg-yellow-500",
  confirmed: "bg-blue-500",
  shipped:   "bg-purple-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

const ITEMS_PER_PAGE = 5;

function makeBillData(order: ApiOrder, userName: string, userPhone: string): BillData {
  const d = new Date(order.created_at);
  const dateStr = `${d.getDate().toString().padStart(2,"0")}.${(d.getMonth()+1).toString().padStart(2,"0")}.${d.getFullYear()}`;
  return {
    receiptNo: order.order_number.replace(/\D/g, "").slice(-3) || "001",
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

interface BillModalProps {
  order: ApiOrder;
  userName: string;
  userPhone: string;
  onClose: () => void;
}

function BillModal({ order, userName, userPhone, onClose }: BillModalProps) {
  const [activeBill, setActiveBill] = useState<"receipt" | "invoice" | null>(null);
  const billData = makeBillData(order, userName, userPhone);

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
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-800">Order #{order.order_number}</h3>
            <p className="text-xs text-gray-400">
              {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {(["receipt", "invoice"] as const).map(type => (
              <button
                key={type}
                onClick={() => setActiveBill(activeBill === type ? null : type)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  activeBill === type ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <p className="font-bold text-gray-800 text-sm">
                  {type === "receipt" ? "🧾 Payment Receipt" : "📄 Credit Invoice"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {type === "receipt"
                    ? (order.payment_type === "advance"
                        ? `Advance ₹${Number(order.advance_amount).toLocaleString("en-IN")}`
                        : `Full ₹${Number(order.total_amount).toLocaleString("en-IN")}`)
                    : `Total ₹${Number(order.total_amount).toLocaleString("en-IN")}`}
                </p>
              </button>
            ))}
          </div>

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

interface OrdersTableProps {
  orders: ApiOrder[];
  onViewOrder?: (orderNumber: string) => void;
  userName?: string;
  userPhone?: string;
}

export default function OrdersTable({ orders, userName = "", userPhone = "" }: OrdersTableProps) {
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState("all");
  const [page, setPage]             = useState(1);
  const [billOrder, setBillOrder]   = useState<ApiOrder | null>(null);

  const statusCounts = {
    pending:   orders.filter(o => o.order_status === "pending").length,
    confirmed: orders.filter(o => o.order_status === "confirmed").length,
    shipped:   orders.filter(o => o.order_status === "shipped").length,
    delivered: orders.filter(o => o.order_status === "delivered").length,
  };

  const filtered = orders.filter(o =>
    (filter === "all" || o.order_status === filter) &&
    (o.order_number.toLowerCase().includes(search.toLowerCase()) ||
     o.items?.[0]?.variety_name?.toLowerCase().includes(search.toLowerCase()) ||
     o.items?.[0]?.crop_name?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-800 text-lg">Order List</h3>
            <span className="text-xs text-gray-400"><span className="font-semibold text-gray-600">{filtered.length}</span> orders</span>
          </div>

          {/* Status pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { key: "pending",   label: "New Orders", color: "from-blue-500 to-indigo-600",   count: statusCounts.pending   },
              { key: "confirmed", label: "Confirmed",  color: "from-orange-400 to-amber-500",  count: statusCounts.confirmed },
              { key: "shipped",   label: "On the Way", color: "from-yellow-400 to-orange-400", count: statusCounts.shipped   },
              { key: "delivered", label: "Delivered",  color: "from-green-400 to-emerald-500", count: statusCounts.delivered },
            ].map(s => (
              <motion.button
                key={s.key}
                whileHover={{ y: -2 }}
                onClick={() => { setFilter(s.key); setPage(1); }}
                className={`rounded-2xl p-4 text-left transition-all ${
                  filter === s.key
                    ? `bg-gradient-to-r ${s.color} text-white shadow-lg`
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <p className={`text-xs font-semibold mb-1 ${filter === s.key ? "text-white/80" : "text-gray-500"}`}>{s.label}</p>
                <p className={`text-2xl font-bold ${filter === s.key ? "text-white" : "text-gray-800"}`}>{s.count}</p>
              </motion.button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <button
              onClick={() => { setFilter("all"); setSearch(""); setPage(1); }}
              className="px-4 py-2.5 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Table */}
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Package className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-y border-gray-100 bg-gray-50/50">
                  {["Order #", "Product", "Crop", "Plants", "Amount", "Date", "Payment", "Status", ""].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((order, i) => {
                  const firstItem = order.items?.[0];
                  const date = new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors group"
                    >
                      <td className="px-5 py-4 text-sm font-bold text-indigo-600">{order.order_number}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">{firstItem?.variety_name ?? "—"}</p>
                        {order.items?.length > 1 && <p className="text-xs text-gray-400">+{order.items.length - 1} more</p>}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">{firstItem?.crop_name ?? "—"}</td>
                      <td className="px-5 py-4 text-sm text-gray-700 font-medium">{Number(order.total_plants).toLocaleString()}</td>
                      <td className="px-5 py-4 text-sm font-bold text-gray-800">₹{Number(order.total_amount).toLocaleString()}</td>
                      <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">{date}</td>
                      <td className="px-5 py-4 text-xs text-gray-500 capitalize">{order.payment_method}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLE[order.order_status] ?? STATUS_STYLE.pending}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[order.order_status] ?? STATUS_DOT.pending}`} />
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setBillOrder(order)}
                          className="p-1.5 rounded-lg hover:bg-indigo-100 text-indigo-500 transition-colors opacity-0 group-hover:opacity-100"
                          title="View Bills"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
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
                className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
                    page === i + 1 ? "bg-indigo-600 text-white shadow-lg" : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Bill Modal */}
      <AnimatePresence>
        {billOrder && (
          <BillModal
            order={billOrder}
            userName={userName}
            userPhone={userPhone}
            onClose={() => setBillOrder(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
