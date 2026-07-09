import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, Banknote, Building, Check, ShieldCheck, Info, Wallet, BadgePercent, CheckCircle2, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { ApiCartItem, resolvePrice, resolveDelivery, placeOrder } from "@/services/api";
import { toast } from "sonner";
import { validateCheckout } from "@/lib/validation";
import BillReceipt, { BillData } from "@/components/BillReceipt";

function itemTotal(item: ApiCartItem): number {
  return resolvePrice(item as any, item.quantity) * item.quantity
    + resolveDelivery(item as any, item.quantity, item.delivery_type);
}

const ADVANCE_PCT = 25;

interface OrderResult {
  order_number: string;
  total_amount: number;
  advance_amount: number;
  remaining_amount: number;
  payment_type: string;
  total_plants: number;
}

export default function Checkout() {
  const { items, clearItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod" | "bank">("razorpay");
  const [paymentType, setPaymentType]     = useState<"advance" | "full">("advance");
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", address: "",
    city: "", state: "Maharashtra", pincode: "", landmark: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [orderItems, setOrderItems] = useState<ApiCartItem[]>([]);
  const [activeBill, setActiveBill] = useState<"receipt" | "invoice" | null>(null);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors(er => ({ ...er, [key]: "" }));
  };

  const inputCls = (key: string, extra = "") =>
    `w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 transition-colors ${extra} ${
      errors[key] ? "border-red-500 focus:ring-red-200" : "border-border focus:ring-primary/20"
    }`;

  const grandTotal      = items.reduce((sum, item) => sum + itemTotal(item), 0);
  const totalPlants     = items.reduce((sum, item) => sum + item.quantity, 0);
  const advanceAmount   = Math.round(grandTotal * ADVANCE_PCT) / 100;
  const remainingAmount = grandTotal - advanceAmount;
  const chargeAmount    = paymentType === "advance" ? advanceAmount : grandTotal;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateCheckout(form);
    if (Object.keys(errs).length) { setErrors(errs); toast.error("Please fix the errors below"); return; }
    try {
      const snapshot = [...items];
      const res = await placeOrder({
        customer_name:    form.fullName,
        customer_phone:   form.phone,
        customer_email:   form.email || undefined,
        delivery_address: form.address,
        delivery_city:    form.city,
        delivery_state:   form.state,
        delivery_pincode: form.pincode,
        delivery_landmark: form.landmark || undefined,
        payment_method:   paymentMethod,
        payment_type:     paymentType,
      });
      toast.success(`Order placed! #${res.data.order_number}`);
      setOrderItems(snapshot);
      setOrderResult(res.data);
      clearItems();
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    }
  };

  // ── Success Screen ──────────────────────────────────────────
  if (orderResult) {
    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2,"0")}.${(today.getMonth()+1).toString().padStart(2,"0")}.${today.getFullYear()}`;
    const receiptNo = orderResult.order_number.replace(/\D/g, "").slice(-3) || "001";
    const billItems = orderItems.map(item => ({
      name: item.variety_name,
      qty: item.quantity,
      rate: resolvePrice(item as any, item.quantity),
      amount: resolvePrice(item as any, item.quantity) * item.quantity + resolveDelivery(item as any, item.quantity, item.delivery_type),
      company: item.company,
    }));
    const billData: BillData = {
      receiptNo,
      date: dateStr,
      orderNumber: orderResult.order_number,
      customerName: form.fullName,
      customerPhone: form.phone,
      customerAddress: `${form.address}, ${form.city}`,
      items: billItems,
      totalAmount: orderResult.total_amount,
      advanceAmount: orderResult.advance_amount,
      remainingAmount: orderResult.remaining_amount,
      paymentType: orderResult.payment_type as "advance" | "full",
      paymentMethod: paymentMethod === "razorpay" ? "Online" : paymentMethod === "cod" ? "Cash" : "Bank Transfer",
    };

    return (
      <div className="min-h-screen bg-background">
        <section className="gradient-hero text-primary-foreground py-12">
          <div className="container-nursery">
            <h1 className="font-display text-3xl md:text-4xl font-bold">Order Confirmed</h1>
          </div>
        </section>

        <div className="container-nursery py-10 max-w-4xl">
          {/* Success Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border-2 border-green-400 rounded-2xl p-8 text-center mb-8"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-green-800 mb-1">Payment Successful!</h2>
            <p className="text-green-700 text-lg mb-2">Your order has been placed successfully.</p>
            <p className="text-green-600 font-semibold text-xl">Order #{orderResult.order_number}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {[
                { label: "Total Amount", value: `₹${orderResult.total_amount.toLocaleString("en-IN")}` },
                { label: "Paid Now", value: `₹${orderResult.advance_amount.toLocaleString("en-IN")}`, highlight: true },
                { label: "Remaining", value: orderResult.payment_type === "full" ? "₹0" : `₹${orderResult.remaining_amount.toLocaleString("en-IN")}` },
                { label: "Total Plants", value: orderResult.total_plants.toLocaleString("en-IN") },
              ].map(({ label, value, highlight }) => (
                <div key={label} className={`rounded-xl p-3 ${highlight ? "bg-green-200" : "bg-white border border-green-200"}`}>
                  <p className="text-xs text-green-600 font-medium">{label}</p>
                  <p className="text-lg font-bold text-green-800">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bill Selection */}
          <div className="mb-6">
            <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Download / Print Bills
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setActiveBill(activeBill === "receipt" ? null : "receipt")}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${
                  activeBill === "receipt" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                }`}
              >
                <p className="font-bold text-foreground">🧾 Payment Receipt</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {orderResult.payment_type === "advance"
                    ? `Advance receipt for ₹${orderResult.advance_amount.toLocaleString("en-IN")}`
                    : `Full payment receipt for ₹${orderResult.total_amount.toLocaleString("en-IN")}`}
                </p>
              </button>
              <button
                onClick={() => setActiveBill(activeBill === "invoice" ? null : "invoice")}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${
                  activeBill === "invoice" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                }`}
              >
                <p className="font-bold text-foreground">📄 Credit Invoice</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Full order invoice for ₹{orderResult.total_amount.toLocaleString("en-IN")}
                  {orderResult.payment_type === "advance" && ` (₹${orderResult.remaining_amount.toLocaleString("en-IN")} outstanding)`}
                </p>
              </button>
            </div>
          </div>

          {/* Bill Preview */}
          {activeBill && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <BillReceipt data={billData} type={activeBill} />
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/dashboard"
              className="flex-1 gradient-cta text-primary-foreground py-3 rounded-xl font-semibold text-center hover:shadow-elevated transition-all"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/products"
              className="flex-1 border-2 border-primary text-primary py-3 rounded-xl font-semibold text-center hover:bg-primary/5 transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🛒</p>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Cart is empty</h2>
          <Link to="/products" className="text-primary font-semibold hover:underline">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="gradient-hero text-primary-foreground py-12">
        <div className="container-nursery">
          <Link to="/cart" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Checkout</h1>
        </div>
      </section>

      <div className="container-nursery py-10">
        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: Delivery + Payment Method ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Delivery Address */}
              <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card">
                <h3 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Delivery Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                    <input type="text" value={form.fullName} onChange={set("fullName")} className={inputCls("fullName")} maxLength={100} />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number *</label>
                    <input type="tel" value={form.phone} onChange={set("phone")} className={inputCls("phone")} maxLength={15} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email (Optional)</label>
                    <input type="email" value={form.email} onChange={set("email")} className={inputCls("email")} maxLength={255} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Address *</label>
                    <textarea value={form.address} onChange={set("address")} rows={3} className={inputCls("address", "resize-none")} maxLength={500} />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">City *</label>
                    <input type="text" value={form.city} onChange={set("city")} className={inputCls("city")} />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">State *</label>
                    <select value={form.state} onChange={set("state")} className={inputCls("state")}>
                      {["Maharashtra","Karnataka","Andhra Pradesh","Telangana","Tamil Nadu","Gujarat","Rajasthan","Madhya Pradesh","Uttar Pradesh","Other"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Pincode *</label>
                    <input type="text" value={form.pincode} onChange={set("pincode")} className={inputCls("pincode")} maxLength={6} />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Landmark</label>
                    <input type="text" value={form.landmark} onChange={set("landmark")} className={inputCls("landmark")} maxLength={100} />
                  </div>
                </div>
              </div>

              {/* Payment Type Selection */}
              <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card">
                <h3 className="font-display text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                  <BadgePercent className="w-5 h-5 text-primary" /> Payment Option
                </h3>
                <p className="text-sm text-muted-foreground mb-5">Choose how much you'd like to pay now to confirm your order.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  {/* Advance 25% */}
                  <button
                    type="button"
                    onClick={() => setPaymentType("advance")}
                    className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                      paymentType === "advance"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {paymentType === "advance" && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                    )}
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-3">
                      <Wallet className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="font-bold text-foreground text-sm">Pay Advance (25%)</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Minimum required to confirm order</p>
                    <p className="text-xl font-bold text-orange-600 mt-2">₹{advanceAmount.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-muted-foreground">Remaining ₹{remainingAmount.toLocaleString("en-IN")} before dispatch</p>
                  </button>

                  {/* Full 100% */}
                  <button
                    type="button"
                    onClick={() => setPaymentType("full")}
                    className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                      paymentType === "full"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {paymentType === "full" && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                    )}
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-3">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="font-bold text-foreground text-sm">Pay Full Amount (100%)</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Complete payment — no balance due</p>
                    <p className="text-xl font-bold text-green-600 mt-2">₹{grandTotal.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-muted-foreground">No remaining balance</p>
                  </button>
                </div>

                {/* Info box */}
                <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-relaxed">
                    To confirm your order, a minimum advance payment of <strong>25%</strong> is required.
                    The remaining <strong>75%</strong> must be paid before dispatch or according to the agreed business terms.
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card">
                <h3 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" /> Payment Method
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "razorpay" as const, icon: CreditCard, label: "Pay Online",       desc: "UPI, Cards, NetBanking" },
                    { id: "cod"      as const, icon: Banknote,   label: "Cash on Delivery", desc: "Pay when plants arrive" },
                    { id: "bank"     as const, icon: Building,   label: "Bank Transfer",    desc: "NEFT / RTGS / IMPS" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-5 rounded-xl border-2 text-left transition-all ${
                        paymentMethod === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <method.icon className={`w-6 h-6 mb-2 ${paymentMethod === method.id ? "text-primary" : "text-muted-foreground"}`} />
                      <p className="font-semibold text-foreground text-sm">{method.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{method.desc}</p>
                      {paymentMethod === method.id && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-primary font-semibold">
                          <Check className="w-3 h-3" /> Selected
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: Order Summary ── */}
            <div>
              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card sticky top-28 space-y-5">
                <h3 className="font-display text-lg font-bold text-foreground">Order Summary</h3>

                {/* Items list */}
                <div className="space-y-3 max-h-52 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.variety_id} className="flex gap-3">
                      <img src={item.image_url || "/SA.png"} alt={item.variety_name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{item.variety_name}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity.toLocaleString()} plants</p>
                        <p className="text-sm font-bold text-primary">₹{itemTotal(item).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment breakdown */}
                <div className="border-t border-border pt-4 space-y-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total Plants</span>
                    <span className="font-medium text-foreground">{totalPlants.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span className="font-medium text-foreground">Included</span>
                  </div>
                  <div className="flex justify-between font-bold text-foreground border-t border-border pt-3">
                    <span>Order Total</span>
                    <span className="text-lg">₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Payment split cards */}
                <div className="space-y-2">
                  <motion.div
                    animate={{ scale: paymentType === "advance" ? 1 : 0.98 }}
                    className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl px-4 py-3"
                  >
                    <div>
                      <p className="text-xs font-semibold text-orange-700">Advance Payment (25%)</p>
                      <p className="text-[10px] text-orange-500">Pay now to confirm</p>
                    </div>
                    <p className="text-base font-bold text-orange-600">₹{advanceAmount.toLocaleString("en-IN")}</p>
                  </motion.div>

                  <motion.div
                    animate={{ opacity: paymentType === "full" ? 0.4 : 1 }}
                    className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                  >
                    <div>
                      <p className="text-xs font-semibold text-red-700">Remaining Balance (75%)</p>
                      <p className="text-[10px] text-red-500">Due before dispatch</p>
                    </div>
                    <p className="text-base font-bold text-red-600">
                      {paymentType === "full" ? "₹0" : `₹${remainingAmount.toLocaleString("en-IN")}`}
                    </p>
                  </motion.div>
                </div>

                {/* Amount to pay now */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 flex items-center justify-between">
                  <p className="text-sm font-bold text-foreground">
                    {paymentType === "advance" ? "Pay Now (25%)" : "Pay Now (100%)"}
                  </p>
                  <p className="text-xl font-bold text-primary">₹{chargeAmount.toLocaleString("en-IN")}</p>
                </div>

                <button
                  type="submit"
                  className="w-full gradient-cta text-primary-foreground py-4 rounded-xl font-bold text-lg hover:shadow-elevated transition-all hover:scale-[1.02] btn-ripple"
                >
                  {paymentMethod === "razorpay"
                    ? `Pay ₹${chargeAmount.toLocaleString("en-IN")}`
                    : "Place Order"}
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  By placing this order, you agree to our terms & conditions.
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
