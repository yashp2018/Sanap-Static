import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Mail, Lock, MapPin, ArrowRight, CheckCircle2, Sprout } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { validateRegister } from "@/lib/validation";
import AuthLayout from "@/components/auth/AuthLayout";
import { GlassInput, PasswordInput, FormField, AuthButton } from "@/components/auth/AuthComponents";
import PasswordStrength from "@/components/auth/PasswordStrength";

export default function CustomerRegister() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", phone: "", email: "", password: "", confirmPassword: "", address: "", terms: false,
  });
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = (e.target as HTMLInputElement).type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm(f => ({ ...f, [k]: val }));
    if (errors[k as string]) setErrors(er => ({ ...er, [k]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateRegister(form);
    if (!form.terms) errs.terms = "You must accept the terms to continue";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register({ name: form.name, phone: form.phone, email: form.email || undefined, password: form.password, address: form.address || undefined });
      setDone(true);
      toast.success("Account created! Welcome to Sanap Nursery 🌱");
      setTimeout(() => {
        const returnTo = sessionStorage.getItem("returnTo");
        if (returnTo) { sessionStorage.removeItem("returnTo"); navigate(returnTo); }
        else navigate("/dashboard");
      }, 1200);
    } catch (err: any) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout variant="customer">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5 mb-4">
          <Sprout className="w-3 h-3 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-300">New Account</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Create account</h1>
        <p className="text-sm text-emerald-400/50 mt-1">Join 5,000+ farmers on Sanap Nursery</p>
      </motion.div>

      {/* Success overlay */}
      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-emerald-950 border border-emerald-700/40 rounded-3xl p-10 text-center shadow-2xl">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.15 }}
                className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </motion.div>
              <h3 className="text-lg font-bold text-white">Account Created!</h3>
              <p className="text-sm text-emerald-400/50 mt-1">Redirecting to dashboard...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-emerald-950/40 border border-emerald-900/50 rounded-2xl p-6 backdrop-blur-sm shadow-2xl shadow-black/40"
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Name + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Full Name" error={errors.name} required>
              <GlassInput type="text" value={form.name} onChange={set("name")} placeholder="Your name"
                icon={<User className="w-4 h-4" />} error={errors.name} maxLength={100} autoComplete="name" />
            </FormField>
            <FormField label="Phone" error={errors.phone} required>
              <GlassInput type="tel" value={form.phone} onChange={set("phone")} placeholder="10-digit mobile"
                icon={<Phone className="w-4 h-4" />} error={errors.phone} maxLength={15} autoComplete="tel" />
            </FormField>
          </div>

          {/* Email */}
          <FormField label="Email (Optional)" error={errors.email}>
            <GlassInput type="email" value={form.email} onChange={set("email")} placeholder="For invoices & updates"
              icon={<Mail className="w-4 h-4" />} error={errors.email} maxLength={255} autoComplete="email" />
          </FormField>

          {/* Password */}
          <FormField label="Password" error={errors.password} required>
            <PasswordInput value={form.password} onChange={set("password")} placeholder="Min 8 characters"
              icon={<Lock className="w-4 h-4" />} error={errors.password} maxLength={128} autoComplete="new-password" />
            <PasswordStrength password={form.password} />
          </FormField>

          {/* Confirm password */}
          <FormField label="Confirm Password" error={errors.confirmPassword} required>
            <PasswordInput value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Repeat password"
              icon={<Lock className="w-4 h-4" />} error={errors.confirmPassword} maxLength={128} autoComplete="new-password"
              success={!!form.confirmPassword && form.password === form.confirmPassword && !errors.confirmPassword} />
          </FormField>

          {/* Address */}
          <FormField label="Farm / Delivery Address" error={errors.address}>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600/60 pointer-events-none" />
              <textarea value={form.address} onChange={set("address")} placeholder="Your farm or delivery address" rows={2} maxLength={500}
                className="w-full pl-10 pr-4 py-3 bg-emerald-950/60 border border-emerald-900/60 rounded-xl text-sm text-white/85 placeholder:text-emerald-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/60 focus:bg-emerald-950/80 transition-all resize-none" />
            </div>
          </FormField>

          {/* Terms */}
          <div>
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <div className="relative mt-0.5 shrink-0">
                <input type="checkbox" checked={form.terms} onChange={set("terms")} className="sr-only" />
                <div className={`w-4 h-4 rounded border transition-all ${form.terms ? "bg-emerald-500 border-emerald-500" : "bg-emerald-950/80 border-emerald-800/60 group-hover:border-emerald-600/60"}`}>
                  {form.terms && (
                    <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-emerald-700/70 leading-relaxed">
                I agree to the{" "}
                <button type="button" onClick={() => toast.info("Terms coming soon!")} className="text-emerald-400 hover:text-emerald-300 font-semibold">Terms of Service</button>
                {" "}and{" "}
                <button type="button" onClick={() => toast.info("Privacy policy coming soon!")} className="text-emerald-400 hover:text-emerald-300 font-semibold">Privacy Policy</button>
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-400 mt-1 ml-6">{errors.terms}</p>}
          </div>

          <AuthButton type="submit" loading={loading} variant="green" className="mt-1">
            Create Account <ArrowRight className="w-4 h-4" />
          </AuthButton>
        </form>

        <p className="text-center text-xs text-emerald-800/60 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
