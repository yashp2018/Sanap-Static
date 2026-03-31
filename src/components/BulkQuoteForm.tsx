import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Props {
  varietyName: string;
  cropName: string;
  quantity: number;
  unitPrice: number;
  onClose: () => void;
}

export default function BulkQuoteForm({ varietyName, cropName, quantity, unitPrice, onClose }: Props) {
  const [form, setForm] = useState({ name: "", phone: "", state: "Maharashtra", notes: "" });
  const [sent, setSent] = useState(false);

  const estimatedTotal = (unitPrice * quantity).toLocaleString();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Please fill name and phone");
      return;
    }
    // Build WhatsApp message
    const msg = encodeURIComponent(
      `🌱 *Bulk Quote Request*\n\n` +
      `Variety: ${varietyName} (${cropName})\n` +
      `Quantity: ${quantity.toLocaleString()} plants\n` +
      `Estimated Value: ₹${estimatedTotal}\n\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `State: ${form.state}\n` +
      `Notes: ${form.notes || "None"}`
    );
    window.open(`https://wa.me/917447770803?text=${msg}`, "_blank");
    setSent(true);
    toast.success("Quote request sent via WhatsApp!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card rounded-2xl shadow-elevated border border-border w-full max-w-md">
        {/* Header */}
        <div className="gradient-hero text-primary-foreground p-6 rounded-t-2xl relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-primary-foreground/70 hover:text-primary-foreground">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">Bulk Quote Request</h3>
              <p className="text-primary-foreground/70 text-sm">50,000+ plants — special pricing</p>
            </div>
          </div>
          <div className="bg-primary-foreground/10 rounded-xl p-3 mt-3 text-sm">
            <p className="font-semibold">{varietyName} <span className="font-normal opacity-70">({cropName})</span></p>
            <p className="text-primary-foreground/80">{quantity.toLocaleString()} plants · Est. ₹{estimatedTotal}</p>
          </div>
        </div>

        {/* Form */}
        {!sent ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Our team will contact you within <strong className="text-foreground">2 hours</strong> with a custom quote and delivery schedule.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Full Name *</label>
                <input
                  type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name" required maxLength={100}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Phone *</label>
                <input
                  type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 XXXXX" required maxLength={15}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">State</label>
              <select
                value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {["Maharashtra","Karnataka","Andhra Pradesh","Telangana","Tamil Nadu","Gujarat","Rajasthan","Madhya Pradesh","Uttar Pradesh","Other"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Additional Notes</label>
              <textarea
                value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="Delivery timeline, specific requirements..." rows={2} maxLength={300}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full gradient-cta text-primary-foreground py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-elevated transition-all hover:scale-[1.02]"
            >
              <MessageSquare className="w-4 h-4" /> Send via WhatsApp
            </button>
          </form>
        ) : (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h4 className="font-display text-xl font-bold text-foreground mb-2">Quote Request Sent!</h4>
            <p className="text-sm text-muted-foreground mb-4">Our team will call you within 2 hours with a custom bulk pricing offer.</p>
            <button onClick={onClose} className="gradient-cta text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm">
              Done
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
