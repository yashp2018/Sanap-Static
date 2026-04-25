import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, ArrowRight, Sprout } from "lucide-react";
import logo from "../assets/S-LOGO.png";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const location = useLocation();
  const { t } = useLanguage();
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <footer className="gradient-hero text-primary-foreground">
      {/* Newsletter */}
      <div className="border-b border-primary-foreground/10">
        <div className="container-nursery py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-bold mb-1">{t("stayUpdated")}</h3>
              <p className="text-primary-foreground/70 text-sm">{t("newsletterDesc")}</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-5 py-3 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-accent w-full md:w-72 text-sm"
              />
              <button className="gradient-gold text-accent-foreground px-6 py-3 rounded-full font-semibold text-sm hover:shadow-gold transition-all hover:scale-105 btn-ripple whitespace-nowrap flex items-center gap-2">
                {t("subscribe")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-nursery py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src={logo} alt="Sanap Hi-Tech Logo" className="w-14 h-14 rounded-xl object-contain bg-primary-foreground/10 p-1" />
              <div>
                <h3 className="font-display text-xl font-bold">Sanap Hi-Tech</h3>
                <p className="text-xs text-primary-foreground/60 uppercase tracking-widest">Premium Nursery</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              28+ years of excellence in providing premium grafted vegetable & fruit seedlings to farmers across India. Trusted by 5000+ farmers.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-5">{t("quickLinks")}</h4>
            <ul className="space-y-3 text-sm">
              {[
                { to: "/", key: "home" },
                { to: "/products", key: "products" },
                { to: "/about", key: "about" },
                { to: "/contact", key: "contact" },
                { to: "/login", key: "login" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-primary-foreground/70 hover:text-primary-foreground hover:translate-x-1 inline-block transition-all">
                    → {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Crops */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-5">{t("ourCrops")}</h4>
            <ul className="space-y-3 text-sm">
              {["Tomato", "Chili", "Brinjal", "Capsicum", "Watermelon", "Cucumber"].map((crop) => (
                <li key={crop}>
                  <Link to="/products" className="text-primary-foreground/70 hover:text-primary-foreground hover:translate-x-1 inline-flex items-center gap-2 transition-all">
                    <Sprout className="w-3.5 h-3.5 text-accent" /> {crop} Seedlings
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-5">{t("contactUs")}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-primary-foreground/50 mb-0.5">Phone</p>
                  <a href="tel:+917447770803" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors block">+91 74477 70803</a>
                  <a href="tel:+917447770804" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors block">+91 74477 70804</a>
                  <a href="tel:+917447770805" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors block">+91 74477 70805</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-primary-foreground/50 mb-0.5">Email</p>
                  <a href="mailto:info.sanapnursery@gmail.com" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors block">
                    info.sanapnursery@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-primary-foreground/50 mb-0.5">Address</p>
                  <span className="text-primary-foreground/80">Near MUHS, Tal. Dindori, Dist. Nashik - 422 004, Maharashtra, India</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/50">
          <p>© 2025 Sanap Hi-Tech Nursery. {t("allRightsReserved")}.</p>
          <div className="flex gap-6">
            <span>{t("privacyPolicy")}</span>
            <span>{t("termsConditions")}</span>
            <span>{t("refundPolicy")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
