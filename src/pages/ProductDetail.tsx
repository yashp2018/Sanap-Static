import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Truck, Clock, Package, Check, Leaf, FlaskConical, Lightbulb, BarChart3, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchVariety, ApiVariety, resolvePrice, resolveDelivery } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import SeasonAvailability from "@/components/SeasonAvailability";
import PlantReadinessTracker from "@/components/PlantReadinessTracker";
import BulkQuoteForm from "@/components/BulkQuoteForm";

const BULK_THRESHOLD = 50000;

export default function ProductDetail() {
  const { id: slug } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [variety, setVariety] = useState<ApiVariety | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showBulkQuote, setShowBulkQuote] = useState(false);
  const [quantity, setQuantity] = useState(15000);
  const [deliveryType, setDeliveryType] = useState<"local" | "250km">("local");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchVariety(slug)
      .then(r => setVariety(r.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !variety) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🌿</p>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Product not found</h2>
          <Link to="/products" className="text-primary hover:underline">Back to catalog</Link>
        </div>
      </div>
    );
  }

  const unitPrice      = resolvePrice(variety, quantity);
  const deliveryCharge = resolveDelivery(variety, quantity, deliveryType);
  const total          = unitPrice * quantity + deliveryCharge;
  const priceTier      = quantity >= 30000 ? "30K+ Rate" : quantity >= 15000 ? "15K+ Rate" : "Ex-Factory";
  const minQty         = variety.min_order_qty || 1000;
  const isBulkOrder    = quantity >= BULK_THRESHOLD;

  const handleAddToCart = async () => {
    if (!user) {
      // Save the current product URL so we return here after login
      sessionStorage.setItem("returnTo", window.location.pathname);
      toast.info("Please login to add items to cart");
      navigate("/login");
      return;
    }
    if (quantity < minQty) {
      toast.error(`Minimum order is ${minQty.toLocaleString()} plants`);
      return;
    }
    setAdding(true);
    try {
      await addItem(variety.id, quantity, deliveryType);
      toast.success(`Added ${quantity.toLocaleString()} ${variety.name} plants to cart!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleWhatsAppEnquiry = () => {
    const msg = encodeURIComponent(
      `Hi, I'm interested in ordering:\n\n` +
      `🌱 *${variety.name}* (${variety.crop_name})\n` +
      `Company: ${variety.company}\n` +
      `Quantity: ${quantity.toLocaleString()} plants\n` +
      `Delivery: ${deliveryType === "local" ? "Local" : "250+ km"}\n` +
      `Estimated Total: ₹${total.toLocaleString()}\n\n` +
      `Please share availability and delivery schedule.`
    );
    window.open(`https://wa.me/917447770803?text=${msg}`, "_blank");
  };

  const characteristics: Record<string, string | undefined> = {
    Segment:             variety.char_segment,
    Size:                variety.char_size,
    Colour:              variety.char_colour,
    Shape:               variety.char_shape,
    "Plant Type":        variety.char_plant_type,
    "Avg Weight":        variety.char_avg_weight,
    "Maturity Days":     variety.char_maturity_days,
    "Sowing Season":     variety.char_sowing_season,
    "Harvesting Season": variety.char_harvesting_season,
    Vigour:              variety.char_vigour,
  };
  const hasChars = Object.values(characteristics).some(Boolean);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="gradient-hero text-primary-foreground py-6">
        <div className="container-nursery">
          <Link to="/products" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-3 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-primary-foreground/60 text-sm">{variety.crop_name}</p>
              <h1 className="font-display text-3xl md:text-5xl font-bold">{variety.name}</h1>
            </div>
            <div className="ml-auto hidden md:flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-primary-foreground/20">
              <span className="text-primary-foreground/70 text-sm">by</span>
              <span className="font-display text-xl font-bold text-primary-foreground">{variety.company}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-nursery py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Left: Image + Info ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="rounded-2xl overflow-hidden shadow-elevated mb-6">
              <img
                src={variety.image_url || "/SA.png"}
                alt={`${variety.name} ${variety.crop_name}`}
                className="w-full h-80 lg:h-[460px] object-cover"
              />
            </div>

            {/* Feature badges */}
            {variety.features?.length > 0 && (
              <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card mb-6">
                <div className="flex flex-wrap gap-2">
                  {variety.features.map((f) => (
                    <span key={f} className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
                      <Check className="w-3 h-3" /> {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Season Availability */}
            {variety.available_months?.length > 0 && (
              <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card mb-6">
                <SeasonAvailability availableMonths={variety.available_months} />
              </div>
            )}

            {/* Features / Advantages / Agronomic Tips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {variety.features?.length > 0 && (
                <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-card">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-xl gradient-cta flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <h3 className="font-display font-bold text-foreground">Features</h3>
                  </div>
                  <ul className="space-y-2">
                    {variety.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {variety.advantages?.length > 0 && (
                <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-card">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <h3 className="font-display font-bold text-foreground">Advantages</h3>
                  </div>
                  <ul className="space-y-2">
                    {variety.advantages.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {variety.agronomic_tips?.length > 0 && (
                <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-card">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                      <FlaskConical className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <h3 className="font-display font-bold text-foreground">Agronomic Tips</h3>
                  </div>
                  <ul className="space-y-2">
                    {variety.agronomic_tips.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-3.5 h-3.5 text-secondary-foreground mt-0.5 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Characteristics Table */}
            {hasChars && (
              <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-9 h-9 rounded-xl gradient-cta flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">Characteristics</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(characteristics)
                    .filter(([, val]) => val)
                    .map(([key, value]) => (
                      <div key={key} className="bg-muted rounded-xl p-3">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">{key}</p>
                        <p className="text-sm font-bold text-foreground">{value}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* ── Right: Pricing & Order ── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="sticky top-24 space-y-5">

              {/* Mobile company badge */}
              <div className="md:hidden flex items-center gap-2 text-muted-foreground text-sm">
                <span>by</span>
                <span className="font-semibold text-foreground">{variety.company}</span>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted rounded-xl p-4 text-center">
                  <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-sm font-semibold text-foreground">{variety.duration_days} Days</p>
                  <p className="text-xs text-muted-foreground">Ready</p>
                </div>
                <div className="bg-muted rounded-xl p-4 text-center">
                  <Package className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-sm font-semibold text-foreground">
                    {variety.stock >= 1000 ? `${(variety.stock / 1000).toFixed(0)}K` : variety.stock}
                  </p>
                  <p className="text-xs text-muted-foreground">In Stock</p>
                </div>
                <div className="bg-muted rounded-xl p-4 text-center">
                  <Truck className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-sm font-semibold text-foreground">{minQty.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Min Order</p>
                </div>
              </div>

              {/* Pricing Table */}
              <div className="bg-muted rounded-xl p-5">
                <h3 className="font-display font-semibold text-foreground mb-3">Bulk Pricing (per plant)</h3>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  {[
                    { label: "Ex-Factory", price: variety.price_ex_factory, active: priceTier === "Ex-Factory" },
                    { label: "15K+ Rate",  price: variety.price_15k,        active: priceTier === "15K+ Rate" },
                    { label: "30K+ Rate",  price: variety.price_30k,        active: priceTier === "30K+ Rate" },
                  ].map((p) => (
                    <div
                      key={p.label}
                      className={`rounded-lg p-3 transition-all ${p.active ? "gradient-cta text-primary-foreground shadow-card" : "bg-card"}`}
                    >
                      <p className={`text-xs ${p.active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{p.label}</p>
                      <p className="text-lg font-bold">₹{Number(p.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity & Delivery */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">Quantity (plants)</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(minQty, parseInt(e.target.value) || minQty))}
                    min={minQty}
                    step={1000}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">Delivery</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { type: "local" as const, label: "Local Delivery",   charge: variety.delivery_local_charge },
                      { type: "250km" as const, label: "250+ km Delivery", charge: variety.delivery_250km_charge },
                    ].map((d) => (
                      <button
                        key={d.type}
                        onClick={() => setDeliveryType(d.type)}
                        className={`p-3 rounded-xl border text-sm text-left transition-all ${
                          deliveryType === d.type
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        <p className="font-semibold">{d.label}</p>
                        <p className="text-xs">₹{Number(d.charge).toFixed(2)}/plant</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Unit Price ({priceTier})</span>
                  <span className="text-foreground font-semibold">₹{unitPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Qty × {quantity.toLocaleString()}</span>
                  <span className="text-foreground font-semibold">₹{(unitPrice * quantity).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-foreground font-semibold">₹{deliveryCharge.toLocaleString()}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-display font-bold text-foreground">Total</span>
                  <span className="font-display text-2xl font-bold text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Add to Cart — shows login prompt if not logged in */}
              {!user ? (
                <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-4 text-center">
                  <p className="text-sm font-semibold text-foreground mb-1">🔒 Login Required to Order</p>
                  <p className="text-xs text-muted-foreground mb-3">Create a free account to place bulk orders</p>
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      onClick={() => sessionStorage.setItem("returnTo", window.location.pathname)}
                      className="flex-1 gradient-cta text-primary-foreground py-2.5 rounded-xl font-semibold text-sm text-center hover:shadow-elevated transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => sessionStorage.setItem("returnTo", window.location.pathname)}
                      className="flex-1 border-2 border-primary text-primary py-2.5 rounded-xl font-semibold text-sm text-center hover:bg-primary/5 transition-all"
                    >
                      Register Free
                    </Link>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={adding || variety.stock === 0}
                  className="w-full gradient-cta text-primary-foreground py-4 rounded-xl font-semibold text-lg hover:shadow-elevated transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {variety.stock === 0 ? "Out of Stock" : adding ? "Adding..." : "Add to Cart"}
                </button>
              )}

              {/* WhatsApp Enquiry */}
              <button
                onClick={handleWhatsAppEnquiry}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#25D366] text-[#25D366] font-semibold text-sm hover:bg-[#25D366]/5 transition-all"
              >
                <MessageCircle className="w-4 h-4" /> Enquire on WhatsApp
              </button>

              {/* Bulk Quote CTA */}
              {isBulkOrder && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-accent/10 border border-accent/30 rounded-xl p-4 text-center"
                >
                  <p className="text-sm font-semibold text-foreground mb-1">🌟 Bulk Order Detected!</p>
                  <p className="text-xs text-muted-foreground mb-3">Orders of 50,000+ plants qualify for special pricing</p>
                  <button
                    onClick={() => setShowBulkQuote(true)}
                    className="gradient-gold text-white px-5 py-2 rounded-lg font-semibold text-sm hover:shadow-gold transition-all"
                  >
                    Request Custom Quote
                  </button>
                </motion.div>
              )}

              {/* Plant Readiness Tracker */}
              <PlantReadinessTracker durationDays={variety.duration_days} cropName={variety.crop_name} />

            </div>
          </motion.div>
        </div>
      </div>

      {/* Bulk Quote Modal */}
      <AnimatePresence>
        {showBulkQuote && (
          <BulkQuoteForm
            varietyName={variety.name}
            cropName={variety.crop_name}
            quantity={quantity}
            unitPrice={unitPrice}
            onClose={() => setShowBulkQuote(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
