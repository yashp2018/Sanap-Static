import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Leaf, Sprout, Flower2, Sun, Droplets, Wind, Users, TrendingUp, Shield } from "lucide-react";
import logo from "@/assets/S-LOGO.png";

// ── Floating animated blob ────────────────────────────────────
function Blob({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
      transition={{ duration: 7 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

// ── Floating leaf particle ────────────────────────────────────
function FloatingLeaf({ style, delay }: { style: React.CSSProperties; delay: number }) {
  return (
    <motion.div
      style={style}
      className="absolute pointer-events-none"
      animate={{ y: [-10, 10, -10], rotate: [-8, 8, -8], opacity: [0.15, 0.3, 0.15] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <Leaf className="w-5 h-5 text-emerald-400" />
    </motion.div>
  );
}

// ── Stat badge ────────────────────────────────────────────────
function StatBadge({ icon: Icon, label, value, delay, className }: {
  icon: any; label: string; value: string; delay: number; className: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className={`absolute flex items-center gap-2.5 bg-black/20 backdrop-blur-xl border border-emerald-500/20 rounded-2xl px-4 py-2.5 shadow-xl ${className}`}
    >
      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
        <Icon className="w-4 h-4 text-emerald-300" />
      </div>
      <div>
        <p className="text-[10px] text-white/40 leading-none">{label}</p>
        <p className="text-sm font-bold text-white leading-tight mt-0.5">{value}</p>
      </div>
    </motion.div>
  );
}

// ── Nursery illustration ──────────────────────────────────────
function NurseryIllustration() {
  const orbitItems = [
    { icon: Leaf,    angle: 0,   bg: "bg-emerald-500/25", color: "text-emerald-300" },
    { icon: Sprout,  angle: 72,  bg: "bg-lime-500/20",    color: "text-lime-300"    },
    { icon: Flower2, angle: 144, bg: "bg-amber-500/20",   color: "text-amber-300"   },
    { icon: Droplets,angle: 216, bg: "bg-cyan-500/20",    color: "text-cyan-300"    },
    { icon: Sun,     angle: 288, bg: "bg-yellow-500/20",  color: "text-yellow-300"  },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.9 }}
      className="relative w-64 h-64 mx-auto"
    >
      {/* Rotating rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-emerald-500/20 border-dashed"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        className="absolute inset-5 rounded-full border border-lime-500/15 border-dashed"
      />

      {/* Glow pulse */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-10 rounded-full bg-emerald-500/20 blur-xl"
      />

      {/* Center */}
      <div className="absolute inset-10 rounded-full bg-gradient-to-br from-emerald-800/60 to-green-900/40 backdrop-blur-sm border border-emerald-500/20 flex items-center justify-center">
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={logo} alt="Sanap" className="w-16 h-16 rounded-2xl shadow-2xl shadow-emerald-900/50" />
        </motion.div>
      </div>

      {/* Orbiting icons */}
      {orbitItems.map(({ icon: Icon, angle, bg, color }, i) => {
        const rad = (angle * Math.PI) / 180;
        const r = 100;
        const x = 128 + r * Math.cos(rad) - 20;
        const y = 128 + r * Math.sin(rad) - 20;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.12, type: "spring" }}
            whileHover={{ scale: 1.2 }}
            style={{ position: "absolute", left: x, top: y }}
            className={`w-10 h-10 rounded-xl ${bg} backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-lg cursor-pointer`}
          >
            <Icon className={`w-5 h-5 ${color}`} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ── Admin illustration ────────────────────────────────────────
function AdminIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.9 }}
      className="relative w-56 h-56 mx-auto"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-emerald-500/20 border-dashed"
      />
      <div className="absolute inset-6 rounded-full bg-gradient-to-br from-emerald-900/50 to-green-900/30 border border-emerald-500/20 flex items-center justify-center">
        <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-green-700/20 border border-emerald-500/30 flex items-center justify-center shadow-2xl">
            <Shield className="w-10 h-10 text-emerald-300" />
          </div>
        </motion.div>
      </div>
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const r = 88;
        const x = 112 + r * Math.cos(rad) - 8;
        const y = 112 + r * Math.sin(rad) - 8;
        return (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ delay: i * 0.2, duration: 2.5, repeat: Infinity }}
            style={{ position: "absolute", left: x, top: y }}
            className="w-4 h-4 rounded-full bg-emerald-400/40 border border-emerald-400/30"
          />
        );
      })}
    </motion.div>
  );
}

