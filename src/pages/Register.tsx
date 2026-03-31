import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { validateRegister, passwordStrength } from "@/lib/validation";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", password: "", confirmPassword: "", address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors(er => ({ ...er, [key]: "" }));
  };

  const inputCls = (key: string, extra = "") =>
    `w-full py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors pl-11 pr-4 ${extra} ${
      errors[key] ? "border-red-500 focus:ring-red-200" : "border-border focus:ring-primary/20"
    }`;

  const strength = passwordStrength(form.password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateRegister(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        password: form.password,
        address: form.address || undefined,
      });
      toast.success("Registration successful! Welcome aboard.");
      const returnTo = sessionStorage.getItem("returnTo");
      if (returnTo) {
        sessionStorage.removeItem("returnTo");
        navigate(returnTo);
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 surface-green">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/">
            <div className="w-14 h-14 rounded-2xl gradient-cta flex items-center justify-center shadow-glow mx-auto">
              <Leaf className="w-7 h-7 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-foreground mt-4">Create Account</h1>
          <p className="text-muted-foreground mt-1">Join 5000+ farmers on Sanap Nursery</p>
        </div>

        <div className="bg-card rounded-2xl border border-border/50 shadow-elevated p-8">
          <form onSubmit={handleRegister} className="space-y-4" noValidate>

            {/* Name + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" value={form.name} onChange={set("name")} placeholder="Your name" maxLength={100} className={inputCls("name")} />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Phone *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="tel" value={form.phone} onChange={set("phone")} placeholder="10-digit mobile" maxLength={15} className={inputCls("phone")} />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email (Optional)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={form.email} onChange={set("email")} placeholder="Email address" maxLength={255} className={inputCls("email")} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password + Confirm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password} onChange={set("password")}
                    placeholder="Min 8 characters" maxLength={128}
                    className={inputCls("password", "pr-12")}
                  />
                  <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Strength bar */}
                {form.password && (
                  <div className="mt-1.5">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength.score ? strength.color : "bg-muted"}`} />
                      ))}
                    </div>
                    <p className={`text-[10px] font-semibold ${strength.score <= 1 ? "text-red-500" : strength.score <= 3 ? "text-amber-500" : "text-primary"}`}>
                      {strength.label}
                    </p>
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="password" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Confirm password" maxLength={128} className={inputCls("confirmPassword")} />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Farm/Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 w-4 h-4 text-muted-foreground" />
                <textarea value={form.address} onChange={set("address")} placeholder="Your farm or delivery address" rows={2} maxLength={500}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 resize-none transition-colors ${
                    errors.address ? "border-red-500 focus:ring-red-200" : "border-border focus:ring-primary/20"
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-cta text-primary-foreground py-3.5 rounded-xl font-bold text-lg hover:shadow-elevated transition-all hover:scale-[1.02] btn-ripple disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? "Creating account..." : <>Create Account <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">Login here</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
