import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", confirmPassword: "", address: "", city: "", state: "Maharashtra" });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.password) {
      toast.error("Please fill all required fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
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
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 surface-green" id="register-page">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl gradient-cta flex items-center justify-center shadow-glow">
              <Leaf className="w-7 h-7 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-foreground mt-4">Create Account</h1>
          <p className="text-muted-foreground mt-1">Join 5000+ farmers on Sanap Nursery</p>
        </div>

        <div className="bg-card rounded-2xl border border-border/50 shadow-elevated p-8" id="register-form-card">
          <form onSubmit={handleRegister} className="space-y-4" id="register-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" required maxLength={100} id="registerName" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Phone *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone number"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" required maxLength={15} id="registerPhone" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email (Optional)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email address"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" maxLength={255} id="registerEmail" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min 6 characters"
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" required maxLength={128} id="registerPassword" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} placeholder="Confirm password"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" required maxLength={128} id="reg-confirm" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Farm/Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 w-4 h-4 text-muted-foreground" />
                <textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Your farm or delivery address" rows={2}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" maxLength={500} id="reg-address" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-cta text-primary-foreground py-3.5 rounded-xl font-bold text-lg hover:shadow-elevated transition-all hover:scale-[1.02] btn-ripple disabled:opacity-60 flex items-center justify-center gap-2"
              id="registerBtn"
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
