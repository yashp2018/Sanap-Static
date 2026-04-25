import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, Truck, Banknote, Building, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { ApiCartItem, resolvePrice, resolveDelivery, placeOrder } from "@/services/api";
import { toast } from "sonner";
import { validateCheckout } from "@/lib/validation";

function itemTotal(item: ApiCartItem): number {
  return resolvePrice(item as any, item.quantity) * item.quantity
    + resolveDelivery(item as any, item.quantity, item.delivery_type);
}

export default function Checkout() {
  const { items, clearItems } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod" | "bank">("razorpay");
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", address: "", city: "", state: "Maharashtra", pincode: "", landmark: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors(er => ({ ...er, [key]: "" }));
  };

  const inputCls = (key: string, extra = "") =>
    `w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 transition-colors ${extra} ${
      errors[key] ? "border-red-500 focus:ring-red-200" : "border-border focus:ring-primary/20"
    }`;

  const grandTotal = items.reduce((sum, item) => sum + itemTotal(item), 0);
  const totalPlants = items.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateCheckout(form);
    if (Object.keys(errs).length) { setErrors(errs); toast.error("Please fix the errors below"); return; }
    try {
      const res = await placeOrder({
        customer_name: form.fullName,
        customer_phone: form.phone,
        customer_email: form.email || undefined,
        delivery_address: form.address,
        delivery_city: form.city,
        delivery_state: form.state,
        delivery_pincode: form.pincode,
        delivery_landmark: form.landmark || undefined,
        payment_method: paymentMethod,
      });
      toast.success(`Order placed! Order #${res.data.order_number}`);
      clearItems();
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    }
  };

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
            {/* Delivery Form */}
            <div className="lg:col-span-2 space-y-6" id="checkout-form">
              {/* Delivery Address */}
              <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card">
                <h3 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Delivery Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="delivery-address-fields">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                    <input type="text" value={form.fullName} onChange={set("fullName")}
                      className={inputCls("fullName")} maxLength={100} id="customerName" />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number *</label>
                    <input type="tel" value={form.phone} onChange={set("phone")}
                      className={inputCls("phone")} maxLength={15} id="customerPhone" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email (Optional)</label>
                    <input type="email" value={form.email} onChange={set("email")}
                      className={inputCls("email")} maxLength={255} id="checkout-email" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Address *</label>
                    <textarea value={form.address} onChange={set("address")} rows={3}
                      className={inputCls("address", "resize-none")} maxLength={500} id="customerAddress" />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">City *</label>
                    <input type="text" value={form.city} onChange={set("city")}
                      className={inputCls("city")} id="customerCity" />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">State *</label>
                    <select value={form.state} onChange={set("state")}
                      className={inputCls("state")} id="checkout-state">
                      {["Maharashtra", "Karnataka", "Andhra Pradesh", "Telangana", "Tamil Nadu", "Gujarat", "Rajasthan", "Madhya Pradesh", "Uttar Pradesh", "Other"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Pincode *</label>
                    <input type="text" value={form.pincode} onChange={set("pincode")}
                      className={inputCls("pincode")} maxLength={6} id="customerPincode" />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Landmark</label>
                    <input type="text" value={form.landmark} onChange={set("landmark")}
                      className={inputCls("landmark")} maxLength={100} />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card" id="payment-method">
                <h3 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" /> Payment Method
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "razorpay" as const, icon: CreditCard, label: "Pay Online", desc: "Razorpay (UPI, Cards, NetBanking)" },
                    { id: "cod" as const, icon: Banknote, label: "Cash on Delivery", desc: "Pay when plants are delivered" },
                    { id: "bank" as const, icon: Building, label: "Bank Transfer", desc: "NEFT/RTGS/IMPS" },
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

            {/* Order Summary */}
            <div id="order-summary">
              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card sticky top-28">
                <h3 className="font-display text-lg font-bold text-foreground mb-5">Order Summary</h3>

                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.variety_id} className="flex gap-3" id={`order-item-${item.variety_id}`}>
                      <img src={item.image_url || "/SA.png"} alt={item.variety_name} className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{item.variety_name}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity.toLocaleString()} plants</p>
                        <p className="text-sm font-bold text-primary mt-0.5">₹{itemTotal(item).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total Plants</span>
                    <span className="font-medium text-foreground">{totalPlants.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span className="font-medium text-foreground">Included</span>
                  </div>
                  <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
                    <span className="font-display font-bold text-foreground text-lg">Total</span>
                    <span className="font-display text-2xl font-bold text-primary">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full gradient-cta text-primary-foreground py-4 rounded-xl font-bold text-lg mt-6 hover:shadow-elevated transition-all hover:scale-[1.02] btn-ripple"
                  id="placeOrderBtn"
                >
                  {paymentMethod === "razorpay" ? "Pay & Place Order" : "Place Order"}
                </button>

                <p className="text-xs text-muted-foreground text-center mt-3">
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
