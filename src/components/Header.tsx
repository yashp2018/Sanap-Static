import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Phone, User, ChevronDown, Mail, Globe, LogOut, LayoutDashboard, Sprout, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { categories } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/S-LOGO.png";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isHome = location.pathname === "/";
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <>
      {/* Top Bar */}
      <div className="gradient-hero text-primary-foreground text-sm py-2.5 hidden md:block">
        <div className="container-nursery flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="mailto:info.sanapnursery@gmail.com" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Mail className="w-3.5 h-3.5" /> info.sanapnursery@gmail.com
            </a>
            <a href="tel:+917447770803" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Phone className="w-3.5 h-3.5" /> +91 74477 70803
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative" onMouseLeave={() => setLangDropdownOpen(false)}>
              <button
                onMouseEnter={() => setLangDropdownOpen(true)}
                className="flex items-center gap-1.5 hover:text-accent transition-colors px-2 py-1 rounded-md hover:bg-primary-foreground/10"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="font-medium">{language === "en" ? "English" : language === "hi" ? "हिंदी" : "मराठी"}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${langDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 min-w-[140px] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-[100]"
                  >
                    <button
                      onClick={() => { setLanguage("en"); setLangDropdownOpen(false); }}
                      className={`block w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                        language === "en" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => { setLanguage("hi"); setLangDropdownOpen(false); }}
                      className={`block w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                        language === "hi" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      हिंदी
                    </button>
                    <button
                      onClick={() => { setLanguage("mr"); setLangDropdownOpen(false); }}
                      className={`block w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                        language === "mr" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      मराठी
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="h-4 w-px bg-primary-foreground/30" />
            <span className="font-medium flex items-center gap-1.5"><Sprout className="w-3.5 h-3.5 text-accent" /> 28+ Years of Farming Excellence</span>
          </div>
        </div>
      </div>

      {/* Main Header - Glass Effect */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-effect shadow-elevated"
            : isHome
            ? "bg-transparent"
            : "glass-effect"
        }`}
      >
        <div className="container-nursery flex items-center justify-between h-16 md:h-20">
          {/* Logo - Coin Form */}
          <Link to="/" className="group">
            <img 
              src={logo} 
              alt="Sanap Hi-Tech Nursery" 
              className="w-14 h-14 md:w-16 md:h-16 rounded-full shadow-elevated group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border-2 border-primary/20" 
            />
          </Link>

          {/* Desktop Mega Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className="group relative px-3 py-2">
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">Home</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>

            {/* Products Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className="group relative px-3 py-2 flex items-center gap-1.5">
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">Products</span>
                <ChevronDown className={`w-4 h-4 text-foreground group-hover:text-primary transition-all duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-border/30 overflow-hidden"
                  >
                    {categories.filter(c => c.crops.length > 0).map((cat, idx) => (
                      <Link
                        key={cat.id}
                        to={`/products?category=${cat.id}`}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors group/item ${
                          idx !== 0 ? 'border-t border-border/20' : ''
                        }`}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <span className="font-medium text-foreground group-hover/item:text-primary transition-colors">{cat.name}</span>
                      </Link>
                    ))}
                    <Link
                      to="/products"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-primary/5 text-primary font-semibold text-sm hover:bg-primary/10 transition-colors border-t border-border/20"
                    >
                      View All Products <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/grafting" className="group relative px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">Grafting</span>
                <span className="text-[10px] font-bold bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">NEW</span>
              </div>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
            
            <Link to="/process" className="group relative px-3 py-2">
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">Process</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
            
            <Link to="/infrastructure" className="group relative px-3 py-2">
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">Infrastructure</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
            
            <Link to="/gallery" className="group relative px-3 py-2">
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">Gallery</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
            
            <Link to="/about" className="group relative px-3 py-2">
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">About</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
            
            <Link to="/contact" className="group relative px-3 py-2">
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">Contact</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* User menu */}
            <div className="relative hidden md:block" onMouseLeave={() => setUserDropdownOpen(false)}>
              {user ? (
                <button
                  onMouseEnter={() => setUserDropdownOpen(true)}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-muted"
                >
                  <div className="w-7 h-7 rounded-full gradient-cta flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link to="/login" className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors">
                  <User className="w-4 h-4" /> Login
                </Link>
              )}
              <AnimatePresence>
                {user && userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-border/30 overflow-hidden z-[100]"
                  >
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-primary" /> My Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors border-t border-border/20">
                        <LayoutDashboard className="w-4 h-4 text-accent" /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-destructive hover:bg-destructive/5 transition-colors border-t border-border/20">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl gradient-cta hover:shadow-elevated transition-all group"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-white text-accent text-[10px] font-bold rounded-full flex items-center justify-center shadow-card"
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </motion.span>
              )}
            </Link>

            <Link
              to="/products"
              className="hidden md:inline-flex gradient-cta text-primary-foreground px-6 py-2.5 rounded-full font-semibold text-sm hover:shadow-elevated transition-all hover:scale-105 btn-ripple"
            >
              Order Now
            </Link>

            <button
              className="lg:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-border bg-card overflow-hidden"
            >
              <nav className="container-nursery py-6 flex flex-col gap-1">
                {[
                  { to: "/", label: "Home" },
                  { to: "/products", label: "Products" },
                  { to: "/grafting", label: "Grafting" },
                  { to: "/process", label: "Process" },
                  { to: "/infrastructure", label: "Infrastructure" },
                  { to: "/gallery", label: "Gallery" },
                  { to: "/about", label: "About" },
                  { to: "/contact", label: "Contact" },
                  { to: "/login", label: "Login / Register" },
                  { to: "/dashboard", label: "My Dashboard" },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="py-3 px-4 rounded-xl font-medium hover:text-primary hover:bg-muted transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/cart"
                  className="py-3 px-4 rounded-xl font-medium hover:text-primary hover:bg-muted transition-all flex items-center justify-between"
                >
                  Cart
                  {totalItems > 0 && (
                    <span className="text-xs bg-primary text-primary-foreground rounded-full px-2.5 py-0.5">{totalItems}</span>
                  )}
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
