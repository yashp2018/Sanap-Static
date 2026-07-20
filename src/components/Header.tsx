import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, UserRound, ChevronDown, Globe, LogOut, LayoutDashboard, Sprout, ArrowRight, Settings } from "lucide-react";
import { Icon } from "@iconify/react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { categories } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/S-LOGO.png";

const CAT_CONFIG: Record<string, { icon: string; gradient: string; lightBg: string; textColor: string }> = {
  vegetables: {
    icon: "mdi:carrot",
    gradient: "from-green-500 to-emerald-600",
    lightBg: "bg-green-50",
    textColor: "text-green-700",
  },
  fruits: {
    icon: "mdi:fruit-watermelon",
    gradient: "from-orange-400 to-yellow-500",
    lightBg: "bg-orange-50",
    textColor: "text-orange-700",
  },
  flowers: {
    icon: "mdi:flower",
    gradient: "from-pink-500 to-purple-500",
    lightBg: "bg-pink-50",
    textColor: "text-pink-700",
  },
  "other-plants": {
    icon: "mdi:tree",
    gradient: "from-emerald-600 to-green-800",
    lightBg: "bg-emerald-50",
    textColor: "text-emerald-700",
  },
};

const CROP_EMOJI: Record<string, string> = {
  tomato: "🍅", chili: "🌶️", brinjal: "🍆", capsicum: "🫑",
  cucumber: "🥒", watermelon: "🍉", cabbage: "🥬", cauliflower: "🥦",
  bittergourd: "🌿", bottlegourd: "🌿", papaya: "🍈", muskmelon: "🍈",
  marigold: "🌸",
};

const LANGS = [
  { code: "en" as const, label: "English", short: "EN" },
  { code: "hi" as const, label: "हिंदी",   short: "HI" },
  { code: "mr" as const, label: "मराठी",   short: "MR" },
];

