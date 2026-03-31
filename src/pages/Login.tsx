import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { validateLogin } from "@/lib/validation";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if we need to return somewhere after login
      const returnTo = sessionStorage.getItem("returnTo");
      if (returnTo) {
        sessionStorage.removeItem("returnTo");
        navigate(returnTo, { replace: true });
      } else {
        navigate(user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
      }
    }
  }, [user, navigate]);

  const field = (key: string) => ({
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(f => ({ ...f, [key]: e.target.value }));
      if (errors[key]) setErrors(er => ({ ...er, [key]: "" }));
    },
    className: `w-full py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors ${
      errors[key]
        ? "border-red-500 focus:ring-red-200 pl-11 pr-4"
        : "border-border focus:ring-primary/20 pl-11 pr-4"
    }`,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateLogin(form.email, form.password);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Login successful!");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 surface-green">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <div className="w-14 h-14 rounded-2xl gradient-cta flex items-center justify-center shadow-glow mx-auto">
              <Leaf className="w-7 h-7 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-foreground mt-4">Welcome Back</h1>
          <p className="text-muted-foreground mt-1">Login to your Sanap Nursery account</p>
        </div>

        <div className="bg-card rounded-2xl border border-border/50 shadow-elevated p-8">
          <form onSubmit={handleLogin} className="space-y-5" noValidate>

            {/* Email / Phone */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email or Phone</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={form.email}
                  placeholder="Enter email or 10-digit phone"
                  maxLength={255}
                  {...field("email")}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
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
                  placeholder="Enter password"
                  maxLength={128}
                  {...field("password")}
                  className={field("password").className + " pr-12"}
                />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-cta text-primary-foreground py-3.5 rounded-xl font-bold text-lg hover:shadow-elevated transition-all hover:scale-[1.02] btn-ripple disabled:opacity-60 flex items-center justify-center gap-2"
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
