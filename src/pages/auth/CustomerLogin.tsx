import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Phone, Leaf } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { validateLogin } from "@/lib/validation";
import AuthLayout from "@/components/auth/AuthLayout";
import { GlassInput, PasswordInput, FormField, AuthButton } from "@/components/auth/AuthComponents";

export default function CustomerLogin() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ email: "", password: "", remember: false });
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const returnTo = sessionStorage.getItem("returnTo");
      if (returnTo) { sessionStorage.removeItem("returnTo"); navigate(returnTo, { replace: true }); }
      else navigate(user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [k]: val }));
    if (errors[k as string]) setErrors(er => ({ ...er, [k]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateLogin(form.email, form.password);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back! 🌱");
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout variant="customer">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5 mb-4">
          <Leaf className="w-3 h-3 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-300">Farmer Login</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="text-sm text-emerald-400/50 mt-1">Sign in to your Sanap Nursery account</p>
      </motion.div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-emerald-950/40 border border-emerald-900/50 rounded-2xl p-6 backdrop-blur-sm shadow-2xl shadow-black/40"
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email / Phone */}
          <FormField label="Email or Phone" error={errors.email} required>
            <GlassInput
              type="text"
              value={form.email}
              onChange={set("email")}
              placeholder="Enter email or 10-digit phone"
              icon={form.email.includes("@") ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
              error={errors.email}
              autoComplete="username"
              maxLength={255}
            />
          </FormField>

          {/* Password */}
          <FormField label="Password" error={errors.password} required>
            <PasswordInput
              value={form.password}
              onChange={set("password")}
              placeholder="Enter your password"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password}
              autoComplete="current-password"
              maxLength={128}
            />
          </FormField>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" checked={form.remember} onChange={set("remember")} className="sr-only" />
                <div className={`w-4 h-4 rounded border transition-all ${form.remember ? "bg-emerald-500 border-emerald-500" : "bg-emerald-950/80 border-emerald-800/60 group-hover:border-emerald-600/60"}`}>
                  {form.remember && (
                    <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-emerald-700/70 group-hover:text-emerald-500/70 transition-colors">Remember me</span>
            </label>
            <button type="button" onClick={() => toast.info("Password reset coming soon!")}
              className="text-xs text-emerald-400/70 hover:text-emerald-300 font-semibold transition-colors">
              Forgot password?
            </button>
          </div>

          <AuthButton type="submit" loading={loading} variant="green" className="mt-2">
            Sign In <ArrowRight className="w-4 h-4" />
          </AuthButton>
        </form>

        <p className="text-center text-xs text-emerald-800/60 mt-5">
          Don't have an account?{" "}
          <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
            Create account
          </Link>
        </p>
      </motion.div>

      {/* Admin link */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-4 text-center">
        <Link to="/admin-login" className="inline-flex items-center gap-1.5 text-xs text-emerald-900/60 hover:text-emerald-700/60 transition-colors">
          🔒 Admin login
        </Link>
      </motion.div>
    </AuthLayout>
  );
}
