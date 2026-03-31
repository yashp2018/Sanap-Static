import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { validateContact } from "@/lib/validation";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors(er => ({ ...er, [key]: "" }));
  };

  const inputCls = (key: string) =>
    `w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors ${
      errors[key] ? "border-red-500 focus:ring-red-200" : "border-border focus:ring-primary/30"
    }`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateContact(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSent(true);
    toast.success("Thank you! We'll contact you shortly.");
    setForm({ name: "", phone: "", email: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="min-h-screen">
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container-nursery">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-primary-foreground/80">Get in touch for bulk orders, quotes, and inquiries</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-nursery">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Get In Touch</h2>
              <div className="space-y-6">
                {[
                  { icon: Phone, label: "Phone", value: "+91 74477 70803 / 804 / 805", href: "tel:+917447770803" },
                  { icon: Mail, label: "Email", value: "info.sanapnursery@gmail.com", href: "mailto:info.sanapnursery@gmail.com" },
                  { icon: MapPin, label: "Address", value: "Near MUHS, Tal. Dindori, Dist. Nashik - 422 004, Maharashtra, India", href: "https://maps.google.com/?q=MUHS+Nashik" },
                  { icon: Clock, label: "Working Hours", value: "All Days: 9:00 AM – 6:30 PM", href: "#" },
                ].map((item) => (
                  <a key={item.label} href={item.href} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:gradient-cta group-hover:text-primary-foreground transition-all">
                      <item.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-semibold text-foreground">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 shadow-card" noValidate>
                <h3 className="font-display text-xl font-bold text-foreground mb-6">Send us a Message</h3>
                <div className="space-y-4">
                  <div>
                    <input type="text" placeholder="Your Name *" value={form.name} onChange={set("name")}
                      className={inputCls("name")} maxLength={100} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <input type="tel" placeholder="10-digit Phone Number *" value={form.phone} onChange={set("phone")}
                      className={inputCls("phone")} maxLength={15} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <input type="email" placeholder="Email (optional)" value={form.email} onChange={set("email")}
                      className={inputCls("email")} maxLength={255} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <textarea placeholder="Your Message (min 10 characters)" value={form.message} onChange={set("message")}
                      rows={4} className={`${inputCls("message")} resize-none`} maxLength={1000} />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>
                  <button type="submit"
                    className="w-full gradient-cta text-primary-foreground py-4 rounded-xl font-semibold hover:shadow-elevated transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> {sent ? "Sent! ✓" : "Send Message"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
