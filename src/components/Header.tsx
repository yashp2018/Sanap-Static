import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, UserRound, ChevronDown, Globe, LogOut, LayoutDashboard, Sprout, ArrowRight, Settings } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { categories } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/S-LOGO.png";

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
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-52 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-border/30 overflow-hidden"
                >
                  {categories.filter(c => c.crops.length > 0).map((cat, idx) => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${cat.id}`}
                      className={`flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors group/item ${idx !== 0 ? "border-t border-border/20" : ""}`}
                    >
                      <Sprout className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-medium text-foreground group-hover/item:text-primary transition-colors text-sm">{cat.name}</span>
                    </Link>
                  ))}
                  <Link
                    to="/products"
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary/5 text-primary font-semibold text-sm hover:bg-primary/10 transition-colors border-t border-border/20"
                  >
                    {t("viewAllProducts")} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
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
