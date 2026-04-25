import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, ArrowRight, Minus, Plus, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ApiCartItem, resolvePrice, resolveDelivery } from "@/services/api";
import { toast } from "sonner";

function itemTotal(item: ApiCartItem): number {
  const price = resolvePrice(item as any, item.quantity);
  const delivery = resolveDelivery(item as any, item.quantity, item.delivery_type);
  return price * item.quantity + delivery;
}

export default function Cart() {
  const { items, removeItem, updateQuantity, updateDelivery, clearItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      sessionStorage.setItem("returnTo", "/checkout");
      toast.info("Please login to proceed to checkout");
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  const grandTotal = items.reduce((sum, item) => sum + itemTotal(item), 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-6">Browse our catalog and add plants to your order.</p>
          <Link
            to="/products"
            className="gradient-cta text-primary-foreground px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2"
          >
            Browse Products <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="gradient-hero text-primary-foreground py-12">
        <div className="container-nursery">
          <h1 className="font-display text-3xl font-bold">Shopping Cart</h1>
          <p className="text-primary-foreground/80">{items.length} item(s)</p>
        </div>
      </section>

      <div className="container-nursery py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4" id="cartContainer">
            {items.map((item, i) => {
              const unitPrice = resolvePrice(item as any, item.quantity);
              const delivery = resolveDelivery(item as any, item.quantity, item.delivery_type);
              const total = itemTotal(item);

              return (
                <motion.div
                  key={item.variety_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl border border-border p-5 flex flex-col sm:flex-row gap-5"
                >
                  <img
                    src={item.image_url || "/SA.png"}
                    alt={item.variety_name}
                    className="w-full sm:w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-display font-bold text-foreground">{item.variety_name}</h3>
                        <p className="text-xs text-muted-foreground">{item.crop_name} · {item.company}</p>
                      </div>
                      <button
                        onClick={() => { removeItem(item.variety_id); toast.info("Item removed"); }}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 bg-muted rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.variety_id, Math.max(item.min_order_qty, item.quantity - 1000))}
                          className="p-2 hover:text-primary transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-semibold min-w-[60px] text-center">{item.quantity.toLocaleString()}</span>
                        <button
                          onClick={() => updateQuantity(item.variety_id, item.quantity + 1000)}
                          className="p-2 hover:text-primary transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <select
                        value={item.delivery_type}
                        onChange={(e) => updateDelivery(item.variety_id, e.target.value as "local" | "250km")}
                        className="text-xs px-3 py-2 rounded-lg border border-border bg-card text-foreground"
                      >
                        <option value="local">Local Delivery</option>
                        <option value="250km">250+ km</option>
                      </select>

                      <span className="ml-auto font-bold text-primary text-lg">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">Order Summary</h3>

              <div className="space-y-3 text-sm">
                {items.map((item) => (
                  <div key={item.variety_id} className="flex justify-between text-muted-foreground">
                    <span>{item.variety_name}</span>
                    <span>₹{itemTotal(item).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
                <span className="font-display font-bold text-foreground">Grand Total</span>
                <span className="font-display text-2xl font-bold text-primary" id="cartTotal">₹{grandTotal.toLocaleString()}</span>
              </div>

              {!user ? (
                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 gradient-cta text-primary-foreground py-4 rounded-xl font-semibold text-center hover:shadow-elevated transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" /> Login to Checkout
                </button>
              ) : (
                <button
                  onClick={handleCheckout}
                  className="block w-full gradient-cta text-primary-foreground py-4 rounded-xl font-semibold text-center mt-6 hover:shadow-elevated transition-all hover:scale-[1.02]"
                >
                  Proceed to Checkout
                </button>
              )}

              <button
                onClick={() => { clearItems(); toast.info("Cart cleared"); }}
                className="w-full text-sm text-muted-foreground hover:text-destructive mt-3 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