// ── Brand panel (left side) ───────────────────────────────────
export function BrandPanel({ variant }: { variant: "customer" | "admin" }) {
  const isAdmin = variant === "admin";

  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-10 relative overflow-hidden">
      {/* Deep green gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-green-950 to-[#071a0e]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Blobs */}
      <Blob className="w-80 h-80 bg-emerald-600/25 -top-20 -left-20" delay={0} />
      <Blob className="w-64 h-64 bg-lime-600/15 bottom-10 right-0" delay={2.5} />
      <Blob className="w-48 h-48 bg-green-500/10 top-1/2 left-1/2" delay={1.5} />

      {/* Floating leaves */}
      <FloatingLeaf style={{ top: "15%", right: "12%" }} delay={0} />
      <FloatingLeaf style={{ top: "55%", left: "8%" }} delay={1.2} />
      <FloatingLeaf style={{ bottom: "20%", right: "20%" }} delay={2.4} />
      <FloatingLeaf style={{ top: "35%", right: "5%" }} delay={0.8} />

      {/* Logo */}
      <div className="relative z-10">
        <Link to="/" className="flex items-center gap-3 group w-fit">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
            <img src={logo} alt="Sanap" className="relative w-10 h-10 rounded-xl shadow-lg" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">Sanap Hi-Tech</p>
            <p className="text-[10px] text-emerald-300/50">Nursery ERP Platform</p>
          </div>
        </Link>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8">
        {isAdmin ? <AdminIllustration /> : <NurseryIllustration />}

        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-white leading-tight"
          >
            {isAdmin ? "Secure Admin Access" : "Welcome to Sanap Nursery"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="text-sm text-emerald-200/40 mt-2 max-w-xs leading-relaxed"
          >
            {isAdmin
              ? "Manage your nursery operations with full control and real-time insights."
              : "India's premium grafted plant nursery. Trusted by 5,000+ farmers across Maharashtra."}
          </motion.p>
        </div>

        {/* Stat badges */}
        {!isAdmin && (
          <div className="relative w-full h-20">
            <StatBadge icon={Users}      label="Active Farmers"   value="5,000+"  delay={0.8} className="-left-2 top-0" />
            <StatBadge icon={Leaf}       label="Plant Varieties"  value="50+"     delay={1.0} className="right-0 top-0" />
            <StatBadge icon={TrendingUp} label="Orders Delivered" value="12,000+" delay={1.2} className="left-1/2 -translate-x-1/2 -bottom-2" />
          </div>
        )}
      </div>

      {/* Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="relative z-10 text-center"
      >
        <p className="text-xs text-emerald-400/30">
          {isAdmin ? "🔒 Authorized personnel only" : "🌱 Grafted plants · Premium quality · Pan-India delivery"}
        </p>
      </motion.div>
    </div>
  );
}

// ── Main layout wrapper ───────────────────────────────────────
export default function AuthLayout({ children, variant = "customer" }: {
  children: React.ReactNode;
  variant?: "customer" | "admin";
}) {
  return (
    <div className="min-h-screen flex" style={{ background: "#071a0e" }}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <Blob className="w-[500px] h-[500px] bg-emerald-800/15 -top-40 -left-40" delay={0} />
        <Blob className="w-[400px] h-[400px] bg-green-700/10 top-1/2 right-0" delay={3} />
        <Blob className="w-[300px] h-[300px] bg-lime-700/8 bottom-0 left-1/3" delay={1.5} />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(rgba(52,211,153,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="flex w-full relative z-10">
        {/* Left brand panel */}
        <div className="hidden lg:block lg:w-[45%] border-r border-emerald-900/40">
          <BrandPanel variant={variant} />
        </div>

        {/* Right form panel */}
        <div
          className="flex-1 flex items-center justify-center p-6 md:p-10 overflow-y-auto"
          style={{ background: "linear-gradient(135deg, #0a1f12 0%, #071a0e 100%)" }}
        >
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-3 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-xl blur-md opacity-40" />
                <img src={logo} alt="Sanap" className="relative w-9 h-9 rounded-xl" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Sanap Hi-Tech Nursery</p>
                <p className="text-[10px] text-emerald-400/40">ERP Platform</p>
              </div>
            </div>

            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
