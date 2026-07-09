import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Shield, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import AuthLayout from "@/components/auth/AuthLayout";
import { GlassInput, FormField, AuthButton } from "@/components/auth/AuthComponents";

export default function AdminLogin() {
  const { adminLoginByEmail, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]     = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect once logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin", { replace: true });
      else { toast.error("Access denied. Admin only."); navigate("/", { replace: true }); }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Email is required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email address"); return; }
    setLoading(true);
    setError("");
    try {
      await adminLoginByEmail(email.trim());
      setSuccess(true);
      toast.success("Access granted! Redirecting...");
    } catch (err: any) {
      setError(err.message || "No admin account found for this email.");
      toast.error("Access denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout variant="admin">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5 mb-4"
        >
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>
            <Shield className="w-3 h-3 text-emerald-400" />
          </motion.div>
          <span className="text-xs font-semibold text-emerald-300">Admin Access Only</span>
        </motion.div>
        <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
        <p className="text-sm text-emerald-400/50 mt-1">Enter your admin email to access the dashboard.</p>
      </motion.div>

      {/* Success state */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <div className="bg-emerald-950 border border-emerald-700/40 rounded-3xl p-10 text-center shadow-2xl">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </motion.div>
              <h3 className="text-lg font-bold text-white">Access Granted!</h3>
              <p className="text-sm text-emerald-400/50 mt-1">Redirecting to admin panel...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-emerald-950/40 border border-emerald-900/50 rounded-2xl p-6 backdrop-blur-sm shadow-2xl shadow-black/40"
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormField label="Admin Email" error={error} required>
            <GlassInput
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              placeholder="admin@sanapnursery.com"
              icon={<Mail className="w-4 h-4" />}
              error={error}
              autoComplete="email"
              autoFocus
              maxLength={255}
            />
          </FormField>

          {/* Info notice */}
          <div className="flex items-start gap-2 bg-emerald-950/60 border border-emerald-900/40 rounded-xl p-3">
            <Shield className="w-3.5 h-3.5 text-emerald-700/50 shrink-0 mt-0.5" />
            <p className="text-[10px] text-emerald-800/50 leading-relaxed">
              If your email is registered as an admin, you will be granted instant access.
            </p>
          </div>

          <AuthButton type="submit" loading={loading} variant="green">
            Access Admin Panel <ArrowRight className="w-4 h-4" />
          </AuthButton>
        </form>

        <p className="text-center text-xs text-emerald-800/50 mt-5">
          Not an admin?{" "}
          <Link to="/login" className="text-emerald-400/70 hover:text-emerald-300 font-semibold transition-colors">
            Customer login
          </Link>
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-4 text-center">
        <Link to="/" className="text-xs text-emerald-900/50 hover:text-emerald-700/50 transition-colors">
          ← Back to website
        </Link>
      </motion.div>
    </AuthLayout>
  );
}
