import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Already logged in — redirect
  if (user) {
    navigate(user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 surface-green" id="login-page">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl gradient-cta flex items-center justify-center shadow-glow">
              <Leaf className="w-7 h-7 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-foreground mt-4">Welcome Back</h1>
          <p className="text-muted-foreground mt-1">Login to your Sanap Nursery account</p>
        </div>

        <div className="bg-card rounded-2xl border border-border/50 shadow-elevated p-8" id="login-form-card">
          <form onSubmit={handleLogin} className="space-y-5" id="login-form">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email or Phone</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="Enter email or phone"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  id="loginEmail"
                  maxLength={255}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                <button type="button" className="text-xs text-primary hover:underline font-medium">Forgot Password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="Enter password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  id="loginPassword"
                  maxLength={128}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-cta text-primary-foreground py-3.5 rounded-xl font-bold text-lg hover:shadow-elevated transition-all hover:scale-[1.02] btn-ripple disabled:opacity-60 flex items-center justify-center gap-2"
              id="loginBtn"
            >
              {loading ? "Logging in..." : <>Login <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-semibold hover:underline">Register here</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
