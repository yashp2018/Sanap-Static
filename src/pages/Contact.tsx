import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { validateContact } from "@/lib/validation";
import contactHero from "@/assets/Contact.png";

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
      <section className="relative h-[420px] md:h-[520px] flex items-center overflow-hidden">
        {/* Background image */}
        <img
          src={contactHero}
          alt="Sanap Hi-Tech Nursery"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

        <div className="container-nursery relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white rounded-full px-5 py-2 text-sm font-semibold mb-6"
            >
              <MapPin className="w-4 h-4 text-green-400" /> Nashik, Maharashtra
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl md:text-6xl font-bold text-white mb-4"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.6)" }}
            >
              Contact Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-lg md:text-xl text-white/90 leading-relaxed"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
            >
              Get in touch for bulk orders, quotes, and inquiries
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3 mt-8"
            >
              {[
                { label: "Call Us", href: "tel:+917447770803", icon: Phone },
                { label: "WhatsApp", href: "https://wa.me/919823044556", icon: Phone },
              ].map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={label === "WhatsApp" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105 shadow-lg"
                >
                  <Icon className="w-4 h-4" /> {label}
                </a>
              ))}
            </motion.div>
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
                  { icon: Mail, label: "Info Email", value: "info@sanapnurseryindia.com", href: "mailto:info@sanapnurseryindia.com" },
                  { icon: Mail, label: "Admin Email", value: "admin@sanapnurseryindia.com", href: "mailto:admin@sanapnurseryindia.com" },
                  { icon: Mail, label: "Sales Email", value: "sales@sanapnurseryindia.com", href: "mailto:sales@sanapnurseryindia.com" },
                  { icon: MapPin, label: "Address", value: "Next to Amogha Vidhnyan Vidhyalaya, Preeti Dinesh Road, Near MUHS, Tal. Dindori, Dist. Nashik, Maharashtra, India", href: "https://www.google.com/maps/place/Sanap+Nursery+India+Pvt+Ltd/@20.091827,73.8053781,17z" },
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

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-cta flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">Find Us Here</h2>
                <p className="text-sm text-muted-foreground">Next to Amogha Vidhnyan Vidhyalaya, Preeti Dinesh Road, Near MUHS, Tal. Dindori, Dist. Nashik</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-elevated border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3748.8601353930226!2d73.80318!3d20.09182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdde9ad99774d5b%3A0xe353cdd2e2d34bc8!2sSanap%20Nursery%20India%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sanap Hi-Tech Nursery — Next to Amogha Vidhnyan Vidhyalaya, Preeti Dinesh Road, Near MUHS, Tal. Dindori, Dist. Nashik"
                className="w-full"
              />
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                📍 Next to Amogha Vidhnyan Vidhyalaya, Preeti Dinesh Road, Near MUHS, Tal. Dindori, Dist. Nashik, Maharashtra
              </p>
              <a
                href="https://www.google.com/maps/place/Sanap+Nursery+India+Pvt+Ltd/@20.091827,73.8053781,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 gradient-cta text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-elevated transition-all hover:scale-105 shrink-0"
              >
                <MapPin className="w-4 h-4" /> Open in Google Maps
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