export default function Header() {
  const [scrolled, setScrolled]           = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [productsOpen, setProductsOpen]   = useState(false);
  const [langOpen, setLangOpen]           = useState(false);
  const [userOpen, setUserOpen]           = useState(false);
  const langCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const productsCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { language, setLanguage, t } = useLanguage();
  const { totalItems }               = useCart();
  const { user, logout }             = useAuth();
  const location                     = useLocation();
  const navigate                     = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setLangOpen(false); setUserOpen(false); }, [location]);

  const handleLogout = async () => { await logout(); navigate("/"); };

  const isHome  = location.pathname === "/";
  const isAdmin = location.pathname.startsWith("/admin");
  if (isAdmin) return null;

  const navLinks = [
    { to: "/",              key: "home" },
    { to: "/about",         key: "about" },
    { to: "/grafting",      key: "grafting" },
    { to: "/process",       key: "process" },
    { to: "/infrastructure",key: "infrastructure" },
    { to: "/gallery",       key: "gallery" },
    { to: "/contact",       key: "contact" },
  ] as const;

  const currentLang = LANGS.find(l => l.code === language)!;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-effect shadow-elevated" : isHome ? "bg-transparent" : "glass-effect"
      }`}
    >
      <div className="container-nursery flex items-center justify-between h-20 md:h-24">

        {/* ── Logo ── */}
        <Link to="/" className="group shrink-0">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-white shadow-elevated border-2 border-primary/20 ring-2 ring-primary/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <img src={logo} alt="Sanap Hi-Tech Nursery" className="w-full h-full object-cover" />
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden lg:flex items-center gap-1">

          <Link to="/" className="group relative px-3 py-2">
            <span className="font-medium text-foreground group-hover:text-primary transition-colors text-lg">{t("home")}</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>

          {/* Products dropdown */}
          <div
            className="relative"
            onMouseEnter={() => { if (productsCloseTimer.current) clearTimeout(productsCloseTimer.current); setProductsOpen(true); }}
            onMouseLeave={() => { productsCloseTimer.current = setTimeout(() => setProductsOpen(false), 300); }}
          >
            <button className="group relative px-3 py-2 flex items-center gap-1">
              <span className="font-medium text-foreground group-hover:text-primary transition-colors text-lg">{t("products")}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-foreground group-hover:text-primary transition-all duration-200 ${productsOpen ? "rotate-180" : ""}`} />
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </button>
            <AnimatePresence>
              {productsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[520px] bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/20 overflow-hidden z-[200]"
                >
                  {/* Header strip */}
                  <div className="px-5 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-border/20 flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Explore Categories</span>
                    <span className="text-xs text-muted-foreground">{categories.reduce((s, c) => s + c.crops.length, 0)} crops available</span>
                  </div>

                  {/* Category cards grid */}
                  <div className="grid grid-cols-3 gap-3 p-4">
                    {categories.filter(c => c.crops.length > 0).map((cat) => {
                      const cfg = CAT_CONFIG[cat.id] ?? { icon: "mdi:leaf", gradient: "from-green-500 to-teal-600", lightBg: "bg-green-50", textColor: "text-green-700" };
                      const totalVarieties = cat.crops.reduce((s, cr) => s + cr.varieties, 0);
                      return (
                        <Link
                          key={cat.id}
                          to={`/products?category=${cat.id}`}
                          className="group/card flex flex-col rounded-xl border border-border/30 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                        >
                          {/* Gradient icon banner */}
                          <div className={`relative h-16 bg-gradient-to-br ${cfg.gradient} flex items-center justify-center overflow-hidden`}>
                            <div className="absolute w-14 h-14 rounded-full bg-white/10 -top-4 -right-4" />
                            <motion.div whileHover={{ rotate: 8, scale: 1.15 }} transition={{ type: "spring", stiffness: 300 }}>
                              <Icon icon={cfg.icon} className="w-8 h-8 text-white drop-shadow" />
                            </motion.div>
                          </div>
                          {/* Body */}
                          <div className="p-3 flex flex-col gap-1.5 bg-white group-hover/card:bg-muted/30 transition-colors">
                            <span className="font-display font-bold text-sm text-foreground group-hover/card:text-primary transition-colors leading-tight">{cat.name}</span>
                            <div className="flex gap-1.5">
                              <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${cfg.lightBg} ${cfg.textColor}`}>
                                <Icon icon="mdi:sprout" className="w-2.5 h-2.5" />{cat.crops.length} crops
                              </span>
                              <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${cfg.lightBg} ${cfg.textColor}`}>
                                <Icon icon="mdi:seed" className="w-2.5 h-2.5" />{totalVarieties} var.
                              </span>
                            </div>
                            {/* Crop emoji chips */}
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {cat.crops.slice(0, 3).map(cr => (
                                <span key={cr.id} className="text-[10px] bg-secondary/50 text-secondary-foreground rounded-full px-1.5 py-0.5 font-medium">
                                  {CROP_EMOJI[cr.id] ?? "🌿"} {cr.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Footer CTA */}
                  <div className="px-4 pb-4">
                    <Link
                      to="/products"
                      className="group/cta flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
                    >
                      <span>{t("viewAllProducts")}</span>
                      <motion.span animate={{ x: 0 }} whileHover={{ x: 4 }}>
                        <ArrowRight className="w-4 h-4" />
                      </motion.span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navLinks.slice(1).map(link => (
            <Link key={link.to} to={link.to} className="group relative px-3 py-2">
              <span className="font-medium text-foreground group-hover:text-primary transition-colors text-lg">{t(link.key)}</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
        </nav>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-2">

          {/* Language Switcher */}
          <div
            className="relative"
            onMouseEnter={() => { if (langCloseTimer.current) clearTimeout(langCloseTimer.current); setLangOpen(true); }}
            onMouseLeave={() => { langCloseTimer.current = setTimeout(() => setLangOpen(false), 300); }}
          >
            <button
              onClick={() => setLangOpen(v => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-muted transition-all text-sm font-semibold text-foreground"
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>{currentLang.short}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${langOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 min-w-[150px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100]"
                >
                  {LANGS.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                      className={`flex items-center gap-3 w-full px-5 py-3.5 text-left text-sm font-medium transition-colors ${
                        language === lang.code ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {language === lang.code && <span className="w-2 h-2 rounded-full bg-white shrink-0" />}
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative p-2.5 rounded-xl gradient-cta hover:shadow-elevated transition-all">
            <ShoppingCart className="w-5 h-5 text-white" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-white text-accent text-[10px] font-bold rounded-full flex items-center justify-center shadow-card"
              >
                {totalItems > 99 ? "99+" : totalItems}
              </motion.span>
            )}
          </Link>

          {/* User / Profile */}
          <div
            className="relative hidden md:block"
            onMouseEnter={() => { if (userCloseTimer.current) clearTimeout(userCloseTimer.current); setUserOpen(true); }}
            onMouseLeave={() => { userCloseTimer.current = setTimeout(() => setUserOpen(false), 300); }}
          >
            {user ? (
              <>
                <button
                  onMouseEnter={() => { if (userCloseTimer.current) clearTimeout(userCloseTimer.current); }}
                  onClick={() => setUserOpen(v => !v)}
                  className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-muted transition-all"
                  title={user.name}
                >
                  <div className="w-9 h-9 rounded-full gradient-cta flex items-center justify-center text-primary-foreground text-sm font-bold shadow-card">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className={`w-3 h-3 text-foreground transition-transform ${userOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-border/30 overflow-hidden z-[100]"
                    >
                      <div className="px-4 py-3 border-b border-border/20 bg-muted/30">
                        <p className="font-semibold text-foreground text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Link to="/dashboard" className="flex items-center gap-2.5 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-primary" /> {t("myDashboard")}
                      </Link>
                      {user.role === "admin" && (
                        <Link to="/admin" className="flex items-center gap-2.5 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors border-t border-border/20">
                          <Settings className="w-4 h-4 text-accent" /> {t("adminPanel")}
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-destructive hover:bg-destructive/5 transition-colors border-t border-border/20"
                      >
                        <LogOut className="w-4 h-4" /> {t("logout")}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-muted transition-all text-sm font-medium text-foreground"
              >
                <UserRound className="w-4 h-4" /> {t("login")}
              </Link>
            )}
          </div>

          {/* Order Now CTA */}
          <Link
            to="/products"
            className="hidden lg:inline-flex gradient-cta text-primary-foreground px-5 py-2.5 rounded-full font-semibold text-lg hover:shadow-elevated transition-all hover:scale-105 btn-ripple"
          >
            {t("orderNow")}
          </Link>

          {/* Mobile hamburger */}
          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-border bg-card overflow-hidden"
          >
            <nav className="container-nursery py-5 flex flex-col gap-1">
              <Link to="/" className="py-3 px-4 rounded-xl font-medium hover:text-primary hover:bg-muted transition-all text-base">{t("home")}</Link>
              <Link to="/products" className="py-3 px-4 rounded-xl font-medium hover:text-primary hover:bg-muted transition-all text-base">{t("products")}</Link>
              {navLinks.slice(1).map(link => (
                <Link key={link.to} to={link.to} className="py-3 px-4 rounded-xl font-medium hover:text-primary hover:bg-muted transition-all text-base">
                  {t(link.key)}
                </Link>
              ))}

              <Link to="/cart" className="py-3 px-4 rounded-xl font-medium hover:text-primary hover:bg-muted transition-all flex items-center justify-between text-sm">
                {t("cart")}
                {totalItems > 0 && <span className="text-xs bg-primary text-primary-foreground rounded-full px-2.5 py-0.5">{totalItems}</span>}
              </Link>

              {user ? (
                <>
                  <div className="mx-4 my-1 border-t border-border/30" />
                  <div className="px-4 py-2 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full gradient-cta flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/dashboard" className="py-3 px-4 rounded-xl font-medium hover:text-primary hover:bg-muted transition-all flex items-center gap-2 text-sm">
                    <LayoutDashboard className="w-4 h-4 text-primary" /> {t("myDashboard")}
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/admin" className="py-3 px-4 rounded-xl font-medium hover:text-primary hover:bg-muted transition-all flex items-center gap-2 text-sm">
                      <Settings className="w-4 h-4 text-accent" /> {t("adminPanel")}
                    </Link>
                  )}
                  <button onClick={handleLogout} className="py-3 px-4 rounded-xl font-medium text-destructive hover:bg-destructive/5 transition-all flex items-center gap-2 text-sm text-left">
                    <LogOut className="w-4 h-4" /> {t("logout")}
                  </button>
                </>
              ) : (
                <Link to="/login" className="py-3 px-4 rounded-xl font-medium hover:text-primary hover:bg-muted transition-all flex items-center gap-2 text-sm">
                  <UserRound className="w-4 h-4" /> {t("login")}
                </Link>
              )}

              <div className="mx-4 my-1 border-t border-border/30" />
              <div className="px-4 py-2">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Language
                </p>
                <div className="flex gap-2">
                  {LANGS.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setMobileOpen(false); }}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                        language === lang.code
                          ? "bg-primary text-white shadow-sm"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              <Link
                to="/products"
                className="mx-4 mt-2 gradient-cta text-primary-foreground py-3 rounded-full font-semibold text-sm text-center hover:shadow-elevated transition-all"
              >
                {t("orderNow")}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
